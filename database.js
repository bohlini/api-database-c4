const { MongoClient } = require('mongodb')
const client = new MongoClient(process.env.MONGODB_URI)
let collection;

async function startDatabase() {
    await client.connect()
    const db = client.db('music-library')
    collection = db.collection('playlist')
}

async function showAll() {
    const all = await collection.find({}).toArray()
    return all
}

async function filterByArtist(artist) {
    const song = await collection.find({
        artist: artist
    }).toArray()
    return song
}

async function addSong(title, artist, album, year) {
    const isExisting = await collection.findOne({
        title: title,
        artist: artist
    })
    if (isExisting) {
        return { currentlyExisting: true }
    } else {
        await collection.insertOne({
            title: title,
            artist: artist,
            album: album,
            year: year
        })
        return { currentlyExisting: false }
    }
}

async function deleteSong(id) {
    const isExisting = await collection.findOne({
        _id: id
    })
    if (!isExisting) {
        return { currentlyExisting: false }
    } else {
        await collection.deleteOne({
            _id: id
        })
        return { currentlyExisting: true }
    }
}

module.exports = {
    startDatabase,
    addSong,
    filterByArtist,
    showAll,
    deleteSong
}