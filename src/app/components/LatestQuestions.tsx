import QuestionCard from "@/components/QuestionCard";
import { answerCollection, db, questionCollection, voteCollection } from "@/models/name";
import { databases, users } from "@/models/server/config";
import { UserPrefs } from "@/store/Auth";
import { Query } from "node-appwrite";
import React from "react";

const LatestQuestions = async () => {
    try {
        const questions = await databases.listDocuments(db, questionCollection, [
            Query.limit(5),
            Query.orderDesc("$createdAt"),
        ]);
        console.log("Fetched Questions:", questions);

        // If there are no questions, return early
        if (questions.documents.length === 0) {
            return <div>No questions available.</div>;
        }

        const updatedQuestions = await Promise.all(
            questions.documents.map(async (ques) => {
                try {
                    const [author, answers, votes] = await Promise.all([
                        users.get<UserPrefs>(ques.authorId),
                        databases.listDocuments(db, answerCollection, [
                            Query.equal("questionId", ques.$id),
                            Query.limit(1), // for optimization
                        ]),
                        databases.listDocuments(db, voteCollection, [
                            Query.equal("type", "question"),
                            Query.equal("typeId", ques.$id),
                            Query.limit(1), // for optimization
                        ]),
                    ]);

                    return {
                        ...ques,
                        totalAnswers: answers.total || 0,
                        totalVotes: votes.total || 0,
                        author: {
                            $id: author.$id,
                            reputation: author.prefs.reputation || 0,
                            name: author.name || "Anonymous",
                        },
                    };
                } catch (error) {
                    console.error(`Error fetching details for question ${ques.$id}:`, error);
                    return {
                        ...ques,
                        totalAnswers: 0,
                        totalVotes: 0,
                        author: {
                            $id: ques.authorId,
                            reputation: 0,
                            name: "Unknown Author",
                        },
                    };
                }
            })
        );

        console.log("Latest question")
        console.log(questions)
        return (
            <div className="space-y-6">
                {updatedQuestions.map(question => (
                    <QuestionCard key={question.$id} ques={question} />
                ))}
            </div>
        );
    } catch (error) {
        console.error("Error fetching questions:", error);
        return <div>Error loading questions. Please try again later.</div>;
    }
};

export default LatestQuestions;