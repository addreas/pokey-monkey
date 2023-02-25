import { autoDetectClient } from "https://deno.land/x/kubernetes_client@v0.5.0/mod.ts";
import { CoreV1Api } from "https://deno.land/x/kubernetes_apis@v0.4.0/builtin/core@v1/mod.ts";
import { PodList } from "https://deno.land/x/kubernetes_apis@v0.4.0/builtin/core@v1/structs.ts";

import {
  ManagedFieldsEntry,
  ObjectMeta,
  OwnerReference,
} from "https://deno.land/x/kubernetes_apis@v0.4.0/builtin/meta@v1/structs.ts";

// import apiSchema from "./kapi.json" assert { type: "json" };

const kubernetes = await autoDetectClient();
const apiSchema = (await kubernetes.performRequest({
  method: "GET",
  path: `/openapi/v2`,
  expectJson: true,
})) as {
  paths: Record<
    string,
    {
      get: {
        "x-kubernetes-action": "get" | "list";
        "x-kubernetes-group-version-kind": {
          group: string;
          version: string;
          kind: string;
        };
      };
    }
  >;
};
// const apis = await discoverApis()
const coreApi = new CoreV1Api(kubernetes);

export function getPods(namespace?: string) {
  return coreApi.namespace(namespace ?? "").getPodList();
}

export async function getPodOwners(pods: PodList) {
  for (const pod of pods.items) {
    console.log([
      pod,
      ...(pod.metadata?.managedFields ?? []),
      ...(await getOwners(pod)),
    ]);
  }
}

async function getOwners(obj: {
  metadata?: ObjectMeta | null;
}): Promise<({ metadata?: ObjectMeta  | null }| ManagedFieldsEntry)[]> {
  const ownerRef = obj.metadata?.ownerReferences?.at(0);
  if (!ownerRef) return [];

  const path = pathFor(ownerRef, obj.metadata?.namespace);
  const owner = (await kubernetes.performRequest({
    method: "GET",
    path,
    expectJson: true,
  })) as { metadata?: ObjectMeta | null };

  return [
    owner,
    ...(owner.metadata?.managedFields ?? []),
    ...(await getOwners(owner)),
  ];
}

export function deletePod(namespace: string, name: string) {
  return coreApi.namespace(namespace).deletePod(name);
}

function pathFor(
  { apiVersion, kind, name }: OwnerReference,
  namespace: string | null | undefined
) {
  const [group, version] = apiVersion.split("/");
  for (const [key, value] of Object.entries(apiSchema.paths)) {
    if (
      "get" in value &&
      "x-kubernetes-action" in value.get &&
      value.get["x-kubernetes-action"] == "get" &&
      value.get["x-kubernetes-group-version-kind"].group == group &&
      value.get["x-kubernetes-group-version-kind"].version == version &&
      value.get["x-kubernetes-group-version-kind"].kind == kind
    ) {
      return key
        .replace("{namespace}", namespace ?? "")
        .replace("{name}", name);
    }
  }
  return `no path found for ${apiVersion} ${kind} ${namespace} ${name}`;
}

if (import.meta.main) {
  // await discoverApis();
  const pods = await getPods("grrrr");
  await getPodOwners(pods);
}
