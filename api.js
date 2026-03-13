const { startDatabase, addSong, filterByArtist, deleteSong, showAll } = require('./database')
const { ObjectId } = require('mongodb')
const express = require('express')
const app = express();
app.use(express.json())
const cors = require('cors')
app.use(cors({
    origin: '*'
}))
const port = 3000;

const init = async () => {
    try {
        await startDatabase()
    } catch (error) {
        console.log(error)
    }
}

init();

app.get('/songs', async (req, res) => {
    try {
        await startDatabase()
        const result = await showAll()
        if (result.length < 1) {
            res.status(404).send('No songs found')
        } else {
            res.status(200).json(result)
        }
    } catch (error) {
        console.log(error)
        res.status(500).send(error.message)
    }
})

app.get('/songs/:artist', async (req, res) => {
    await startDatabase()
    const result = await filterByArtist(req.params.artist)
    if (result.length < 1) {
        res.status(404).send('Artist not found')
    } else {
        res.status(200).json(result)
    }
})

app.post('/songs/add', async (req, res) => {
    await startDatabase()
    if (!/^\d{4}$/.test(req.body.year)) {
        return res.status(400).send('Year must be a 4-digit number')
    }
    const result = await addSong(
        req.body.title,
        req.body.artist,
        req.body.album,
        req.body.year
    )
    if (result.currentlyExisting) {
        res.status(409).send('Song already exist')
    } else {
        res.status(201).send('Song created')
    }
})

app.delete('/songs/delete/:id', async (req, res) => {
    await startDatabase()
    const result = await deleteSong(
        new ObjectId(req.params.id)
    )
    if (result.currentlyExisting) {
        res.status(204).send()
    } else {
        res.status(404).send('Song not found')
    }
})

if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`listening on port ${port}`)
    })
}

module.exports = app;