import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ChatRequest {
  messages: { role: string; content: string }[];
  trackId: string;
  chapterId?: string | null;
  chapterName?: string | null;
  syllabusContext?: string;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body: ChatRequest = await req.json();
    const { messages, chapterName, syllabusContext } = body;

    const systemPrompt = `You are ExamCrack AI, a helpful tutor for BPSC TRE 4.0 exam preparation.
${syllabusContext ? `The student is studying: ${syllabusContext}.` : ""}
${chapterName ? `They are currently on the chapter: "${chapterName}".` : "They are asking about the overall syllabus."}

Your role:
- Explain concepts clearly and simply, as if teaching a student
- Give examples to illustrate concepts
- If the student asks about a specific topic, break it down step by step
- Keep responses concise but thorough — use bullet points and short paragraphs
- If the student asks something outside the syllabus scope, gently redirect them
- Encourage the student and suggest practice questions when relevant

Respond in a friendly, encouraging tone. Use markdown formatting for readability.`;

    const conversationMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map((m) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.content,
      })),
    ];

    const openaiKey = Deno.env.get("OPENAI_API_KEY");

    if (!openaiKey) {
      // Fallback: provide a helpful static response when no API key is configured
      const lastUserMsg = messages.filter((m) => m.role === "user").pop();
      const fallback = `I'm here to help you understand "${chapterName || "the syllabus"}"! 

Here's what I can assist you with:
- **Concept explanations** — Ask me about any topic and I'll break it down step by step
- **Worked examples** — I can walk through solved problems
- **Practice guidance** — I'll suggest which areas to focus on
- **Doubt clearing** — Ask any question about the material

${lastUserMsg ? `You asked: "${lastUserMsg.content}". ` : ""}To enable full AI-powered responses, an OpenAI API key needs to be configured. For now, please explore the notes, MCQs, and practice sections of this chapter for detailed content.`;

      return new Response(
        JSON.stringify({ reply: fallback }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: conversationMessages,
        max_tokens: 800,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return new Response(
        JSON.stringify({ error: `AI service error: ${response.status}` }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "I couldn't generate a response. Please try again.";

    return new Response(
      JSON.stringify({ reply }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
