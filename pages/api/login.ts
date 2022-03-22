// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import userNames from "../../utilities/userName";
import {StreamChat} from "stream-chat";
import genToken from "../../utilities/genToken";

type Data = {
    token: string
} | string

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method === 'POST') {
        // Process POST request only
        const userItemFromClient = JSON.parse(req.body)
        const isMatched = userNames.find(_userName => _userName === userItemFromClient.username)
        if (isMatched) {
            // Initialize a Server Client
            const token = genToken(userItemFromClient.username)
            res.status(200).json({
                token
            })
            return
        }
    }
    res.status(404).json('""')
}
