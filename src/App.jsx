import React, { useState, useEffect, useMemo } from 'react';
import './App.css';

// Configurações
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

// Função para obter símbolo do ícone
const getIconSymbol = (iconValue) => {
  const icon = ICON_OPTIONS.find(i => i.value === iconValue);
  return icon ? icon.symbol : "◈";
};

// API functions usando Netlify Functions
const api = {
  async getPortals() {
    try {
      const response = await fetch('/.netlify/functions/list-portals');
      if (!response.ok) {
        throw new Error('Erro ao carregar portais');
      }
      const data = await response.json();
      return data.portals || [];
    } catch (error) {
      console.error('Erro ao carregar portais:', error);
      throw error;
    }
  },

  async createPortal(data, token) {
    const response = await fetch('/.netlify/functions/save-portal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao criar portal');
    }
    
    return await response.json();
  },

  async updatePortal(id, data, token) {
    const response = await fetch('/.netlify/functions/update-portal', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ id, ...data })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao atualizar portal');
    }
    
    return await response.json();
  },

  async deletePortal(id, token) {
    const response = await fetch(`/.netlify/functions/delete-portal/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao eliminar portal');
    }
    
    return await response.json();
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
      className={`tag ${active ? 'tag-active' : ''}`}
    >
      {label}
    </span>
  );
}

function ProjectCard({ p, isAdmin, onEdit, onDelete }) {
  return (
    <div className="project-card">
      {isAdmin && (
        <div className="admin-buttons">
          <button
            onClick={() => onEdit(p)}
            className="admin-btn edit-btn"
            title="Editar"
          >
            ✏
          </button>
          <button
            onClick={() => onDelete(p)}
            className="admin-btn delete-btn"
            title="Eliminar"
          >
            ✕
          </button>
        </div>
      )}

      <div className="card-header">
        <div className="icon-container">
          <div className="project-icon">
            {getIconSymbol(p.icon)}
          </div>
          <h3 className="project-title">
            {p.title}
            {p.pinned && (
              <span className="pinned-icon" title="Fixado">★</span>
            )}
          </h3>
        </div>
      </div>
      
      <div className="card-content">
        <p className="project-description">{p.desc}</p>
        <div className="tags-container">
          {p.tags?.map((t) => (
            <span key={t} className="project-tag">
              {t}
            </span>
          ))}
          <span className="status-tag">{p.status}</span>
        </div>
      </div>
      
      <a 
        href={p.url} 
        target="_blank" 
        rel="noreferrer"
        className="open-button"
      >
        Abrir →
      </a>
    </div>
  );
}

function Hero({ onScrollToHub }) {
  return (
    <section className="hero">
      <div className="hero-overlay" />
      
      <div className="hero-header">
        <div className="logo-container">
          <div className="logo-icon">◈</div>
          <span className="logo-text">NEXAI</span>
        </div>
        <button className="menu-button" aria-label="Abrir menu">☰</button>
      </div>

      <div className="hero-content">
        <img src="/n3xai-logo.png" alt="NEXAI Logo" className="hero-logo" />
        <p className="hero-subtitle">The missing piece</p>
        <button onClick={onScrollToHub} className="enter-button">
          Entrar ↓
        </button>
      </div>

      <div className="hero-gradient" />
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
      await api.deletePortal(deletingProject.id, adminToken);
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
        await api.updatePortal(editingProject.id, projectData, adminToken);
      } else {
        await api.createPortal(projectData, adminToken);
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
      <div className="loading-screen">
        <div className="loading-content">
          <div className="spinner"></div>
          <span>A carregar portais...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Hero onScrollToHub={() => {
        const el = document.getElementById("hub");
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      }} />

      <section id="hub" className="hub-section">
        {/* Header */}
        <div className="hub-header">
         

          <div className="hub-actions">
            {isAdmin ? (
              <div className="admin-actions">
                <button 
                  onClick={handleAddProject}
                  className="add-button"
                >
                  + Adicionar Portal
                </button>
                <button 
                  onClick={handleLogout}
                  className="logout-button"
                >
                  ←
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowLoginDialog(true)}
                className="login-button"
              >
                ⚙ Admin Login
              </button>
            )}
          </div>
        </div>

        <div className="divider" />

        {/* Search & Filters */}
        <div className="filters-section">
          <div className="search-container">
            <span className="search-icon">⌕</span>
            <input
              id="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pesquisar por título, descrição ou tag… (atalho: /)"
              className="search-input"
            />
          </div>
          
          <div className="status-filter">
            <button
              onClick={() => setStatus("todos")}
              className={`status-btn ${status === "todos" ? "active" : ""}`}
            >
              Todos
            </button>
            {STATUS_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`status-btn ${status === s ? "active" : ""}`}
              >
                {s}
              </button>
            ))}
          </div>
          
          <button 
            onClick={clearFilters}
            className="clear-button"
          >
            ↻ Limpar filtros
          </button>
        </div>

        {/* Tags */}
        <div className="tags-section">
          <span className="tags-label"># Tags</span>
          {tags.map((t) => (
            <Tag key={t} label={t} active={activeTags.includes(t)} onClick={() => toggleTag(t)} />
          ))}
        </div>

        {/* Grid */}
        <div className="projects-grid">
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
            <div className="no-results">
              <span className="no-results-icon">⌕</span>
              <p>Nada encontrado com esses filtros.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="footer">
          <div className="footer-content">
            <span>◈</span>
            <span>NEXAI • Hub — o teu ponto único de acesso</span>
          </div>
        </div>
      </section>

      {/* Login Dialog */}
      {showLoginDialog && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Login de Administrador</h3>
              <button onClick={() => { setShowLoginDialog(false); setLoginError(""); }} className="close-btn">✕</button>
            </div>
            
            <div className="modal-content">
              <div className="form-group">
                <label>Palavra-passe</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  placeholder="Digite a palavra-passe..."
                  className="form-input"
                />
                {loginError && (
                  <div className="error-message">{loginError}</div>
                )}
              </div>
              
              <div className="modal-actions">
                <button onClick={() => { setShowLoginDialog(false); setLoginError(""); }} className="cancel-btn">
                  Cancelar
                </button>
                <button onClick={handleLogin} className="confirm-btn">
                  Entrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      {showDeleteDialog && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Confirmar Eliminação</h3>
              <button onClick={() => setShowDeleteDialog(false)} className="close-btn">✕</button>
            </div>
            
            <p className="modal-text">Tem a certeza que deseja eliminar o portal "{deletingProject?.title}"?</p>
            
            <div className="modal-actions">
              <button onClick={() => setShowDeleteDialog(false)} className="cancel-btn">
                Cancelar
              </button>
              <button onClick={confirmDelete} className="delete-btn">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Project Dialog */}
      {showProjectDialog && (
        <div className="modal-overlay">
          <div className="modal large">
            <div className="modal-header">
              <h3>
                {editingProject ? 'Editar Portal' : 'Adicionar Novo Portal'}
              </h3>
              <button onClick={() => { setShowProjectDialog(false); setFormError(""); }} className="close-btn">✕</button>
            </div>
            
            {formError && (
              <div className="error-banner">
                {formError}
              </div>
            )}
            
            <div className="modal-content">
              <div className="form-group">
                <label>Título *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Nome do portal..."
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Descrição *</label>
                <textarea
                  value={formData.desc}
                  onChange={(e) => setFormData({...formData, desc: e.target.value})}
                  rows={3}
                  placeholder="Descrição do portal..."
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>URL *</label>
                <input
                  type="text"
                  value={formData.url}
                  onChange={(e) => setFormData({...formData, url: e.target.value})}
                  placeholder="https://example.com"
                  className="form-input"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Estado</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="form-input"
                  >
                    {STATUS_OPTIONS.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Ícone</label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({...formData, icon: e.target.value})}
                    className="form-input"
                  >
                    {ICON_OPTIONS.map(icon => (
                      <option key={icon.value} value={icon.value}>
                        {icon.symbol} {icon.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Tags (separadas por vírgula)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  placeholder="ExpressGlass, Operações, Front-end"
                  className="form-input"
                />
              </div>

              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="pinned"
                  checked={formData.pinned}
                  onChange={(e) => setFormData({...formData, pinned: e.target.checked})}
                />
                <label htmlFor="pinned">Portal fixado (aparece primeiro)</label>
              </div>
              
              <div className="modal-actions">
                <button onClick={() => { setShowProjectDialog(false); setFormError(""); }} className="cancel-btn">
                  Cancelar
                </button>
                <button 
                  onClick={handleSaveProject} 
                  disabled={saving}
                  className="confirm-btn"
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
