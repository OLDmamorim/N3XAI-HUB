import { useState } from "react"; import LoginButton from "./components/LoginButton.jsx";

export default function App() { // <<< Linha adicionada para o estado de admin >>> const [isAdmin, setIsAdmin] = useState(false);

return ( <div className="min-h-screen"> <header className="p-4 flex items-center justify-between"> <h1 className="text-2xl font-bold">N3XAI</h1> {/* Substituir botão Entrar pelo LoginButton */} <LoginButton onAuthenticated={() => setIsAdmin(true)} /> </header>

<main className="p-4">
    <p>Conteúdo público da app aqui...</p>

    {/* Placeholder: só aparece depois de fazer login */}
    {isAdmin && (
      <section className="mt-6 p-4 rounded bg-black/20 border border-white/20">
        <h2 className="text-xl font-semibold mb-2">Admin • Gestão de Portais</h2>
        <p className="opacity-80">Estás autenticado. (Em breve aqui ficará o painel de gestão.)</p>
      </section>
    )}
  </main>
</div>

); }

