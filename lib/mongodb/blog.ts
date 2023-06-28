// @ts-nocheck
import { ObjectId } from "mongodb";
import clientPromise from ".";

let client
let db
let blogs

async function init() {
    if (db) return
    try {
        client = await clientPromise
        db = await client.db('fact-flow')
        blogs = await db.collection('blogs')
    } catch (err) {

        throw new Error("Failed to establish connection to database")
    }
}
; (async () => {
    await init()
})()


export async function getBlogs() {
    try {
        if (!blogs) await init()

        const result = await blogs
            .find({})
            .toArray()


        return { blogs: result }
    } catch (err) {
        return { error: 'Failed to fetch blogs' }
    }
}

export async function getOneBlog(title) {

    try {
        if (!blogs) await init()

        const result = await blogs
            .findOne({ title: title })

        return { blog: result }
    } catch (err) {

        return { error: 'Failed to fetch blogs' }
    }
}

export async function createBlog(blog) {

    try {
        if (!blogs) await init()

        const result = await blogs
            .insertOne({
                title: blog.title,
                content: blog.content,
                publisher: blog.publisher,
                created_at: new Date(),
                category: blog.category,
                cover_image: blog.coverImage,
                publisher_pic: blog.publisherPic,
                summary: blog.summary
            })



        return { blog: result }
    } catch (err) {
        return { error: 'Failed to fetch blogs' }
    }
}