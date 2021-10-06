import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SheetListItem from './SheetListItem.jsx';
import SheetView from './SheetView.jsx';
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@material-ui/core';

const SheetList = ({ username, page, setPage }) => {
  const [sheets, setSheets] = useState([]);
  const [setlists, setSetlists] = useState([]);
  const [setListSheets, setSetlistSheets] = useState(0);
  const [newSetlist, setNewSetlist] = useState('');
  const [selectedSetlist, setSelectedSetlist] = useState(0);
  const [selectedSheet, setSelectedSheet] = useState(0);
  const [openedFromSetlist, setOpenedFromSetlist] = useState(false);



  const fetchAll = () => {
    fetchSetlists();
    fetchSheets();
    selectedSetlist ? fetchSetSheets() : null;
  };

  const fetchSheets = () => {
    return new Promise((resolve, reject) => {
      axios
        .get(`/sheets/${username}`)
        .then((results) => {
          setSheets(results.data.sort(function (a, b) {
            var x = a.artist.toLowerCase();
            var y = b.artist.toLowerCase();
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
          })
          );
          resolve();
        })
        .catch((err) => {
          console.error(err);
          reject(err);
        });
    });
  };

  const fetchSetlists = () => {
    return new Promise((resolve, reject) => {
      axios
        .get(`/setlists/${username}`)
        .then((results) => {
          setSetlists(results.data);
          resolve();
        })
        .catch((err) => {
          console.error(err);
          reject(err);
        });
    });
  };

  const fetchSetSheets = (event) => {

    return new Promise((resolve, reject) => {
      axios
        .get(`/setSheets/${event.target.attributes[0].value}`)
        .then((results) => {
          setSetlistSheets(results.data)
          if (selectedSetlist === Number(event.target.attributes[0].value)) {
            setSelectedSetlist(0)
          } else {
            setSelectedSetlist(Number(event.target.attributes[0].value));
          }
          resolve();
        })
        .catch((err) => {
          console.error(err);
          reject(err);
        });
    });
  };

  const postSetlist = (event) => {
    event.preventDefault();
    return new Promise((resolve, reject) => {
      axios
        .post('/setlists', { name: newSetlist, username })
        .then(() => {
          setNewSetlist('');
          fetchSetlists();
          resolve();
        }
        )
        .catch((err) => {
          console.error(err);
          reject(err);
        });
    });
  };

  useEffect(() => {
    fetchSheets();
    fetchSetlists();
  }, []);

  useEffect(() => {
    fetchSheets();
  }, [page]);

  const handleView = (event) => {
    setListSheets.forEach((sheet) => {
      console.log(event.target.attributes[0])
      if (sheet.id === Number(event.target.attributes[0].value)) {
        console.log(sheet.id);
        setSelectedSheet(sheet);
      }
    });
  };

  const handleNext = () => {
    for (let i = 0; i < setListSheets.length; i++) {
      if (setListSheets[i] === selectedSheet) {
        setSelectedSheet(setListSheets[i + 1]);
      }
    };
  };

  const handlePrev = () => {
    for (let i = 0; i < setListSheets.length; i++) {
      if (setListSheets[i] === selectedSheet) {
        setSelectedSheet(setListSheets[i - 1]);
        return;
      }
    };
  };

  const handleSort = (sort) => {
    console.log('sort');
    let sorted = [...sheets];
    sorted.sort(function (a, b) {
      var x = a[sort].toLowerCase();
      var y = b[sort].toLowerCase();
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
    setSheets(sorted);
  }

  return (
    <>
      <div className="list">
        <div>
          <TableContainer component={Paper} style={{ width: selectedSheet ? '33vw' : '50vw' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Add To Setlist</TableCell>
                  <TableCell style={{ cursor: 'pointer' }} onClick={() => { handleSort('artist') }}>Artist</TableCell>
                  <TableCell style={{ cursor: 'pointer' }} onClick={() => { handleSort('title') }}>Title</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sheets.map((sheet) => (
                  <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <SheetListItem key={sheet.id} sheet={sheet} setlists={setlists} setSelectedSheet={setSelectedSheet} setSelectedSetlist={setSelectedSetlist} setOpenedFromSetlist={setOpenedFromSetlist} />
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <TableContainer component={Paper} style={{ width: selectedSheet ? '33vw' : '50vw' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Setlist</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {setlists.map((list) => {
                return (
                  <TableRow>
                    <h4 onClick={fetchSetSheets} style={{ cursor: 'pointer', width: '5em' }} value={list.id} key={list.id}>{list.name}</h4>
                    {selectedSetlist === list.id
                      ? setListSheets.map((sheet) => (
                        <TableRow onClick={(event) => {
                          handleView(event);
                          setOpenedFromSetlist(true);
                        }} className="setSheet">
                          <TableCell>
                            <div value={sheet.id}>{sheet.title} - {sheet.artist}</div>
                          </TableCell>
                        </TableRow>
                      ))
                      : null}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <form onSubmit={postSetlist}>
          <TextField required value={newSetlist} onChange={(event) => { setNewSetlist(event.target.value); }} type="text" placeholder="New Set List" />
          <Button variant="contained" type="submit">Create Set List </Button>
        </form>
      </div>
      <div className="sheetView">
        {selectedSheet ? (
          <>
            {openedFromSetlist
              ? <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button variant="contained" onClick={handlePrev}>Previous</Button>
                <Button variant="contained" onClick={handleNext}>Next</Button>
              </div>
              : null}
            <SheetView sheet={selectedSheet} setSelectedSheet={setSelectedSheet} fetchAll={fetchAll} />
            {openedFromSetlist
              ? <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button variant="contained" onClick={handlePrev}>Previous</Button>
                <Button variant="contained" onClick={handleNext}>Next</Button>
              </div>
              : null}
          </>
        ) : null}
      </div>
    </>
  )
}

export default SheetList;