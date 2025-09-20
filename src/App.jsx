import React, { useState, useEffect } from 'react';
import { 
  CalendarCheck, 
  ScanLine, 
  FolderKanban, 
  Puzzle,
  Search,
  Plus,
  Edit,
  Trash2,
  X,
  Moon,
  Sun,
  LogOut,
  User
} from 'lucide-react';
import './App.css';

// Dados iniciais dos portais
const initialProjects = [
  {
    id: 1,
    title: "Express OCR",
    description: "Leitura de Eurocodes e etiquetas com validação e base de dados.",
    url: "https://example.com/ocr",
    status: "ativo",
    icon: "ScanLine",
    tags: ["OCR", "Operações", "BD", "Ativo"],
    pinned: true
  },
  {
    id: 2,
    title: "ExpressGlass • Agendamentos",
    description: "Portal para marcação e gestão de serviços por loja e serviço móvel.",
    url: "https://example.com/agendamentos",
    status: "ativo",
    icon: "CalendarCheck",
    tags: ["ExpressGlass", "Operações", "Front-end", "Ativo"],
    pinned: true
  },
  {
    id: 3,
    title: "Receção de Material",
    description: "Registo de entradas, reconciliação e controlo de stock em loja.",
    url: "https://example.com/recepcao",
    status: "pausado",
    icon: "FolderKanban",
    tags: ["Stock", "Operações", "Em Teste"],
    pinned: false
  }
];

const STATUS_OPTIONS = ["ativo", "em teste", "em construção", "pausado"];
const ICON_OPTIONS = ["CalendarCheck", "ScanLine", "FolderKanban", "Puzzle"];

const ICON_MAP = {
  CalendarCheck: <CalendarCheck size={20} />,
  ScanLine: <ScanLine size={20} />,
  FolderKanban: <FolderKanban size={20} />,
  Puzzle: <Puzzle size={20} />,
};

