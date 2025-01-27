/* Copyright 2024 Marimo. All rights reserved. */
import { generateSessionId } from "@/lib/marimo/sessions";

const URL_BASE = process.env.NEXT_PUBLIC_MARIMO_URL || 'http://localhost:2718';
console.log('URL_BASE', URL_BASE);

export function updateQueryParams(updater: (params: URLSearchParams) => void) {
  const url = new URL(URL_BASE);
  updater(url.searchParams);
  window.history.replaceState({}, "", url.toString());
}

export function hasQueryParam(key: string, value?: string): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  const urlParams = new URLSearchParams(window.location.search);

  if (value === undefined) {
    return urlParams.has(key);
  }

  return urlParams.get(key) === value;
}

export function newNotebookURL(user_id: string, notebook_id: string) {
  const sessionId = generateSessionId();
  const initializationId = `__new__${sessionId}`;
  return asURL(initializationId, user_id, notebook_id).toString();
}

const urlRegex = /(https?:\/\/\S+)/g;
export function isUrl(value: unknown): boolean {
  return typeof value === "string" && urlRegex.test(value);
}

export function asURL(path: string, user_id: string, notebook_id: string): URL {
    return new URL(`?file=${path}&user_id=${user_id}&notebook_id=${notebook_id}`, URL_BASE);
}
  