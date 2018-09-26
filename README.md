# raspiplayer

Routes:
GET /bandfolders
Returns the band names (folder names) in array as response

GET /bandfolders/:bandId
Returns the albums of the band as string array

GET /bandfolders/:bandId/:albumId
Returns the songs (file names) of the album of the band as string array

GET /albums
Returns all the album data in JSON format as response

GET /bands
Returns all unique band names as string array

GET /albums/:id
Returns album data based on id in JSON format

GET /albums/:id/songs/
Returns songs of the album as object array (id, filename)

GET /albums/:id/songs/:songId
Returns the file name of the song based on album id and song id

POST /albums
Adds a new album to the list
