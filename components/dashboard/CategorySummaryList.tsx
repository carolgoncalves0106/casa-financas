import { CategoriaGasto } from "@/lib/types";
import { formatBRL } from "@/lib/utils";

export default function CategorySummaryList({ dados }: { dados: CategoriaGasto[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {dados.map((cat) => (
        <li key={cat.nome} className="flex items-center gap-3">
          <span className="text-lg shrink-0">{cat.emoji}</span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-sm font-medium text-ink truncate">{cat.nome}</span>
              <span className="text-sm text-ink-soft shrink-0">
                {formatBRL(cat.valor)}{" "}
                <span className="text-ink-faint">· {cat.percentual}%</span>
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-cream-soft overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${cat.percentual}%`, backgroundColor: cat.cor }}
              />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
