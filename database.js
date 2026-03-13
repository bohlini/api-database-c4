const { MongoClient } = require('mongodb')
const client = new MongoClient(process.env.MONGODB_URI)
let collection;

async function getCollection() {
    if (!collection) {
        await client.connect()
        const db = client.db('music-library')
        collection = db.collection('playlist')
    }
    return collection
}

async function startDatabase() {
    await getCollection()
}

async function showAll() {
    const col = await getCollection()
    return await col.find({}).toArray()
}

async function filterByArtist(artist) {
    const col = await getCollection()
    return await col.find({ artist }).toArray()
}

async function addSong(title, artist, album, year, theme) {
    const col = await getCollection()
    const isExisting = await col.findOne({ title, artist })
    if (isExisting) {
        return { currentlyExisting: true }
    }
    await col.insertOne({ title, artist, album, year, theme })
    return { currentlyExisting: false }
}

async function deleteSong(id) {
    const col = await getCollection()
    const isExisting = await col.findOne({ _id: id })
    if (!isExisting) {
        return { currentlyExisting: false }
    }
    await col.deleteOne({ _id: id })
    return { currentlyExisting: true }
}

module.exports = {
    startDatabase,
    addSong,
    filterByArtist,
    showAll,
    deleteSong
}