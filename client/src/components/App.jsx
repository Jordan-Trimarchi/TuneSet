import React, { useState } from 'react';
import TextEditor from './TextEditor.jsx';
import SheetList from './SheetList.jsx';
import { Button, TextField } from '@material-ui/core';

const App = () => {
  const [page, setPage] = useState('');
  const [username, setUsername] = useState('');

  return (
    <>
      <h1>Tuneset</h1>
      <div className="mainDiv">
        {page === '' ?
          <div className="login">
            <form className="loginForm" onSubmit={(event) => {
              event.preventDefault();
              setPage('list');
            }}>
              <TextField type="text" placeholder="Username" onChange={(event) => {
                setUsername(event.target.value);
              }} />
              <Button variant="contained" type="submit">Submit</Button>
            </form>
          </div>
          : null}
        {page === 'create' ?
          <div className="create">
            <Button variant="contained" onClick={() => { setPage('list') }}>
              Back
            </Button>
            <TextEditor username={username} setPage={setPage} />
          </div>
          : null}
        {page === 'list'
          ?
          <div className="container">
            {/* <input type="text" placeholder="Change User" /> */}
            <h2> Songs </h2>
            <Button variant="contained" onClick={() => { setPage('create') }}>
              Create A Song Sheet
            </Button>
            <SheetList username={username} page={page} setPage={setPage} />
          </div>
          : null}
      </div>
    </>
  )
}

export default App;