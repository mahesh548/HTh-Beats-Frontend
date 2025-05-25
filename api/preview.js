// api/preview.js

export async function GET(request) {
  const userAgent = request.headers.get("user-agent") || "";
  const url = new URL(request.url);
  const type = url.searchParams.get("type");
  const id = url.searchParams.get("id");
  const myDomain = "https://hthbeats.vercel.app";
  const apiDomain = process.env.VITE_API;
  const secret = process.env.META_SECRET;

  if (!type || !id) {
    return new Response("Missing parameters", { status: 400 });
  }

  // You can fetch metadata from your backend if needed
  const meta = await fetch(
    `${apiDomain}/meta/${type}/${id}?secret=${secret}`
  ).then((res) => res.json());

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/svg+xml" href="${`${myDomain}/logo.png`}" />
        <link rel="shortcut icon" href="${`${myDomain}/logo.png`}" type="image/x-icon" />

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
    <body>
      <noscript>
        <meta http-equiv="refresh" content="0;url=${myDomain}/${type}/${id}" />
      </noscript>
      <script>
        // Wait a bit so bots can parse OG tags
        setTimeout(() => {
          window.location.href = "${myDomain}/${type}/${id}";
        }, 100);
      </script>
    </body>
    </html>
    `;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html",
    },
  });
}
