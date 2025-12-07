import { createFileRoute } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";
import Cloudflare from "cloudflare";
import { z } from "zod";
import css from "@/index.css?inline";
import { defaultContent } from "@/utils/editor";
import { buildHtml } from "./-template";

const bodySchema = z.object({
  filename: z.string().optional(),
  content: z.string().min(1, "Resume HTML is required"),
});

export const Route = createFileRoute("/api/resumes/download")({
  server: {
    middleware: [
      createMiddleware({ type: "request" }).server(async ({ next, ...rest }) => {
        try {
          return await next();
        } catch (e) {
          console.error(e);
          return {
            ...rest,
            response: new Response(
              JSON.stringify({ error: JSON.parse((e as Error)?.message) || "Something went wrong" }),
              {
                status: 500,
                headers: { "Content-Type": "application/json" },
              },
            ),
          };
        }
      }),
    ],
    handlers: {
      async GET() {
        const html = buildHtml({ content: defaultContent, css: css });
        return new Response(html, {
          headers: { "Content-Type": "text/html" },
        });
      },

      async POST({ request }) {
        console.log("@@@@@@@@@@@");
        const body = bodySchema.parse(await request.json());

        const filename = `${body.filename || "resume"}.pdf`;
        const html = buildHtml({
          name: filename,
          content: body.content,
          css,
        });

        const cloudflare = new Cloudflare({ apiToken: process.env.CLOUDFLARE_API_TOKEN });
        const pdf = await cloudflare.browserRendering.pdf.create({
          account_id: process.env.CLOUDFLARE_ACCOUNT_ID!,
          html,
        });

        return new Response(pdf.body as BodyInit, {
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="resume.pdf"`,
          },
        });
      },
    },
  },
});
