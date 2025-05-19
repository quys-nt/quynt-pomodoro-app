"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

interface PomodoroHistoryProps {
  userId: string;
}

interface Pomodoro {
  id: string;
  startTime: { seconds: number };
  duration: number;
  type: string;
}

export default function PomodoroHistory({ userId }: PomodoroHistoryProps) {
  const [history, setHistory] = useState<Pomodoro[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, `users/${userId}/pomodoros`),
      orderBy("startTime", "desc"),
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const pomodoros = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Pomodoro[];
      setHistory(pomodoros);
    });
    return () => unsubscribe();
  }, [userId]);

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Pomodoro History</CardTitle>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <p>No Pomodoro sessions yet.</p>
        ) : (
          <ul className="space-y-2">
            {history.map((pomodoro) => (
              <li key={pomodoro.id}>
                {new Date(pomodoro.startTime.seconds * 1000).toLocaleString()} -{" "}
                {pomodoro.duration / 60} minutes ({pomodoro.type})
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
