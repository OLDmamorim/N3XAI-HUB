// /.netlify/functions/update-portal.mjs - Atualizar portal (sem user_id)
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
  if (event.httpMethod !== 'PUT' && event.httpMethod !== 'PATCH') return err(405, 'Method Not Allowed');

  try {
    checkAdminAuth(event);
    await init();
    const data = JSON.parse(event.body || '{}');
    const { id, title, desc, url, tags, status, icon, pinned } = data;
    if (!id) return err(400, 'ID é obrigatório');
    const tagsArray = Array.isArray(tags)
      ? tags
      : typeof tags === 'string'
      ? tags.split(',').map((t) => t.trim()).filter(Boolean)
      : null;
    const fields = [];
    if (typeof title !== 'undefined') fields.push({ key: 'title', val: title });
    if (typeof desc !== 'undefined') fields.push({ key: 'description', val: desc });
    if (typeof url !== 'undefined') fields.push({ key: 'url', val: url });
    if (tagsArray !== null) fields.push({ key: 'tags', val: tagsArray });
    if (typeof status !== 'undefined') fields.push({ key: 'status', val: status });
    if (typeof icon !== 'undefined') fields.push({ key: 'icon', val: icon });
    if (typeof pinned !== 'undefined') fields.push({ key: 'pinned', val: !!pinned });
    if (!fields.length) return err(400, 'Nada para atualizar');
    const sets = fields.map((f, i) => `${f.key} = $${i + 1}`).join(', ');
    const values = fields.map((f) => f.val);
    const query = `UPDATE portals SET ${sets}, updated_at = NOW() WHERE id = $${fields.length + 1} RETURNING id`;
    const result = await sql.unsafe(query, [...values, id]);
    if (!result.length) return err(404, 'Portal não encontrado');
    return ok({ ok: true, id, message: 'Portal atualizado com sucesso' });
  } catch (e) {
    console.error('Erro ao atualizar portal:', e);
    const statusCode = e.message.includes('Token') || e.message.includes('autorizado') ? 401 : 500;
    return err(statusCode, String(e?.message || e));
  }
};
