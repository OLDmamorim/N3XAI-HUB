// /.netlify/functions/update-portal.mjs - Atualizar portal (Neon sql tag, sem sql.unsafe)
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

    // Se nada para atualizar, avisa
    if (
      typeof title === 'undefined' &&
      typeof desc === 'undefined' &&
      typeof url === 'undefined' &&
      typeof tagsArray === 'undefined' &&
      typeof status === 'undefined' &&
      typeof icon === 'undefined' &&
      typeof pinned === 'undefined'
    ) {
      return err(400, 'Nada para atualizar');
    }

    const result = await sql/*sql*/`
      UPDATE portals SET
        title = COALESCE(${typeof title !== 'undefined' ? title : null}, title),
        description = COALESCE(${typeof desc !== 'undefined' ? desc : null}, description),
        url = COALESCE(${typeof url !== 'undefined' ? url : null}, url),
        tags = COALESCE(${tagsArray !== null ? tagsArray : null}, tags),
        status = COALESCE(${typeof status !== 'undefined' ? status : null}, status),
        icon = COALESCE(${typeof icon !== 'undefined' ? icon : null}, icon),
        pinned = COALESCE(${typeof pinned === 'boolean' ? pinned : null}, pinned),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING id
    `;

    if (!result.length) return err(404, 'Portal não encontrado');

    return ok({ ok: true, id, message: 'Portal atualizado com sucesso' });
  } catch (e) {
    console.error('Erro ao atualizar portal:', e);
    const statusCode = e.message.includes('Token') || e.message.includes('autorizado') ? 401 : 500;
    return err(statusCode, String(e?.message || e));
  }
};
