import { serve, Status } from "https://deno.land/std@0.177.0/http/mod.ts";
import { PodList } from "https://deno.land/x/kubernetes_apis@v0.4.0/builtin/core@v1/structs.ts";

import { renderToString } from "https://esm.sh/preact-render-to-string@5.1.19?deps=preact@10.5.15";
import { getStyleTagProperties } from "https://esm.sh/twind@0.16.16/sheets";

import { sheet } from "./twindSetup.ts";
import { App } from "./app.tsx";
import { deletePod, getPods } from "./kubes.ts";

function Page(props: { pods: PodList }) {
  sheet.reset();
  const app = renderToString(<App {...props} />);
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

serve(async (req) => {
  console.log("got req: ", req);
  if (req.method.toLowerCase() === "post") {
    const data = await req.formData();
    console.log(
      await deletePod(
        data.get("namespace") as string,
        data.get("name") as string,
      ),
    );
    return new Response(null, { status: 302, headers: { location: "/" } });
  }

  return new Response(renderToString(<Page pods={await getPods("")} />), {
    status: Status.OK,
    headers: {
      "Content-Type": "text/html",
    },
  });
});
