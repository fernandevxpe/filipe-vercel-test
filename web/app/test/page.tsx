import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Teste deploy — Filipe",
};

/** Página mínima: só HTML + layout. Útil para confirmar que a Vercel serve este projeto. */
export default function TestDeployPage() {
  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-3xl font-bold text-emerald-400">Hello world</h1>
      <p className="text-slate-300">
        Se estás a ler isto no URL da Vercel, o deploy e o App Router estão a responder.
      </p>
      <p className="text-slate-500 text-sm">
        Esta rota não chama API, não usa SQLite nem gráficos — só texto estático.
      </p>
      <Link href="/" className="inline-block text-sky-400 hover:underline text-sm">
        ← Voltar ao painel
      </Link>
    </div>
  );
}
