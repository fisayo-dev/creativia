import type { Metadata } from "next";
import Link from "next/link";
import { Clock01Icon, FavouriteIcon, PlayIcon, RefreshIcon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { buttonVariants } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { donateConfig, isDonationProvider, type DonationProvider } from "@/config/donate";
import { getDictionary } from "@/i18n/dictionaries";
import { rich, t } from "@/i18n/format";
import { paymentProviders, REFERENCE_RE, type VerifiedPayment } from "@/lib/payments";
import { cn } from "@/lib/utils";
import { formatMoney } from "@/utils/format";

type ThanksPageProps = {
  params: Promise<{ payment?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.meta.thanksTitle, robots: { index: false } };
}

type Outcome = { provider: DonationProvider; payment: VerifiedPayment | null; retryHref: string };

/**
 * /donate/thanks/{provider}/{reference}. the amount shown comes from asking the provider,
 * never from the url, so nobody can craft a "you donated ₦1,000,000" link.
 */
async function checkPayment({ params, searchParams }: ThanksPageProps): Promise<Outcome | null> {
  const [{ payment }, query] = await Promise.all([params, searchParams]);
  const [provider, reference] = payment ?? [];
  if (!isDonationProvider(provider) || !reference || !REFERENCE_RE.test(reference)) return null;

  const flat = Object.fromEntries(Object.entries(query).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v]));
  const retryHref = `/donate/thanks/${provider}/${reference}${flat.checkout_id ? `?checkout_id=${encodeURIComponent(flat.checkout_id)}` : ""}`;

  try {
    return { provider, payment: await paymentProviders[provider].verify(reference, flat), retryHref };
  } catch (error) {
    console.error(`[donate] ${provider} verification failed`, reference, error);
    return { provider, payment: null, retryHref };
  }
}

export default async function DonateThanksPage(props: ThanksPageProps) {
  const [dict, outcome] = await Promise.all([getDictionary(), checkPayment(props)]);
  const copy = dict.thanks;
  const status = outcome?.payment?.status;
  const amount = outcome?.payment?.amount ? formatMoney(outcome.payment.amount, outcome.payment.currency) : null;
  const providerName = outcome ? donateConfig.providerNames[outcome.provider] : "";

  if (status === "failed") {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-16 text-center sm:py-24">
        <span className="animate-pop grid size-24 place-items-center rounded-full bg-error text-white shadow-[0_6px_0_var(--color-error-dark)]">
          <Icon icon={Cancel01Icon} size={48} />
        </span>
        <h1 className="mt-6 text-4xl font-black text-ink">{copy.failedTitle}</h1>
        <p className="mt-3 text-lg font-semibold text-muted">{copy.failedBody}</p>
        <div className="mt-10 grid w-full gap-3">
          <Link href="/donate" className={cn(buttonVariants({ size: "lg" }), "w-full")}>
            <Icon icon={FavouriteIcon} />
            {copy.tryAgain}
          </Link>
          <Link href="/" className={cn(buttonVariants({ variant: "ghost" }), "w-full")}>
            {copy.home}
          </Link>
        </div>
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-16 text-center sm:py-24">
        <span className="animate-float grid size-24 place-items-center rounded-full bg-info text-white shadow-[0_6px_0_var(--color-info-dark)]">
          <Icon icon={Clock01Icon} size={48} />
        </span>
        <h1 className="mt-6 text-4xl font-black text-ink">{copy.pendingTitle}</h1>
        <p className="mt-3 text-lg font-semibold text-muted">
          {t(copy.pendingBody, { amount: amount ?? "", provider: providerName })}
        </p>
        <div className="mt-10 grid w-full gap-3">
          <a href={outcome!.retryHref} className={cn(buttonVariants({ variant: "info", size: "lg" }), "w-full")}>
            <Icon icon={RefreshIcon} />
            {copy.checkAgain}
          </a>
          <Link href="/" className={cn(buttonVariants({ variant: "ghost" }), "w-full")}>
            {copy.home}
          </Link>
        </div>
      </div>
    );
  }

  const paid = status === "paid" && amount;
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-16 text-center sm:py-24">
      <span className="animate-pop grid size-24 place-items-center rounded-full bg-success text-white shadow-[0_6px_0_var(--color-success-dark)]">
        <Icon icon={FavouriteIcon} size={48} />
      </span>
      <h1 className="mt-6 text-4xl font-black text-ink">{copy.title}</h1>

      {paid && (
        <div className="animate-rise mt-6 w-full rounded-3xl border-2 border-b-4 border-success/40 bg-success-soft px-6 py-5">
          <p className="text-sm font-extrabold text-success-dark">{copy.youDonated}</p>
          <p className="mt-1 text-5xl font-black tracking-tight text-success-dark">{amount}</p>
          <p className="mt-2 text-xs font-bold text-success-dark/80">
            {rich(copy.paidWith, { provider: <span className="font-black">{providerName}</span> })}
          </p>
        </div>
      )}

      <p className="mt-6 text-lg font-semibold text-muted">{copy.body}</p>
      <div className="mt-10 grid w-full gap-3">
        <Link href="/play" className={cn(buttonVariants({ size: "lg" }), "w-full")}>
          <Icon icon={PlayIcon} />
          {copy.play}
        </Link>
        <Link href="/" className={cn(buttonVariants({ variant: "ghost" }), "w-full")}>
          {copy.home}
        </Link>
      </div>
    </div>
  );
}
