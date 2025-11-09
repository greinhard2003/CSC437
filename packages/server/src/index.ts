import express, { Request, Response } from "express";
import { connect } from "./services/mongo";
import Users from "./services/user-svc";

const app = express();
const port = process.env.PORT || 5173;
const staticDir = process.env.STATIC || "public";

connect("Festigoers_Database");

app.use(express.static(staticDir));

app.get("/hello", (req: Request, res: Response) => {
  res.send("Hello, World");
});

app.get("/users/:userid", (req: Request, res: Response) => {
  const { userid } = req.params;
  Users.get(userid).then((data) => {
    if (data) {
      res.set("Content-Type", "application/json").send(JSON.stringify(data));
    } else {
      res.status(404).send();
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
