const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const fs = require('fs');

app.use(bodyParser.json())

const root = '\\\\192.168.1.5\\share\\FLAC\\';
const contents = getContents();

function getContents() {
    let contents = {};
    let bandFolders = [];
    let bands = {};
    let bandAlbumFolders = [];

    bandFolders = fs.readdirSync(root, { 'withFileTypes': true })
    bands = bandFolders.map((folder, index) => {
        return { bandId: index, bandName: folder }
    })
    contents = bands

    bandFolders.forEach(band => {
        const albums = fs.readdirSync(root + '/' + band, { 'withFileTypes': true })
        bandAlbumFolders.push(albums)
    })

    bandAlbumFolders.forEach((folders, bandIndex) => {
        const albums = folders.map((folder, albumIndex) => {
            const songs = fs.readdirSync(root + '/' + bandFolders[bandIndex] + '/' + folder, { 'withFileTypes': true })
            const albumSongs = songs.map((song, index) => {
                return { songId: index, songName: song }
            })
            return { albumId: albumIndex, albumName: folder, songs: albumSongs }
        })
        contents[bandIndex].albums = albums
    })

    return contents
}

app.get('/', (request, response) => {
    response.send('<h1>Routes:</h1><a href="/contents"><b>GET /contents</b></a><p>Returns the whole contents of the music library</p>' +
        '<a href="/bands"><b>GET /bands</b></a><p>Returns the band names (folder names) as string array</p>' +
        '<b>GET /albums/:bandId</b><p>Returns the albums of the band as string array</p>' +
        '<b>GET /band/:bandId/albumId</b><p>Returns the songs (file names) of the album of the band as string array</p>')
})

/* ROUTES FOR THE NETWORK DRIVE */
// Returns the band names (folder names) in array as response
app.get('/contents', (request, response) => {
    response.json(contents);
})

app.get('/bands', (request, response) => {
    fs.readdir('\\\\192.168.1.5\\share\\FLAC\\', { 'withFileTypes': true }, (error, files) => {
        if (error) {
            console.log(error)
            return response.status(400).json({ error: error }).end()
        } else if (files) {
            response.json(files)
        }
    })
})

// Returns the albums of the band as string array
app.get('/albums/:bandId', (request, response) => {
    const bandId = Number(request.params.bandId)
    const band = contents[bandId].bandName
    console.log(band)
    if (band) {
        fs.readdir('\\\\192.168.1.5\\share\\FLAC\\' + band, { 'withFileTypes': true }, (error, files) => {
            if (error) {
                console.log(error)
                return response.status(400).json({ error: error }).end()
            } else if (files) {
                response.json(files)
            }
        })
    } else return response.status(400).json({ error: 'Band with given id not found!' })
})

// Returns the songs (file names) of the album of the band as string array
app.get('/band/:bandId/:albumId', (request, response) => {
    const bandId = Number(request.params.bandId)
    const albumId = Number(request.params.albumId)
    let band = undefined
    let album = undefined
    if (contents[bandId]) {
        band = contents[bandId].bandName
        if (contents[bandId].albums[albumId]) {
            album = contents[bandId].albums[albumId].albumName
        } else response.status(400).json({ error: `Album with albumId ${albumId} not found!` }).end()
    } else {
        return response.status(400).json({ error: `Band with bandId ${bandId} not found!` }).end()
    }
    console.log('band:', band, 'album:', album)
    fs.readdir('\\\\192.168.1.5\\share\\FLAC\\' + band + '\\' + album, { 'withFileTypes': true }, (error, files) => {
        if (error) {
            console.log('ERROR:', error)
            return response.status(400).json({ error: error }).end()
        } else if (files) {
            response.json(files)
        }
    })
})

/* ROUTES FOR THE LOCAL ALBUM ARRAY
// Returns all the album data in JSON format as response
app.get('/albums', (request, response) => {
    response.json(contents)
})

// Returns all unique band names as string array
app.get('/bands', (request, response) => {
    const contents = getContents()
    let bands = []
    contents.forEach(band => bands.push(band.bandName))
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
        else response.status(400).json({ error: 'Song with given id not found' }).end()
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
        album: { name: body.album.name, id: body.album.id },
        songs: body.songs
    }
    console.log(album)
    albums = albums.concat(album)
    response.json(album)
})*/

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})