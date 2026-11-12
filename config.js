export async function onRequestPost({request,env}) {
  if (!env.DB || !env.ADMIN_TOKEN) return Response.json({error:'تنظیمات DB یا ADMIN_TOKEN ناقص است'}, {status:500});
  if (request.headers.get('Authorization') !== `Bearer ${env.ADMIN_TOKEN}`) return Response.json({error:'توکن مدیر اشتباه است'}, {status:401});
  let b; try { b=await request.json(); } catch { return Response.json({error:'درخواست نامعتبر'}, {status:400}); }
  if (!b.name || !b.config_text || !Number.isFinite(Number(b.volume_gb)) || Number(b.volume_gb)<=0 || !/^\d{4}-\d{2}-\d{2}$/.test(b.expires_at||'')) return Response.json({error:'اطلاعات کانفیگ ناقص است'}, {status:400});
  const token=Array.from(crypto.getRandomValues(new Uint8Array(24)),x=>x.toString(16).padStart(2,'0')).join('');
  const now=Math.floor(Date.now()/1000), exp=Math.floor(new Date(b.expires_at+'T23:59:59Z').getTime()/1000);
  await env.DB.prepare('INSERT INTO subscriptions(token,name,file_name,config_text,country,uid,total_bytes,expires_at,created_at) VALUES(?,?,?,?,?,?,?,?,?)').bind(token,String(b.name).slice(0,100),String(b.file_name||'config.conf').slice(0,120),String(b.config_text),String(b.country||''),String(b.uid||''),Math.floor(Number(b.volume_gb)*1024**3),exp,now).run();
  const base=new URL(request.url).origin;
  return Response.json({url:`${base}/sub/${token}`});
}
