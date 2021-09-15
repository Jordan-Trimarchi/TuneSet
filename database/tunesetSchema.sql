drop database if exists tuneset;

create database tuneset;

\c tuneset;

create table sheets (
  id serial primary key,
  title text,
  artist text,
  body text,
  user_name text
);

create table lists (
  id serial primary key,
  name text,
  user_name text
);

create table sheets_lists (
  id serial primary key,
  sheet_id int,
  list_id int,
  foreign key(sheet_id) references sheets(id),
  foreign key(list_id) references lists(id)
);