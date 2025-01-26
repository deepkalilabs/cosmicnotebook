/* Copyright 2024 Marimo. All rights reserved. */
import { init } from "@paralleldrive/cuid2";
import { Logger } from "@/lib/marimo/logger";
import { KnownQueryParams } from "@/lib/marimo/constants";

export type SessionId = TypedString<"SessionId">;

/**
 * A typed number.
 * This is a compile-time type only and does not exist at runtime.
 * It is used to distinguish between different types of numbers.
 */
export type TypedNumber<T> = number & { __type__: T };

/**
 * A typed string.
 * This is a compile-time type only and does not exist at runtime.
 * It is used to distinguish between different types of strings.
 */
export type TypedString<T> = string & { __type__: T };

export type Identified<T> = { id: string } & T;

export function updateQueryParams(updater: (params: URLSearchParams) => void) {
    const url = new URL(window.location.href);
    updater(url.searchParams);
    window.history.replaceState({}, "", url.toString());
}  

const createId = init({ length: 6 });

export function generateSessionId(): SessionId {
  return `s_${createId()}` as SessionId;
}

export function isSessionId(value: string | null): value is SessionId {
  if (!value) {
    return false;
  }
  return /^s_[\da-z]{6}$/.test(value);
}

const sessionId = (() => {
  const url = new URL(window.location.href);
  const id = url.searchParams.get(
    KnownQueryParams.sessionId,
  ) as SessionId | null;
  if (isSessionId(id)) {
    // Remove the session_id from the URL
    updateQueryParams((params) => {
      // Keep the session_id if we are in kiosk mode
      // this is so we can resume the same session if the user refreshes the page
      if (params.has(KnownQueryParams.kiosk)) {
        return;
      }
      params.delete(KnownQueryParams.sessionId);
    });
    Logger.debug("Connecting to existing session", { sessionId: id });
    return id;
  }
  Logger.debug("Starting a new session", { sessionId: id });
  return generateSessionId();
})();

/**
 * Resume an existing session or start a new one
 */
export function getSessionId(): SessionId {
  return sessionId;
}
