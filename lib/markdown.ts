import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

const processor = remark().use(remarkGfm).use(remarkHtml);

export function markdownToHtml(markdown: string): string {
  return String(processor.processSync(markdown));
}
