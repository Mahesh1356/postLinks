const axios = require('axios');
const cors = require('cors');
const { nanoid } = require('nanoid');
const express = require("express")
const postLinkApp = express()

postLinkApp.use(express.json())
postLinkApp.use(cors({ origin: "*", credentials: true }))

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
        posts.map(item => { if (item.next == null) prevId = item.id })
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
//sample
//insert back
postLinkApp.post("/posts/:id", async (req, res) => {
    const { data: currentPost } = await axios.get(`http://localhost:3000/posts/${req.params.id}`);
    const newId = nanoid(10);
    const next = currentPost.next === null ? null : currentPost.next;

    const newPost = {
        "previous": currentPost.id,
        "id": newId,
        "title": "title " + newId,
        "author": "author " + newId,
        "next": next,
    };
    await axios.post("http://localhost:3000/posts", newPost);
    await axios.patch(`http://localhost:3000/posts/${currentPost.id}`, { next: newPost.id, });
    currentPost.next !== null && await axios.patch(`http://localhost:3000/posts/${next.id}`, { previous: newPost.id, });
    res.send("inserted");
})

postLinkApp.listen(3002, console.log("app is running in http://localhost:3002"))
