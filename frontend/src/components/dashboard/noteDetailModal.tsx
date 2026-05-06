"use client";

import { useEffect } from "react";
import { Form, Input, Modal, Select, Button, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import type { Note, NoteStatus } from "@/types/note";

const { TextArea } = Input;

type NoteFields = {
  title: string;
  description: string;
  status: NoteStatus;
};

type Props = {
  note: Note | null;
  onClose: () => void;
  onSave: (id: string, data: NoteFields) => void;
  onDelete: (id: string) => void;
};

export default function NoteDetailModal({ note, onClose, onSave, onDelete }: Props) {
  const [form] = Form.useForm<NoteFields>();

  useEffect(() => {
    if (note) {
      form.setFieldsValue({
        title: note.title,
        description: note.description,
        status: note.status,
      });
    }
  }, [note, form]);

  const handleSave = () => {
    form.validateFields().then((values) => {
      onSave(note!.id, values);
      onClose();
    });
  };

  const handleDelete = () => {
    onDelete(note!.id);
    onClose();
  };

  return (
    <Modal
      title="Note Detail"
      open={!!note}
      onCancel={onClose}
      styles={{
        container: { background: "var(--bg-card)", border: "1px solid var(--border)" },
        header: { background: "var(--bg-card)" },
        body: { background: "var(--bg-card)" },
        footer: { background: "var(--bg-card)" },
        mask: { backdropFilter: "blur(2px)" },
      }}
      footer={
        <div className="flex justify-between items-center">
          <Popconfirm
            title="Delete this note?"
            description="This action cannot be undone."
            onConfirm={handleDelete}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Button danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
          <div className="flex gap-2">
            <Button onClick={onClose}>Cancel</Button>
            <Button
              type="primary"
              onClick={handleSave}
              style={{ backgroundColor: "var(--brand)" }}
            >
              Save
            </Button>
          </div>
        </div>
      }
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

        <Form.Item name="status" label="Status">
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
