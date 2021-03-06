const axios = require('axios');
const { nanoid } = require('nanoid');
const express = require("express")
const postLinkApp = express()

postLinkApp.use(express.json())

const getNewId = () => {
    return nanoid(10)
}

postLinkApp.get("/posts", async (req, res) => {
    const response = await axios.get("http://localhost:3000/posts")
    res.send(response.data)
})

postLinkApp.get("/posts/:id", async (req, res) => {
    const id = req.params.id
    const response = await axios.get(`http://localhost:3000/posts/${id}`)
    res.send(response.data)
})

postLinkApp.post("/posts", async (req, res) => {
    const { data: posts } = await axios.get("http://localhost:3000/posts")
    const totPost = posts.length
    const newId = getNewId()
    let prevId = null
    if (totPost > 0) {
        prevId = posts[totPost - 1].id
    }
    if (prevId !== null) {
        await axios.patch(`http://localhost:3000/posts/${prevId}`, { next: newId })
    }
    const newData = {
        "previous": prevId,
        "id": newId,
        "title": "title " + newId,
        "author": "author " + newId,
        "next": null
    }
    await axios.post("http://localhost:3000/posts", newData)
    res.send("added")
})

postLinkApp.delete("/posts/:id", async (req, res) => {
    const { data: post } = await axios.get(`http://localhost:3000/posts/${req.params.id}`)
    if (post.previous !== null)
        await axios.patch(`http://localhost:3000/posts/${post.previous}`, { next: post.next })
    if (post.next !== null)
        await axios.patch(`http://localhost:3000/posts/${post.next}`, { previous: post.previous })
    await axios.delete(`http://localhost:3000/posts/${req.params.id}`)
    res.send("deleted")
})

postLinkApp.listen(3001, console.log("app is running in http://localhost:3001"))
