/** @jsxImportSource https://esm.sh/preact@10.5.15 */

import "./twindSheet.ts";
import pods from "./pods.json" assert { type: "json" };

export function App() {
  // layout stolen from https://www.kindacode.com/article/tailwind-css-grid-examples/
  return (
    <div tw="mx-auto container grid grid-cols-5">
      <header tw="col-span-5 p-10 bg-amber-300">
        <h1 tw="text-center text-2xl">Header</h1>
      </header>
      <aside tw="col-span-5 md:col-span-1 p-10 bg-gray-700">
        <h1 tw="text-center text-2xl text-white">Menu</h1>
      </aside>

      <main tw="col-span-5 md:col-span-3 h-96 p-10 bg-blue-200">
        <h1 tw="text-center text-2xl">Main Content</h1>
        {pods.items.map((p) => (
          <div>
            <button>
              {p.metadata.name}
            </button>
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
