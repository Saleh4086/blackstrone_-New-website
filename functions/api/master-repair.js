const MASTER_INTAKE = 'https://brokerage-os-master.pages.dev/api/website-repair-intake';

function reply(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'x-blackstone-stage': '64F'
    }
  });
}

export async function onRequestPost({ request }) {
  let payload;
  try { payload = await request.json(); }
  catch (_) { return reply({ ok:false, error:'invalid_json' }, 400); }

  try {
    const upstream = await fetch(MASTER_INTAKE, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const text = await upstream.text();
    let data;
    try { data = JSON.parse(text); }
    catch (_) { data = { ok:false, error:'invalid_master_response' }; }
    return reply(data, upstream.status);
  } catch (_) {
    return reply({ ok:false, error:'master_intake_unreachable' }, 502);
  }
}

export async function onRequestGet() {
  return reply({ ok:true, stage:'64F', route:'website-to-master-repair-proxy' });
}
