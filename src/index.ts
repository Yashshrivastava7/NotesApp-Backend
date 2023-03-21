require("dotenv").config({ path: "./.env" });
import { Express, Request, Response } from "express";
const express = require("express");
const requestHandlers = require("./Handlers/handlers");
import authenticate from "./Auth";

const app: Express = express();
const port = 8080;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.get("/user", authenticate, requestHandlers.checkUser);
app.post("/signup", requestHandlers.handleSignup);
app.post("/login", requestHandlers.handleLogin);
app.get("/notes/:id", authenticate, requestHandlers.getSingleNote);
app.get("/notes", authenticate, requestHandlers.getAllNotes);
app.post("/notes", authenticate, requestHandlers.addNote);
app.delete("/notes/:id", authenticate, requestHandlers.deleteNote);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
