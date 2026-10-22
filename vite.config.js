import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { handleAiRequest } from "./server/ai.mjs";

const MAX_BODY_BYTES = 32 * 1024;

/**
 * Serves POST /api/ai during `npm run dev`, mirroring the Netlify Function,
 * so the AI features work locally without the Netlify CLI.
 */
function enveloAiDevApi(env) {
  return {
    name: "envelo-ai-dev-api",
    configureServer(server) {
      server.middlewares.use("/api/ai", (req, res) => {
        const send = (status, body) => {
          res.statusCode = status;
          res.setHeader("content-type", "application/json");
          res.end(JSON.stringify(body));
        };

        if (req.method !== "POST") {
          send(405, { error: { code: "method_not_allowed", message: "Use POST." } });
          return;
        }

        let raw = "";
        let tooLarge = false;
        req.on("data", (chunk) => {
          raw += chunk;
          if (raw.length > MAX_BODY_BYTES) tooLarge = true;
        });
        req.on("end", async () => {
          if (tooLarge) {
            send(413, { error: { code: "too_large", message: "That request is too large." } });
            return;
          }
          let body;
          try {
            body = JSON.parse(raw);
          } catch {
            send(400, { error: { code: "bad_request", message: "The request body must be JSON." } });
            return;
          }
          const result = await handleAiRequest({ authorization: req.headers.authorization, body, env });
          send(result.status, result.body);
        });
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  // Load every variable (not only VITE_*) for server-side use. These are
  // never exposed to client code; only VITE_* variables are.
  const env = { ...loadEnv(mode, process.cwd(), ""), ...process.env };

  return {
    // https://github.com/vitejs/vite/issues/1973#issuecomment-787571499
    define: {
      "process.env": {},
    },
    server: {
      open: true,
    },
    build: {
      outDir: "build",
    },
    plugins: [react(), enveloAiDevApi(env)],
  };
});
