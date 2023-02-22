import { PodList } from "https://deno.land/x/kubernetes_apis@v0.4.0/builtin/core@v1/structs.ts";

export function App({ pods }: { pods: PodList }) {
  // layout stolen from https://www.kindacode.com/article/tailwind-css-grid-examples/
  return (
    <div tw="mx-auto container grid grid-cols-5">
      <header tw="col-span-5 p-10 bg-amber-300">
        <h1 tw="text-center text-2xl">Header</h1>
      </header>
      <aside tw="col-span-5 md:col-span-1 p-10 bg-gray-700">
        <h1 tw="text-center text-2xl text-white">Menu</h1>
      </aside>

      <main tw="col-span-5 md:col-span-3 p-10 bg-blue-200">
        <h1 tw="text-center text-2xl">Main Content</h1>
        {pods.items.map(({ metadata, status }) => (
          <div>
            <form method="POST">
              <input
                type="hidden"
                name="namespace"
                value={metadata?.namespace as string}
              />
              <input
                type="hidden"
                name="name"
                value={metadata?.name as string}
              />
              <button type="submit">
                {metadata?.namespace}/{metadata?.name} ({status?.phase})
              </button>
            </form>
          </div>
        ))}
      </main>

      <aside tw="col-span-5 md:col-span-1 p-10 bg-rose-300">
        <h1 tw="text-center text-2xl">Sidebar</h1>
      </aside>

      <footer tw="col-span-5 p-10 bg-green-300">
        <h1 tw="text-center text-2xl">Footer</h1>
      </footer>
    </div>
  );
}
