"use client";

import { loginUser } from "@/lib/auth";
import { useMutation } from "@tanstack/react-query";
import { App, Button, Form, Input } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";

type LoginFields = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const [form] = Form.useForm<LoginFields>();
  const router = useRouter();
  const { message } = App.useApp();
  const { mutate, isPending } = useMutation({
    mutationFn: (values: LoginFields) =>
      loginUser({
        email: values.email,
        password: values.password,
      }),
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      document.cookie = `token=${data.token}; path=/; max-age=86400`;
      message.success("Logged in!");
      router.push("/dashboard/notes");
    },
    onError: (err: Error) => {
      message.error(err.message ?? "Registration failed");
    },
  });
  const onFinish = (values: LoginFields) => {
    mutate(values);
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} className="mt-4">
      <Form.Item
        name="email"
        label="Email"
        rules={[{ required: true, message: "Please enter your email" }]}
      >
        <Input placeholder="Enter your email" size="large" />
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
          loading={isPending}
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
