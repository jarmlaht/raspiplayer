const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const fs = require('fs');

app.use(bodyParser.json())

let albums = [{
        id: 1,
        band: {
            id: 1,
            name: 'Pendragon',
        },
        albumname: 'Pure',
        songs: [{
                id: 1,
                filename: '01-Indigo.flac'
            },
            {
                id: 2,
                filename: '02-Eraserhead.flac'
            },
            {
                id: 3,
                filename: '03-Comatose I- View From the Seashore.flac'
            },
            {
                id: 4,
                filename: '04-Comatose II- Space Cadet.flac'
            },
            {
                id: 5,
                filename: '05-Comatose III- Home and Dry.flac'
            },
            {
                id: 6,
                filename: '06-The Freak Show.flac'
            },
            {
                id: 7,
                filename: '07-It\'s Only Me.flac'
            },
        ]
    },
    {
        id: 2,
        band: {
            id: 2,
            name: 'Transatlantic',
        },
        albumname: 'SMPTe',
        songs: [{
                id: 1,
                filename: '01-All Of The Above.flac'
            },
            {
                id: 2,
                filename: '02-We All Need Some Light.flac'
            },
            {
                id: 3,
                filename: '03-Mystery Train.flac'
            },
            {
                id: 4,
                filename: '04-My New World.flac'
            },
            {
                id: 5,
                filename: '05-In Held (Twas) In I.flac'
            },
        ]
    },
    {
        id: 3,
        band: {
            id: 2,
            name: 'Transatlantic',
        },
        albumname: 'Bridge Across Forever',
        songs: [{
                id: 1,
                filename: '01-Duel With The Devil.flac'
            },
            {
                id: 2,
                filename: '02-Suite Charlotte Pike.flac'
            },
            {
                id: 3,
                filename: '03-Bridge Across Forever.flac'
            },
            {
                id: 4,
                filename: '04-Stranger In Your Soul.flac'
            },
        ]
    },
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

/* ROUTES FOR THE NETWORK DRIVE */
// Returns the band names (folder names) in array as response
app.get('/bandfolders', (request, response) => {
    fs.readdir('\\\\192.168.1.5\\share\\FLAC\\', { 'withFileTypes': true }, (error, files) => {
        if (error) {
            console.log(error)
            return response.status(400).json({ error: error })
        } else if (files) {
            response.json(files)
        }
    })
})

// Returns the albums of the band as string array
app.get('/bandfolders/:bandId', (request, response) => {
    const bandId = Number(request.params.bandId)
    const band = albums.find(album => album.band.id === bandId)
    if (band) {
        fs.readdir('\\\\192.168.1.5\\share\\FLAC\\' + band.band.name, { 'withFileTypes': true }, (error, files) => {
            if (error) {
                console.log(error)
                return response.status(400).json({ error: error })
            } else if (files) {
                response.json(files)
            }
        })
    } else return response.status(400).json({ error: 'Band with given id not found!' })
})

/* ROUTES FOR THE LOCAL ALBUM ARRAY */
// Returns all the album data in JSON format as response
app.get('/albums', (request, response) => {
    response.json(albums)
})

// Returns all unique band names as string array
app.get('/bands', (request, response) => {
    let bands = []
    albums.forEach(album => bands.push(album.band.name))
    const uniqueBands = bands.filter((item, pos) => {
        console.log(item, pos)
        return bands.indexOf(item) == pos
    })
    response.json(uniqueBands)
})

// Returns album data based on id in JSON format
app.get('/albums/:id', (request, response) => {
    const id = Number(request.params.id)
    const album = albums.find(album => album.id === id)
    if (album) {
        response.json(album)
    } else {
        response.status(404).end()
    }
})

// Returns songs of the album as object array (id, filename)
app.get('/albums/:id/songs/', (request, response) => {
    const id = Number(request.params.id)
    const album = albums.find(album => album.id === id)
    if (album) {
        response.json(album.songs)
    } else {
        response.status(404).end()
    }
})

// Returns the file name of the song based on album id and song id
app.get('/albums/:id/songs/:songId', (request, response) => {
    const id = Number(request.params.id)
    const songId = Number(request.params.songId)
    const album = albums.find(album => album.id === id)
    if (album) {
        const song = album.songs.find(song => song.id === songId)
        if (song) response.end(song.filename)
        else response.status(400).json({ error: 'Song with given id not found' })
    } else {
        response.status(404).end()
    }
})

// Adds a new album to the list 
app.post('/albums', (request, response) => {
    const body = request.body
    console.log(body.id, albums.length)
    if (body === undefined) {
        return response.status(400).json({ error: 'Album data missing' })
    } else if (Number(body.id) <= albums.length) {
        return response.status(400).json({ error: 'Album id already exists' })
    }

    const album = {
        id: body.id,
        band: { id: body.band.id, name: body.band.name },
        albumname: body.albumname,
        songs: body.songs
    }
    console.log(album)
    albums = albums.concat(album)
    response.json(album)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})