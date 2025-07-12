export async function onRequest(context) {
  const { request, next, env } = context;
  const userAgent = request.headers.get("user-agent") || "";
  const url = new URL(request.url);
  const pathname = url.pathname;

  const match = pathname.match(
    /^\/(playlist|album|song|mix|artist)\/([^\/]+)$/
  );
  if (!match) return next();

  const [_, type, id] = match;

  const isBot =
    /bot|crawl|slurp|spider|facebook|twitter|discord|whatsapp|linkedin|embed/i.test(
      userAgent
    );
  if (!isBot) return next();

  const apiDomain = env.VITE_API;
  const secret = env.META_SECRET;
  const frontendDomain = "https://hthbeats.online";

  let meta = {};
  try {
    const res = await fetch(`${apiDomain}/meta/${type}/${id}?secret=${secret}`);
    meta = await res.json();
  } catch (err) {
    console.error("Metadata fetch failed:", err);
  }

  const title = meta?.title || "HTh Beats";
  const desc = meta?.subtitle || "Listen millions of songs for free.";
  const image = meta?.image || `${frontendDomain}/logo.png`;
  const pageUrl = `${frontendDomain}/${type}/${id}`;

  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${desc}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:url" content="${pageUrl}" />
  </head>
  <body>
    <script>
      window.location.href = "${pageUrl}";
    </script>
  </body>
</html>`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html",
      "Cache-Control": "public, max-age=600",
    },
  });
}
