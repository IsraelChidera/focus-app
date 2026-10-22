import { auth } from "../firebase";

// A little longer than the server's own deadline, so server errors arrive first.
const CLIENT_TIMEOUT_MS = 60 * 1000;

export class AiRequestError extends Error {}

async function callAi(payload) {
  const user = auth?.currentUser;
  if (!user) throw new AiRequestError("Please sign in to use Envelo AI.");

  let token;
  try {
    token = await user.getIdToken();
  } catch (error) {
    console.error("Could not get ID token:", error);
    throw new AiRequestError("Your session has expired. Please sign in again.");
  }

  let response;
  try {
    response = await fetch("/api/ai", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(CLIENT_TIMEOUT_MS),
    });
  } catch (error) {
    if (error.name === "TimeoutError") throw new AiRequestError("Envelo AI is taking too long. Please try again.");
    throw new AiRequestError("Can't reach Envelo AI. Check your connection and try again.");
  }

  const body = await response.json().catch(() => null);
  if (!response.ok || !body?.data) {
    throw new AiRequestError(body?.error?.message || "Envelo AI couldn't answer that. Please try again.");
  }
  return body.data;
}

/** Turns a plain-language description into an envelope plan. */
export const buildPlan = (description) => callAi({ task: "plan", description });

/** Asks whether a purchase fits the given budget text. */
export const checkSpend = ({ budget, question }) => callAi({ task: "spend-check", budget, question });
