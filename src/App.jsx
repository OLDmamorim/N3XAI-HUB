import React, { useMemo, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import {
  Puzzle,
  Search,
  Star,
  ExternalLink,
  Filter,
  FolderKanban,
  CalendarCheck,
  ScanLine,
  Tags,
  Menu,
  ChevronDown,
} from "lucide-react";

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
    icon: <CalendarCheck className="size-5" />,
    pinned: true,
  },
  {
    id: "ocr",
    title: "Express OCR",
    desc: "Leitura de Eurocodes e etiquetas com validação e base de dados.",
    url: "https://example.com/ocr",
    tags: ["OCR", "Operações", "BD"],
    status: "ativo",
    icon: <ScanLine className="size-5" />,
    pinned: true,
  },
  {
    id: "rececao-material",
    title: "Receção de Material",
    desc: "Registo de entradas, reconciliação e controlo de stock em loja.",
    url: "https://example.com/rececao",
    tags: ["Stock", "Operações"],
    status: "em teste",
    icon: <FolderKanban className="size-5" />,
    pinned: false,
  },
];

const TAG_ORDER = ["ExpressGlass", "Operações", "OCR", "Stock", "Notion", "Automação", "Front-end", "BD", "Admin", "Permissões", "Pessoal", "Prototipagem"];
const STATUS_OPTIONS = ["ativo", "em teste", "em construção", "pausado"];

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
   UI auxiliares
========================= */
function Tag({ label, onClick, active }) {
  return (
    <Badge
      onClick={onClick}
      variant={active ? "default" : "secondary"}
      className={`cursor-pointer select-none rounded-full px-3 py-1 text-xs ${
        active ? "shadow" : "opacity-90 hover:opacity-100"
      }`}
    >
      {label}
    </Badge>
  );
}

function ProjectCard({ p }) {
  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="group transition-shadow duration-200 rounded-2xl bg-white/5 text-white border border-white/10 hover:shadow-lg">
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-2 text-white/85">
            <div className="shrink-0 rounded-xl border border-white/10 p-2">
              {p.icon ?? <Puzzle className="size-5" />}
            </div>
            <CardTitle className="text-base sm:text-lg leading-tight flex items-center gap-2">
              {p.title}
              {p.pinned && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Star className="size-4 fill-current text-yellow-500" />
                    </TooltipTrigger>
                    <TooltipContent>Fixado</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="text-sm text-white/75">
          <p>{p.desc}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {p.tags?.map((t) => (
              <Badge key={t} variant="outline" className="rounded-full text-[10px] border-white/20 text-white/85">
                {t}
              </Badge>
            ))}
            <Badge className="rounded-full text-[10px] capitalize bg-white/10 text-white">{p.status}</Badge>
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild size="sm" className="rounded-xl bg-white text-neutral-800 hover:opacity-90">
            <a href={p.url} target="_blank" rel="noreferrer">
              Abrir <ExternalLink className="ml-2 size-4" />
            </a>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

/* =========================
   Hero com imagem fixa (bg-fixed)
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
            <Puzzle className="size-5" />
          </div>
          <span className="font-semibold tracking-wide">NEXAI</span>
        </div>
        <button
          className="rounded-full border border-white/40 p-2 text-white/90 hover:text-white"
          aria-label="Abrir menu"
        >
          <Menu className="size-5" />
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
          Entrar
          <ChevronDown className="size-4" />
        </button>
      </div>

      {/* Blend para fundo cinza base */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 sm:h-28 md:h-32 bg-gradient-to-b from-transparent to-neutral-700" />
    </section>
  );
}

/* =========================
   App
========================= */
export default function NEXAIHub() {
  const [query, setQuery] = useState("");
  const [activeTags, setActiveTags] = useState([]);
  const [status, setStatus] = useState("todos");
  const [projects, setProjects] = useState(initialProjects);
  const { dark, setDark } = useSystemTheme();

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
            <motion.div initial={{ rotate: -6, scale: 0.9 }} animate={{ rotate: 0, scale: 1 }} className="rounded-2xl border border-white/10 p-2">
              <Puzzle className="size-6" />
            </motion.div>
            <div>
              <img src="/n3xai-logo.png" alt="NEXAI Logo" className="h-8 sm:h-10 md:h-12 drop-shadow-md select-none" draggable={false} />
              <p className="text-sm text-white/75">O ponto único para todos os teus portais e ferramentas.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center space-x-2">
              <Switch id="theme" checked={dark} onCheckedChange={setDark} />
              <Label htmlFor="theme" className="text-sm">Tema escuro</Label>
            </div>
          </div>
        </div>

        <Separator className="my-4 border-white/10" />

        {/* Search & Filters */}
        <div className="grid gap-3 md:grid-cols-[1fr_auto_auto] md:items-center">
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 px-3 py-2 bg-white/5">
            <Search className="size-4" />
            <Input
              id="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pesquisar por título, descrição ou tag… (atalho: /)"
              className="border-0 focus-visible:ring-0 bg-transparent text-white placeholder:text-white/60"
            />
          </div>
          <Tabs value={status} onValueChange={setStatus} className="justify-self-start">
            <TabsList className="grid grid-cols-5 bg-white/5 border border-white/10 rounded-xl">
              <TabsTrigger value="todos">Todos</TabsTrigger>
              {STATUS_OPTIONS.map((s) => (
                <TabsTrigger key={s} value={s} className="capitalize">{s}</TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <div className="justify-self-end">
            <Button variant="ghost" size="sm" className="rounded-xl" onClick={clearFilters}>
              <Filter className="mr-2 size-4" />Limpar filtros
            </Button>
          </div>
        </div>

        {/* Tags */}
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge variant="outline" className="rounded-full text-[10px] flex items-center gap-1 border-white/20 text-white/85">
            <Tags className="size-3" />Tags
          </Badge>
          {tags.map((t) => (
            <Tag key={t} label={t} active={activeTags.includes(t)} onClick={() => toggleTag(t)} />
          ))}
        </div>

        {/* Grid */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <ProjectCard key={p.id} p={p} />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center text-white/75 py-16">
              <Search className="mx-auto mb-3 size-6" />
              <p>Nada encontrado com esses filtros.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-10 text-center text-xs text-white/60">
          <div className="flex items-center justify-center gap-2">
            <Puzzle className="size-3" />
            <span>NEXAI • Hub — o teu ponto único de acesso</span>
          </div>
        </div>
      </section>
    </div>
  );
}