import bcrypt from "bcrypt";
import { Hono } from "hono";
import authenticateUser from "../middlewares/authenticate-user.js";
import validator from "../middlewares/validator.js";
import {
  AcceptChallengeSchema,
  CreateChallengeSchema,
  GetChallengeSchema,
} from "../schema/challenge.js";
import { db } from "../utils/db.js";

const router = new Hono();

router.post(
  "/create",
  authenticateUser,
  validator("json", CreateChallengeSchema),
  async (c) => {
    const { email: creatorEmail } = c.get("jwtPayload");
    const creator = await db.user.findUnique({
      where: {
        email: creatorEmail,
      },
    });

    if (!creator) {
      return c.json({ success: false, error: "User not found" }, 404);
    }

    const { email: playerEmail } = c.req.valid("json");
    let player = await db.user.findUnique({
      where: {
        email: playerEmail,
      },
    });
    if (!player) {
      player = await db.user.create({
        data: {
          email: playerEmail,
        },
      });
    }

    const existingChallenge = await db.challenge.findFirst({
      where: {
        OR: [
          { creatorId: creator.id, playerId: player.id },
          { creatorId: player.id, playerId: creator.id },
        ],
      },
    });

    if (existingChallenge) {
      return c.json({
        success: true,
        message: "Challenge already exists",
        data: existingChallenge,
      });
    }

    const challenge = await db.challenge.create({
      data: {
        creator: {
          connect: {
            id: creator.id,
          },
        },
        player: {
          connect: {
            id: player.id,
          },
        },
      },
    });

    return c.json({
      success: true,
      message: "Challenge created",
      data: challenge,
    });
  },
);

router.get(
  "/:challengeId",
  validator("param", GetChallengeSchema),
  async (c) => {
    const { challengeId } = c.req.valid("param");

    const challenge = await db.challenge.findUnique({
      where: {
        id: challengeId,
      },
      include: {
        creator: {
          select: {
            email: true,
            score: true,
          },
        },
        player: {
          select: {
            email: true,
            score: true,
            password: true,
          },
        },
      },
    });

    if (!challenge) {
      return c.json({ success: false, error: "Challenge not found" }, 404);
    }

    return c.json({
      success: true,
      data: {
        ...challenge,
        player: {
          ...challenge.player,
          requirePasswordChange: !challenge.player?.password,
          password: undefined,
        },
      },
    });
  },
);

router.post("/accept", validator("json", AcceptChallengeSchema), async (c) => {
  const { challengeId, email, password } = c.req.valid("json");
  const player = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (!player) {
    return c.json({ success: false, error: "User not found" }, 404);
  }

  if (!player.password) {
    if (!password) {
      return c.json(
        { success: false, error: "Password is required to accept challenge" },
        400,
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.user.update({
      where: {
        id: player.id,
      },
      data: {
        password: hashedPassword,
      },
    });
  }

  const challenge = await db.challenge.findUnique({
    where: {
      id: challengeId,
    },
  });

  if (!challenge) {
    return c.json({ success: false, error: "Challenge not found" }, 404);
  }

  await db.challenge.update({
    where: {
      id: challengeId,
    },
    data: {
      isAccepted: true,
    },
  });

  return c.json({ success: true, message: "Challenge accepted" });
});

export default router;
