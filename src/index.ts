require('dotenv').config({path:'./.env'});
import { Express, Request, Response } from 'express';
import { UserPass , Notes } from './models/Models';

const express = require('express');

const app: Express = express();
const port = 8080;
const jwt = require('jsonwebtoken');

const posts = new Map([
  ["Halo","Halo"],
  ["YOLO","YOLO"],
  ["Cyka", "Cyka"]
]);

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.get('/user', authenticate , (req : Request , res : Response) => {
  const post = posts.get(req.body.username);
  return res.status(200).send(post);
});

app.post('/login', (req: Request, res: Response) => {
  const username = req.body.username;
  const password = req.body.password;
  if(!posts.has(req.body.username)){
    return res.status(401).send("User does not exist");
  }
  const storedPass = posts.get(username);

  if(storedPass!==password){
    return res.status(403).send("Wrong Password");
  }

  const AccessToken = jwt.sign(username, process.env.ACCESS_TOKEN, { expiresIn: '10m' });

  return res.status(200).json({ AccessToken: AccessToken });
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
