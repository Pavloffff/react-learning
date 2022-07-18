CREATE DATABASE project5_2;

create TABLE posts(
    id SERIAL PRIMARY KEY,
    title TEXT,
    tag TEXT,
    body TEXT,
    name TEXT,
    password TEXT,
    likeArray TEXT[],
    likeCounter INTEGER
);