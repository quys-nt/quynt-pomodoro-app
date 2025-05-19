'use client'
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

interface PomodoroTimerProps {
  userId: string;
}

export default function PomodoroTimer({ userId }: PomodoroTimerProps) {
  const [time, setTime] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isWork, setIsWork] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prev) => prev - 1);
      }, 1000);
    } else if (time === 0) {
      setIsActive(false);
      if (isWork) {
        addDoc(collection(db, `users/${userId}/pomodoros`), {
          startTime: serverTimestamp(),
          duration: 25 * 60,
          type: "work",
        });
        setTime(5 * 60);
        setIsWork(false);
      } else {
        setTime(25 * 60);
        setIsWork(true);
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, time, isWork, userId]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTime(25 * 60);
    setIsWork(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pomodoro Timer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold mb-4">{formatTime(time)}</div>
        <div className="flex gap-2">
          <Button onClick={toggleTimer}>{isActive ? "Pause" : "Start"}</Button>
          <Button variant="outline" onClick={resetTimer}>
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
