import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const port = 3000;
const prisma = new PrismaClient();

app.use(express.static("src/public"));
app.use(express.json());

app.get("/profile/random", async (req, res) => {
  let fid = parseInt(req.query.fid, 10);
  if (isNaN(fid) || !fid) {
    fid = 123;
  }
  try {
    const randomUsers = await prisma.$queryRaw`
       SELECT * FROM "User"
       WHERE "fid" != ${parseInt(fid, 10)}
       ORDER BY RANDOM()
       LIMIT 100
     `;
    if (randomUsers.length > 0) {
      res.json(randomUsers);
    } else {
      res.status(404).json({ error: "No other users found." });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/profile", async (req, res) => {
  const { bio, custody, displayName, fid, pfpUrl, username, verifications } =
    req.body;
  try {
    const user = await prisma.user.create({
      data: {
        bio,
        custody,
        displayName,
        fid,
        pfpUrl,
        username,
        verifications,
      },
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
