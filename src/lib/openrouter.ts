// Shared OpenRouter client (OpenAI-compatible gateway → Claude). Replaces the
// Anthropic SDK. JSON output is enforced by injecting the JSON Schema into the
// prompt + robust balanced-brace extraction (provider-agnostic, no reliance on
// model-specific response_format).
const MODEL = process.env.OPENROUTER_MODEL ?? "anthropic/claude-sonnet-4.6";
const BASE_URL = process.env.OPENROUTER_BASE_URL ?? "https://openrouter.ai/api/v1";

export class OpenRouterError extends Error {}

/** Pull the first balanced {...} object out of arbitrary model text. */
function extractJSON(text: string): string {
  const clean = text.replace(/```json/gi, "").replace(/```/g, "").trim();
  const start = clean.indexOf("{");
  if (start === -1) throw new OpenRouterError("No JSON object in model response");
  let depth = 0;
  for (let i = start; i < clean.length; i++) {
    if (clean[i] === "{") depth++;
    else if (clean[i] === "}") {
      depth--;
      if (depth === 0) return clean.slice(start, i + 1);
    }
  }
  throw new OpenRouterError("Unterminated JSON in model response");
}

/**
 * Call Claude via OpenRouter and return a JSON string conforming to `schema`.
 * Callers JSON.parse it and cast to their own type (preserving their error types).
 */
export async function completeJSON(opts: {
  system: string;
  user: string;
  schema: unknown;
  maxTokens: number;
  title?: string;
}): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new OpenRouterError("OPENROUTER_API_KEY not set");

  const system = `${opts.system}\n\nResponde ÚNICAMENTE con un objeto JSON válido que cumpla EXACTAMENTE este JSON Schema. Sin texto extra, sin markdown, sin comentarios:\n${JSON.stringify(opts.schema)}`;

  const response = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "X-Title": opts.title ?? "blueprint",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: opts.maxTokens,
      temperature: 0.4,
      messages: [
        { role: "system", content: system },
        { role: "user", content: opts.user },
      ],
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new OpenRouterError(`OpenRouter ${response.status}: ${detail.slice(0, 200)}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  const text =
    typeof content === "string"
      ? content
      : Array.isArray(content)
        ? content.map((p: any) => p?.text ?? "").join("")
        : "";
  if (!text.trim()) throw new OpenRouterError("Empty response from OpenRouter");
  return extractJSON(text);
}
