require('dotenv').config({path:'./.env'});
import { Express, Request, Response } from 'express';
import { UserPassSchema , NotesSchema } from './models/Models';
import mongoose from 'mongoose';

mongoose.connect("mongodb+srv://yashnode:<password>@cluster0.nbdaj.mongodb.net/?retryWrites=true&w=majority");

const UserPass = mongoose.model("UserPass", UserPassSchema);
const Notes = mongoose.model("Notes", NotesSchema);

const express = require('express');

const app: Express = express();
const port = 8080;
const jwt = require('jsonwebtoken');

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.get('/user', authenticate , (req: Request , res: Response) => {
  return res.status(200).send("Success");
});

app.post('/signup', (req: Request , res: Response) => {
  const username : string = req.body.username;
  const password : string = req.body.password;
  run();
  async function run() {
    const checker = await UserPass.find({username:username}).exec();
    if(checker.length!==0){
      return res.status(400).send("User already exists");
    }
    else {
      await UserPass.create({username:username, password:password});
      return res.status(200).send("User registered successfully");
    }
  }
});

app.post('/login', (req: Request, res: Response) => {
  const username = req.body.username;
  const password = req.body.password;
  run();
  async function run() {
    const checker = await UserPass.find({username:username,password:password}).exec();
    if(checker.length===0){
      return res.status(400).send("Invalid Credentials");
    }
    else {
      const AccessToken = jwt.sign({username: username}, process.env.ACCESS_TOKEN, { expiresIn: '10m' });
      return res.status(200).json({ AccessToken: AccessToken });
    }
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
