export async function onRequest(context) {
  const { params, request } = context;
  const userAgent = request.headers.get("user-agent") || "";

  const type = params.type;
  const id = params.id;

  const myDomain = "https://hth-beats.pages.dev"; // or your custom domain
  const apiDomain = context.env.VITE_API;
  const secret = context.env.META_SECRET;

  const isBot =
    /bot|crawl|facebook|twitter|discord|whatsapp|linkedin|preview/i.test(
      userAgent
    );

  if (!type || !id) {
    return new Response("Missing parameters", { status: 400 });
  }

  if (isBot) {
    try {
      const metaRes = await fetch(
        `${apiDomain}/meta/${type}/${id}?secret=${secret}`
      );
      const meta = await metaRes.json();

      const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="icon" type="image/svg+xml" href="${myDomain}/logo.png" />
          <link rel="shortcut icon" href="${myDomain}/logo.png" type="image/x-icon" />
          <meta property="og:title" content="${meta?.title || "HTh Beats"}" />
          <meta property="og:description" content="${
            meta?.subtitle || "Listen millions of songs for free."
          }" />
          <meta property="og:image" content="${
            meta?.image || `${myDomain}/logo.png`
          }" />
          <meta property="og:url" content="${myDomain}/${type}/${id}" />
          <title>${meta?.title || "HTh Beats"}</title>
        </head>
        <body></body>
        </html>
      `;

      return new Response(html, {
        headers: {
          "Content-Type": "text/html",
          "Cache-Control": "public, max-age=600",
        },
      });
    } catch (err) {
      return new Response("Error fetching metadata", { status: 500 });
    }
  }

  // Real user: redirect to React app
  return Response.redirect(`${myDomain}/${type}/${id}`, 302);
}
