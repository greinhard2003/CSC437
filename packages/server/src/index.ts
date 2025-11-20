import express, { Request, Response } from "express";
import { connect } from "./services/mongo";
import Users from "./services/user-svc";
import users from "./routes/users";
import Events from "./services/event-svc";
import events from "./routes/events";
import auth, { authenticateUser } from "./routes/auth";
import fs from "node:fs/promises";
import path from "path";

const app = express();
const port = process.env.PORT || 8000;
const staticDir = process.env.STATIC || "public";

connect("Festigoers_Database");

app.use(express.static(staticDir));

app.use(express.json());

app.use("/auth", auth);

app.use("/api/events", authenticateUser, events);

app.use("/api/users", authenticateUser, users);

app.get("/hello", (req: Request, res: Response) => {
  res.send("Hello, World");
});

app.use("/app", (req: Request, res: Response) => {
  const indexHtml = path.resolve(staticDir, "index.html");
  fs.readFile(indexHtml, { encoding: "utf8" }).then((html) => res.send(html));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
