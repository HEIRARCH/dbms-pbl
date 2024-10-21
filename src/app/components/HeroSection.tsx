import React from "react";
import { HeroParallax } from "@/components/ui/hero-parallax";
import { databases } from "@/models/server/config";
import { db, questionAttachmentBucket, questionCollection } from "@/models/name";
import { Query } from "node-appwrite";
import slugify from "@/utils/slugify";
import { storage } from "@/models/client/config";
import HeroSectionHeader from "./HeroSectionHeader";

export default async function HeroSection() {
    //fetch latest questions
    const questions = await databases.listDocuments(db, questionCollection, [
        Query.orderDesc("$createdAt"),
        Query.limit(15),
    ]);

    // Map questions with their corresponding file previews
    const products = await Promise.all(
        questions.documents.map(async (q) => {
            let thumbnail = "";
            try {
                // Use the result of `getFilePreview` as the URL directly
                thumbnail = await storage.getFilePreview(questionAttachmentBucket, q.attachmentId);
            } catch (error) {
                console.error(`Error fetching file preview for question ${q.$id}:`, error);
            }
            return {
                title: q.title,
                link: `/questions/${q.$id}/${slugify(q.title)}`,
                thumbnail: thumbnail || "/default-thumbnail.png", // Fallback thumbnail if there's an error.
            };
        })
    );

    return (
        <HeroParallax
            header={<HeroSectionHeader />}
            products={products}
        />
    );
}