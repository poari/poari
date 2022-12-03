import { Head } from "$fresh/runtime.ts";
import { appPayoff, appTitle } from "../components/shared.tsx";
import SimpleBoard from "../islands/SimpleBoard.tsx";

export default function Simple() {
  return (
    <>
      <Head>
        <title>{appTitle} :: {appPayoff}</title>
      </Head>
      <SimpleBoard />
    </>
  );
}
