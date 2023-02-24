import groupBy from "https://deno.land/x/denodash@0.1.3/src/collection/groupBy.ts";
import { Pod } from "https://deno.land/x/kubernetes_apis@v0.4.0/builtin/core@v1/structs.ts";
import { tw } from "twind";

export function PodsByNamespace({ pods }: { pods: Pod[] }) {
  const grouped = Object.entries(groupBy((p) => p.metadata?.namespace, pods));
  return (
    <>
      {grouped.map(([namespace, pods]) => (
        <div class={tw`bg-indigo-600 rounded`}>
          <h2 class={tw`text-center text-2xl col-span-3 md:col-span-5 p-2`}>
            {namespace}
          </h2>
          <form
            method="POST"
            class={tw`grid grid-cols-3 md:grid-cols-5 bg-purple-400 p-2 gap-2 rounded`}
          >
            <input type="hidden" name="namespace" value={namespace} />
            <GroupByWorkload pods={pods} />
          </form>
        </div>
      ))}
    </>
  );
}

function GroupByWorkload({ pods }: { pods: Pod[] }) {
  const grouped = Object.entries(
    groupBy(
      (p) =>
        p.metadata?.ownerReferences
          ?.map((o) => `${o.kind}: ${o.name}`)
          .join(", "),
      pods,
    ),
  );
  return (
    <>
      {grouped.map(([owner, pods]) => (
        <>
          <div class={tw`bg-green-700 rounded`}>
            <h3 class={tw`text-center p-2`}>{owner}</h3>
            {pods.map((p) => (
              <div class={tw`flex m-2`}>
                <button
                  type="submit"
                  name="name"
                  value={p.metadata?.name as string}
                  class={tw`flex-grow bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded py-4 `}
                >
                  {p.status?.phase} {maybeSurround(
                    trimPrefix(
                      trimPrefix(
                        trimPrefix(
                          p.metadata?.name,
                          p.metadata?.ownerReferences?.at(0)?.name,
                        ),
                        "-",
                      ),
                      "0",
                    ),
                    "()",
                  )}
                </button>
              </div>
            ))}
          </div>
        </>
      ))}
    </>
  );
}

function trimPrefix(
  str: string | null | undefined,
  prefix: string | null | undefined,
): string | null {
  if (str && prefix && str.startsWith(prefix)) {
    return str.substring(prefix.length);
  }
  return str ?? null;
}

function maybeSurround(str: string | null, ends: string): string | null {
  if (str && ends.length === 2) {
    return `${ends[0]}${str}${ends[1]}`;
  }
  return null;
}
