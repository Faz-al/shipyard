import {
  mkdir,
  writeFile,
} from "node:fs/promises";

import path from "node:path";
import {
  fileURLToPath,
} from "node:url";

const SITE_URL =
  "https://www.getshipyard.in";

const currentFile =
  fileURLToPath(import.meta.url);

const currentDirectory =
  path.dirname(currentFile);

const projectRoot =
  path.resolve(
    currentDirectory,
    ".."
  );

const publicDirectory =
  path.join(
    projectRoot,
    "public"
  );

const sitemapPath =
  path.join(
    publicDirectory,
    "sitemap.xml"
  );

const routes = [
  "/",
  "/pricing",
  "/how-it-works",
  "/become-a-tester",
  "/contact",
  "/privacy",
  "/terms",
  "/refund",
  "/refund-policy",
];

const lastModified =
  new Date()
    .toISOString()
    .split("T")[0];

const sitemapEntries =
  routes
    .map((route) => {
      const url =
        route === "/"
          ? SITE_URL
          : `${SITE_URL}${route}`;

      return `  <url>
    <loc>${url}</loc>
    <lastmod>${lastModified}</lastmod>
  </url>`;
    })
    .join("\n\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

${sitemapEntries}

</urlset>
`;

await mkdir(
  publicDirectory,
  {
    recursive: true,
  }
);

await writeFile(
  sitemapPath,
  sitemap,
  "utf8"
);

console.log(
  `Sitemap generated with ${routes.length} URLs`
);

console.log(sitemapPath);