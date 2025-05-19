"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";

interface TodoListProps {
  userId: string;
}

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export default function TodoList({ userId }: TodoListProps) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, `users/${userId}/todos`),
      (snapshot) => {
        const todoList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Todo[];
        setTodos(todoList);
      },
      (error) => {
        console.error("Error fetching todos:", error); // Thêm xử lý lỗi
      },
    );
    return () => unsubscribe();
  }, [userId]);
  const addTodo = async () => {
    if (newTodo.trim()) {
      await addDoc(collection(db, `users/${userId}/todos`), {
        text: newTodo,
        completed: false,
      });
      setNewTodo("");
    }
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    await updateDoc(doc(db, `users/${userId}/todos`, id), {
      completed: !completed,
    });
  };

  const deleteTodo = async (id: string) => {
    await deleteDoc(doc(db, `users/${userId}/todos`, id));
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Todo List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Input
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new task"
            onKeyPress={(e) => e.key === "Enter" && addTodo()}
          />
          <Button onClick={addTodo}>Add</Button>
        </div>
        {todos.length === 0 ? (
          <p>No tasks yet.</p>
        ) : (
          <ul className="space-y-2">
            {todos.map((todo) => (
              <li key={todo.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id, todo.completed)}
                />
                <span className={todo.completed ? "line-through" : ""}>
                  {todo.text}
                </span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteTodo(todo.id)}
                >
                  Delete
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
