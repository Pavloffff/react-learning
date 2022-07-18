const express = require("express")
const app = express()
const PORT = 5000
const cors = require("cors")
const pool = require("./db")
const e = require("express");
app.use(express.json())
app.use(cors())

//post one
app.post("/posts", async(req, res) => {
    try {
        const { title, tag, body, name, password, likeArray, likeCounter,} = req.body
        console.log(req.body)
        const newPost = await pool.query(
            "INSERT INTO posts (title, tag, body, name, password, likeArray, likeCounter) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *", [title, tag, body, name, password, likeArray, likeCounter]);
        res.json(newPost.rows[0])
    } catch (err) {
        console.error(err.message)
    }
})

//get all
app.get("/posts", async(req, res) => {
    try {
        const allPosts = await pool.query("SELECT * FROM posts")
        res.json(allPosts.rows)
    } catch (err) {
        console.error(err.message)
    }
})

//get one
app.get("/posts/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const post = await pool.query("SELECT * FROM posts WHERE id = $1", [id])
        res.json(post.rows[0])
    } catch (err) {
        console.error(err.message)
    }
})

//update 1 post
app.put("/posts/:id", async(req, res) => {
    try {
        const {id} = req.params
        const { title, tag, body, name, password, likeArray, likeCounter,} = req.body
        const updatePost = await pool.query("UPDATE posts SET title = $1, tag = $2, body = $3, name = $4, password = $5, likeArray = $6, likeCounter = $7 WHERE id = $8",
            [title, tag, body, name, password, likeArray, likeCounter, id])
        res.json("UPDATED!")
    } catch (err) {
        console.error(err.message)
    }
})

//delete 1 post
app.delete("/posts/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const deletePost = await pool.query("DELETE FROM posts WHERE id = $1", [id])
        res.json("DELETED!!!")
    } catch (err) {
        console.error(err.message)
    }
})

app.listen(PORT, () => {
    console.log(`server has started on port ${PORT}`)
})