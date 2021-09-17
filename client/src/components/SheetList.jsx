import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SheetListItem from './SheetListItem.jsx';
import SheetView from './SheetView.jsx';

const SheetList = ({ username, page, setPage }) => {
  const [sheets, setSheets] = useState([]);
  const [setlists, setSetlists] = useState([]);
  const [setListSheets, setSetlistSheets] = useState(0);
  const [newSetlist, setNewSetlist] = useState('');
  const [selectedSetlist, setSelectedSetlist] = useState(0);
  const [selectedSheet, setSelectedSheet] = useState(0);
  const [sortBy, setSortBy] = useState('title');
  const [openedFromSetlist, setOpenedFromSetlist] = useState(false);


  const fetchAll = () => {
    fetchSetSheets();
    fetchSetlists();
    fetchSheets();
  };

  const fetchSheets = () => {
    return new Promise((resolve, reject) => {
      axios
        .get(`/sheets/${username}`)
        .then((results) => {
          setSheets(results.data.sort(function (a, b) {
            var x = a.artist;
            var y = b.artist;
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

  const postSetlist = () => {
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

  const handleSort = (sortBy) => {
    console.log('sort');
    let sorted = [...sheets];
    if (sortBy === 'title') {
      sorted = sorted.sort(function (a, b) {
        var x = a.title;
        var y = b.title;
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      });
      setSortBy('artist');
    } else if (sortBy === 'artist') {
      sorted = sorted.sort(function (a, b) {
        var x = a.artist;
        var y = b.artist;
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      });
      setSortBy('title');
    };
    setSheets(sorted);
  }

  return (
    <>
      <h3 onClick={() => { handleSort(sortBy) }} style={{ cursor: 'pointer', width: '5em' }} >Title/Artist</h3>
      <div className="list">
        <div>{sheets.map((sheet) => {
          return <SheetListItem key={sheet.id} sheet={sheet} setlists={setlists} setSelectedSheet={setSelectedSheet} setOpenedFromSetlist={setOpenedFromSetlist} />
        })}</div>
        <h2>Set Lists</h2>
        <div>{setlists.map((list) => {
          return (
            <div>
              <h3 onClick={fetchSetSheets} style={{ cursor: 'pointer', width: '5em' }} value={list.id} key={list.id}>{list.name}</h3>
              {selectedSetlist === list.id
                ? setListSheets.map((sheet) => {
                  return (
                    <div onClick={(event) => {
                      handleView(event);
                      setOpenedFromSetlist(true);
                    }} className="setSheet">
                      <span value={sheet.id}> {sheet.title} - {sheet.artist} </span>
                    </div>
                  )
                })
                : null}
            </div>
          )
        })}</div>
        <form onSubmit={postSetlist}>
          <input required value={newSetlist} onChange={(event) => { setNewSetlist(event.target.value) }} type="text" placeholder="New Set List" />
          <input type="submit" value="Create Set List" />
        </form>
      </div>
      <div className="sheetView">
        {selectedSheet ? (
          <>
            {openedFromSetlist
              ? <div>
                <button onClick={handlePrev}>Previous</button>
                <button onClick={handleNext}>Next</button>
              </div>
              : null}
            <SheetView sheet={selectedSheet} setSelectedSheet={setSelectedSheet} fetchAll={fetchAll} />
          </>
        ) : null}
      </div>
    </>
  )
}

export default SheetList;