// WireGuard monitoring agent on your own server must POST real counters here.
// Header: X-Agent-Token: <USAGE_AGENT_TOKEN>
// JSON: {token, used_bytes, online_seconds, last_handshake, last_seen}
export async function onRequestPost({request,env}) {
 if(!env.DB || !env.USAGE_AGENT_TOKEN) return Response.json({error:'Agent is not configured'}, {status:503});
 if(request.headers.get('X-Agent-Token')!==env.USAGE_AGENT_TOKEN) return Response.json({error:'Unauthorized'}, {status:401});
 let b; try { b=await request.json(); } catch { return Response.json({error:'Bad JSON'}, {status:400}); }
 if(!/^[a-f0-9]{48}$/.test(b.token||'') || !Number.isFinite(Number(b.used_bytes)) || !Number.isFinite(Number(b.online_seconds))) return Response.json({error:'Invalid metrics'}, {status:400});
 const now=Math.floor(Date.now()/1000);
 const r=await env.DB.prepare('UPDATE subscriptions SET used_bytes=?,online_seconds=?,last_handshake=?,last_seen=? WHERE token=?').bind(Math.max(0,Math.floor(b.used_bytes)),Math.max(0,Math.floor(b.online_seconds)),Number.isFinite(Number(b.last_handshake))?Math.floor(b.last_handshake):null,Number.isFinite(Number(b.last_seen))?Math.floor(b.last_seen):now,b.token).run();
 return Response.json({ok:true,changes:r.meta?.changes??0});
}
