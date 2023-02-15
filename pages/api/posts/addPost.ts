// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "../../../prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const session = await getServerSession(req, res, authOptions);

    if (!session)
      return res.status(401).json({ message: "Sign In to make a post." });

    const title: string = req.body.title;

    // get user
    const prismaUser = await prisma.user.findUnique({
      where: { email: session?.user?.email },
    });

    // check title
    if (title.length > 300) {
      return res
        .status(403)
        .json({ message: "Post is too long. 300 Characters Max" });
    }
    if (!title.length) {
      return res.status(403).json({ message: "Cannot submit an empty post." });
    }

    // create Post
    try {
      const result = await prisma.post.create({
        data: {
          title,
          userId: prismaUser.id,
        },
      });
      res.status(200).json(result);
    } catch (error) {
      res
        .status(403)
        .json({ error: "Error occured while making a post, try again later." });
    }
  }
}
