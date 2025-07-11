export async function onRequest(context) {
  const { request, env } = context;
  const userAgent = request.headers.get("user-agent") || "";
  const url = new URL(request.url);
  const pathname = url.pathname;

  const pathParts = pathname.split("/").filter(Boolean);
  const [type, id] = pathParts;
  const isDynamic = pathParts.length === 2;

  const isBot = /bot|crawl|facebook|twitter|discord|whatsapp|linkedin|preview/i.test(userAgent);

  // If it's a bot and a dynamic playlist-type URL
  if (isBot && isDynamic) {
    try {
      const meta = await fetch(`${env.VITE_API}/meta/${type}/${id}?secret=${env.META_SECRET}`).then(res => res.json());

      const html = `<!DOCTYPE html>
<html>
<head>
  <meta property="og:title" content="${meta?.title || 'HTh Beats'}" />
  <meta property="og:description" content="${meta?.subtitle || 'Listen to millions of songs for free.'}" />
  <meta property="og:image" content="${meta?.image || 'https://yourdomain.com/logo.png'}" />
  <meta property="og:url" content="https://yourdomain.com/${type}/${id}" />
  <title>${meta?.title || 'HTh Beats'}</title>
</head><body></body></html>`;

      return new Response(html, {
        headers: {
          "Content-Type": "text/html",
          "Cache-Control": "public, max-age=600",
        },
      });
    } catch {
      return new Response("Error loading meta", { status: 500 });
    }
  }

  // 💡 Let everything else load like normal
  return context.next();
}
