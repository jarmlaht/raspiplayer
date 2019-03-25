# raspiplayer

Routes:
GET /contents
Returns the whole contents of the music library

GET /bands
Returns the band names (folder names) as string array

GET /albums/:bandId
Returns the albums of the band as string array

GET /band/:bandId/albumId
Returns the songs (file names) of the album of the band as string array
