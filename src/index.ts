import express from "express";
import {
  checkUser,
  handleSignup,
  handleLogin,
  getSingleNote,
  getAllNotes,
  addNote,
  deleteNote,
} from "./Handlers/handlers";
import authenticate from "./Auth";

const app = express();
const port = 8080;

app.use(express.json());

app.get("/", (_, res) => {
  res.send("Express + TypeScript Server");
});

app.get("/user", authenticate, checkUser);
app.post("/signup", handleSignup);
app.post("/login", handleLogin);
app.get("/notes/:id", authenticate, getSingleNote);
app.get("/notes", authenticate, getAllNotes);
app.post("/notes", authenticate, addNote);
app.delete("/notes/:id", authenticate, deleteNote);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
