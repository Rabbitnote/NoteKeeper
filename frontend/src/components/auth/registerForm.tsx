"use client";

import { Button, Form, Input } from "antd";
import Link from "next/link";

type RegisterFields = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterForm() {
  const [form] = Form.useForm<RegisterFields>();

  const onFinish = (values: RegisterFields) => {
    console.log("Register params:", values);
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} className="mt-4">
      <Form.Item
        name="username"
        label="Username"
        rules={[{ required: true, message: "Please enter a username" }]}
      >
        <Input placeholder="Choose a username" size="large" />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: "Please enter your email" },
          { type: "email", message: "Please enter a valid email" },
        ]}
      >
        <Input placeholder="Enter your email" size="large" />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[
          { required: true, message: "Please enter a password" },
          { min: 8, message: "Password must be at least 8 characters" },
        ]}
      >
        <Input.Password placeholder="Create a password" size="large" />
      </Form.Item>

      <Form.Item
        name="confirmPassword"
        label="Confirm Password"
        dependencies={["password"]}
        rules={[
          { required: true, message: "Please confirm your password" },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("Passwords do not match"));
            },
          }),
        ]}
      >
        <Input.Password placeholder="Re-enter your password" size="large" />
      </Form.Item>

      <Form.Item className="mb-3">
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          className="w-full"
          style={{ backgroundColor: "var(--brand)" }}
        >
          Create Account
        </Button>
      </Form.Item>

      <p className="text-center text-sm text-text-tertiary">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="text-brand hover:text-brand-hover transition-colors font-medium"
        >
          Sign in
        </Link>
      </p>
    </Form>
  );
}
