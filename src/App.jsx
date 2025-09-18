import React, { useMemo, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
  Plus,
  X,
  Filter,
  Rocket,
  Settings,
  FolderKanban,
  CalendarCheck,
  ScanLine,
  Database,
  Wrench,
  Tags,
} from "lucide-react";
import { Menu, ChevronDown } from "lucide-react";

/**
 * App principal - NEXAI Hub
 * (versão com overlay escuro e vinheta no Hero)
 */

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
];

const TAG_ORDER = ["ExpressGlass", "Operações"];
const STATUS_OPTIONS = ["ativo", "em teste", "em construção", "pausado"];

function useSystemTheme() {
  const prefersDark = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [dark, setDark] = useState(prefersDark);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);
  return { dark, setDark };
}

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
      <Card className="group hover:shadow-lg transition-shadow duration-200 rounded-2xl">
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="shrink-0 rounded-xl border p-2">{p.icon ?? <Puzzle className="size-5" />}</div>
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
        <CardContent className="text-sm text-muted-foreground">
          <p>{p.desc}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {p.tags?.map((t) => (
              <Badge key={t} variant="outline" className="rounded-full text-[10px]">{t}</Badge>
            ))}
            <Badge className="rounded-full text-[10px] capitalize" variant="secondary">{p.status}</Badge>
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild size="sm" className="rounded-xl">
            <a href={p.url} target="_blank" rel="noreferrer">
              Abrir <ExternalLink className="ml-2 size-4" />
            </a>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

function Hero({ onScrollToHub }) {
  return (
    <section className="relative h-[86vh] min-h-[560px] w-full overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[url('/face-swap.png')] bg-cover bg-center" />
      {/* Overlay escuro */}
      <div className="absolute inset-0 bg-black/70" />
      {/* Vinheta extra */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-5 pt-5 sm:px-8">
        <div className="flex items-center gap-2 text-white">
          <div className="rounded-full border border-white/40 p-2">
            <Puzzle className="size-5" />
          </div>
          <span className="font-semibold tracking-wide">NEXAI</span>
        </div>
        <button className="rounded-full border border-white/40 p-2 text-white/90 hover:text-white" aria-label="Abrir menu">
          <Menu className="size-5" />
        </button>
      </div>

      {/* Headline */}
      <div className="relative z-10 mx-auto flex h-full max-w-5xl flex-col items-start justify-center px-5 sm:px-8">
        <h1 className="text-4xl leading-tight font-extrabold text-white drop-shadow-md sm:text-5xl md:text-6xl">NEXAI Hub</h1>
        <p className="mt-2 text-white/90 text-base sm:text-lg">Projetos, portais e ferramentas — tudo num só lugar.</p>

        <button onClick={onScrollToHub} className="mt-10 inline-flex items-center gap-2 rounded-full border border-white/40 px-4 py-2 text-sm text-white/90 hover:text-white">
          Entrar
          <ChevronDown className="size-4" />
        </button>
      </div>
    </section>
  );
}

export default function NEXAIHub() {
  const [query, setQuery] = useState("");
  const [activeTags, setActiveTags] = useState([]);
  const [status, setStatus] = useState("todos");
  const [projects, setProjects] = useState(initialProjects);
  const { dark, setDark } = useSystemTheme();

  const filtered = useMemo(() => projects, [projects]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Hero onScrollToHub={() => {
        const el = document.getElementById('hub');
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }} />
      <section id="hub" className="mx-auto max-w-7xl p-4 sm:p-6">
        <h2 className="text-xl font-bold mb-4">Projetos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <ProjectCard key={p.id} p={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
