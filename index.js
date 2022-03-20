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





















// {
//     "id": 1,
//     "title": "title 1",
//     "author": "author 1",
//     "previous": null,
//     "next": 2
// },
// {
//     "id": 2,
//     "title": "title 2",
//     "author": "author 2",
//     "previous": 1,
//     "next": 3
// },
// {
//     "id": 3,
//     "title": "title 3",
//     "author": "author 3",
//     "previous": 2,
//     "next": 4
// },
// {
//     "id": 4,
//     "title": "title 4",
//     "author": "author 4",
//     "previous": 3,
//     "next": 5
// },
// {
//     "id": 5,
//     "title": "title 5",
//     "author": "author 5",
//     "previous": 4,
//     "next": null
// }