import React, { useState } from "react";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { storage } from "../firebase-config.js";
import { db } from "../firebase-config.js";

/**
 *
 * @describe форма составления записи. Создаем состояние file для хранения и отправки на сервер
 * загруженных файлов. Из массива file получаем имена файлов для соответсвующего поля записи. Ссылки получаем
 * во время отправки файлов на сервер при помощи функции getDownloadUrl()
 *
 *
 */

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
    <form className="todo-form" onSubmit={(e) => handleSubmit(e)}>
      <fieldset className="todo-fieldset" disabled={disabled}>
        <div className="todo-first-row-wrapper">
          <input
            className="todo-title"
            type="text"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            placeholder="Заголовок..."
            required
          />
          <input
            className="todo-date"
            type="datetime-local"
            onInput={(e) => {
              console.log(e.target.value);
              setDate(e.target.value);
            }}
            required
            value={date}
          />
          <input className="todo-submit" type="submit" value={"Добавить"} />
        </div>

        <input
          className="todo-description"
          type="text"
          onChange={(e) => setDescription(e.target.value)}
          value={desription}
          placeholder="Описание..."
          required
        />

        <div className="file-area">
          <div className="browse-wrapper">
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
              className="browse-button"
              type="button"
              value="Browse..."
              onClick={() => document.getElementById("selectedFile").click()}
            />
          </div>
          <div className="files-wrapper">
            {fileNames &&
              fileNames.map((item, index) => (
                <div key={index} className="file-wrapper">
                  <span>{item}</span>
                  <div
                    className="close"
                    onClick={(e) => {
                      deleteFile(item);
                    }}
                  >
                    {/* <span>Удалить</span> */}
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
