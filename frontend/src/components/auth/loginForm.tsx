"use client";

import { Button, Form, Input } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";

type LoginFields = {
  username: string;
  password: string;
};

export default function LoginForm() {
  const [form] = Form.useForm<LoginFields>();
  const router = useRouter();

  const onFinish = (values: LoginFields) => {
    console.log("Login params:", values);
    router.push("/dashboard/notes");
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} className="mt-4">
      <Form.Item
        name="username"
        label="Username"
        rules={[{ required: true, message: "Please enter your username" }]}
      >
        <Input placeholder="Enter your username" size="large" />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[{ required: true, message: "Please enter your password" }]}
      >
        <Input.Password placeholder="Enter your password" size="large" />
      </Form.Item>

      <div className="flex justify-end -mt-3 mb-5">
        <Link
          href="/auth/forgot-password"
          className="text-sm text-brand hover:text-brand-hover transition-colors"
        >
          Forgot password?
        </Link>
      </div>

      <Form.Item className="mb-3">
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          className="w-full"
          onClick={() => form.submit()}
          style={{ backgroundColor: "var(--brand)" }}
        >
          Sign In
        </Button>
      </Form.Item>

      <p className="text-center text-sm text-text-tertiary">
        Don&apos;t have an account?{" "}
        <Link
          href="/auth/register"
          className="text-brand hover:text-brand-hover transition-colors font-medium"
        >
          Create one
        </Link>
      </p>
    </Form>
  );
}
