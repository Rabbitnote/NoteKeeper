export type NoteStatus = "todo" | "ongoing" | "done";

export type Note = {
  id: string;
  title: string;
  description: string;
  status: NoteStatus;
  createdAt: string;
};

export type KanbanColumn = {
  id: NoteStatus;
  label: string;
};

export const KANBAN_COLUMNS: KanbanColumn[] = [
  { id: "todo", label: "Todo" },
  { id: "ongoing", label: "Ongoing" },
  { id: "done", label: "Done" },
];
