// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "../../../prisma/client";
import { userAgent } from "next/server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const session = await getServerSession(req, res, authOptions);

    if (!session) return res.status(401).json({ message: "Please Sign In" });

    // get user
    const prismaUser = await prisma.user.findUnique({
      where: { email: session?.user?.email },
    });

    // add a comment
    try {
      const { title, postId } = req.body.data;

      if (!title.length) {
        return res.status(401).json({ message: "Don't leave empty" });
      }
      const result = await prisma.comment.create({
        data: {
          message: title,
          userId: prismaUser?.id,
          postId,
        },
      });
      res.status(200).json(result);
    } catch (error) {
      res.status(403).json({
        error: "Error occured while adding a comment, try again later.",
      });
    }
  }
}
