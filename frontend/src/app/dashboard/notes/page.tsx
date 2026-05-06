"use client";

import { Layout } from "antd";
import Sidebar from "@/components/dashboard/sidebar";
import KanbanBoard from "@/components/dashboard/kanbanBoard";

const { Content } = Layout;

export default function DashboardPage() {
  return (
    <Layout className="min-h-screen" style={{ background: "var(--bg-app)" }}>
      <Sidebar />
      <Layout style={{ background: "var(--bg-app)" }}>
        <Content className="p-6">
          <KanbanBoard />
        </Content>
      </Layout>
    </Layout>
  );
}
