"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { CategoriaGasto } from "@/lib/types";
import { formatBRL } from "@/lib/utils";

interface Props {
  dados: CategoriaGasto[];
  total: number;
}

export default function CategoryDonutChart({ dados, total }: Props) {
  return (
    <div className="relative">
      <div className="h-56 sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={dados}
              dataKey="valor"
              nameKey="nome"
              innerRadius="68%"
              outerRadius="100%"
              paddingAngle={2}
              stroke="none"
            >
              {dados.map((entry) => (
                <Cell key={entry.nome} fill={entry.cor} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => [formatBRL(value), name]}
              contentStyle={{
                borderRadius: 16,
                border: "1px solid rgba(0,0,0,0.06)",
                boxShadow: "0 8px 24px -12px rgba(59,51,44,0.18)",
                fontSize: 13,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Total no centro do donut */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-xs text-ink-faint">Total gasto</p>
        <p className="font-display text-xl sm:text-2xl font-semibold text-ink">
          {formatBRL(total)}
        </p>
      </div>
    </div>
  );
}
