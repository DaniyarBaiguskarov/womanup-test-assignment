import React, { useState, useEffect } from "react";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import * as dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ru";
import { storage } from "../firebase-config.js";
import { db } from "../firebase-config.js";

dayjs.extend(relativeTime);
dayjs.locale("ru");

const TodoForm = () => {
  const [title, setTitle] = useState("");
  const [desription, setDescription] = useState("");
  const [date, setDate] = useState();
  const [fileNames, setFileNames] = useState([]);
  const [file, setFile] = useState([]);
  const [disabled, setDisabled] = useState(false);

  const handleFileInput = (e) => {
    setFile([...file, ...e.target.files]);
    setFileNames([
      ...fileNames,
      ...[...e.target.files].map((item) => item.name),
    ]);
    e.target.value = null;
    console.log("file");
  };
  let hrefs = [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file) {
      await Promise.all(
        file.map(async (fileItem) => {
          const storageRef = ref(storage, `files/${fileItem.name}`);
          setDisabled(true);
          await uploadBytesResumable(storageRef, fileItem);

          setDisabled(false);

          let url = await getDownloadURL(storageRef);
          hrefs.push(url);
        })
      );
    }
    console.log(title, desription, date, fileNames, hrefs);
    await upload();
  };
  const upload = async () => {
    await addDoc(collection(db, "todos"), {
      title: title,
      description: desription,
      date: date,
      fileNames: fileNames,
      urls: hrefs,
      timestamp: serverTimestamp(),
      done: false,
    });
    setTitle("");
    setDescription("");
    setDate("");
    setFile([]);
    setFileNames([]);
    hrefs = [];
  };
  const deleteFile = (choosenFile) => {
    setFile(file.filter((item) => item.name !== choosenFile));
    setFileNames(fileNames.filter((item) => item !== choosenFile));
  };
  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <fieldset disabled={disabled}>
        <input
          type="text"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          placeholder="Описание..."
        />
        <input
          type="text"
          onChange={(e) => setDescription(e.target.value)}
          value={desription}
          placeholder="Заголовок..."
        />

        <input
          type="datetime-local"
          onInput={(e) => {
            console.log(e.target.value);
            setDate(e.target.value);
          }}
          value={date}
        />
        <input type="submit" />
        <div>
          <div>
            <input
              type="file"
              id="selectedFile"
              multiple
              style={{ display: "none" }}
              onInput={(e) => {
                handleFileInput(e);
              }}
            />
            <input
              type="button"
              value="Browse..."
              onClick={() => document.getElementById("selectedFile").click()}
            />
          </div>
          <div>
            {fileNames &&
              fileNames.map((item, index) => (
                <div key={index} id="fileEl">
                  <span>{item}</span>
                  <div
                    onClick={(e) => {
                      deleteFile(item);
                    }}
                  >
                    Удалить
                  </div>
                </div>
              ))}
          </div>
        </div>
      </fieldset>
    </form>
  );
};

export default TodoForm;
