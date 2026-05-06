"use client";

import { Layout, Menu, Popconfirm } from "antd";
import {
  FileTextOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { useRouter } from "next/navigation";

const { Sider } = Layout;

const menuItems: MenuProps["items"] = [];

export default function Sidebar() {
  const router = useRouter();
  return (
    <Sider
      width={240}
      style={{
        background: "var(--bg-card)",
        borderRight: "1px solid var(--border)",
        minHeight: "100vh",
      }}
    >
      <div className="flex flex-col h-full min-h-screen">
        {/* Logo */}
        <div className="flex items-center gap-2 h-[64px] px-4 border-b border-border flex-shrink-0">
          <div className="rounded-full w-3 h-3 bg-brand flex-shrink-0" />
          <h1 className="text-lg font-semibold text-text-primary">
            NoteKeeper
          </h1>
        </div>

        {/* Nav menu */}
        <Menu
          mode="inline"
          defaultSelectedKeys={["notes"]}
          items={menuItems}
          style={{
            background: "var(--bg-card)",
            borderRight: "none",
            marginTop: 8,
            flex: 1,
          }}
          theme="dark"
        />

        {/* Spacer */}
        <div className="flex-1" />

        {/* User account */}
        <div className="flex items-center gap-3 px-4 py-4 border-t border-border cursor-pointer group flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-semibold">T</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-text-primary text-sm font-medium truncate">
              Thanakorn
            </p>
            <p className="text-text-tertiary text-xs truncate">
              thanakorn@email.com
            </p>
          </div>
          <Popconfirm
            title="Sign out"
            description="Are you sure you want to sign out?"
            onConfirm={() => router.push("/auth/login")}
            okText="Sign out"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
            placement="topRight"
          >
            <LogoutOutlined className="text-text-tertiary group-hover:text-red-400 transition-colors" />
          </Popconfirm>
        </div>
      </div>
    </Sider>
  );
}
