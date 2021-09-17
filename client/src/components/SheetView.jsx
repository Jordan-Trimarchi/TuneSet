import axios from 'axios';
import React, { useState } from 'react';

const SheetView = ({ sheet, setSelectedSheet, fetchAll }) => {
  const [transpose, setTranpose] = useState(0);
  const [newBodyString, setNewBodyString] = useState('');
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

  console.log(sheet);
  return (
    <div>
      <h2> '{sheet.title}' by {sheet.artist}</h2>
      <iframe src={sheet.url}></iframe>
      <form onSubmit={() => {
        event.preventDefault();
        handleTranspose(transpose);
      }}>
        <input onChange={handleChange} type='number' min="-11" max="11" />
        <input type="submit" value="Transpose by half steps" />
      </form>
      <input type="button" value="Delete Sheet" onClick={handleDelete} />
    </div>
  )
};

export default SheetView;


