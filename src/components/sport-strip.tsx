import { sports } from "@/lib/betting-data";

export function SportStrip({ active = "football" }: { active?: string }) {
  return (
    <div className="no-scrollbar overflow-x-auto border-b border-border bg-card">
      <div className="mx-auto flex max-w-5xl gap-1 px-2 py-2">
        {sports.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors ${
              s.id === active
                ? "bg-odds-active text-odds-active-foreground"
                : "bg-secondary text-secondary-foreground"
            }`}
          >
            {s.name}
            <span className="ml-1.5 opacity-60">{s.count}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
