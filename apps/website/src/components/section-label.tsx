export function SectionLabel({ children }: { children: string }) {
  return (
    <p className="text-[10px] tracking-[0.35em] uppercase text-accent font-bold mb-3">
      {children}
    </p>
  );
}
