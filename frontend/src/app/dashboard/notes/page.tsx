"use client";

import { Layout } from "antd";
import Sidebar from "@/components/dashboard/sidebar";
import KanbanBoard from "@/components/dashboard/kanbanBoard";
import { Suspense } from "react";

const { Content } = Layout;

export default function DashboardPage() {
  return (
    <Layout className="min-h-screen" style={{ background: "var(--bg-app)" }}>
      <Suspense fallback={null}>
        <Sidebar />
      </Suspense>
      <Layout style={{ background: "var(--bg-app)" }}>
        <Content className="p-6">
          <Suspense fallback={null}>
            <KanbanBoard />
          </Suspense>
        </Content>
      </Layout>
    </Layout>
  );
}
