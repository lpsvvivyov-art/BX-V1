export async function onRequestGet({params,env}) {
 const token=params.token||'';
 if(!/^[a-f0-9]{48}$/.test(token)) return Response.json({error:'لینک اشتراک نامعتبر است'},{status:404});
 const row=await env.DB.prepare('SELECT name,country,total_bytes,used_bytes,online_seconds,last_handshake,last_seen,expires_at,created_at FROM subscriptions WHERE token=?').bind(token).first();
 if(!row) return Response.json({error:'اشتراک پیدا نشد'},{status:404});
 return Response.json({...row,expired:row.expires_at<=Math.floor(Date.now()/1000),online:row.last_handshake && Date.now()/1000-row.last_handshake<180});
}
