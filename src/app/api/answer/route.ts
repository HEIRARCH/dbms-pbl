import { answerCollection, db } from "@/models/name";
import { databases, users } from "@/models/server/config";
import { NextRequest, NextResponse } from "next/server";
import { ID } from "node-appwrite";
import { UserPrefs } from "@/store/Auth";


type PostBody = {
  questionId: string;
  answer: string;
  authorId: string;
};

type DeleteBody = {
  answerId: string;
};

export async function POST(request: NextRequest) {
  try {
    const { questionId, answer, authorId }: PostBody = await request.json();

    if (!questionId || !answer || !authorId) {
      return NextResponse.json(
        { error: "Invalid request: Missing required fields." },
        { status: 400 }
      );
    }

    const response = await databases.createDocument(db, answerCollection, ID.unique(), {
      content: answer,
      authorId: authorId,
      questionId: questionId
    });

    //Increase author reputation
    const prefs = await users.getPrefs<UserPrefs>(authorId);
    const reputation = Number(prefs.reputation) || 0;
    await users.updatePrefs(authorId, {
        reputation: reputation + 1
    });

    return NextResponse.json(response, {
      status: 201
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error?.message || "Error creating answer"
      },
      {
        status: error?.status || error?.code || 500
      }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const {answerId}: DeleteBody = await request.json();

    if (!answerId) {
      return NextResponse.json(
        { error: "Invalid request: Missing answerId." },
        { status: 400 }
      );
    }

    const answer = await databases.getDocument(db, answerCollection, answerId);

    if (!answer) {
      return NextResponse.json(
        { error: "Answer not found" },
        { status: 404 }
      );
    }

    const response = await databases.deleteDocument(db, answerCollection, answerId);

    //decrease the reputation
    const prefs = await users.getPrefs<UserPrefs>(answer.authorId);
    const reputation = Number(prefs.reputation) || 0;
    await users.updatePrefs(answer.authorId, {
        reputation: reputation - 1
    });

    return NextResponse.json( 
      { data: response },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error?.message || "Error deleting the answer"
      },
      {
        status: error?.status || error?.code || 500
      }
    );
  }
}