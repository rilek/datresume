import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import OpenAI from "jsr:@openai/openai";
import { codeBlock } from "https://esm.sh/common-tags@1.8.2";


type ChatMessage = {
  id: string;
  createdAt: string;
  content?: string;
  error?: string;
}

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const apiKey = Deno.env.get("OPENAI_API_KEY");
const openai = new OpenAI({ apiKey }) as OpenAI;
const assistantId = Deno.env.get("OPENAI_ASSISTANT_ID")!;

const messageToChat = (x: OpenAI.Beta.Threads.Messages.Message, parseContent = false): ChatMessage => {
  let res: Record<string, unknown> = {
    id: x.id,
    createdAt: (new Date(x.created_at * 1000)).toJSON(),
  };

  if (x.content[0].type === "text")
    res = {
      ...res,
      content: parseContent ? JSON.parse(x.content[0].text.value) : x.content[0].text.value
    };
  else if (x.content[0].type === "refusal")
    res = {
      ...res,
      error: x.content[0].refusal
    }
  else res = {
    ...res,
    error: "Unknown response type"
  };

  return res as ChatMessage;
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const reqBody = await req.json();
  const { message, content, threadId } = reqBody;

  console.log("Calling GPT:");

  const thread = threadId ? await openai.beta.threads.retrieve(threadId) : await openai.beta.threads.create();

  if (!threadId)
    await openai.beta.threads.messages.create(
      thread.id,
      {
        role: "user",
        content: codeBlock`Resume html content is: ${content}. Dont respond to this`,
      });

  await openai.beta.threads.messages.create(
    thread.id,
    {
      role: "user",
      content: message
    }
  );

  const run = await openai.beta.threads.runs.createAndPoll(
    thread.id,
    {
      assistant_id: assistantId
    }
  )

  if (run.status === "completed") {
    const messagesList = await openai.beta.threads.messages.list(run.thread_id, {
      limit: 2,
      order: "desc"
    });

    const lastAnswer = messagesList.data[0];
    const lastQuestion = messagesList.data[1];

    console.log(messagesList.data[0]);
    console.log(messagesList.data[1]);

    const response = {
      threadId: thread.id,
      question: messageToChat(lastQuestion),
      answer: messageToChat(lastAnswer, true)
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });
  }

  return new Response(JSON.stringify({ threadId: thread.id, error: "Run failed" }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 500
  });



  // const stream = OpenAIStream(response);
  // return new StreamingTextResponse(stream, { headers: corsHeaders })
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/chat' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
