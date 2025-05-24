// api/preview.js

export async function GET(request) {
  const userAgent = request.headers.get("user-agent") || "";
  const url = new URL(request.url);
  const type = url.searchParams.get("type");
  const id = url.searchParams.get("id");
  const myDomain = "https://hthbeats.vercel.app";
  const apiDomain = "https://m8b5chhv-5000.inc1.devtunnels.ms";

  const isBot = /bot|crawl|slurp|spider|mediapartners/i.test(userAgent);

  if (!type || !id) {
    return new Response("Missing parameters", { status: 400 });
  }

  if (isBot) {
    // You can fetch metadata from your backend if needed
    const meta = await fetch(`${apiDomain}/${type}/${id}`).then((res) =>
      res.json()
    );

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta property="og:title" content="${meta.title}" />
        <meta property="og:description" content="${meta.subtitle}" />
        <meta property="og:image" content="${meta.image}" />
        <meta property="og:url" content="${myDomain}/${type}/${id}" />
      </head>
      <body>
       
      </body>
      </html>
    `;
    return new Response(html, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  } else {
    // Redirect real users
    return Response.redirect(`${myDomain}/${type}/${id}`, 302);
  }
}
