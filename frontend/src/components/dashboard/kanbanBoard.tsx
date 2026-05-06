"use client";

import { useState } from "react";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { Note, NoteStatus } from "@/types/note";
import { KANBAN_COLUMNS } from "@/types/note";
import NoteCard from "./noteCard";
import NewNoteModal from "./newNoteModal";
import NoteDetailModal from "./noteDetailModal";

const COLUMN_ACCENT: Record<NoteStatus, string> = {
  todo: "var(--text-secondary)",
  ongoing: "var(--brand)",
  done: "var(--live)",
};

const INITIAL_NOTES: Note[] = [];

export default function KanbanBoard() {
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    setNotes((prev) => {
      const dragged = prev.find((n) => n.id === draggableId)!;
      const rest = prev.filter((n) => n.id !== draggableId);

      const updated = {
        ...dragged,
        status: destination.droppableId as NoteStatus,
      };

      // Build ordered list per destination column, insert at correct index
      const destColNotes = rest
        .filter((n) => n.status === destination.droppableId)
        .toSpliced(destination.index, 0, updated);

      const otherNotes = rest.filter(
        (n) => n.status !== destination.droppableId,
      );

      return [...otherNotes, ...destColNotes];
    });
  };

  const handleSaveNote = (
    id: string,
    data: { title: string; description: string; status: NoteStatus },
  ) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, ...data } : n)));
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const handleAddNote = (data: Omit<Note, "id" | "createdAt">) => {
    const newNote: Note = {
      ...data,
      id: Date.now().toString(),
      createdAt: "Just now",
    };
    setNotes((prev) => [...prev, newNote]);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-text-primary text-xl font-semibold">All Notes</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalOpen(true)}
          style={{ backgroundColor: "var(--brand)" }}
        >
          New Note
        </Button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 flex-1 overflow-x-auto pb-4">
          {KANBAN_COLUMNS.map((col) => {
            const colNotes = notes.filter((n) => n.status === col.id);
            return (
              <div
                key={col.id}
                className="flex flex-col rounded-xl p-3 min-w-[280px] flex-1"
                style={{ background: "var(--bg-surface)" }}
              >
                {/* Column header */}
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ background: COLUMN_ACCENT[col.id] }}
                    />
                    <span className="text-text-primary font-medium text-sm">
                      {col.label}
                    </span>
                  </div>
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{
                      background: "var(--bg-input)",
                      color: "var(--text-tertiary)",
                    }}
                  >
                    {colNotes.length}
                  </span>
                </div>

                {/* Droppable area */}
                <Droppable droppableId={col.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="flex-1 min-h-[200px] rounded-lg p-1 transition-colors"
                      style={{
                        background: snapshot.isDraggingOver
                          ? "var(--brand-tint)"
                          : "transparent",
                      }}
                    >
                      {colNotes.map((note, index) => (
                        <NoteCard
                          key={note.id}
                          note={note}
                          index={index}
                          onClick={setSelectedNote}
                        />
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      <NewNoteModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAddNote}
      />

      <NoteDetailModal
        note={selectedNote}
        onClose={() => setSelectedNote(null)}
        onSave={handleSaveNote}
        onDelete={handleDeleteNote}
      />
    </div>
  );
}
