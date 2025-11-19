import express, { Request, Response } from "express";
import { User } from "../models/user";
import Users from "../services/user-svc";
import { isValidObjectId } from "mongoose";

const router = express.Router();


router.get("/", (_: Request, res: Response) => {
  Users.index()
    .then((list: User[]) => res.json(list))
    .catch((err: any) => res.status(500).send({ error: err?.message || "Server error" }));
});


router.get("/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).send({ error: "Invalid user id format" });
  }

  Users.get(id)
    .then((user: User) => res.json(user))
    .catch((err) => res.status(404).send({ error: err?.message || String(err) }));
});


router.post("/", (req: Request, res: Response) => {
  const newUser: User = req.body;

  Users.create(newUser)
    .then((user: User) => res.status(201).json(user))
    .catch((err: any) => {
      if (err?.code === 11000) {
        return res.status(409).send({ error: "Duplicate key: a user with that value already exists" });
      }
      return res.status(500).send({ error: err?.message || "Server error" });
    });
});

router.put("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedUser = req.body;

  Users
    .update(id, updatedUser)
    .then((user: User) => res.json(user))
    .catch((err) => res.status(404).send(err));
});

router.delete("/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).send({ error: "Invalid user id format" });
  }

  Users.remove(id)
    .then(() => res.status(204).send())
    .catch((err: any) => res.status(500).send({ error: err?.message || "Server error" }));
});

export default router;
