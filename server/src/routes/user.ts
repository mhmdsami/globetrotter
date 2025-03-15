import bcrypt from "bcrypt";
import { Hono } from "hono";
import { sign } from "hono/jwt";
import authenticateUser from "../middlewares/authenticate-user.js";
import validator from "../middlewares/validator.js";
import {
  CreateUserSchema,
  SignInUserSchema,
  UpdateUserSchema,
} from "../schema/user.js";
import { JWT_SECRET } from "../utils/config.js";
import { db } from "../utils/db.js";

const router = new Hono();

router.post("/create", validator("json", CreateUserSchema), async (c) => {
  const { email, username, password } = c.req.valid("json");

  const doesUserExist = await db.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });
  if (doesUserExist) {
    return c.json(
      {
        success: false,
        message: "User with this email or username already exists",
      },
      400,
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const createdUser = await db.user.create({
    data: {
      email,
      username,
      password: hashedPassword,
    },
    select: {
      email: true,
      username: true,
      score: true,
    },
  });
  if (!createdUser) {
    return c.json({ success: false, error: "Failed to create user" }, 500);
  }

  const token = await sign(
    {
      email: createdUser.email,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
    },
    JWT_SECRET,
  );

  return c.json(
    {
      success: true,
      message: "User created",
      data: {
        token,
        user: createdUser,
      },
    },
    201,
  );
});

router.post("/sign-in", validator("json", SignInUserSchema), async (c) => {
  const { email, password } = c.req.valid("json");

  const user = await db.user.findFirst({
    where: {
      email,
    },
  });
  if (!user) {
    return c.json({ success: false, error: "User not found" }, 404);
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return c.json({ success: false, error: "Invalid password" }, 401);
  }

  const token = await sign(
    {
      email: user.email,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
    },
    JWT_SECRET,
  );

  return c.json(
    {
      success: true,
      message: "User signed in",
      data: {
        token,
        user: {
          email: user.email,
          username: user.username,
          score: user.score,
        },
      },
    },
    200,
  );
});

router.get("/me", authenticateUser, async (c) => {
  const { email } = c.get("jwtPayload");

  const user = await db.user.findFirst({
    where: {
      email,
    },
    select: {
      id: true,
      email: true,
      username: true,
      score: true,
    },
  });
  if (!user) {
    return c.json({ success: false, error: "User not found" }, 404);
  }

  const gameSessions = await db.gameSession.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return c.json(
    {
      success: true,
      data: {
        user,
        gameSessions,
      },
    },
    200,
  );
});

router.patch(
  "/",
  authenticateUser,
  validator("json", UpdateUserSchema),
  async (c) => {
    const { email } = c.get("jwtPayload");
    const { username, password } = c.req.valid("json");

    const doesUserExist = await db.user.findFirst({
      where: {
        email,
      },
    });
    if (!doesUserExist) {
      return c.json({ success: false, error: "User not found" }, 404);
    }

    const updatedUser = await db.user.update({
      where: {
        email,
      },
      data: {
        username,
        password: password ? await bcrypt.hash(password, 10) : undefined,
      },
      select: {
        email: true,
        username: true,
        score: true,
      },
    });
    if (!updatedUser) {
      return c.json({ success: false, error: "Failed to update user" }, 500);
    }

    return c.json(
      {
        success: true,
        message: "User updated",
        data: {
          user: updatedUser,
        },
      },
      200,
    );
  },
);

export default router;
