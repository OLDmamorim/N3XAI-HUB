// src/components/LoginButton.jsx
import { useState } from "react";

// ATENÇÃO: isto é só para testar.
// No Passo 2 vamos trocar por uma função Netlify + variável de ambiente.
const TEST_PASSWORD = "n3xai";

export default function LoginButton({ onAuthenticated }) {
  const [open, setOpen] = useState(false);
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState("");

  function login() {
    if (pwd === TEST_PASSWORD) {
      setErr("");
      setOpen(false);
      setPwd("");
      onAuthenticated?.(); // ativa modo admin no App
    } else {
      setErr("Palavra-passe incorreta");
    }
  }

  return (
    <>
      <button
        className="px-4 py-2 rounded-full border border-white/40 hover:bg-white/10 transition"
        onClick={() => setOpen(true)}
      >
        Entrar
      </button>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60">
          <div className="w-[92vw] max-w-sm rounded-2xl bg-zinc-900 p-4 border border-white/10">
            <h3 className="text-lg font-semibold mb-3">Acesso de administrador</h3>
            <input
              type="password"
              className="w-full mb-2 px-3 py-2 rounded bg-zinc-800 outline-none"
              placeholder="Palavra-passe"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && login()}
            />
            {err && <p className="text-red-400 text-sm mb-2">{err}</p>}
            <div className="flex justify-end gap-2">
              <button className="px-3 py-2" onClick={() => setOpen(false)}>
                Cancelar
              </button>
              <button
                className="px-3 py-2 rounded bg-white text-black"
                onClick={login}
              >
                Entrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}