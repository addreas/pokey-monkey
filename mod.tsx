/** @jsxImportSource https://esm.sh/preact@10.5.15 */
import { renderToString } from "https://esm.sh/preact-render-to-string@5.1.19?deps=preact@10.5.15";
import { setup, tw } from "https://esm.sh/twind@0.16.16";
import * as colors from "https://esm.sh/twind@0.16.16/colors";
import {
  getStyleTagProperties,
  virtualSheet,
} from "https://esm.sh/twind@0.16.16/sheets";
import pods from "./pods.json" assert { type: "json" };

import { serve, Status } from "https://deno.land/std@0.177.0/http/mod.ts";

const sheet = virtualSheet();

setup({
  theme: {
    fontFamily: {
      sans: ["Helvetica", "sans-serif"],
      serif: ["Times", "serif"],
    },
    extend: { colors },
  },
  sheet,
});

function App() {
  // layout stolen from https://www.kindacode.com/article/tailwind-css-grid-examples/
  return (
    <div className={tw`mx-auto container grid grid-cols-5`}>
      <header className={tw`col-span-5 p-10 bg-amber-300`}>
        <h1 className={tw`text-center text-2xl`}>Header</h1>
      </header>
      <aside className={tw`col-span-5 md:col-span-1 p-10 bg-gray-700`}>
        <h1 class={tw`text-center text-2xl text-white`}>Menu</h1>
      </aside>

      <main className={tw`col-span-5 md:col-span-3 h-96 p-10 bg-blue-200`}>
        <h1 className={tw`text-center text-2xl`}>Main Content</h1>
        {pods.items.map((p) => (
          <div>
            <button>
              {p.metadata.name}
            </button>
          </div>
        ))}
      </main>

      <aside className={tw`col-span-5 md:col-span-1 p-10 bg-rose-300`}>
        <h1 class={tw`text-center text-2xl`}>Sidebar</h1>
      </aside>

      <footer className={tw`col-span-5 p-10 bg-green-300`}>
        <h1 className={tw`text-center text-2xl`}>Footer</h1>
      </footer>
    </div>
  );
}

function Page() {
  sheet.reset();
  const app = renderToString(<App />);
  const { id, textContent } = getStyleTagProperties(sheet);

  return (
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style id={id}>{textContent}</style>
        <title>pokeymonkey</title>
      </head>
      <body dangerouslySetInnerHTML={{ __html: app }} />
    </html>
  );
}

serve((req) => {
  console.log("got req: ", req);

  return new Response(renderToString(<Page />), {
    status: Status.OK,
    headers: {
      "Content-Type": "text/html",
    },
  });
});
