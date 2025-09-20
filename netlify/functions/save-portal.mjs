// /.netlify/functions/save-portal.mjs - Criar novo portal (sem user_id)
import { jsonHeaders, sql, init } from './db-portals.mjs';

const ok = (data) => ({
  statusCode: 200,
  headers: jsonHeaders,
  body: JSON.stringify(data),
});

const err = (status, message) => ({
  statusCode: status,
  headers: jsonHeaders,
  body: JSON.stringify({ ok: false, error: message }),
});

function checkAdminAuth(event) {
  const authHeader = event.headers.authorization || event.headers.Authorization;
  const adminPassword = 'admin123';
  if (!authHeader || !authHeader.startsWith('Bearer ')) throw new Error('Token de autenticação necessário');
  const token = authHeader.substring(7);
  if (token !== adminPassword) throw new Error('Não autorizado');
  return true;
}

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return ok({ ok: true });
  if (event.httpMethod !== 'POST') return err(405, 'Method Not Allowed');
  try {
    checkAdminAuth(event);
    await init();
    const data = JSON.parse(event.body || '{}');
    const { title, desc, url, tags, status, icon, pinned } = data;
    if (!title || !desc || !url) return err(400, 'Título, descrição e URL são obrigatórios');
    const id = data.id || `portal-${Date.now()}`;
    const tagsArray = Array.isArray(tags)
      ? tags
      : typeof tags === 'string'
      ? tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [];
    const result = await sql/*sql*/`
      INSERT INTO portals (id, title, description, url, tags, status, icon, pinned)
      VALUES (${id}, ${title}, ${desc}, ${url}, ${tagsArray}, ${status || 'ativo'}, ${icon || 'puzzle'}, ${!!pinned})
      RETURNING id
    `;
    return ok({ ok: true, id: result[0].id, message: 'Portal criado com sucesso' });
  } catch (e) {
    console.error('Erro ao criar portal:', e);
    const statusCode = e.message.includes('Token') || e.message.includes('autorizado') ? 401 : 500;
    return err(statusCode, String(e?.message || e));
  }
};
