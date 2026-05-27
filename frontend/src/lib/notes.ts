import { Note, NoteStatus } from "@/types/note";
import { apiClient } from "./apiClient";

type NoteApiResponse = {
  id: string;
  title: string;
  content: string;
  status: NoteStatus;
  created_at: string;
  is_live: boolean;
};
export type CreateNotePayload = {
  title: string;
  content: string;
  status: NoteStatus;
  is_live: boolean;
};
export type UpdateNotePayload = {
  title?: string;
  content?: string;
  status?: NoteStatus;
};
export async function getNotes(isLive: boolean): Promise<Note[]> {
  const data = await apiClient<{ notes: NoteApiResponse[] }>(
    `/notes?is_live=${!isLive}`,
  );
  return data.notes.map((n: NoteApiResponse) => ({
    id: n.id,
    title: n.title,
    content: n.content,
    status: n.status,
    createdAt: n.created_at,
    is_live: n.is_live,
  }));
}

export async function createNote(payload: CreateNotePayload): Promise<Note> {
  const data = await apiClient<{
    note: NoteApiResponse;
  }>("/notes", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return {
    id: data.note.id,
    title: data.note.title,
    content: data.note.content,
    status: data.note.status,
    createdAt: data.note.created_at,
    is_live: data.note.is_live,
  };
}

export async function updateNote(
  id: string,
  payload: UpdateNotePayload,
): Promise<Note> {
  const data = await apiClient<{
    note: NoteApiResponse;
  }>(`/notes/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return {
    id: data.note.id,
    title: data.note.title,
    content: data.note.content,
    status: data.note.status,
    createdAt: data.note.created_at,
    is_live: data.note.is_live,
  };
}

export async function deleteNote(id: string): Promise<Note> {
  return apiClient<Note>(`/notes/${id}`, {
    method: "DELETE",
  });
}
