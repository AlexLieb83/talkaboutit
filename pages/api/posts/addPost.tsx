// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const session = await getServerSession(req, res, authOptions);

    if (!session)
      return res.status(401).json({ message: "Sign In to make a post." });

    const title: string = req.body.title;

    // check title
    if (title.length > 300)
      return res
        .status(403)
        .json({ message: "Post is too long. 300 Characters Max" });
  }
}
