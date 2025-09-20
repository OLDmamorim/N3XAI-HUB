import React, { useState, useEffect, useMemo } from 'react';
import './App.css';

/* =========================
   Dados base
========================= */
const initialProjects = [
  {
    id: "agendamentos",
    title: "ExpressGlass • Agendamentos",
    desc: "Portal para marcação e gestão de serviços por loja e serviço móvel.",
    url: "https://example.com/agendamentos",
    tags: ["ExpressGlass", "Operações", "Front-end"],
    status: "ativo",
    icon: "📅",
    pinned: true,
  },
  {
    id: "ocr",
    title: "Express OCR",
    desc: "Leitura de Eurocodes e etiquetas com validação e base de dados.",
    url: "https://example.com/ocr",
    tags: ["OCR", "Operações", "BD"],
    status: "ativo",
    icon: "📊",
    pinned: true,
  },
  {
    id: "rececao-material",
    title: "Receção de Material",
    desc: "Registo de entradas, reconciliação e controlo de stock em loja.",
    url: "https://example.com/rececao",
    tags: ["Stock", "Operações"],
    status: "em teste",
    icon: "📦",
    pinned: false,
  },
];

const TAG_ORDER = ["ExpressGlass", "Operações", "OCR", "Stock", "Notion", "Automação", "Front-end", "BD", "Admin", "Permissões", "Pessoal", "Prototipagem"];
const STATUS_OPTIONS = ["ativo", "em teste", "em construção", "pausado"];
const ICON_OPTIONS = ["📅", "📊", "📦", "🧩", "⚙️", "🔧", "💼", "📋"];

/* =========================
   Tema escuro
========================= */
function useSystemTheme() {
  const prefersDark =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [dark, setDark] = useState(prefersDark);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);
  return { dark, setDark };
}

/* =========================
   Componentes UI
========================= */
function Tag({ label, onClick, active }) {
  return (
    <span
      onClick={onClick}
      className={`cursor-pointer select-none rounded-full px-3 py-1 text-xs border transition-all ${
        active 
          ? "bg-white text-neutral-800 border-white shadow" 
          : "bg-white/10 text-white/85 border-white/20 opacity-90 hover:opacity-100"
      }`}
    >
      {label}
    </span>
  );
}

function ProjectCard({ p, isAdmin, onEdit, onDelete }) {
  return (
    <div className="group transition-shadow duration-200 rounded-2xl bg-white/5 text-white border border-white/10 hover:shadow-lg p-6 relative">
      {/* Admin actions */}
      {isAdmin && (
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(p)}
            className="p-1 rounded bg-white/10 hover:bg-white/20 text-white/80 hover:text-white"
            title="Editar"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(p)}
            className="p-1 rounded bg-white/10 hover:bg-red-500/20 text-white/80 hover:text-red-300"
            title="Eliminar"
          >
            🗑️
          </button>
        </div>
      )}

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-white/85">
          <div className="shrink-0 rounded-xl border border-white/10 p-2 text-lg">
            {p.icon ?? "🧩"}
          </div>
          <h3 className="text-base sm:text-lg leading-tight flex items-center gap-2 font-semibold">
            {p.title}
            {p.pinned && (
              <span className="text-yellow-500" title="Fixado">⭐</span>
            )}
          </h3>
        </div>
      </div>
      
      <div className="text-sm text-white/75 mb-4">
        <p>{p.desc}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {p.tags?.map((t) => (
            <span key={t} className="rounded-full text-[10px] border border-white/20 text-white/85 px-2 py-1">
              {t}
            </span>
          ))}
          <span className="rounded-full text-[10px] capitalize bg-white/10 text-white px-2 py-1">{p.status}</span>
        </div>
      </div>
      
      <a 
        href={p.url} 
        target="_blank" 
        rel="noreferrer"
        className="inline-flex items-center gap-2 rounded-xl bg-white text-neutral-800 hover:opacity-90 px-4 py-2 text-sm font-medium transition-opacity"
      >
        Abrir 🔗
      </a>
    </div>
  );
}

