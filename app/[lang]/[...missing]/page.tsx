import { notFound } from "next/navigation";

/** unknown urls are rewritten under a language, so this catches them and shows the localized 404 */
export default function MissingPage() {
  notFound();
}
