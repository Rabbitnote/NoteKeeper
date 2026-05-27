import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createNote,
  deleteNote,
  getNotes,
  updateNote,
  UpdateNotePayload,
} from "@/lib/notes";
import { useEffect } from "react";

export function useNotes(isLive: boolean) {
  return useQuery({
    queryKey: ["notes", isLive],
    queryFn: () => getNotes(isLive),
  });
}

export function useCreateNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", true] });
      queryClient.invalidateQueries({ queryKey: ["notes", false] });
    },
  });
}

export function useUpdateNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateNotePayload }) =>
      updateNote(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", true] });
      queryClient.invalidateQueries({ queryKey: ["notes", false] });
    },
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", true] });
      queryClient.invalidateQueries({ queryKey: ["notes", false] });
    },
  });
}
export function useNoteStream(isLive: boolean) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isLive) return;
    const token = localStorage.getItem("token");
    const es = new EventSource(
      `${process.env.NEXT_PUBLIC_API_URL}/notes/stream?token=${token}`,
    );

    es.onmessage = (e) => {
      // server sent a note ID that was updated
      console.log("SSE update:", e.data);
      // refetch notes list
      queryClient.invalidateQueries({ queryKey: ["notes", true] });
    };

    es.onerror = () => es.close();

    return () => es.close();
  }, [queryClient]);
}
