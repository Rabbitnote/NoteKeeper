"use client";

import { Form, Input, Modal, Select } from "antd";
import type { Note, NoteStatus } from "@/types/note";

const { TextArea } = Input;

type NewNoteFields = {
  title: string;
  description: string;
  status: NoteStatus;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onAdd: (note: Omit<Note, "id" | "createdAt">) => void;
};

export default function NewNoteModal({ open, onClose, onAdd }: Props) {
  const [form] = Form.useForm<NewNoteFields>();

  const handleOk = () => {
    form.validateFields().then((values) => {
      onAdd(values);
      form.resetFields();
      onClose();
    });
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="New Note"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Add Note"
      styles={{
        container: {
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
        },
        header: { background: "var(--bg-card)" },
        body: { background: "var(--bg-card)" },
        footer: { background: "var(--bg-card)" },
        mask: { backdropFilter: "blur(2px)" },
      }}
      okButtonProps={{ style: { backgroundColor: "var(--brand)" } }}
    >
      <Form form={form} layout="vertical" className="mt-4">
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: "Please enter a title" }]}
        >
          <Input placeholder="Note title" size="large" />
        </Form.Item>

        <Form.Item name="description" label="Description">
          <TextArea
            placeholder="Write something..."
            rows={4}
            style={{ resize: "none" }}
          />
        </Form.Item>

        <Form.Item name="status" label="Status" initialValue="todo">
          <Select
            size="large"
            options={[
              { value: "todo", label: "Todo" },
              { value: "ongoing", label: "Ongoing" },
              { value: "done", label: "Done" },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
