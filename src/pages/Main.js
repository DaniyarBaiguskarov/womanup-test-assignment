import React, { useEffect, useState } from "react";
import TodoForm from "../components/TodoForm";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  deleteDoc,
  doc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase-config.js";
import TodoItemsList from "../components/TodoItemsList";

const q = query(collection(db, "todos"), orderBy("timestamp", "desc"));

const Main = () => {
  const [todos, setTodos] = useState([]);
  useEffect(() => {
    onSnapshot(q, (snapshot) => {
      setTodos(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          item: doc.data(),
        }))
      );
    });
  }, []);
  const handleDelete = (id) => {
    // setTodos(todos.filter((item) => item.id !== id));
    deleteDoc(doc(db, "todos", id));
  };
  const handleDone = async (id) => {
    updateDoc(doc(db, "todos", id), {
      done: !(await db.collection("todos").doc(id).get()).data().done,
    });
  };
  console.log(todos);
  return (
    <div>
      <TodoForm />
      <TodoItemsList
        todoItems={todos}
        handleDelete={handleDelete}
        handleDone={handleDone}
      />
    </div>
  );
};

export default Main;
