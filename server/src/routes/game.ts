import { Hono } from "hono";
import authenticateUser from "../middlewares/authenticate-user.js";
import validator from "../middlewares/validator.js";
import {
  GameGuessSchema,
  GetCurrentGameStateParamSchema,
  GetNextDestinationSchema,
} from "../schema/game.js";
import { db } from "../utils/db.js";
import { getCluesFunFactAndTriviaIndices } from "../utils/transformers.js";

const router = new Hono();

router.post("/start", authenticateUser, async (c) => {
  const { email } = c.get("jwtPayload");
  const user = await db.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) {
    return c.json({ success: false, error: "User not found" }, 404);
  }

  await db.gameSession.updateMany({
    where: {
      userId: user.id,
      isActive: true,
    },
    data: {
      isActive: false,
    },
  });

  const numberOfDestinations = await db.destination.count();
  const destination = await db.destination.findFirst({
    skip: Math.floor(Math.random() * numberOfDestinations),
  });

  if (!destination) {
    return c.json({ success: false, error: "Destination not found" }, 404);
  }

  const gameSession = await db.gameSession.create({
    data: {
      user: {
        connect: {
          id: user.id,
        },
      },
    },
  });
  if (!gameSession) {
    return c.json({ success: false, error: "Game session not created" }, 500);
  }

  const game = await db.game.create({
    data: {
      session: {
        connect: {
          id: gameSession.id,
        },
      },
      metadata: getCluesFunFactAndTriviaIndices(destination),
      destination: {
        connect: {
          id: destination.id,
        },
      },
    },
  });

  return c.json({
    success: true,
    message: "Game session created",
    data: {
      gameSession,
    },
  });
});

router.post(
  "/guess",
  authenticateUser,
  validator("json", GameGuessSchema),
  async (c) => {
    const { email } = c.get("jwtPayload");
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return c.json({ success: false, error: "User not found" }, 404);
    }

    const { gameSessionId, gameId, guess } = c.req.valid("json");
    const gameSession = await db.gameSession.findUnique({
      where: {
        id: gameSessionId,
        userId: user.id,
        isActive: true,
      },
    });
    if (!gameSession) {
      return c.json(
        { success: false, error: "Game session not found or inactive" },
        404,
      );
    }

    const game = await db.game.findUnique({
      where: {
        id: gameId,
        sessionId: gameSessionId,
      },
    });
    if (!game) {
      return c.json({ success: false, error: "Game not found" }, 404);
    }

    if (game.guessCount >= 2) {
      return c.json(
        { success: false, error: "Guess limit reached for this game" },
        400,
      );
    }

    if (game.isCorrect) {
      return c.json(
        { success: false, error: "Game already guessed correctly" },
        400,
      );
    }

    const destination = await db.destination.findUnique({
      where: {
        id: game.destinationId,
      },
    });
    if (!destination) {
      return c.json({ success: false, error: "Destination not found" }, 404);
    }

    const isCorrect = destination.name.toLowerCase() === guess.toLowerCase();
    const updatedGame = await db.game.update({
      where: {
        id: gameId,
        sessionId: gameSessionId,
      },
      data: {
        isCorrect,
        guessCount: { increment: 1 },
        guessedAt: new Date(),
      },
    });

    await db.gameSession.update({
      where: {
        id: gameSessionId,
        userId: user.id,
        isActive: true,
      },
      data: {
        score: { increment: isCorrect ? 10 / updatedGame.guessCount : 0 },
      },
    });
    await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        score: { increment: isCorrect ? 10 / updatedGame.guessCount : 0 },
      },
    });

    return c.json({
      success: true,
      message: isCorrect ? "Correct guess" : "Incorrect guess",
      data: {
        gameSession,
        isCorrect,
      },
    });
  },
);

router.post(
  "/next",
  authenticateUser,
  validator("json", GetNextDestinationSchema),
  async (c) => {
    const { email } = c.get("jwtPayload");
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return c.json({ success: false, error: "User not found" }, 404);
    }

    const { gameSessionId } = c.req.valid("json");
    const gameSession = await db.gameSession.findUnique({
      where: {
        id: gameSessionId,
        userId: user.id,
        isActive: true,
      },
    });
    if (!gameSession) {
      return c.json(
        { success: false, error: "Game session not found or inactive" },
        404,
      );
    }

    const numberOfDestinations = await db.destination.count();
    const destination = await db.destination.findFirst({
      skip: Math.floor(Math.random() * numberOfDestinations),
    });

    if (!destination) {
      return c.json({ success: false, error: "Destination not found" }, 404);
    }

    const game = await db.game.create({
      data: {
        session: {
          connect: {
            id: gameSession.id,
          },
        },
        metadata: getCluesFunFactAndTriviaIndices(destination),
        destination: {
          connect: {
            id: destination.id,
          },
        },
      },
    });

    return c.json({
      success: true,
      message: "Next game created",
      data: {
        gameSession,
      },
    });
  },
);

router.get(
  "/current-state/:gameSessionId",
  authenticateUser,
  validator("param", GetCurrentGameStateParamSchema),
  async (c) => {
    const { email } = c.get("jwtPayload");
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return c.json({ success: false, error: "User not found" }, 404);
    }

    const { gameSessionId } = c.req.valid("param");
    const gameSession = await db.gameSession.findFirst({
      where: {
        userId: user.id,
        isActive: true,
        id: gameSessionId,
      },
    });
    if (!gameSession) {
      return c.json(
        { success: false, error: "No active game session found" },
        404,
      );
    }

    const game = await db.game.findFirst({
      where: {
        sessionId: gameSession.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        destination: true,
      },
    });
    if (!game) {
      return c.json({ success: false, error: "No active game found" }, 404);
    }

    const clues =
      game.guessCount >= 1 && !game.isCorrect
        ? game.destination.clues
        : [game.destination.clues[game.metadata.clueIndex]];
    const funFacts =
      game.guessCount >= 1
        ? game.destination.funFacts
        : [game.destination.funFacts[game.metadata.funFactIndex]];
    const trivia =
      game.guessCount >= 1
        ? game.destination.trivia
        : [game.destination.trivia[game.metadata.triviaIndex]];

    return c.json({
      success: true,
      message: "Current game state",
      data: {
        gameSession,
        game: {
          id: game.id,
          guessCount: game.guessCount,
          isCorrect: game.isCorrect,
          canContinue: game.guessCount < 2 && !game.isCorrect,
          clues,
          funFacts,
          trivia,
        },
      },
    });
  },
);

router.post("/end", authenticateUser, async (c) => {
  const { email } = c.get("jwtPayload");
  const user = await db.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) {
    return c.json({ success: false, error: "User not found" }, 404);
  }

  await db.gameSession.updateMany({
    where: {
      userId: user.id,
      isActive: true,
    },
    data: {
      isActive: false,
    },
  });

  return c.json({ success: true, message: "Game session ended" });
});

export default router;
