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
import { useSearchParams } from "next/navigation";

import {
  useCreateNote,
  useDeleteNote,
  useNotes,
  useNoteStream,
  useUpdateNote,
} from "@/lib/hooks/useNotes";

const COLUMN_ACCENT: Record<NoteStatus, string> = {
  todo: "var(--text-secondary)",
  ongoing: "var(--brand)",
  done: "var(--live)",
};

export default function KanbanBoard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const searchParams = useSearchParams();
  const isLive = searchParams.get("tab") === "live";
  const { data: notes = [] } = useNotes(isLive);
  const { mutate: addNote } = useCreateNote();
  const { mutate: editNote } = useUpdateNote();
  const { mutate: removeNote } = useDeleteNote();
  useNoteStream(isLive);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;
    const note = notes.find((n) => n.id === draggableId);
    if (!note) return;
    editNote({
      id: draggableId,
      payload: {
        title: note.title,
        content: note.content,
        status: destination.droppableId as NoteStatus,
      },
    });
  };

  const handleSaveNote = (
    id: string,
    data: { title: string; content: string; status: NoteStatus },
  ) => {
    editNote({ id, payload: data });
  };

  const handleDeleteNote = (id: string) => {
    removeNote(id);
  };

  const handleAddNote = (data: {
    title: string;
    content: string;
    status: NoteStatus;
  }) => {
    addNote({
      title: data.title,
      content: data.content,
      status: data.status,
      is_live: isLive,
    });
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
