import express from "express";
const app = express();
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import { authRoute } from "./routes/index.js";
import { machineRoute } from "./routes/index.js";
import passport from "passport";
import { pst } from "./config/passport.js";
pst(passport);
import cors from "cors";
//const authRoute = require("./routes").auth;

mongoose
  .connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("successfully connect to Mongo atlas");
  })
  .catch((err) => {
    console.log(err);
  });

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//cors
app.use(cors());
//要進入這個path要先去authRoute，/api是之後react要跟server溝通會很好用
app.use("/api/user", authRoute);
//要透過passport驗證後才能到這個/api的route 以確保有權限的人可以新增課程
app.use(
  "/api/machine",
  passport.authenticate("jwt", { session: false }),
  machineRoute
);

app.listen(8080, () => {
  console.log("server listening on 8080");
});
