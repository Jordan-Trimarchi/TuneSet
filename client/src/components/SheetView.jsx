import axios from 'axios';
import React, { useState, useEffect } from 'react';
import ButtonGroup from '@material-ui/core/Button';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';


const SheetView = ({ sheet, setSelectedSheet, fetchAll }) => {
  const [transpose, setTranpose] = useState(0);
  const [editView, setEditView] = useState('edit');
  const [viewHeight, setViewHeight] = useState(sheet.height || 45);
  const [scrollMins, setScrollMins] = useState(sheet.scroll || 0);
  const [chordString, setChordString] = useState('');
  const [newChordString, setNewChordString] = useState('');
  let scrolling = false;

  useEffect(() => {
    setViewHeight(sheet.height);
    setScrollMins(sheet.scroll);
    fetchAll();
  }, [sheet]);

  const handleTranspose = (amount) => {
    const transposeAmount = Number(amount);
    const notes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
    let chordSnippets = chordString.split(' ');
    // chordSnippets = chordSnippets.filter(item => item);
    for (let i = 0; i < chordSnippets.length; i++) {
      if (chordSnippets[i]) {
        let note = chordSnippets[i][1] === '#' ? chordSnippets[i].slice(0, 2) : chordSnippets[i].slice(0, 1);

        let replacementindex = notes.indexOf(note) + transposeAmount;

        if (replacementindex > 11) {
          replacementindex = replacementindex - 12;
        }
        if (replacementindex < 0) {
          replacementindex = 12 + replacementindex;
        }
        note.length === 1
          ? chordSnippets[i] = chordSnippets[i].replace(chordSnippets[i].slice(0, 1), notes[replacementindex])
          : chordSnippets[i] = chordSnippets[i].replace(chordSnippets[i].slice(0, 2), notes[replacementindex]);
      }
    }

    setChordString(chordSnippets.join(' '))
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

  const handleScroll = () => {
    console.log(sheet.scroll);
    scrolling = true;
    axios.put(`/scroll/${sheet.id}/${scrollMins}`);
    const body = document.body
    const html = document.documentElement;
    const clientHeight = document.documentElement.clientHeight;
    const height = Math.max(body.scrollHeight, body.offsetHeight,
      html.clientHeight, html.scrollHeight, html.offsetHeight);
    const maxScroll = height - clientHeight;
    let thousandth = 1;

    const scroll = () => {
      let timer = setInterval(() => {
        if (thousandth < 1001 && scrolling === true) {
          window.scrollTo({
            top: maxScroll * thousandth * .001,
            behavior: 'smooth'
          });
          thousandth++;
        } else {
          clearInterval(timer);
          return;
        }
      }, Number(scrollMins) * 60);
    };
    scroll();
  };

  const handleHeightSubmit = () => {
    axios.put(`/sheets/${sheet.id}/${viewHeight}`);
  };

  return (
    <div style={{ width: '63vw' }}>
      <h2> '{sheet.title}' by {sheet.artist}</h2>
      <Button variant="contained" onClick={handleEditView}>
        {editView === 'edit' ? 'Enter Edit Mode' : 'Enter View Mode'}
      </Button>
      {/* <input type="button" value={editView === 'edit' ? 'Click for Edit Mode' : 'Click for View Mode'} onClick={handleEditView} /> */}
      <div style={{ display: 'flex', justifyContent: "space-between" }}>
        <TextField type="number" placeholder="Mins" value={Number(scrollMins)} inputProps={{ min: "0", max: "10", step: ".25" }} onChange={(event) => { setScrollMins(event.target.value) }} style={{ width: '3.75em' }} />
        <ButtonGroup variant="contained" size="small" >
          <Button style={{ borderRight: 'solid' }} onClick={() => { handleScroll() }}>
            {`Scroll to bottom over ${Number(scrollMins)} minutes.`}
          </Button>
          <Button onClick={() => { scrolling = false; }}>
            <div>	&#11035;</div>
          </Button>
        </ButtonGroup>
      </div>
      <div>
        <form style={{ display: 'flex', justifyContent: "space-between" }} onSubmit={(event) => {
          event.preventDefault();
          handleTranspose(transpose);
        }}>
          <TextField type="textarea" value={chordString} onChange={(event) => { setChordString(event.target.value) }} placeholder="Enter chords separated by commas" style={{ width: '20em' }} />
          <TextField onChange={handleChange} style={{ width: '2.25em' }} type='number' inputProps={{ min: "-11", max: "11" }} />
          <Button style={{ width: '21em' }} variant="contained" type="submit">
            {`Transpose${transpose < 0 ? ' down' : transpose > 0 ? ' up' : ''} by ${Math.abs(transpose)} half step${Math.abs(transpose) !== 1 ? 's' : ''}`}
          </Button>
        </form>
      </div>
      {editView === 'view'
        ? <iframe src={sheet.url} style={{ width: '63vw' }}></iframe>
        : <iframe src={sheet.embed} style={{ height: `${viewHeight}em`, width: '63vw' }} ></iframe>
      }
      {editView === 'edit'
        ? <div style={{ display: 'flex', justifyContent: "space-between" }}>
          <input type="range" min={45} max={150} value={viewHeight} onChange={handleViewHeight} />
          <Button variant="contained" onClick={handleHeightSubmit}> Set Document Height </Button>
        </div>
        : null}
      <div style={{ display: 'flex', justifyContent: "center" }}>
        <Button variant="contained" onClick={handleDelete}>Delete Sheet</Button>
      </div>
    </div>
  )
};

export default SheetView;


