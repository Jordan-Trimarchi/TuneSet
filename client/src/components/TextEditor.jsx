import React, { useState } from 'react';
import axios from "axios";
import { Button, TextField } from '@material-ui/core';

const TextEditor = ({ username, setPage }) => {
  const [sheet, setSheet] = useState({});

  const handleChange = (event) => {
    const newSheet = { ...sheet };
    newSheet[event.target.name] = event.target.value
    setSheet(newSheet);
  };
  const postSheet = (event) => {
    event.preventDefault();
    console.log(sheet);
    const { title, artist, url, embed } = sheet;
    return new Promise((resolve, reject) => {
      axios
        .post('/sheets', { title, artist, url, embed, username })
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
        <TextField style={{ width: '30em' }} autoComplete="on" required name="title" type="text" placeholder="Title" onChange={handleChange} />
        <TextField style={{ width: '30em' }} required name="artist" type="text" placeholder="Artist" onChange={handleChange} />
        <TextField style={{ width: '30em' }} required name="url" type="url" placeholder="Edit URL" onChange={handleChange} />
        <TextField style={{ width: '30em' }} required name="embed" type="text" placeholder="Embed HTML" onChange={handleChange} />
        <Button variant="contained" type="submit">Submit</Button>
      </form>
    </div>
  )
}

export default TextEditor;