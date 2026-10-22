import { handleAiRequest } from "../../server/ai.mjs";

const json = (body, status) => Response.json(body, { status, headers: { "cache-control": "no-store" } });

export default async (request) => {
  if (request.method !== "POST") {
    return json({ error: { code: "method_not_allowed", message: "Use POST." } }, 405);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: { code: "bad_request", message: "The request body must be JSON." } }, 400);
  }

  const result = await handleAiRequest({
    authorization: request.headers.get("authorization"),
    body,
    env: process.env,
  });
  return json(result.body, result.status);
};

export const config = { path: "/api/ai" };
