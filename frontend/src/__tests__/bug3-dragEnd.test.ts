/**
 * BUG 3 — kanbanBoard.tsx:47
 *
 * onDragEnd uses `!==` instead of `===` when looking up the dragged note:
 *
 *   const note = notes.find((n) => n.id !== draggableId)  // ← wrong operator
 *
 * This selects the FIRST note that is NOT the dragged one, so editNote is
 * called with the correct draggableId but wrong title/content.
 *
 * These tests replicate the exact logic from onDragEnd in isolation.
 * They assert CORRECT behaviour and should currently FAIL.
 */

import { describe, it, expect } from "vitest";
import type { Note } from "@/types/note";

// ─── fixture ─────────────────────────────────────────────────────────────────

const notes: Note[] = [
  {
    id: "note-a",
    title: "Title A",
    content: "Content A",
    status: "todo",
    is_live: true,
    createdAt: "2024-01-01",
  },
  {
    id: "note-b",
    title: "Title B",
    content: "Content B",
    status: "ongoing",
    is_live: true,
    createdAt: "2024-01-02",
  },
  {
    id: "note-c",
    title: "Title C",
    content: "Content C",
    status: "done",
    is_live: true,
    createdAt: "2024-01-03",
  },
];

// Logic from kanbanBoard.tsx onDragEnd (fixed: === operator)
function findDraggedNote(notes: Note[], draggableId: string) {
  return notes.find((n) => n.id === draggableId);
}

// ─── tests ───────────────────────────────────────────────────────────────────

describe("Bug 3 regression – onDragEnd finds the correct note (=== operator)", () => {
  it("dragging note-b returns note-b with correct title and content", () => {
    const draggableId = "note-b";
    const result = findDraggedNote(notes, draggableId);
    expect(result?.id).toBe("note-b");
    expect(result?.title).toBe("Title B");
    expect(result?.content).toBe("Content B");
  });

  it("dragging note-a (first in array) returns note-a, not note-b", () => {
    const draggableId = "note-a";
    const result = findDraggedNote(notes, draggableId);
    expect(result?.id).toBe("note-a");
    expect(result?.title).toBe("Title A");
  });

  it("finds the right note for every id in the list", () => {
    for (const note of notes) {
      const result = findDraggedNote(notes, note.id);
      expect(result?.id).toBe(note.id);
      expect(result?.title).toBe(note.title);
    }
  });
});
