import React, { useState } from 'react';
import axios from 'axios';
import { FormControl, MenuItem, Select, TableCell, TableRow, Typography } from '@material-ui/core';
import { InputLabel } from '@mui/material';

const SheetListItem = ({ sheet, setlists, setSelectedSheet, setOpenedFromSetlist, setSelectedSetlist }) => {
  const { setList, setSetList } = useState('');
  const addToSetlist = (event) => {

    return new Promise((resolve, reject) => {
      axios
        .post('/association', { sheet: sheet.id, list: event.target.value })
        .then(() => {
          setSelectedSetlist(0);
          resolve();
        }
        )
        .catch((err) => {
          console.error(err);
          reject(err);
        });
    });
  };

  const handleView = () => {
    setSelectedSheet(sheet);
    //make it scroll to top when sheet is selected
  };

  return (
    <>
      <TableCell component="th" scope="row">
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <Select labelId="selectBox-label" value='' id="selectBox" label="Add To Set List" onChange={(event) => {
            addToSetlist(event);
          }}>
            {setlists.map((list) => {
              return <MenuItem key={list.id} value={list.id}> {list.name} </MenuItem>
            })}
          </Select>
        </FormControl>
      </TableCell>
      <TableCell>
        <Typography onClick={() => {
          handleView();
          setOpenedFromSetlist(false);
        }} style={{ cursor: 'pointer' }}> {sheet.artist}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography onClick={() => {
          handleView();
          setOpenedFromSetlist(false);
        }} style={{ cursor: 'pointer' }}> {sheet.title}
        </Typography>
      </TableCell>
    </>
  )
}

export default SheetListItem;