import express, { Request, Response } from "express";
import { Event } from "../models/event";
import Events from "../services/event-svc";
import { isValidObjectId } from "mongoose";

const router = express.Router();

router.get("/", (_: Request, res: Response) => {
  Events.index()
    .then((list: Event[]) => res.json(list))
    .catch((err: any) =>
      res.status(500).send({ error: err?.message || "Server error" })
    );
});

router.get("/:userid", (req: Request, res: Response) => {
  const { userid } = req.params;

  Events.get(userid)
    .then((events: Event[]) => res.json(events))
    .catch((err) =>
      res.status(404).send({ error: err?.message || String(err) })
    );
});

router.post("/", (req: Request, res: Response) => {
  const newEvent: Event = req.body;

  Events.create(newEvent)
    .then((event: Event) => res.status(201).json(event))
    .catch((err: any) => {
      return res.status(500).send({ error: err?.message || "Server error" });
    });
});

router.put("/:id", (req: Request, res: Response) => {
  const { userid } = req.params;
  const updatedEvent = req.body;

  Events.update(userid, updatedEvent)
    .then((event: Event) => res.json(event))
    .catch((err) => res.status(404).send(err));
});

router.delete("/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).send({ error: "Invalid user id format" });
  }

  Events.remove(id)
    .then(() => res.status(204).send())
    .catch((err: any) =>
      res.status(500).send({ error: err?.message || "Server error" })
    );
});

export default router;