function App() {
  const [projects, setProjects] = useState(initialProjects);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [tagFilter, setTagFilter] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [loginPassword, setLoginPassword] = useState("");

  // Formulário de projeto
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    url: "",
    status: "ativo",
    icon: "Puzzle",
    tags: "",
    pinned: false
  });

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    document.body.className = darkMode ? 'dark-mode' : '';
  }, [darkMode]);

  // Filtrar projetos
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === "Todos" || project.status === statusFilter;
    const matchesTag = !tagFilter || project.tags.some(tag => tag.toLowerCase().includes(tagFilter.toLowerCase()));
    
    return matchesSearch && matchesStatus && matchesTag;
  });

  // Ordenar projetos (fixados primeiro)
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return 0;
  });

  // Obter todas as tags únicas
  const allTags = [...new Set(projects.flatMap(p => p.tags))];

  const handleLogin = () => {
    if (loginPassword === "admin123") {
      setIsAdmin(true);
      setShowLoginDialog(false);
      setLoginPassword("");
    } else {
      alert("Palavra-passe incorreta!");
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
  };

  const handleAddProject = () => {
    setEditingProject(null);
    setFormData({
      title: "",
      description: "",
      url: "",
      status: "ativo",
      icon: "Puzzle",
      tags: "",
      pinned: false
    });
    setShowProjectDialog(true);
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      url: project.url,
      status: project.status,
      icon: project.icon,
      tags: project.tags.join(", "),
      pinned: project.pinned
    });
    setShowProjectDialog(true);
  };

  const handleDeleteProject = (projectId) => {
    if (confirm("Tem a certeza que deseja eliminar este portal?")) {
      setProjects(projects.filter(p => p.id !== projectId));
    }
  };

  const handleSaveProject = () => {
    if (!formData.title || !formData.description || !formData.url) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const projectData = {
      ...formData,
      tags: formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag),
      id: editingProject ? editingProject.id : Date.now()
    };

    if (editingProject) {
      setProjects(projects.map(p => p.id === editingProject.id ? projectData : p));
    } else {
      setProjects([...projects, projectData]);
    }

    setShowProjectDialog(false);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("Todos");
    setTagFilter("");
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <img src="/n3xai-logo.png" alt="NEXAI Logo" className="logo" />
            <h1>NEXAI Hub</h1>
          </div>
          
          <div className="header-right">
            <button onClick={() => setDarkMode(!darkMode)} className="icon-btn">
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            {isAdmin ? (
              <div className="admin-controls">
                <button onClick={handleAddProject} className="btn btn-primary">
                  <Plus size={16} />
                  <span>Adicionar Portal</span>
                </button>
                <button onClick={handleLogout} className="icon-btn">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <button onClick={() => setShowLoginDialog(true)} className="btn btn-secondary">
                <User size={16} />
                <span>Admin Login</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="hero">
        <div className="hero-content">
          <h2>O ponto único para todos os teus portais e ferramentas</h2>
          <p>Acede rapidamente a todas as aplicações e serviços da NEXAI</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Filters */}
        <div className="filters-section">
          <div className="search-row">
            <div className="search-input-wrapper">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                placeholder="Pesquisar por título, descrição ou tag..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="Todos">Todos</option>
              {STATUS_OPTIONS.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            <button onClick={clearFilters} className="clear-filters-btn">
              Limpar filtros
            </button>
          </div>

          <div className="tags-row">
            <span className="tags-label">Tags:</span>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setTagFilter(tagFilter === tag ? "" : tag)}
                className={`tag-btn ${tagFilter === tag ? 'active' : ''}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="projects-grid">
          {sortedProjects.map((project) => (
            <div key={project.id} className="project-card">
              {project.pinned && (
                <div className="pinned-badge">Fixado</div>
              )}

              <div className="project-header">
                <div className="project-info">
                  <div className="project-icon">
                    {ICON_MAP[project.icon]}
                  </div>
                  <div>
                    <h3>{project.title}</h3>
                    <div className="status-row">
                      <span className={`status-dot status-${project.status}`}></span>
                      <span className="status-text">{project.status}</span>
                    </div>
                  </div>
                </div>

                {isAdmin && (
                  <div className="project-actions">
                    <button
                      onClick={() => handleEditProject(project)}
                      className="action-btn edit-btn"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="action-btn delete-btn"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>

              <p className="project-description">{project.description}</p>

              <div className="project-tags">
                {project.tags.map((tag, index) => (
                  <span key={index} className="project-tag">
                    {tag}
                  </span>
                ))}
              </div>

              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Abrir
              </a>
            </div>
          ))}
        </div>

        {sortedProjects.length === 0 && (
          <div className="no-results">
            <p>Nenhum portal encontrado com os filtros aplicados.</p>
          </div>
        )}
      </div>

      {/* Login Dialog */}
      {showLoginDialog && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Login de Administrador</h3>
              <button
                onClick={() => setShowLoginDialog(false)}
                className="close-btn"
              >
                <X size={20} />
              </button>
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
                />
              </div>
              
              <div className="modal-actions">
                <button
                  onClick={() => setShowLoginDialog(false)}
                  className="btn btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleLogin}
                  className="btn btn-primary"
                >
                  Entrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Project Dialog */}
      {showProjectDialog && (
        <div className="modal-overlay">
          <div className="modal modal-large">
            <div className="modal-header">
              <h3>{editingProject ? 'Editar Portal' : 'Adicionar Novo Portal'}</h3>
              <button
                onClick={() => setShowProjectDialog(false)}
                className="close-btn"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-content">
              <div className="form-group">
                <label>Título *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Nome do portal..."
                />
              </div>

              <div className="form-group">
                <label>Descrição *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  placeholder="Descrição do portal..."
                />
              </div>

              <div className="form-group">
                <label>URL *</label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({...formData, url: e.target.value})}
                  placeholder="https://example.com"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Estado</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
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
                  >
                    {ICON_OPTIONS.map(icon => (
                      <option key={icon} value={icon}>{icon}</option>
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
                <button
                  onClick={() => setShowProjectDialog(false)}
                  className="btn btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveProject}
                  className="btn btn-primary"
                >
                  {editingProject ? 'Guardar Alterações' : 'Criar Portal'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>© NEXAI • Hub — o teu ponto único de acesso</p>
        </div>
      </footer>
    </div>
  );
}

export default App;