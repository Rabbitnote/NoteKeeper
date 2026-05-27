/**
 * BUG 1 — notes.ts:25
 *
 * getNotes(isLive) passes `!isLive` to the API query string, so the live
 * tab always fetches archive notes and the archive tab fetches live notes.
 *
 * These tests assert CORRECT behaviour. They should currently FAIL,
 * proving the bug exists.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { getNotes } from "@/lib/notes";

// ─── mock apiClient so no real HTTP is made ──────────────────────────────────
vi.mock("@/lib/apiClient", () => ({
  apiClient: vi.fn().mockResolvedValue({ notes: [] }),
}));

// Pull the mock reference AFTER the vi.mock call
import { apiClient } from "@/lib/apiClient";
const mockedApiClient = vi.mocked(apiClient);

beforeEach(() => {
  mockedApiClient.mockClear();
});

describe("Bug 1 – getNotes passes wrong is_live to the API", () => {
  it("getNotes(true) should request is_live=true  [FAILS — actual: is_live=false]", async () => {
    await getNotes(true);

    // Extract the URL string that was passed as the first argument
    const calledUrl = mockedApiClient.mock.calls[0][0] as string;

    // This assertion proves the bug: the URL contains the NEGATED value
    expect(
      calledUrl,
      `API was called with "${calledUrl}" — expected is_live=true but got is_live=false`,
    ).toBe("/notes?is_live=true");
  });

  it("getNotes(false) should request is_live=false  [FAILS — actual: is_live=true]", async () => {
    await getNotes(false);

    const calledUrl = mockedApiClient.mock.calls[0][0] as string;

    expect(
      calledUrl,
      `API was called with "${calledUrl}" — expected is_live=false but got is_live=true`,
    ).toBe("/notes?is_live=false");
  });
});
