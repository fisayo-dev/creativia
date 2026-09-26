import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { LogoMark } from "@/components/layout/logo";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <LogoMark className="animate-float size-20 rounded-3xl" size={44} />
      <h1 className="mt-6 text-4xl font-black text-ink">lost the link?</h1>
      <p className="mt-2 font-semibold text-muted">this page doesn&apos;t connect to anything.</p>
      <Link href="/" className={buttonVariants({ size: "lg", className: "mt-8" })}>
        take me home
      </Link>
    </main>
  );
}
