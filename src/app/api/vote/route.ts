import { answerCollection, db, questionCollection, voteCollection } from "@/models/name";
import { databases, users } from "@/models/server/config";
import { UserPrefs } from "@/store/Auth";
import { NextRequest, NextResponse } from "next/server";
import { ID, Query } from "node-appwrite";

type VoteBody = {
  votedById: string;
  voteStatus: "upvoted" | "downvoted";
  type: "question" | "answer";
  typeId: string;
};

export async function POST(request: NextRequest) {
  try {
    //grab the data
    const { votedById, voteStatus, type, typeId }: VoteBody = await request.json();

    //check if vote already exists
    const existingVote = await databases.listDocuments(
      db, voteCollection, [
      Query.equal("type", type),
      Query.equal("typeId", typeId),
      Query.equal("votedById", votedById),
    ]
    );

    const voteExists = existingVote.documents.length > 0;


    // decrease the reputation of question/answer author
    const questionOrAnswer = await databases.getDocument(
      db,
      type === "question" ? questionCollection : answerCollection,
      typeId
    );

    const authorPrefs = await users.getPrefs<UserPrefs>(questionOrAnswer.authorId);
    let reputation = Number(authorPrefs.reputation) || 0;

    // If the vote exists, handle the vote withdrawal or status change
    if (voteExists) {
      const currentVote = existingVote.documents[0];

      if (currentVote.voteStatus === voteStatus) {
        // Vote is being withdrawn
        await databases.deleteDocument(db, voteCollection, currentVote.$id);
        reputation += voteStatus === "upvoted" ? -1 : 1; // Adjust reputation accordingly
      } else {
        // Vote status is changing (upvote to downvote or vice versa)
        await databases.updateDocument(db, voteCollection, currentVote.$id, { voteStatus });
        reputation += voteStatus === "upvoted" ? 2 : -2; // Adjust reputation for change in vote status
      }
    } else {
      // Create a new vote
      await databases.createDocument(db, voteCollection, ID.unique(), {
        type,
        typeId,
        voteStatus,
        votedById,
      });

      // Adjust reputation based on new vote
      reputation += voteStatus === "upvoted" ? 1 : -1;
    }

    await users.updatePrefs<UserPrefs>(questionOrAnswer.authorId, { reputation });

    const [upvotes, downvotes] = await Promise.all([
      databases.listDocuments(db, voteCollection, [
        Query.equal("type", type),
        Query.equal("typeId", typeId),
        Query.equal("voteStatus", "upvoted"),
        Query.equal("votedById", votedById),
        Query.limit(1), // for optimization as we only need total
      ]),
      databases.listDocuments(db, voteCollection, [
        Query.equal("type", type),
        Query.equal("typeId", typeId),
        Query.equal("voteStatus", "downvoted"),
        Query.equal("votedById", votedById),
        Query.limit(1), // for optimization as we only need total
      ]),
    ]);

    const voteResult = upvotes.total - downvotes.total;

    return NextResponse.json(
      {
        data: { voteResult },
        message: voteExists ? "Vote updated" : "Voted successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error?.message || "Error in voting",
      },
      {
        status: error?.status || error?.code || 500,
      }
    );
  }
}