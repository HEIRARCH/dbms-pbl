import { db, questionCollection } from "@/models/name";
import { databases } from "@/models/server/config";
import React from "react";
import EditQues from "./EditQues";

const Page = async ({ params }: { params: { quesId: string; quesName: string } }) => {
    let question;
    try{
        question = await databases.getDocument(db, questionCollection, params.quesId);
    } catch(error) {
        console.error("Error fetching question:", error);
        // Return an error page or null based on your app's UX strategy
        return <div className="text-center text-red-500">Error fetching question.</div>;
    }
    
    if (!question) {
        return <div className="text-center">Loading...</div>;
    }

    return <EditQues question={question} />;
};

export default Page;