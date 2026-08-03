import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center mb-6">
          <span className="text-4xl mb-2">🏡</span>
          <h1 className="font-display text-2xl font-semibold text-ink">Nossa Casa</h1>
          <p className="text-sm text-ink-faint mt-1">finanças da família</p>
        </div>

        <div className="rounded-3xl bg-white border border-black/5 shadow-soft p-6 sm:p-7">
          <h2 className="font-display text-lg font-semibold text-ink mb-1">Entrar</h2>
          <p className="text-sm text-ink-faint mb-5">Use o e-mail e senha da sua conta da casa.</p>
          <LoginForm />
        </div>

        <p className="text-xs text-ink-faint text-center mt-6">
          Só Carol e Mitch têm acesso — se você não tem um login ainda, peça pra um dos dois criar.
        </p>
      </div>
    </div>
  );
}
