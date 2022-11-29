import React, { useState } from "react";
import {
  ref,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import * as dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ru";
import { storage } from "../firebase-config.js";
import { db } from "../firebase-config.js";

const EditForm = ({
  id,
  titleProp,
  descriptionProp,
  dateProp,
  fileNamesProp,
  urlsProp,
  handleComplete,
}) => {
  const [title, setTitle] = useState(titleProp);
  const [desription, setDescription] = useState(descriptionProp);
  const [date, setDate] = useState(dateProp);
  const [fileNames, setFileNames] = useState(fileNamesProp);
  const [file, setFile] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const handleFileInput = (e) => {
    setFile([...file, ...e.target.files]);
    setFileNames([
      ...fileNames,
      ...[...e.target.files].map((item) => item.name),
    ]);
    e.target.value = null;
  };
  let hrefs = urlsProp;

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
    handleComplete();
    // hrefs = [];
  };
  const upload = async () => {
    await updateDoc(doc(db, "todos", id), {
      title: title,
      description: desription,
      date: date,
      fileNames: fileNames,
      //   [...fileNames, ...file.map((item) => item.name)],
      urls: hrefs,
      //   timestamp: serverTimestamp(),
      done: false,
    });
    // setTitle("");
    // setDescription("");
    // setDate("");
    // setFile([]);
    // setFileNames([]);
    // hrefs = [];
  };
  const deleteFile = async (choosenFile) => {
    // console.log(file);

    setFile(file.filter((item) => item.name !== choosenFile));

    // const desertRef = ref(storage, `files/${choosenFile}`);
    // let url = await getDownloadURL(desertRef);

    // hrefs = hrefs.filter((item) => item !== url);
    // setFileNames(fileNames.filter((item) => item !== choosenFile));
    // setFile(file.filter((item) => item.name !== choosenFile));

    // deleteObject(desertRef);
    hrefs.splice(fileNames.indexOf(choosenFile), 1);
    // setFile(file.filter((item) => item.name !== choosenFile));
    setFileNames(fileNames.filter((item) => item !== choosenFile));
    // await updateDoc(doc(db, "todos", id), {
    //   fileNames: fileNames,
    //   urls: hrefs,
    // });
  };
  return (
    <div>
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
                id="selectedFileEdit"
                multiple
                style={{ display: "none" }}
                onInput={(e) => {
                  handleFileInput(e);
                }}
              />
              <input
                type="button"
                value="Browse..."
                onClick={() =>
                  document.getElementById("selectedFileEdit").click()
                }
              />
            </div>
            <div>
              {fileNames &&
                fileNames.map((item, index) => (
                  <div key={index}>
                    <span>{item}</span>
                    <div onClick={() => deleteFile(item)}>Удалить</div>
                  </div>
                ))}
              {/* {file &&
                file.map((item, index) => (
                  <div key={index}>
                    <span>{item.name}</span>
                    <button onClick={() => deleteFile(item.name)}>
                      Удалить
                    </button>
                  </div>
                ))} */}
            </div>
          </div>
        </fieldset>
      </form>
      {/* <button onClick={() => handleComplete()}>завершить</button> */}
    </div>
  );
};

export default EditForm;
