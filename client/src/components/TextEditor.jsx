import React, { useState } from 'react';
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
    const { title, artist, body } = sheet;
    return new Promise((resolve, reject) => {
      axios
        .post('/sheets', { title, artist, body, username })
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
        <textarea required name="body" placeholder="Lyrics/Chords" onChange={handleChange} />
        <input type="submit" />
      </form>
    </div>
  )
}

export default TextEditor;