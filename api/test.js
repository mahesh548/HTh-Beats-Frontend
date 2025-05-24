export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  /*  const { pathname } = new URL(req.url);
    // pathname format: /api/[type]/[id]
    const parts = pathname.split("/");
  
    const type = parts[2] || "no-type";
    const id = parts[3] || "no-id"; */

  const responseText = `Type: , ID: `;

  return new Response(responseText, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
