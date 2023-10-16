import express from "express";
import cors from "cors";
import { CronJob } from "cron";
import ApiError from "./utils/apiError";
import globalError from "./middlewares/error-middleware";
import setHeaders from "./middlewares/headers-middleware";
import authRouter from "./routes/user.route";
import prisma from "./db/connection";
import registerStrategies from "./utils/functions/registerStrategies";

// Express App
export const app = express();
registerStrategies();
// Middlewares
app.use(express.json());
app.use(setHeaders);
app.use(cors());
app.use("/api/auth", authRouter);

// Routes

app.all("*", (req, res, next) => {
  next(new ApiError(`Can't Find This Route: ${req.originalUrl}`, 404));
});
const checkForExpiredTokens = new CronJob("@hourly", async () => {
  console.log("Checking for expired tokens...");
  const expiredTokens = await prisma.token.findMany({
    where: {
      expiresAt: {
        lte: new Date(),
      },
    },
  });
  if (expiredTokens.length > 0) {
    console.log(`Found ${expiredTokens.length} expired tokens`);
    for (const token of expiredTokens) {
      await prisma.token.delete({
        where: {
          id: token.id,
        },
      });
    }
    console.log("Deleted expired tokens");
  } else {
    console.log("No expired tokens found");
  }
});
app.use(globalError);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server Running on http://localhost:${PORT}`);
  checkForExpiredTokens.start();
});
