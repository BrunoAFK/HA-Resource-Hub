const renderBody = (status, content) => {
  const html = `
    <script>
      const receiveMessage = (message) => {
        window.opener.postMessage(
          'authorization:github:${status}:${JSON.stringify(content)}',
          message.origin
        );
        window.removeEventListener("message", receiveMessage, false);
      };
      window.addEventListener("message", receiveMessage, false);
      window.opener.postMessage("authorizing:github", "*");
    </script>
  `;
  return new Blob([html], { type: "text/html;charset=UTF-8" });
};

export const onRequestGet = async ({ request, env }) => {
  const clientId = env.GITHUB_CLIENT_ID;
  const clientSecret = env.GITHUB_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return new Response("Missing GitHub OAuth env vars", { status: 500 });
  }

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  if (!code) {
    return new Response("Missing code", { status: 400 });
  }

  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "user-agent": "cloudflare-functions-github-oauth",
      accept: "application/json"
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code
    })
  });

  const tokenJson = await tokenRes.json();
  if (!tokenRes.ok || tokenJson.error) {
    const body = renderBody("error", tokenJson);
    return new Response(body, {
      status: 401,
      headers: { "content-type": "text/html;charset=UTF-8" }
    });
  }

  const token = tokenJson.access_token;
  const body = renderBody("success", { token, provider: "github" });
  return new Response(body, {
    status: 200,
    headers: { "content-type": "text/html;charset=UTF-8" }
  });
};
