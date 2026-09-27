import type { Metadata } from "next";
import { Coffee02Icon, Rocket01Icon, SparklesIcon, StarIcon } from "@hugeicons/core-free-icons";
import { DonateForm } from "@/components/donate/donate-form";
import { Icon } from "@/components/ui/icon";
import { getDictionary } from "@/i18n/dictionaries";
import { getProviderOptions } from "@/lib/payments";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return { title: dict.meta.donateTitle, description: dict.meta.donateDescription };
}

const perkIcons = [Rocket01Icon, SparklesIcon, StarIcon];

export default async function DonatePage() {
  const dict = await getDictionary();
  const copy = dict.donate;
  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-4 py-10 sm:px-6 md:grid-cols-[1fr_1.2fr] md:py-16">
      <section className="flex flex-col items-center text-center md:items-start md:text-left">
        <span className="animate-float grid size-20 place-items-center rounded-3xl bg-primary text-white shadow-[0_6px_0_var(--color-primary-dark)]">
          <Icon icon={Coffee02Icon} size={42} />
        </span>
        <h1 className="mt-6 text-4xl font-black text-ink">{copy.title}</h1>
        <p className="mt-3 text-lg font-semibold text-muted">
          {copy.body}
        </p>

        <ul className="mt-8 grid w-full gap-4 text-left">
          {copy.perks.map((perk, i) => (
            <li key={perk.title} className="flex items-start gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary">
                <Icon icon={perkIcons[i % perkIcons.length]} size={22} />
              </span>
              <div>
                <p className="font-black text-ink">{perk.title}</p>
                <p className="text-sm font-semibold text-muted">{perk.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <DonateForm providers={getProviderOptions()} />
    </div>
  );
}
