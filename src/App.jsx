import React, { useState, useEffect, useMemo } from 'react';
import './App.css';

// Configurações
const JSONBIN_API_KEY = '$2a$10$8vVXjKQX9yF.Hn8Qz5Qz5uO5Qz5Qz5Qz5Qz5Qz5Qz5Qz5Qz5Q'; // API key pública para demo
const JSONBIN_BIN_ID = '676e8f5fe41b4d34e4625c8a'; // ID do bin para os portais
const TAG_ORDER = ["ExpressGlass", "Operações", "OCR", "Stock", "Notion", "Automação", "Front-end", "BD", "Admin", "Permissões", "Pessoal", "Prototipagem"];
const STATUS_OPTIONS = ["ativo", "em teste", "em construção", "pausado"];
const ICON_OPTIONS = [
  { value: "calendar", label: "Calendário", symbol: "□" },
  { value: "scan", label: "Scanner", symbol: "▣" },
  { value: "package", label: "Pacote", symbol: "▢" },
  { value: "puzzle", label: "Puzzle", symbol: "◈" },
  { value: "settings", label: "Configurações", symbol: "⚙" },
  { value: "tool", label: "Ferramenta", symbol: "🔧" },
  { value: "briefcase", label: "Pasta", symbol: "▤" },
  { value: "clipboard", label: "Clipboard", symbol: "▥" }
];

// Dados iniciais
const INITIAL_PROJECTS = [
  {
    id: 'agendamentos',
    title: 'ExpressGlass • Agendamentos',
    desc: 'Portal para marcação e gestão de serviços por loja e serviço móvel.',
    url: 'https://example.com/agendamentos',
    tags: ['ExpressGlass', 'Operações', 'Front-end'],
    status: 'ativo',
    icon: 'calendar',
    pinned: true
  },
  {
    id: 'ocr',
    title: 'Express OCR',
    desc: 'Leitura de Eurocodes e etiquetas com validação e base de dados.',
    url: 'https://example.com/ocr',
    tags: ['OCR', 'Operações', 'BD'],
    status: 'ativo',
    icon: 'scan',
    pinned: true
  },
  {
    id: 'rececao-material',
    title: 'Receção de Material',
    desc: 'Registo de entradas, reconciliação e controlo de stock em loja.',
    url: 'https://example.com/rececao',
    tags: ['Stock', 'Operações'],
    status: 'em teste',
    icon: 'package',
    pinned: false
  }
];

// Função para obter símbolo do ícone
const getIconSymbol = (iconValue) => {
  const icon = ICON_OPTIONS.find(i => i.value === iconValue);
  return icon ? icon.symbol : "◈";
};

