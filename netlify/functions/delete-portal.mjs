// /.netlify/functions/delete-portal.mjs - Apagar portal por ID (requer admin)
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

// Verificação simples de admin
function checkAdminAuth(event) {
  const authHeader = event.headers.authorization || event.headers.Authorization;
  const adminPassword = 'admin123'; // Mesma pass do frontend
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Token de autenticação necessário');
  }

  const token = authHeader.substring(7);
  if (token !== adminPassword) throw new Error('Não autorizado');
  return true;
}

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return ok({ ok: true });
  if (event.httpMethod !== 'DELETE') return err(405, 'Method Not Allowed');

  try {
    checkAdminAuth(event);
    await init();

    const id = event.path.split('/').pop(); // último segmento da URL

    if (!id) return err(400, 'ID é obrigatório');

    const result = await sql/*sql*/`
      DELETE FROM portals WHERE id = ${id}
      RETURNING id
    `;

    if (result.length === 0) return err(404, 'Portal não encontrado');

    return ok({ ok: true, id, message: 'Portal eliminado com sucesso' });
  } catch (e) {
    console.error('Erro ao eliminar portal:', e);
    const statusCode = e.message.includes('Token') || e.message.includes('autorizado') ? 401 : 500;
    return err(statusCode, String(e?.message || e));
  }
};