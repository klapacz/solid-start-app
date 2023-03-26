import solid from "solid-start/vite";
import { defineConfig } from "vite";
import vercel from "solid-start-vercel";
import prpc from "@prpc/vite";

export default defineConfig(() => {
  return {
    test: {
      // environment: "jsdom",
      // transformMode: {
      //   web: [/.[jt]sx?/],
      // },
      threads: false,
      isolate: false,
    },
    // resolve: {
    //   conditions: ["development", "browser"],
    // },

    plugins: [prpc(), solid({ ssr: true, adapter: vercel({ edge: true }) })],
  };
});
