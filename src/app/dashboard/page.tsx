'use client'

import PomodoroTimer from "@/components/PomodoroTimer";
import PomodoroHistory from "@/components/PomodoroHistory";
import TodoList from "@/components/TodoList";
import { auth } from "@/lib/firebase";

export default function Dashboard() {
  const user = auth.currentUser;

  if (!user) return null;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user.displayName}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PomodoroTimer userId={user.uid} />
        <div>
          <PomodoroHistory userId={user.uid} />
          <TodoList userId={user.uid} />
        </div>
      </div>
    </div>
  );
}
