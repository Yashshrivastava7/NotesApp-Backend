require('dotenv').config({path:'./.env'});
import { Express, Request, Response } from 'express';

const express = require('express');

const app: Express = express();
const port = 8080;
const jwt = require('jsonwebtoken');

type Post = {
  username: string;
  title: string;
}

const posts : Post[] = [
  {
    username: 'Halo',
    title: 'Post 1'
  },
  {
    username: 'YOLO',
    title: 'Post 2'
  }
]

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.get('/user', authenticate , (req : Request , res : Response) => {
  const post : Post[] = posts.filter(old => old.username === req.body.username);
  return res.status(200).send(post);
})

app.post('/login', (req: Request, res: Response) => {
  const username = req.body.username ;
  const user = { name: username};

  const AccessToken = jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: '35s' });

  res.json({ AccessToken: AccessToken });
});

app.post('/notes', authenticate , (req: Request, res: Response) => {

});

app.get('/notes/:user', authenticate , (req: Request, res: Response) => {

});

function authenticate(req : Request, res : Response, next) {
  const authHeader = req.headers['authorization'];
  const token : string = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
    console.log(err)
    if (err) return res.sendStatus(403)
    next()
  })
}

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
