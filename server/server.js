const express = require('express');
const bodyParser = require('body-parser');
const pg = require('pg');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('server/public'));
app.use(express.json());

const PORT = 5000;
app.listen(PORT, () => {
    console.log('listening on port', PORT)
});

const Pool = pg.Pool;
const config = {
    database: 'jazzy_sql',
    host: 'localhost',
    port: 5432,
    max: 10,
    idleTimeoutMillis: 30000
};

const pool = new Pool(config);

// Another way to declare the new Pool...
// const Pool = pg.Pool;
// const pool = new Pool ({
//     database: 'jazzy_sql',
//     host: 'localhost',
//     port: 5432,
//     max: 10,
//     idleTimeoutMillis: 30000
// });

pool.on('connect', () => {
    console.log('Postgresql connected');
});

pool.on('error', () => {
    console.log('Error with PostgreSQL pool', error);
});

app.get('/artist', (req, res) => {
    let artistList = `
    SELECT * FROM "artist" 
    ORDER BY "birthdate" DESC;
    `;

    pool.query(artistList)
        .then(result => {
            res.send(result.rows);
        })
        .catch(error => {
            console.log('Error trying to get artists from PostgreSQL', error);
            res.sendStatus(500);
        })
    console.log(`In /songs GET`);
});

app.post('/artist', (req, res) => {
    const newArtist = req.body;

    const artistList = `
    INSERT INTO artist (name, birthdate)
    VALUES ($1, $2);
    `;

    pool.query(artistList, [newArtist.name, newArtist.birthdate])
        .then(dbResponse => {
            res.sendStatus(201);
        })
        .catch(error => {
            console.log('Could not create a new artist', error);
            res.sendStatus(500);
        })
});

app.get('/song', (req, res) => {
    let songList = `
    SELECT * FROM "song"
    ORDER BY "title" ASC;
    `;
    pool.query(songList)
        .then((result) => {
            res.send(result.rows);
        })
        .catch(error => {
            console.log('Error trying to get artists from PostgreSQL', error);
            res.sendStatus(500);
        })
    console.log(`In /songs GET`);
});

app.post('/song', (req, res) => {
    const newSong = req.body;
    const songList = `
    INSERT INTO song (title, length, released)
    VALUES ($1, $2, $3);
    `;
pool.query(songList, [newSong.title, newSong.length, newSong.released])
        .then(dbResponse => {
            res.sendStatus(201);
        })
        .catch(err => {
            console.log(`Error making query`, err);
            res.sendStatus(500);
        });
});


