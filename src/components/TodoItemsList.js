import React from "react";
import TodoItem from "./TodoItem";

const TodoItemsList = ({ todoItems, handleDelete, handleDone }) => {
  return (
    <div>
      {todoItems &&
        todoItems.map((item) => (
          <TodoItem
            key={item.id}
            id={item.id}
            todoItem={item.item}
            handleDelete={handleDelete}
            handleDone={handleDone}
          />
        ))}
    </div>
  );
};

export default TodoItemsList;
