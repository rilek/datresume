// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'jsr:@supabase/supabase-js@2'
import OpenAI from "https://esm.sh/openai@4.10.0";
import { codeBlock } from "https://esm.sh/common-tags@1.8.2";
import { OpenAIStream, StreamingTextResponse } from "https://esm.sh/ai@2.2.13";

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function buildApiKeyName(userId: string) {
  return `openai_api_key_${userId}`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const authHeader = req.headers.get('Authorization')!
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: authHeader } } }
  );

  const supabaseServiceRoleClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  const token = authHeader.replace('Bearer ', '')
  const { data: userData } = await supabaseClient.auth.getUser(token)
  const id = userData.user.id;

  const { data: apiKey, error: apiKeyError } = await supabaseServiceRoleClient.rpc("read_secret", { secret_name: buildApiKeyName(id) });

  if (apiKeyError) throw new Error(apiKeyError.message);

  const { data, error } = await supabaseClient.from("resumes").select("id,content").eq("user_id", id).single();

  const openai = new OpenAI({ apiKey });

  const { jobUrl } = await req.json();

  const completionMessages:
    OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: codeBlock`You are a professional resume writer. Your client is a software engineer who is looking for a new job. They want to apply for a job at ${jobUrl}. They have provided you with their resume. Your task is to adjust the resume to the job offer. Make it emphasis stuff related to the job offer. Return html code only, without any wrappers, including backticks. Dont make up any information, use only the provided resume, reword or remove unneeded information. Try to follow XYZ rules when adjusting experience bullet points`,
      },
      {
        role: "user",
        content: data.content,
      },
    ];
  console.log("Calling GPT:");

  const response = await openai.chat.completions.create({
    messages: completionMessages,
    model: "gpt-4o",
    max_tokens: 2000,
    temperature: 0.8,
    stream: false,
  });

  return new Response(JSON.stringify(response), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 200
  });

  // const stream = OpenAIStream(response);
  // return new StreamingTextResponse(stream, { headers: corsHeaders })
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/regenerate-resume' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