// API functions usando JSONBin
const api = {
  async getPortals() {
    try {
      const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}/latest`, {
        headers: {
          'X-Master-Key': JSONBIN_API_KEY
        }
      });
      
      if (!response.ok) {
        throw new Error('Erro ao carregar dados');
      }
      
      const data = await response.json();
      return data.record?.portals || INITIAL_PROJECTS;
    } catch (error) {
      console.error('Erro ao carregar portais, usando dados locais:', error);
      return INITIAL_PROJECTS;
    }
  },

  async savePortals(portals) {
    try {
      const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': JSONBIN_API_KEY
        },
        body: JSON.stringify({ portals })
      });
      
      if (!response.ok) {
        throw new Error('Erro ao guardar dados');
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao guardar portais:', error);
      throw error;
    }
  },

  async createPortal(data, token, currentPortals) {
    if (token !== 'admin123') throw new Error('Não autorizado');
    
    const id = data.id || `portal-${Date.now()}`;
    const tags = Array.isArray(data.tags) ? data.tags : 
                 typeof data.tags === 'string' ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
    
    const newPortal = {
      id,
      title: data.title,
      desc: data.desc,
      url: data.url,
      tags,
      status: data.status || 'ativo',
      icon: data.icon || 'puzzle',
      pinned: Boolean(data.pinned)
    };
    
    const updatedPortals = [...currentPortals, newPortal];
    await this.savePortals(updatedPortals);
    
    return { id, message: 'Portal criado com sucesso' };
  },

  async updatePortal(id, data, token, currentPortals) {
    if (token !== 'admin123') throw new Error('Não autorizado');
    
    const tags = Array.isArray(data.tags) ? data.tags : 
                 typeof data.tags === 'string' ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
    
    const updatedPortals = currentPortals.map(portal => 
      portal.id === id ? {
        ...portal,
        title: data.title,
        desc: data.desc,
        url: data.url,
        tags,
        status: data.status || 'ativo',
        icon: data.icon || 'puzzle',
        pinned: Boolean(data.pinned)
      } : portal
    );
    
    await this.savePortals(updatedPortals);
    return { message: 'Portal atualizado com sucesso' };
  },

  async deletePortal(id, token, currentPortals) {
    if (token !== 'admin123') throw new Error('Não autorizado');
    
    const updatedPortals = currentPortals.filter(portal => portal.id !== id);
    await this.savePortals(updatedPortals);
    
    return { message: 'Portal eliminado com sucesso' };
  },

  async login(password) {
    if (password === 'admin123') {
      return { token: 'admin123', message: 'Login bem-sucedido' };
    }
    throw new Error('Palavra-passe incorreta');
  }
};

// Componentes
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
      {isAdmin && (
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(p)}
            className="p-1 rounded bg-white/10 hover:bg-white/20 text-white/80 hover:text-white text-sm"
            title="Editar"
          >
            ✏
          </button>
          <button
            onClick={() => onDelete(p)}
            className="p-1 rounded bg-white/10 hover:bg-red-500/20 text-white/80 hover:text-red-300 text-sm"
            title="Eliminar"
          >
            ✕
          </button>
        </div>
      )}

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-white/85">
          <div className="shrink-0 rounded-xl border border-white/10 p-2 text-lg text-white">
            {getIconSymbol(p.icon)}
          </div>
          <h3 className="text-base sm:text-lg leading-tight flex items-center gap-2 font-semibold">
            {p.title}
            {p.pinned && (
              <span className="text-white/60" title="Fixado">★</span>
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
        Abrir →
      </a>
    </div>
  );
}

function Hero({ onScrollToHub }) {
  return (
    <section className="relative h-[86vh] min-h-[560px] w-full bg-neutral-700 bg-[url('/face-swap.png')] bg-cover bg-center bg-fixed overflow-hidden">
      <div className="absolute inset-0 bg-black/45 pointer-events-none" />
      
      <div className="relative z-10 flex items-center justify-between px-5 pt-5 sm:px-8">
        <div className="flex items-center gap-2 text-white">
          <div className="rounded-full border border-white/40 p-2">◈</div>
          <span className="font-semibold tracking-wide">NEXAI</span>
        </div>
        <button className="rounded-full border border-white/40 p-2 text-white/90 hover:text-white" aria-label="Abrir menu">☰</button>
      </div>

      <div className="relative z-10 mx-auto flex h-full max-w-5xl flex-col items-start justify-end px-5 sm:px-8 pb-20 sm:pb-28 md:pb-32">
        <img src="/n3xai-logo.png" alt="NEXAI Logo" className="h-16 sm:h-20 md:h-24 drop-shadow-md select-none" draggable={false} />
        <p className="mt-3 text-white/90 text-base sm:text-lg">The missing piece</p>
        <button onClick={onScrollToHub} className="mt-10 inline-flex items-center gap-2 rounded-full border border-white/40 px-4 py-2 text-sm text-white/90 hover:text-white">
          Entrar ↓
        </button>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 sm:h-28 md:h-32 bg-gradient-to-b from-transparent to-neutral-700" />
    </section>
  );
}

// App principal
function NEXAIHub() {
  const [query, setQuery] = useState("");
  const [activeTags, setActiveTags] = useState([]);
  const [status, setStatus] = useState("todos");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminToken, setAdminToken] = useState("");
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deletingProject, setDeletingProject] = useState(null);
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    url: "",
    status: "ativo",
    icon: "puzzle",
    tags: "",
    pinned: false
  });

  // Carregar portais
  useEffect(() => {
    loadPortals();
  }, []);

  const loadPortals = async () => {
    try {
      setLoading(true);
      const data = await api.getPortals();
      setProjects(data);
    } catch (error) {
      console.error('Erro ao carregar portais:', error);
      setProjects(INITIAL_PROJECTS);
    } finally {
      setLoading(false);
    }
  };

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
  const handleLogin = async () => {
    try {
      setLoginError("");
      const result = await api.login(loginPassword);
      setIsAdmin(true);
      setAdminToken(result.token);
      setShowLoginDialog(false);
      setLoginPassword("");
    } catch (error) {
      setLoginError(error.message);
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setAdminToken("");
  };

  const handleAddProject = () => {
    setEditingProject(null);
    setFormData({
      title: "",
      desc: "",
      url: "",
      status: "ativo",
      icon: "puzzle",
      tags: "",
      pinned: false
    });
    setFormError("");
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
      tags: Array.isArray(project.tags) ? project.tags.join(", ") : "",
      pinned: project.pinned
    });
    setFormError("");
    setShowProjectDialog(true);
  };

  const handleDeleteProject = (project) => {
    setDeletingProject(project);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!deletingProject) return;
    
    try {
      await api.deletePortal(deletingProject.id, adminToken, projects);
      await loadPortals(); // Recarregar lista
      setShowDeleteDialog(false);
      setDeletingProject(null);
    } catch (error) {
      alert('Erro ao eliminar portal: ' + error.message);
    }
  };

  const handleSaveProject = async () => {
    if (!formData.title.trim()) {
      setFormError("Título é obrigatório");
      return;
    }
    
    if (!formData.desc.trim()) {
      setFormError("Descrição é obrigatória");
      return;
    }
    
    if (!formData.url.trim()) {
      setFormError("URL é obrigatória");
      return;
    }

    try {
      setSaving(true);
      setFormError("");

      const projectData = {
        title: formData.title.trim(),
        desc: formData.desc.trim(),
        url: formData.url.trim(),
        status: formData.status,
        icon: formData.icon,
        tags: formData.tags,
        pinned: formData.pinned
      };

      if (editingProject) {
        await api.updatePortal(editingProject.id, projectData, adminToken, projects);
      } else {
        await api.createPortal(projectData, adminToken, projects);
      }

      await loadPortals(); // Recarregar lista
      setShowProjectDialog(false);
    } catch (error) {
      setFormError(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-700 text-white flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="spinner"></div>
          <span>A carregar portais...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-700 text-white">
      <Hero onScrollToHub={() => {
        const el = document.getElementById("hub");
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      }} />

      <section id="hub" className="relative mx-auto max-w-7xl p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-white/10 p-2">◈</div>
            <div>
              <img src="/n3xai-logo.png" alt="NEXAI Logo" className="h-8 sm:h-10 md:h-12 drop-shadow-md select-none" draggable={false} />
              <p className="text-sm text-white/75">O ponto único para todos os teus portais e ferramentas.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin ? (
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleAddProject}
                  className="rounded-xl bg-white text-neutral-800 hover:opacity-90 px-4 py-2 text-sm font-medium"
                >
                  + Adicionar Portal
                </button>
                <button 
                  onClick={handleLogout}
                  className="rounded-xl border border-white/40 px-3 py-2 text-sm text-white/90 hover:text-white"
                >
                  ←
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowLoginDialog(true)}
                className="rounded-xl border border-white/40 px-4 py-2 text-sm text-white/90 hover:text-white"
              >
                ⚙ Admin Login
              </button>
            )}
          </div>
        </div>

        <div className="my-4 border-t border-white/10" />

        {/* Search & Filters */}
        <div className="grid gap-3 md:grid-cols-[1fr_auto_auto] md:items-center">
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 px-3 py-2 bg-white/5">
            ⌕
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
            ↻ Limpar filtros
          </button>
        </div>

        {/* Tags */}
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-full text-[10px] flex items-center gap-1 border border-white/20 text-white/85 px-2 py-1">
            # Tags
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
              ⌕
              <p className="mt-3">Nada encontrado com esses filtros.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-10 text-center text-xs text-white/60">
          <div className="flex items-center justify-center gap-2">
            ◈
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
              <button onClick={() => { setShowLoginDialog(false); setLoginError(""); }} className="text-white/60 hover:text-white">✕</button>
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
                <button onClick={() => { setShowLoginDialog(false); setLoginError(""); }} className="flex-1 px-4 py-2 rounded-xl border border-white/20 text-white/80 hover:text-white">
                  Cancelar
                </button>
                <button onClick={handleLogin} className="flex-1 px-4 py-2 rounded-xl bg-white text-neutral-800 hover:opacity-90">
                  Entrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-800 rounded-2xl p-6 w-full max-w-md border border-white/10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Confirmar Eliminação</h3>
              <button onClick={() => setShowDeleteDialog(false)} className="text-white/60 hover:text-white">✕</button>
            </div>
            
            <p className="mb-6">Tem a certeza que deseja eliminar o portal "{deletingProject?.title}"?</p>
            
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteDialog(false)} className="flex-1 px-4 py-2 rounded-xl border border-white/20 text-white/80 hover:text-white">
                Cancelar
              </button>
              <button onClick={confirmDelete} className="flex-1 px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700">
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
              <button onClick={() => { setShowProjectDialog(false); setFormError(""); }} className="text-white/60 hover:text-white">✕</button>
            </div>
            
            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-sm">
                {formError}
              </div>
            )}
            
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
                  type="text"
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
                      <option key={icon.value} value={icon.value} className="bg-neutral-800">
                        {icon.symbol} {icon.label}
                      </option>
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
                <button onClick={() => { setShowProjectDialog(false); setFormError(""); }} className="flex-1 px-4 py-2 rounded-xl border border-white/20 text-white/80 hover:text-white">
                  Cancelar
                </button>
                <button 
                  onClick={handleSaveProject} 
                  disabled={saving}
                  className="flex-1 px-4 py-2 rounded-xl bg-white text-neutral-800 hover:opacity-90 flex items-center justify-center gap-2"
                >
                  {saving && <div className="spinner"></div>}
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

export default NEXAIHub;