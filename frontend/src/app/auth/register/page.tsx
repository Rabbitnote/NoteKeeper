import RegisterForm from "@/components/auth/registerForm";

export default function RegisterPage() {
  return (
    <main className="flex justify-center items-center w-full min-h-screen bg-bg-app py-8">
      <div className="w-md text-white bg-bg-card border border-border flex flex-col px-5 py-5 rounded-lg">
        <div className="flex gap-2 justify-center items-center mb-5">
          <div className="rounded-full w-3 h-3 bg-brand"></div>
          <h1 className="text-lg font-semibold">NoteKeeper</h1>
        </div>

        <div className="mb-5">
          <h2 className="text-text-primary font-semibold text-lg">
            Create an Account
          </h2>
          <p className="text-text-tertiary">Start organizing your notes today</p>
        </div>

        <RegisterForm />
      </div>
    </main>
  );
}
