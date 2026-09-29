import { buildLlmsFullTxt } from "@/lib/llms";

// Rebuilt daily so the "Other public repositories" list tracks GitHub.
export const revalidate = 86400;

export async function GET() {
  return new Response(await buildLlmsFullTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
