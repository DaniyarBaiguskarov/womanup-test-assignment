import React, { useEffect, useState } from "react";
import TodoForm from "../components/TodoForm";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db, auth } from "../firebase-config.js";
import TodoItemsList from "../components/TodoItemsList";

const q = query(collection(db, "todos"), orderBy("timestamp", "desc"));

/**
 *
 * @describe Основная страница, которая возвращает кнопку выхода из учетной записи,
 * форму создания записи TodoForm, а также непосредственно список карточек-записей TodoItemList
 */
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
    deleteDoc(doc(db, "todos", id));
  };
  const handleDone = async (id) => {
    updateDoc(doc(db, "todos", id), {
      done: !(await db.collection("todos").doc(id).get()).data().done,
    });
  };
  const handleLogout = () => {
    auth.signOut();
  };
  return (
    <>
      <div className="logout-button-wrapper">
        <button className="logout-button" onClick={handleLogout}>
          <span>Выйти</span>
        </button>
      </div>
      <TodoForm />
      <TodoItemsList
        todoItems={todos}
        handleDelete={handleDelete}
        handleDone={handleDone}
      />
    </>
  );
};

export default Main;
