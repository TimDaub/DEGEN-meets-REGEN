import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const port = 3000;
const prisma = new PrismaClient();

app.use(express.static("src/public"));
app.use(express.json());

app.get("/profile/leaderboard/:fid", async (req, res) => {
  const { fid } = req.params;
  try {
    let stats = await prisma.$queryRaw`
            SELECT u."pfpUrl", u."displayName", u."username",
               SUM(CASE WHEN m.liked = true THEN 1 ELSE 0 END) AS likes,
               SUM(CASE WHEN m.liked = false THEN 1 ELSE 0 END) AS dislikes,
               (SUM(CASE WHEN m.liked = true THEN 1 ELSE 0 END) + SUM(CASE WHEN m.liked = false THEN 1 ELSE 0 END)) AS total
        FROM "User" u
        JOIN "Match" m ON u.fid = m."user2Fid"
        GROUP BY u."pfpUrl", u."displayName", u."username"
        ORDER BY likes DESC
        LIMIT 50

     `;
    stats = stats.map((stat) => ({
      ...stat,
      likes: Number(stat.likes),
      dislikes: Number(stat.dislikes),
      total: Number(stat.total),
    }));
    if (stats.length > 0) {
      res.json(stats);
    } else {
      res
        .status(404)
        .json({ error: "User not found or no likes/dislikes data." });
    }
  } catch (error) {
    console.log("unexpected error", error);
    res.status(400).json({ error: error.message });
  }
});

app.get("/profile/stats/:fid", async (req, res) => {
  const { fid } = req.params;
  try {
    let stats = await prisma.$queryRaw`
       SELECT u."pfpUrl", u."displayName",
              SUM(CASE WHEN m.liked = true THEN 1 ELSE 0 END) AS likes,
              SUM(CASE WHEN m.liked = false THEN 1 ELSE 0 END) AS dislikes
       FROM "User" u
       JOIN "Match" m ON u.fid = m."user2Fid"
       WHERE u.fid = ${parseInt(fid, 10)}
       GROUP BY u."pfpUrl", u."displayName"
     `;
    stats = stats.map((stat) => ({
      ...stat,
      likes: Number(stat.likes),
      dislikes: Number(stat.dislikes),
    }));
    if (stats.length > 0) {
      res.json(stats[0]);
    } else {
      res
        .status(404)
        .json({ error: "User not found or no likes/dislikes data." });
    }
  } catch (error) {
    console.log("unexpected error", error);
    res.status(400).json({ error: error.message });
  }
});

app.post("/match", async (req, res) => {
  const { matcherFid, matcheeFid, match } = req.body;

  if (typeof match !== "boolean") {
    return res.status(400).json({ error: "Match must be a boolean." });
  }

  try {
    const newMatch = await prisma.match.create({
      data: {
        user1Fid: matcherFid,
        user2Fid: matcheeFid,
        liked: match,
      },
    });
    return res.status(201).json(newMatch);

    res.status(200).json({ message: "Action processed." });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/profile/random", async (req, res) => {
  let fid = parseInt(req.query.fid, 10);
  if (isNaN(fid) || !fid) {
    fid = 123;
  }
  try {
    const randomUsers = await prisma.$queryRaw`
       SELECT * FROM "User"
       WHERE "fid" != ${fid}
       AND "fid" NOT IN (
         SELECT "user2Fid" FROM "Match" WHERE "user1Fid" = ${fid}
       )
       ORDER BY RANDOM()
       LIMIT 5
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
  let user;
  try {
    user = await prisma.user.upsert({
      create: {
        bio,
        custody,
        displayName,
        fid,
        pfpUrl,
        username,
        verifications,
      },
      update: {},
      where: { fid },
    });
  } catch (error) {
    //nop
  }
  res.status(201).json(user);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
