import { createFileRoute } from "@tanstack/react-router";
// import { chromium } from 'playwright';
import { defaultContent } from "@/utils/editor";
import css from "../../index.css?inline";
import { z } from "zod";
import { createMiddleware } from "@tanstack/react-start";
import { editorClassName } from "@/components/editor";

const buildHtml = ({ name = "Resume", content, css = "" }: { name?: string; content: string; css?: string }) => `
<!DOCTYPE html>
<html lang="en">
<head>

<meta charset="UTF-8" />
<title>${name}</title>
<style>
@font-face {
  font-family: 'Source Serif 4 Variable';
  font-style: normal;
  font-display: swap;
  font-weight: 200 900;
  src: url(https://cdn.jsdelivr.net/fontsource/fonts/source-serif-4:vf@latest/latin-wght-normal.woff2) format('woff2-variations');
  unicode-range: U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;
}

:root {
  --cm: 52px;
}
${css}
</style>
</head>
<body>
<div class="${editorClassName}">
${content}
</div>
</body>
</html>
`;

const bodySchema = z.object({
  filename: z.string().optional(),
  content: z.string().min(1, "Resume HTML is required"),
})

export const Route = createFileRoute("/api/resume")({
  server: {
    middleware: [createMiddleware({ type: "request" }).server(async ({ next, ...rest }) => {
      try {
        return await next();
      } catch (e) {
        console.error(e);
        return {
          ...rest,
          response:
            new Response(JSON.stringify({ error: JSON.parse((e as Error)?.message) || "Something went wrong" }), {
              status: 500,
              headers: { "Content-Type": "application/json" }
            })
        }
      }
    })],
    handlers: {

      async GET() {
        const html = buildHtml({ content: defaultContent, css: css });
        return new Response(html, {
          headers: { "Content-Type": "text/html" }
        })
      },

      // async POST({ request }) {
      //   const body = bodySchema.parse(await request.json());

      //   const filename = `${body.filename || "resume"}.pdf`;
      //   const html = buildHtml({
      //     name: filename,
      //     content: body.content,
      //     css
      //   })

      //   const browser = await chromium.launch({ args: ["--no-sandbox", "--disable-setuid-sandbox"] });
      //   const page = await browser.newPage();
      //   await page.setContent(html, { waitUntil: 'networkidle' });
      //   const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
      //   await browser.close();

      //   return new Response(pdfBuffer as BodyInit, {
      //     headers: {
      //       "Content-Type": "application/pdf",
      //       "Content-Disposition": `attachment; filename="resume.pdf"`,
      //     }
      //   });
      // }
    }
  }
});