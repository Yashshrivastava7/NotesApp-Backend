require("dotenv").config({ path: "./.env" });
import { Express, Request, Response } from "express";
import { UserPassSchema, NoteSchema } from "../models/Models";
const jwt = require("jsonwebtoken");
import mongoose from "mongoose";

const mongoUsername = process.env.MONGO_USER;
const mongoPassword = process.env.MONGO_PASSWORD;
const mongoCluster = process.env.MONGO_CLUSTER;
const mongoURI = `mongodb+srv://${mongoUsername}:${mongoPassword}@${mongoCluster}`;
mongoose.connect(mongoURI);

const UserPass = mongoose.model("UserPass", UserPassSchema);
const Notes = mongoose.model("Notes", NoteSchema);

exports.checkUser = (req: Request, res: Response) => {
  return res.status(200).send(`Success and user is ${req.username}`);
};

exports.handleSignup = async (req: Request, res: Response) => {
  const username: string = req.body.username;
  const password: string = req.body.password;
  const checker = await UserPass.find({
    username: username,
  }).exec();
  if (checker.length !== 0) {
    return res.status(400).send("User already exists");
  } else {
    await UserPass.create({ username: username, password: password });
    return res.status(200).send("User registered successfully");
  }
};

exports.handleLogin = async (req: Request, res: Response) => {
  const username = req.body.username;
  const password = req.body.password;
  const checker = await UserPass.find({
    username: username,
    password: password,
  }).exec();
  if (checker.length === 0) {
    return res.status(400).send("Inlavid Credentials");
  } else {
    const AccessToken = jwt.sign(
      { username: username },
      process.env.ACCESS_TOKEN,
      { expiresIn: "30m" }
    );
    return res.status(200).json({ AccessToken: AccessToken });
  }
};

exports.getAllNotes = async (req: Request, res: Response) => {
  const username = req.username; //coming straight from authenticate function
  const notes = await Notes.find({ username: username }).exec();
  return res.status(200).send(notes);
};

exports.addNote = async (req: Request, res: Response) => {
  const title = req.body.title;
  const note = req.body.note;
  console.log(`[POST /notes] \nTitle: ${title}\nnote: ${note}`);
  await Notes.create({
    username: req.username,
    title: req.body.title,
    note: req.body.note,
  });
  return res.status(200).send("Note added succesfully");
};

exports.deleteNote = async (req: Request, res: Response) => {
  let delNote = undefined;
  try {
    delNote = await Notes.findById(req.params.id).exec();
  } catch (e) {
    console.error("There was an error");
  }

  console.log(delNote);
  if (!delNote) {
    return res.status(400).send("Invalid Request");
  }
  await Notes.findOneAndDelete({ username: req.username, _id: req.params.id });
  return res.status(204).send("Note deleted successfully");
};

exports.getSingleNote = async (req: Request, res: Response) => {
  const id = req.params.id;
  console.log(`[GET /notes/${id}]`);
  let note = undefined;
  try {
    note = await Notes.findById(id).exec();
  } catch (e) {
    console.error("Error fetching record from DB with ID: " + id);
    return res.status(500).send("Error Fetching Record from DB");
  }
  console.log("Returning Note:");
  console.log(note);
  return res.status(200).json(note);
};