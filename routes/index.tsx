import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { Pod } from "https://deno.land/x/kubernetes_apis@v0.4.0/builtin/core@v1/structs.ts";
import Counter from "../islands/Counter.tsx";
import { PodsByNamespace } from "../components/PodsByNamespace.tsx";
import { getPods } from "../util/kubes.ts";

export const handler: Handlers<Pod[]> = {
  async GET(_, ctx) {
    const pods = await getPods("");
    return ctx.render(pods.items);
  },
};

export default function Home({ data }: PageProps<Pod[]>) {
  return (
    <>
      <Head>
        <title>Fresh App</title>
      </Head>
      <div class="p-4 mx-auto max-w-screen-md">
        <img
          src="/logo.svg"
          class="w-32 h-32"
          alt="the fresh logo: a sliced lemon dripping with juice"
        />
        <p class="my-6">
          Welcome to `fresh`. Try updating this message in the
          ./routes/index.tsx file, and refresh.
        </p>
        <Counter start={3} />
        <PodsByNamespace pods={data} />
      </div>
    </>
  );
}
