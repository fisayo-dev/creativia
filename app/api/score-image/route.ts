import { renderScoreImage } from "@/lib/score-image";
import { parseSharedResult } from "@/utils/share";

export async function GET(request: Request) {
  const params = Object.fromEntries(new URL(request.url).searchParams);
  return renderScoreImage(parseSharedResult(params));
}
