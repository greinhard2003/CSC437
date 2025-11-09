import express, { Request, Response } from "express";
import { connect } from "./services/mongo";
import Users from "./services/user-svc";
import users from "./routes/users";

const app = express();
const port = process.env.PORT || 8000;
const staticDir = process.env.STATIC || "public";

connect("Festigoers_Database");

app.use(express.static(staticDir));

app.use(express.json());

app.use("/api/users", users);

app.get("/hello", (req: Request, res: Response) => {
  res.send("Hello, World");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
