import React, { useState } from 'react';
import { Editor, EditorState } from 'draft-js';
import "draft-js/dist/Draft.css"
import axios from "axios";

const TextEditor = ({ username, setPage }) => {
  const [sheet, setSheet] = useState({});

  const handleChange = (event) => {
    const newSheet = { ...sheet };
    newSheet[event.target.name] = event.target.value
    setSheet(newSheet);
  };
  const postSheet = (event) => {
    event.preventDefault();
    const { title, artist, url } = sheet;
    return new Promise((resolve, reject) => {
      axios
        .post('/sheets', { title, artist, url, username })
        .then(() => {
          resolve();
          setSheet({});
          setPage('list');
        }
        )
        .catch((err) => {
          console.error(err);
          reject(err);
        });
    });
  };


  return (
    <div>
      <form className="songForm" onSubmit={postSheet}>
        <input required name="title" type="text" placeholder="Title" onChange={handleChange} />
        <input required name="artist" type="text" placeholder="Artist" onChange={handleChange} />
        <input required name="url" type="url" placeholder="Sheet URL" onChange={handleChange} />
        <input type="submit" />
      </form>
    </div>
  )
}

export default TextEditor;