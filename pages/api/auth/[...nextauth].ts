import { NextApiRequest, NextApiResponse } from 'next'
import NextAuth from 'next-auth'
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"

const options = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID!,
            clientSecret: process.env.GOOGLE_SECRET!
        }),
        FacebookProvider({
            clientId: process.env.FACEBOOK_ID!,
            clientSecret: process.env.FACEBOOK_SECRET!
        }),
    ],
    secret: process.env.NEXT_PUBLIC_SECRET
}

export default (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, options)