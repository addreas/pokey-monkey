import { autoDetectClient } from "https://deno.land/x/kubernetes_client@v0.5.0/mod.ts";
import { CoreV1Api } from "https://deno.land/x/kubernetes_apis@v0.4.0/builtin/core@v1/mod.ts";

const kubernetes = await autoDetectClient();
const coreApi = new CoreV1Api(kubernetes);

export function getPods(namespace?: string) {
  return coreApi.namespace(namespace ?? "").getPodList();
}

export function deletePod(namespace: string, name: string) {
  return coreApi.namespace(namespace).deletePod(name);
}

if (import.meta.main) {
  console.log(await getPods(""));
}
