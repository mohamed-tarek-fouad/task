import express from "express";
import cors from "cors";
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

app.use(globalError);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server Running on http://localhost:${PORT}`);
});
