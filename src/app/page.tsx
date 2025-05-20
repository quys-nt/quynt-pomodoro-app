'use client'

import { ModeToggle } from "@/components/themes/mode-toggle.tsx";

export default function Home() {
  return (
    <div className="px-2.5 flex flex-col gap-3 items-center justify-center min-h-screen">
      <ModeToggle />
      <h1 className="text-4xl">Pomodoro App</h1>
    </div>
  );
}