/* =========================
   Hero
========================= */
function Hero({ onScrollToHub }) {
  return (
    <section
      className="
        relative h-[86vh] min-h-[560px] w-full
        bg-neutral-700
        bg-[url('/face-swap.png')] bg-cover bg-center bg-fixed
        overflow-hidden
      "
    >
      {/* Overlay escuro */}
      <div className="absolute inset-0 bg-black/45 pointer-events-none" />

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-5 pt-5 sm:px-8">
        <div className="flex items-center gap-2 text-white">
          <div className="rounded-full border border-white/40 p-2">
            🧩
          </div>
          <span className="font-semibold tracking-wide">NEXAI</span>
        </div>
        <button
          className="rounded-full border border-white/40 p-2 text-white/90 hover:text-white"
          aria-label="Abrir menu"
        >
          ☰
        </button>
      </div>

      {/* Conteúdo */}
      <div className="relative z-10 mx-auto flex h-full max-w-5xl flex-col items-start justify-end px-5 sm:px-8 pb-20 sm:pb-28 md:pb-32">
        <img
          src="/n3xai-logo.png"
          alt="NEXAI Logo"
          className="h-16 sm:h-20 md:h-24 drop-shadow-md select-none"
          draggable={false}
        />
        <p className="mt-3 text-white/90 text-base sm:text-lg">
          The missing piece
        </p>
        <button
          onClick={onScrollToHub}
          className="mt-10 inline-flex items-center gap-2 rounded-full border border-white/40 px-4 py-2 text-sm text-white/90 hover:text-white"
        >
          Entrar 🔽
        </button>
      </div>

      {/* Blend para fundo cinza base */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 sm:h-28 md:h-32 bg-gradient-to-b from-transparent to-neutral-700" />
    </section>
  );
}

/* =========================
   App Principal
========================= */
export default function NEXAIHub() {
  const [query, setQuery] = useState("");
  const [activeTags, setActiveTags] = useState([]);
  const [status, setStatus] = useState("todos");
  const [projects, setProjects] = useState(initialProjects);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deletingProject, setDeletingProject] = useState(null);
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const { dark, setDark } = useSystemTheme();

  // Formulário de projeto
  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    url: "",
    status: "ativo",
    icon: "🧩",
    tags: "",
    pinned: false
  });

  // Atalho: "/" foca a pesquisa
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "/") {
        e.preventDefault();
        document.getElementById("search")?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const tags = useMemo(() => {
    const all = new Set();
    projects.forEach((p) => p.tags?.forEach((t) => all.add(t)));
    return Array.from(all).sort((a, b) => TAG_ORDER.indexOf(a) - TAG_ORDER.indexOf(b));
  }, [projects]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects
      .filter((p) => (status === "todos" ? true : p.status === status))
      .filter((p) => (activeTags.length ? activeTags.every((t) => p.tags?.includes(t)) : true))
      .filter((p) => (q ? [p.title, p.desc, ...(p.tags || [])].join(" ").toLowerCase().includes(q) : true))
      .sort((a, b) => Number(b.pinned) - Number(a.pinned) || a.title.localeCompare(b.title));
  }, [projects, query, activeTags, status]);

  const toggleTag = (t) => setActiveTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  
  const clearFilters = () => {
    setActiveTags([]);
    setStatus("todos");
    setQuery("");
  };

  // Admin functions
  const handleLogin = () => {
    if (loginPassword === "admin123") {
      setIsAdmin(true);
      setShowLoginDialog(false);
      setLoginPassword("");
      setLoginError("");
    } else {
      setLoginError("Palavra-passe incorreta!");
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
  };

  const handleAddProject = () => {
    setEditingProject(null);
    setFormData({
      title: "",
      desc: "",
      url: "",
      status: "ativo",
      icon: "🧩",
      tags: "",
      pinned: false
    });
    setShowProjectDialog(true);
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      desc: project.desc,
      url: project.url,
      status: project.status,
      icon: project.icon,
      tags: project.tags.join(", "),
      pinned: project.pinned
    });
    setShowProjectDialog(true);
  };

  const handleDeleteProject = (project) => {
    setDeletingProject(project);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (deletingProject) {
      setProjects(projects.filter(p => p.id !== deletingProject.id));
      setShowDeleteDialog(false);
      setDeletingProject(null);
    }
  };

  const handleSaveProject = () => {
    if (!formData.title || !formData.desc || !formData.url) {
      return;
    }

    const projectData = {
      ...formData,
      tags: formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag),
      id: editingProject ? editingProject.id : Date.now().toString()
    };

    if (editingProject) {
      setProjects(projects.map(p => p.id === editingProject.id ? projectData : p));
    } else {
      setProjects([...projects, projectData]);
    }

    setShowProjectDialog(false);
  };

  return (
    <div className="min-h-screen bg-neutral-700 text-white">
      <Hero
        onScrollToHub={() => {
          const el = document.getElementById("hub");
          el?.scrollIntoView({ behavior: "smooth", block: "start" });
        }}
      />

      <section id="hub" className="relative mx-auto max-w-7xl p-4 sm:p-6">
        {/* Header com logo */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-white/10 p-2">
              🧩
            </div>
            <div>
              <img src="/n3xai-logo.png" alt="NEXAI Logo" className="h-8 sm:h-10 md:h-12 drop-shadow-md select-none" draggable={false} />
              <p className="text-sm text-white/75">O ponto único para todos os teus portais e ferramentas.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="theme" 
                checked={dark} 
                onChange={(e) => setDark(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="theme" className="text-sm">Tema escuro</label>
            </div>
            
            {isAdmin ? (
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleAddProject}
                  className="rounded-xl bg-white text-neutral-800 hover:opacity-90 px-4 py-2 text-sm font-medium"
                >
                  ➕ Adicionar Portal
                </button>
                <button 
                  onClick={handleLogout}
                  className="rounded-xl border border-white/40 px-3 py-2 text-sm text-white/90 hover:text-white"
                >
                  🚪
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowLoginDialog(true)}
                className="rounded-xl border border-white/40 px-4 py-2 text-sm text-white/90 hover:text-white"
              >
                👤 Admin Login
              </button>
            )}
          </div>
        </div>

        <div className="my-4 border-t border-white/10" />

        {/* Search & Filters */}
        <div className="grid gap-3 md:grid-cols-[1fr_auto_auto] md:items-center">
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 px-3 py-2 bg-white/5">
            🔍
            <input
              id="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pesquisar por título, descrição ou tag… (atalho: /)"
              className="border-0 focus:outline-none bg-transparent text-white placeholder:text-white/60 flex-1"
            />
          </div>
          
          <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
            <button
              onClick={() => setStatus("todos")}
              className={`px-3 py-1 rounded-lg text-sm ${status === "todos" ? "bg-white text-neutral-800" : "text-white/80"}`}
            >
              Todos
            </button>
            {STATUS_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`px-3 py-1 rounded-lg text-sm capitalize ${status === s ? "bg-white text-neutral-800" : "text-white/80"}`}
              >
                {s}
              </button>
            ))}
          </div>
          
          <button 
            onClick={clearFilters}
            className="rounded-xl border border-white/20 px-4 py-2 text-sm text-white/80 hover:text-white"
          >
            🔄 Limpar filtros
          </button>
        </div>

        {/* Tags */}
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-full text-[10px] flex items-center gap-1 border border-white/20 text-white/85 px-2 py-1">
            🏷️ Tags
          </span>
          {tags.map((t) => (
            <Tag key={t} label={t} active={activeTags.includes(t)} onClick={() => toggleTag(t)} />
          ))}
        </div>

        {/* Grid */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <ProjectCard 
              key={p.id} 
              p={p} 
              isAdmin={isAdmin}
              onEdit={handleEditProject}
              onDelete={handleDeleteProject}
            />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center text-white/75 py-16">
              🔍
              <p className="mt-3">Nada encontrado com esses filtros.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-10 text-center text-xs text-white/60">
          <div className="flex items-center justify-center gap-2">
            🧩
            <span>NEXAI • Hub — o teu ponto único de acesso</span>
          </div>
        </div>
      </section>

      {/* Login Dialog */}
      {showLoginDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-800 rounded-2xl p-6 w-full max-w-md border border-white/10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Login de Administrador</h3>
              <button
                onClick={() => {
                  setShowLoginDialog(false);
                  setLoginError("");
                }}
                className="text-white/60 hover:text-white"
              >
                ❌
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Palavra-passe</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  placeholder="Digite a palavra-passe..."
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/60 focus:outline-none focus:border-white/30"
                />
                {loginError && (
                  <div className="text-red-400 text-sm mt-2">{loginError}</div>
                )}
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowLoginDialog(false);
                    setLoginError("");
                  }}
                  className="flex-1 px-4 py-2 rounded-xl border border-white/20 text-white/80 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleLogin}
                  className="flex-1 px-4 py-2 rounded-xl bg-white text-neutral-800 hover:opacity-90"
                >
                  Entrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-800 rounded-2xl p-6 w-full max-w-md border border-white/10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Confirmar Eliminação</h3>
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="text-white/60 hover:text-white"
              >
                ❌
              </button>
            </div>
            
            <p className="mb-6">Tem a certeza que deseja eliminar o portal "{deletingProject?.title}"?</p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="flex-1 px-4 py-2 rounded-xl border border-white/20 text-white/80 hover:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Project Dialog */}
      {showProjectDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-800 rounded-2xl p-6 w-full max-w-2xl border border-white/10 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">
                {editingProject ? 'Editar Portal' : 'Adicionar Novo Portal'}
              </h3>
              <button
                onClick={() => setShowProjectDialog(false)}
                className="text-white/60 hover:text-white"
              >
                ❌
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Título *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Nome do portal..."
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/60 focus:outline-none focus:border-white/30"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Descrição *</label>
                <textarea
                  value={formData.desc}
                  onChange={(e) => setFormData({...formData, desc: e.target.value})}
                  rows={3}
                  placeholder="Descrição do portal..."
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/60 focus:outline-none focus:border-white/30"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">URL *</label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({...formData, url: e.target.value})}
                  placeholder="https://example.com"
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/60 focus:outline-none focus:border-white/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Estado</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/30"
                  >
                    {STATUS_OPTIONS.map(status => (
                      <option key={status} value={status} className="bg-neutral-800">{status}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Ícone</label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({...formData, icon: e.target.value})}
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/30"
                  >
                    {ICON_OPTIONS.map(icon => (
                      <option key={icon} value={icon} className="bg-neutral-800">{icon}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tags (separadas por vírgula)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  placeholder="ExpressGlass, Operações, Front-end"
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/60 focus:outline-none focus:border-white/30"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pinned"
                  checked={formData.pinned}
                  onChange={(e) => setFormData({...formData, pinned: e.target.checked})}
                  className="rounded"
                />
                <label htmlFor="pinned" className="text-sm">Portal fixado (aparece primeiro)</label>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowProjectDialog(false)}
                  className="flex-1 px-4 py-2 rounded-xl border border-white/20 text-white/80 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveProject}
                  className="flex-1 px-4 py-2 rounded-xl bg-white text-neutral-800 hover:opacity-90"
                >
                  {editingProject ? 'Guardar Alterações' : 'Criar Portal'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}