require('dotenv').config({path:'./.env'});
import { Express, Request, Response } from 'express';
const jwt = require('jsonwebtoken');

declare module 'express' {
  export interface Request {
    username?: string
  }
}

export default function authenticate(req : Request, res : Response, next) {
	const authHeader = req.headers['authorization'];
	const token : string = authHeader && authHeader.split(' ')[1];
	if (token == null) return res.sendStatus(401)

	jwt.verify(token, process.env.ACCESS_TOKEN, (err, data) => {
		if (err) return res.sendStatus(403)
		req.username = data.username;
		next()
	})
}