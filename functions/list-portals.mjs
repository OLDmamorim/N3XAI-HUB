
// /.netlify/functions/list-portals.mjs - Listar todos os portais (público)
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

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return ok({ ok: true });
  if (event.httpMethod !== 'GET') return err(405, 'Method Not Allowed');

  try {
    // Inicializar BD
    await init();
    
    // Buscar todos os portais (público - sem autenticação)
    const rows = await sql/*sql*/`
      SELECT
        id,
        title,
        description as desc,
        url,
        tags,
        status,
        icon,
        pinned,
        created_at,
        updated_at
      FROM portals
      ORDER BY pinned DESC, title ASC
    `;

    return ok({ ok: true, portals: rows });
  } catch (e) {
    console.error('Erro ao listar portais:', e);
    return err(500, String(e?.message || e));
  }
};