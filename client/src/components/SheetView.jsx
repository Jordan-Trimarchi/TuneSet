import axios from 'axios';
import React, { useState } from 'react';

const SheetView = ({ sheet, setSelectedSheet, fetchAll }) => {
  const [transpose, setTranpose] = useState(0);
  const [newBodyString, setNewBodyString] = useState('');
  const [editView, setEditView] = useState('edit');
  const [viewHeight, setViewHeight] = useState(sheet.height || 45);
  const handleTranspose = (amount) => {
    const transposeAmount = Number(amount);
    const notes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
    let snippets = sheet.body.split('*');
    let chordSnippets = '';
    let chordSnippetsOrig;

    snippets.forEach((snippet) => {
      if (snippet[0] === "{") {
        chordSnippets = snippet;
      }
    });

    chordSnippets = chordSnippets.split(',');
    chordSnippetsOrig = [...chordSnippets];
    for (let i = 0; i < chordSnippets.length; i++) {
      if (chordSnippets[i][0] === '{' || chordSnippets[i][0] === ' ') {
        chordSnippets[i] = chordSnippets[i].slice(1);
      }

      if (chordSnippets[i][chordSnippets[i].length - 1] === '}') {
        chordSnippets[i] = chordSnippets[i].slice(0, chordSnippets[i].length - 1);
      }
    }

    for (let i = 0; i < chordSnippets.length; i++) {
      if (chordSnippets[i][1] === '#') {
        chordSnippets[i] = chordSnippets[i].slice(0, 2);
      } else {
        chordSnippets[i] = chordSnippets[i].slice(0, 1);
      }
    }
    for (let i = 0; i < chordSnippetsOrig.length; i++) {
      if (chordSnippetsOrig[i][2] === '#') {
        chordSnippetsOrig[i] = chordSnippetsOrig[i].replace(chordSnippetsOrig[i][1] + chordSnippetsOrig[i][2], '*');
      } else {
        chordSnippetsOrig[i] = chordSnippetsOrig[i].replace(chordSnippetsOrig[i][1], '*');
      }
    }
    for (let i = 0; i < chordSnippets.length; i++) {
      let replacementindex = notes.indexOf(chordSnippets[i]) + transposeAmount;

      if (replacementindex > 11) {
        replacementindex = replacementindex - 12;
      }
      if (replacementindex < 0) {
        replacementindex = 12 + replacementindex;
      }
      chordSnippets[i] = notes[replacementindex];
    }
    for (let i = 0; i < chordSnippets.length; i++) {
      chordSnippetsOrig[i] = chordSnippetsOrig[i].replace('*', chordSnippets[i]);
    }
    for (let i = 0; i < snippets.length; i++) {
      if (snippets[i][0] === "{") {
        snippets[i] = chordSnippetsOrig.join(',');
      }
    };
    const newBody = snippets.join('*');

    setNewBodyString(newBody);
  };

  const handleChange = (event) => {
    event.preventDefault();
    setTranpose(event.target.value);
  };

  const handleDelete = (event) => {
    event.preventDefault();
    axios.delete(`/sheets/${sheet.id}`)
      .then(() => {
        console.log('done');
        setSelectedSheet(0);
        fetchAll();
      })
      .catch((err) => {
        console.error(err);
        reject(err);
      });
  };

  const handleEditView = () => {
    editView === 'edit' ? setEditView('view') : setEditView('edit');
  };

  const handleViewHeight = (event) => {
    setViewHeight(event.target.value);
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'auto'
      /* you can also use 'auto' behaviour 
      in place of 'smooth' */
    });
  }

  const handleHeightSubmit = () => {
    axios.put(`/sheets/${sheet.id}/${viewHeight}`)
  };

  return (
    <div>
      <h2> '{sheet.title}' by {sheet.artist}</h2>
      <input type="button" value={editView} onClick={handleEditView} />
      {editView === 'view'
        ? <iframe src={sheet.url}></iframe>
        : <iframe src={sheet.embed} style={{ height: `${viewHeight}em` }} ></iframe>
      }
      <form onSubmit={() => {
        event.preventDefault();
        handleTranspose(transpose);
      }}>
        <input onChange={handleChange} type='number' min="-11" max="11" />
        <input type="submit" value="Transpose by half steps" />
      </form>
      {editView === 'edit'
        ? <div>
          <input type="range" min={45} max={150} value={viewHeight} onChange={handleViewHeight} />
          <input type="button" value="Set Document Height" onClick={handleHeightSubmit} />
        </div>
        : null}
      <div>
        <input type="button" value="Delete Sheet" onClick={handleDelete} />
      </div>
    </div>
  )
};

export default SheetView;


