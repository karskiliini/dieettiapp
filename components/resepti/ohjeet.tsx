interface OhjeetProps {
  instructions: string[];
}

export function Ohjeet({ instructions }: OhjeetProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">Valmistusohje</h3>
      <ol className="space-y-3">
        {instructions.map((step, i) => (
          <li key={i} className="flex gap-3 text-sm">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {i + 1}
            </span>
            <span className="pt-0.5">{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
