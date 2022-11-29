import React, { useState } from "react";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { storage } from "../firebase-config.js";
import * as dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/ru";
import EditForm from "./EditForm.js";

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.locale("ru");

const TodoItem = ({ id, todoItem, setItem, handleDelete, handleDone }) => {
  const [isEditing, setIsEditing] = useState(false);
  const handleComplete = () => {
    setIsEditing(false);
  };
  return !isEditing ? (
    <div>
      <input
        type="checkbox"
        checked={todoItem.done}
        onChange={() => handleDone(id)}
      ></input>
      <div>{todoItem.title}</div>
      <div>
        <div>{todoItem.description}</div>
        <div>
          {dayjs(todoItem.date).valueOf() - dayjs().valueOf() < 0
            ? "Срок истек " + dayjs(todoItem.date).fromNow()
            : dayjs(todoItem.date).format("LLL")}
        </div>
      </div>
      {todoItem.fileNames && (
        <div>
          {todoItem.fileNames.map((item, index) => {
            return (
              <a
                target="_blank"
                href={todoItem.urls[index]}
                download
                key={index}
              >
                {item}
              </a>
            );
          })}
        </div>
      )}
      <button onClick={() => handleDelete(id)}>удалить</button>
      <button onClick={() => setIsEditing(true)}>редактировать</button>
    </div>
  ) : (
    <EditForm
      id={id}
      titleProp={todoItem.title}
      descriptionProp={todoItem.description}
      dateProp={todoItem.date}
      fileNamesProp={todoItem.fileNames}
      urlsProp={todoItem.urls}
      handleComplete={handleComplete}
    />
  );
};

export default TodoItem;
