/**
 * BUG 2 — useNotes.ts:55, 65, 71
 *
 * Three compounding problems in useNoteStream(isLive):
 *
 *   a) Guard `if (isLive) return` is inverted — stream opens on the archive
 *      tab instead of the live tab.
 *
 *   b) onmessage hard-codes `["notes", true]` — always invalidates the live
 *      cache, even when the stream is running on the archive tab.
 *
 *   c) `isLive` is missing from the useEffect dependency array — switching
 *      tabs never closes the old EventSource or opens a new one.
 *
 * Tests assert CORRECT behaviour. They should currently FAIL.
 */

import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useNoteStream } from "@/lib/hooks/useNotes";

// ─── helpers ─────────────────────────────────────────────────────────────────

type MockES = {
  onmessage: ((e: MessageEvent) => void) | null;
  onerror: (() => void) | null;
  close: ReturnType<typeof vi.fn>;
};

let lastMockES: MockES;

function buildMockEventSource() {
  // Must use a constructor function (not an arrow) so `new EventSource(...)` works
  const MockEventSource = vi.fn(function (this: MockES) {
    this.onmessage = null;
    this.onerror = null;
    this.close = vi.fn();
    lastMockES = this;
  });
  vi.stubGlobal("EventSource", MockEventSource);
  return MockEventSource;
}

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return { queryClient, wrapper };
}

beforeEach(() => {
  localStorage.setItem("token", "test-token");
  process.env.NEXT_PUBLIC_API_URL = "http://localhost:3001";
});

afterEach(() => {
  vi.unstubAllGlobals();
  localStorage.clear();
});

// ─── 2a: stream should open on live tab, not archive tab ─────────────────────

describe("Bug 2a – EventSource guard condition is inverted", () => {
  it("useNoteStream(true)  → should open EventSource on the live tab  [FAILS]", () => {
    const MockES = buildMockEventSource();
    const { wrapper } = createWrapper();

    renderHook(() => useNoteStream(true), { wrapper });

    expect(
      MockES,
      "EventSource was never constructed — stream did not open on the live tab",
    ).toHaveBeenCalledOnce();
  });

  it("useNoteStream(false) → should NOT open EventSource on the archive tab  [FAILS]", () => {
    const MockES = buildMockEventSource();
    const { wrapper } = createWrapper();

    renderHook(() => useNoteStream(false), { wrapper });

    expect(
      MockES,
      "EventSource was constructed on the archive tab — it should not be",
    ).not.toHaveBeenCalled();
  });
});

// ─── 2b: onmessage should invalidate the tab's own cache key ─────────────────

describe("Bug 2b regression – onmessage invalidates the correct cache key", () => {
  it("SSE message on live tab invalidates [notes, true]", async () => {
    buildMockEventSource();
    const { queryClient, wrapper } = createWrapper();
    const spy = vi.spyOn(queryClient, "invalidateQueries");

    renderHook(() => useNoteStream(true), { wrapper });

    await act(async () => {
      lastMockES.onmessage?.(new MessageEvent("message", { data: "note-id-1" }));
    });

    expect(spy).toHaveBeenCalledWith({ queryKey: ["notes", true] });
  });
});

// ─── 2c: switching tabs should restart the stream ────────────────────────────

describe("Bug 2c – isLive missing from useEffect dependency array", () => {
  it("switching from live→archive should close old EventSource and open a new one  [FAILS]", () => {
    const MockES = buildMockEventSource();
    const { wrapper } = createWrapper();

    // Start on live tab
    const { rerender } = renderHook(
      ({ isLive }: { isLive: boolean }) => useNoteStream(isLive),
      { wrapper, initialProps: { isLive: true } },
    );

    const firstES = lastMockES;

    // Switch to archive tab
    rerender({ isLive: false });

    // The old stream should have been closed
    expect(
      firstES.close,
      "Old EventSource was not closed when switching tabs — isLive is missing from deps",
    ).toHaveBeenCalled();
  });
});
