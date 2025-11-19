import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import credentials from "../services/credential-svc";
import usersvc from "../services/user-svc";

const router = express.Router();

dotenv.config();
const TOKEN_SECRET: string = process.env.TOKEN_SECRET || "NOT_A_SECRET";

router.post("/register", (req, res) => {
  const { username, firstname, lastname, favoriteGenre, email, password } =
    req.body;

  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    typeof firstname !== "string" ||
    typeof lastname !== "string" ||
    typeof email !== "string" ||
    typeof favoriteGenre !== "string"
  ) {
    return res.status(400).send("Bad request: Invalid input data.");
  }

  usersvc
    .create({ username, firstname, lastname, email, favoriteGenre })
    .then((user) =>
      credentials
        .create(user._id.toString(), username, password)
        .then((creds) => ({
          userId: creds.userId,
        }))
    )
    .then(({ userId }) =>
      generateAccessToken(userId, username).then((token) => ({ token, userId }))
    )
    .then(({ token, userId }) => res.status(201).send({ token, userId }))
    .catch((err) => {
      console.error("Registration failed:", err);
      res.status(409).send({ error: err.message || "Registration failed" });
    });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Bad request: Invalid input data.");
  }

  credentials
    .verify(username, password)
    .then(({ userId, username }) =>
      generateAccessToken(userId, username).then((token) => ({ token, userId }))
    )
    .then(({ token, userId }) => res.status(200).send({ token, userId }))
    .catch(() => res.status(401).send("Unauthorized"));
});

function generateAccessToken(
  userId: string,
  username: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { userId, username },
      TOKEN_SECRET,
      { expiresIn: "1d" },
      (error, token) => {
        if (error) reject(error);
        else resolve(token as string);
      }
    );
  });
}

export function authenticateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  //Getting the 2nd part of the auth header (the token)
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).end();
  } else {
    jwt.verify(token, TOKEN_SECRET, (error, decoded) => {
      if (decoded) next();
      else res.status(401).end();
    });
  }
}

export default router;
