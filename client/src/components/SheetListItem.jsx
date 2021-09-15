import React, {useState} from 'react';
import axios from 'axios';

const SheetListItem = ({ sheet, setlists }) => {

  const addToSetlist = (event) => {

    return new Promise((resolve, reject) => {
      axios
        .post('/association', { sheet: sheet.id , list: event.target.value })
        .then(() => {
          resolve();
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
      <select id="selectBox" value="Add To Set List" onChange={() => {addToSetlist(event)}}>
        <option value="">Add To Set List</option>
        {setlists.map((list) => {
          return <option key={list.id} value={list.id}> {list.name} </option>
        })}
      </select>
      <span> {sheet.title}</span>
      <span> - </span>
      <span> {sheet.artist}</span>
    </div>
  )
}

export default SheetListItem;