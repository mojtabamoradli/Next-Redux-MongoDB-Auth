import express from "express";
import dotenv from "dotenv";
import { workoutsRouter } from "./routes/workouts.js";
import { emailRouter } from "./routes/email.js";
import { smsRouter } from "./routes/sms.js";
import { usersRouter } from "./routes/users.js";
import mongoose from "mongoose";

const app = express();

dotenv.config();

app.use(express.json());

app.use((request, response, next) => {
  console.log(request.path, request.method);
  next();
});

// routes
app.use(emailRouter);
app.use(smsRouter);
app.use(workoutsRouter);
app.use(usersRouter);

mongoose
  .connect(process.env.MONGODB_ATLAS_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Connected to DB & Server is listening on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
