// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import db from "@astrojs/db";

// https://astro.build/config
export default defineConfig({
  integrations: [
    db(),
    starlight({
      title: "Type-S Wiki",
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/sohansubhash/type-s.org",
        },
      ],
      sidebar: [
        {
          label: "HHKB Models",
          autogenerate: { directory: "models" },
        },
        {
          label: "PCBs",
          autogenerate: { directory: "pcbs" },
        },
        {
          label: "Controllers",
          autogenerate: { directory: "controllers" },
        },
      ],
    }),
  ],
});
