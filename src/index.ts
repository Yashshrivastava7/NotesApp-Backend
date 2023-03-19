require('dotenv').config({path:'./.env'});
import { Express, Request, Response } from 'express';
import { UserPassSchema , NoteSchema } from './models/Models';
import mongoose from 'mongoose';
const jwt = require('jsonwebtoken');
const UserPass = mongoose.model("UserPass", UserPassSchema);
const Notes = mongoose.model("Notes", NoteSchema);
const express = require('express');

mongoose.connect("mongodb+srv://<usernmae>:<password>@cluster0.jnmzzaw.mongodb.net/?retryWrites=true&w=majority");

const app: Express = express();
const port = 8080;


app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.get('/user', authenticate , (req: Request , res: Response) => {
  return res.status(200).send("Success");
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
      { expiresIn: "10m" }
    );
    return res.status(200).json({ AccessToken: AccessToken });
  }
});

app.post('/notes', authenticate , (req: Request, res: Response) => {

});

app.get('/notes/:user', authenticate , (req: Request, res: Response) => {

});

function authenticate(req : Request, res : Response, next) {
  const authHeader = req.headers['authorization'];
  const token : string = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, data) => {
    console.log(err, data)
    if (err) return res.sendStatus(403)
    next()
  })
}

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
