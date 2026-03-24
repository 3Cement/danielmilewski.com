import { ContactCTA } from "@/components/ui/ContactCTA";

interface FinalCTAProps {
  locale: string;
}

export function FinalCTA({ locale }: FinalCTAProps) {
  return (
    <div className="bg-[var(--color-surface)]">
      <ContactCTA locale={locale} />
    </div>
  );
}
