import express from "express";
import cors from "cors";
import {
  checkUser,
  handleSignup,
  handleLogin,
  getSingleNote,
  getAllNotes,
  addNote,
  deleteNote,
  logoutUser,
} from "./Handlers/handlers";
import authenticate from "./Auth";
import cookieParser from "cookie-parser";

const app = express();
const port = 8080;

const corsOptions = {
  origin: true,
  credentials: true,
  optionSuccessStatus: 200,
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.get("/", (_, res) => {
  res.send("Express + TypeScript Server");
});

app.get("/user", authenticate, checkUser);
app.post("/signup", handleSignup);
app.post("/login", handleLogin);
app.get("/logout", authenticate, logoutUser);
app.get("/notes/:id", authenticate, getSingleNote);
app.get("/notes", authenticate, getAllNotes);
app.post("/notes", authenticate, addNote);
app.delete("/notes/:id", authenticate, deleteNote);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
