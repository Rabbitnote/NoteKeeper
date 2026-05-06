import LoginForm from "@/components/auth/loginForm";

export default function LoginPage() {
  return (
    <main className="flex justify-center items-center w-full h-screen bg-bg-app">
      <div className="w-md h-[500px] text-white bg-bg-card border border-border flex flex-col px-5 py-5 rounded-lg">
        <div className="flex gap-2 justify-center items-center mb-5">
          <div className="rounded-full w-3 h-3 bg-brand"></div>
          <h1 className="text-lg font-semibold">NoteKeeper</h1>
        </div>

        <div className="mb-5">
          <h2 className="text-text-primary font-semibold text-lg">
            Welcome Back
          </h2>
          <h2 className="text-text-tertiary">Sign into your account</h2>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
