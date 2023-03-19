require('dotenv').config({path:'./.env'});
import { Express, Request, Response } from 'express';
import { UserPassSchema , NoteSchema } from './models/Models';
import authenticate from './Auth';
import mongoose from 'mongoose';
const jwt = require('jsonwebtoken');
const UserPass = mongoose.model("UserPass", UserPassSchema);
const Notes = mongoose.model("Notes", NoteSchema);
const express = require('express');

declare module 'express' {
  export interface Request {
    username?: string
  }
}

mongoose.connect("mongodb+srv://yashnodets:yashnodetsx@cluster0.jnmzzaw.mongodb.net/?retryWrites=true&w=majority");

const app: Express = express();
const port = 8080;


app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.get('/user', authenticate , (req: Request , res: Response) => {
  return res.status(200).send(`Success and user is ${req.username}`);
});

app.post("/signup", async (req: Request, res: Response) => {
  const username: string = req.body.username;
  const password: string = req.body.password;
  const checker = await UserPass.find({ 
    username: username 
  }).exec();
  if (checker.length !== 0) {
    return res.status(400).send("User already exists");
  } else {
    await UserPass.create({ username: username, password: password });
    return res.status(200).send("User registered successfully");
  }
});

app.post("/login", async (req: Request, res: Response) => {
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
});

app.get('/notes', authenticate, async (req: Request, res: Response) => {
  const username = req.username; //coming straight from authenticate function
  const notes = await Notes.find({username: username}).exec();
  return res.status(200).send(notes);
});

app.post('/notes', authenticate , async (req: Request, res: Response) => {
  await Notes.create({ username: req.username , title: req.body.title, note: req.body.note});
  return res.status(200).send("Note added succesfully");
});

app.delete('/notes/:id', authenticate, async (req: Request, res: Response) => {
  let delNote = undefined;
  try {
    delNote = await Notes.findById(req.params.id).exec();
  } catch (e) {
    console.error("There was an error");
  }
  
  console.log(delNote);
  if(!delNote){
    return res.status(400).send("Invalid Request");
  }
  await Notes.findOneAndDelete({username: req.username, _id: req.params.id});
  return res.status(204).send("Note deleted successfully");
})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
