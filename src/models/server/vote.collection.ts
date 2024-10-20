import { Permission } from "node-appwrite"
import {db, voteCollection} from "../name"
import { databases } from "./config"

export default async function createVoteCollection(){ 
  // create Collection
  await databases.createCollection(db, voteCollection, voteCollection, [
    Permission.read("any"),
    Permission.read("users"), 
    Permission.create("users"), 
    Permission.update("users"), 
    Permission.delete("users"), 
  ]);
  console.log("Vote collection created");

  //creating Attributes
  await Promise.all([
    databases.createEnumAttribute(db, voteCollection, "type", ["answer", "question"], true),
    databases.createEnumAttribute(db, voteCollection, "votestatus", ["upvoted", "downvoted"], true),
    databases.createStringAttribute(db, voteCollection, "typeId", 50, true),
    databases.createStringAttribute(db, voteCollection, "votedById", 50, true),
  ]);
  console.log("Vote Attributes created");
}
