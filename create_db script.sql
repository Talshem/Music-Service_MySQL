<<---- Not Updated ---->>

CREATE DATABASE mydv;

CREATE TABLE artists (
upload_at DATE,
cover_img VARCHAR(1255),
name VARCHAR(255),
PRIMARY KEY (name)
);

CREATE TABLE albums (
upload_at DATE,
created_at DATE,
cover_img VARCHAR(1255),
name VARCHAR(255),
artist VARCHAR(255),
PRIMARY KEY (name),
FOREIGN KEY (artist) REFERENCES artists(name)
);

CREATE TABLE songs (
upload_at DATE,
created_at DATE,
album VARCHAR (255),
title VARCHAR(255),
artist VARCHAR(255),
youtube_id VARCHAR (255),
track_number INT,
length VARCHAR(10),
play_count INT DEFAULT 0,
lyrics MEDIUMTEXT,
PRIMARY KEY (youtube_id),
FOREIGN KEY (artist) REFERENCES artists(name),
FOREIGN KEY (album) REFERENCES albums(name)
);

CREATE TABLE playlists (
upload_at DATE,
created_at DATE,
cover_img VARCHAR(1255),
songs VARCHAR(2500),
name VARCHAR(255),
id INT,
PRIMARY KEY (id)
);

CREATE TABLE users (
upload_at DATE,
created_at DATE,
password VARCHAR(255),
email VARCHAR(255),
is_admin TINYINT DEFAULT 0,
remember_token TINYINT DEFAULT 0,
preferences JSON,
name VARCHAR(255),
PRIMARY KEY (email)
);