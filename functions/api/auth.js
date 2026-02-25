export const onRequestGet = async ({ request, env }) => {
  const clientId = env.GITHUB_CLIENT_ID;
  if (!clientId) {
    return new Response("Missing GitHub OAuth env vars", { status: 500 });
  }

  const url = new URL(request.url);
  const redirectUri = `${url.origin}/api/callback`;
  const scopes = env.OAUTH_SCOPES || "repo user";
  const state = crypto.getRandomValues(new Uint8Array(12)).join("");

  const githubAuthUrl = new URL("https://github.com/login/oauth/authorize");
  githubAuthUrl.searchParams.set("client_id", clientId);
  githubAuthUrl.searchParams.set("redirect_uri", redirectUri);
  githubAuthUrl.searchParams.set("scope", scopes);
  githubAuthUrl.searchParams.set("state", state);

  return Response.redirect(githubAuthUrl.toString(), 302);
};
