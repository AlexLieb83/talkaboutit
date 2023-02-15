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
  if (req.method === "DELETE") {
    const session = await getServerSession(req, res, authOptions);

    if (!session) return res.status(401).json({ message: "Please Sign In" });

    // delete a post
    try {
      const postId = req.body;
      const result = await prisma.post.delete({
        where: {
          id: postId,
        },
      });
      res.status(200).json(result);
    } catch (error) {
      res
        .status(403)
        .json({
          error: "Error occured while deleting a post, try again later.",
        });
    }
  }
}
