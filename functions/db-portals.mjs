// Helper de ligação ao Neon + criação da tabela de portais na 1ª execução
import postgres from 'postgres';

const CONN = process.env.NEON_DATABASE_URL;
if (!CONN) throw new Error('NEON_DATABASE_URL não definido');

export const sql = postgres(CONN);

let inited = false;
export async function init() {
  if (inited) return;
  
  // Criar tabela de portais se não existir
  await sql`
    CREATE TABLE IF NOT EXISTS portals (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      url TEXT NOT NULL,
      tags TEXT[], -- Array de strings
      status TEXT NOT NULL DEFAULT 'ativo',
      icon TEXT NOT NULL DEFAULT 'puzzle',
      pinned BOOLEAN NOT NULL DEFAULT FALSE,
      user_id BIGINT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  // Inserir dados iniciais se a tabela estiver vazia
  const count = await sql`SELECT COUNT(*) as count FROM portals`;
  
  if (count[0].count === 0) {
    await sql`
      INSERT INTO portals (id, title, description, url, tags, status, icon, pinned, user_id)
      VALUES 
        ('agendamentos', 'ExpressGlass • Agendamentos', 'Portal para marcação e gestão de serviços por loja e serviço móvel.', 'https://example.com/agendamentos', ARRAY['ExpressGlass', 'Operações', 'Front-end'], 'ativo', 'calendar', true, 1),
        ('ocr', 'Express OCR', 'Leitura de Eurocodes e etiquetas com validação e base de dados.', 'https://example.com/ocr', ARRAY['OCR', 'Operações', 'BD'], 'ativo', 'scan', true, 1),
        ('rececao-material', 'Receção de Material', 'Registo de entradas, reconciliação e controlo de stock em loja.', 'https://example.com/rececao', ARRAY['Stock', 'Operações'], 'em teste', 'package', false, 1)
    `;
  }
  
  inited = true;
}

// headers comuns 
export const jsonHeaders = {
  'content-type': 'application/json',
  'access-control-allow-origin': '*',
  'access-control-allow-headers': 'Content-Type, Authorization',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS'
};