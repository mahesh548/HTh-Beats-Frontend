export async function onRequest({ request, env }) {
  const userAgent = request.headers.get("user-agent") || "";
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Detect bots (WhatsApp, Facebook, Twitter, etc.)
  const isBot =
    /bot|crawl|facebook|twitter|discord|whatsapp|linkedin|preview/i.test(
      userAgent
    );

  // Match dynamic paths like /playlist/123 or /album/xyz
  const pathParts = pathname.split("/").filter(Boolean);
  const [type, id] = pathParts;

  const isDynamicRoute = pathParts.length === 2;

  // Only handle if it's a bot AND a dynamic route
  if (isBot && isDynamicRoute) {
    try {
      const apiDomain = env.VITE_API;
      const secret = env.META_SECRET;

      const metaRes = await fetch(
        `${apiDomain}/meta/${type}/${id}?secret=${secret}`
      );
      const meta = await metaRes.json();

      const html = `<!DOCTYPE html>
<html>
<head>
  <meta property="og:title" content="${meta?.title || "HTh Beats"}" />
  <meta property="og:description" content="${
    meta?.subtitle || "Listen millions of songs for free."
  }" />
  <meta property="og:image" content="${
    meta?.image || "https://hthbeats.online/logo.png"
  }" />
  <meta property="og:url" content="https://hthbeats.online/${type}/${id}" />
  <title>${meta?.title || "HTh Beats"}</title>
</head>
<body></body>
</html>`;

      return new Response(html, {
        headers: {
          "Content-Type": "text/html",
          "Cache-Control": "public, max-age=600",
        },
      });
    } catch (err) {
      return new Response("Meta fetch failed", { status: 500 });
    }
  }

  // If not bot or not a dynamic route: continue to React normally
  return new Response(null, { status: 204 });
}
