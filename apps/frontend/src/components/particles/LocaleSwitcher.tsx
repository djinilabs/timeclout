import { useLocale } from "../../hooks/useLocale";
import { locales } from "../../i18n";

export const LocaleSwitcher = () => {
  const { locale, setLocale } = useLocale();
  return (
    <div className="flex items-center gap-x-2">
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value)}
        className="rounded-md border-0 py-1.5 pl-3 pr-10 text-sm text-gray-600 shadow-sm hover:ring-1 hover:ring-inset hover:ring-gray-300"
      >
        {Object.keys(locales).map((locale) => (
          <option key={locale} value={locale}>
            {locales[locale as keyof typeof locales]}
          </option>
        ))}
      </select>
    </div>
  );
};
