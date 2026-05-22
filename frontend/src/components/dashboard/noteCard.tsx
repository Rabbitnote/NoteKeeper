"use client";

import { Draggable } from "@hello-pangea/dnd";
import type { Note } from "@/types/note";

type Props = {
  note: Note;
  index: number;
  onClick: (note: Note) => void;
};

export default function NoteCard({ note, index, onClick }: Props) {
  return (
    <Draggable draggableId={note.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => !snapshot.isDragging && onClick(note)}
          className="rounded-lg p-3 mb-2 border cursor-grab active:cursor-grabbing transition-shadow"
          style={{
            background: snapshot.isDragging
              ? "var(--bg-surface)"
              : "var(--bg-input)",
            borderColor: snapshot.isDragging
              ? "var(--brand-border)"
              : "var(--border)",
            boxShadow: snapshot.isDragging
              ? "0 8px 24px rgba(0,0,0,0.4)"
              : "none",
            ...provided.draggableProps.style,
          }}
        >
          <p className="text-text-primary font-medium text-sm leading-snug">
            {note.title}
          </p>
          {note.content && (
            <p className="text-text-tertiary text-xs mt-1 line-clamp-2">
              {note.content}
            </p>
          )}
          <p className="text-text-tertiary text-xs mt-2">{note.createdAt}</p>
        </div>
      )}
    </Draggable>
  );
}
