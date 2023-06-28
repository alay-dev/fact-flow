import { createBlog, getBlogs, getOneBlog } from "@/lib/mongodb/blog";
import type { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    if (req.query.title && req.method === 'GET') {
        const title = req.query.title
        try {
            const { blog, error } = await getOneBlog(title)
            if (error) throw new Error(error)

            return res.status(200).json({ blog })
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }

    }
    if (req.method === 'GET' && !req.query.name) {
        try {
            const { blogs, error } = await getBlogs()
            if (error) throw new Error(error)

            return res.status(200).json({ blogs })
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    }

    if (req.method === 'POST') {
        try {
            const { blog, error } = await createBlog(JSON.parse(req.body))
            if (error) throw new Error(error)

            return res.status(200).json({ blog })
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    }
}

export default handler