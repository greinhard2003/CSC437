import express, { Request, Response } from "express";
import { User } from "../models/user";

import Users from "../services/user-svc";

const router = express.Router();

router.get("/", (_, res: Response) => {
  Users.index()
    .then((list: User[]) => res.json(list))
    .catch((err: any) => res.status(500).send(err));
});

router.get("/:username", (req: Request, res: Response) => {
  const { username } = req.params;
  Users.get(username)
    .then((user: User) => res.json(user))
    .catch((err) => res.status(404).send(err));
});

router.post("/", (req: Request, res: Response) => {
  const newUser: User = req.body;

  Users.create(newUser)
    .then((user: User) => res.status(201).json(user))
    .catch((err: any) => {
      if (err?.code === 11000) {
        return res.status(409).send({ error: "Username already exists" });
      }
      return res.status(500).send({ error: err?.message || "Server error" });
    });
});

router.put("/:username", (req, res) => {
  const { username } = req.params;
  const updatedUser: User = req.body;

  if (Object.prototype.hasOwnProperty.call(updatedUser, "username")) {
    return res.status(400).send({ error: "Username cannot be changed." });
  }

  Users.update(username, updatedUser)
    .then((user) => res.json(user))
    .catch((err) =>
      res.status(500).send({ error: err?.message || String(err) })
    );
});

router.delete("/:username", (req: Request, res: Response) => {
  const { username } = req.params;
  Users.remove(username)
    .then(() => res.status(204).send())
    .catch((err) => res.status(500).send(err));
});

export default router;
