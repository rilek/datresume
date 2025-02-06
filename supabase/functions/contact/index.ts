// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import Mailjet, { Client } from "npm:node-mailjet@^6.0.6";

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export const sleep = (ts = 500) => new Promise((res) => setTimeout(res, ts));

// @ts-ignore: Allow Synthetic default improt
const MJClient = new Mailjet({
  apiKey: Deno.env.get("MJ_APIKEY_PUBLIC")!,
  apiSecret: Deno.env.get("MJ_APIKEY_PRIVATE")!
}) as Client;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response("ok", { headers: corsHeaders });

  const { name, email, message } = await req.json();

  await MJClient
    .post("send", { version: "v3.1" })
    .request({
      Messages: [
        {
          From: {
            Email: "rileczko+fromdatresume@gmail.com",
            Name: "No reply",
          },
          To: [
            {
              Email: "rileczko@gmail.com",
              Name: "Datresume",
            },
          ],
          Subject: "App contact",
          TextPart: `Name: ${name}
email: ${email}

Wiadomość: ${message}`,
        },
      ],
    });

  return new Response(JSON.stringify({ done: true }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200
  });
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/contact' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
