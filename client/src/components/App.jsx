import React, { useState } from 'react';
import TextEditor from './TextEditor.jsx';
import SheetList from './SheetList.jsx';

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
              event.preventDefault()
              setPage('list')
            }}>
              <input type="text" placeholder="Username" onChange={() => {
                setUsername(event.target.value);
              }} />
              <input type="submit" />
            </form>
          </div>
          : null}
        {page === 'create' ?
          <div className="create">
            <button onClick={() => { setPage('list') }}>
              Back
            </button>
            <TextEditor username={username} setPage={setPage} />
          </div>
          : null}
        {page === 'list'
          ?
          <div className="container">
            {/* <input type="text" placeholder="Change User" /> */}
            <h2> Songs </h2>
            <button onClick={() => { setPage('create') }}>
              Create A Song Sheet
            </button>
            <h3>Title/Artist</h3>
            <SheetList username={username} page={page} setPage={setPage} />
          </div>
          : null}
      </div>
    </>
  )
}

export default App;