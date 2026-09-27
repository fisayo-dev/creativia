"use client";

import { LanguageCircleIcon } from "@hugeicons/core-free-icons";
import { useI18n } from "@/components/i18n/i18n-provider";
import { Icon } from "@/components/ui/icon";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LOCALE_COOKIE, LOCALE_NAMES, LOCALES, isLocale } from "@/i18n/config";

/** the language is detected from location, this lets people override it. the choice is kept in a cookie */
export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, dict } = useI18n();

  function handleChange(next: string) {
    if (!isLocale(next) || next === locale) return;
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    // every language has its own root layout, so a full reload is the clean way to switch
    window.location.reload();
  }

  return (
    <Select value={locale} onValueChange={handleChange}>
      <SelectTrigger variant="ghost" aria-label={dict.footer.language} className={className}>
        <Icon icon={LanguageCircleIcon} size={18} />
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end">
        {LOCALES.map((l) => (
          <SelectItem key={l} value={l}>
            {LOCALE_NAMES[l]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
