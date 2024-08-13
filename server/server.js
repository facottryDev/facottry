import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import morgan from "morgan";
import helmet from "helmet";
import authRouter from "./router/authRouter.js";
import adminRouter from "./router/adminRouter.js";
import configRouter from "./router/configRouter.js";
import scaleRouter from "./router/scaleRouter.js";
import { createClient } from "redis";
import RedisStore from "connect-redis";
import session from "express-session";
import passport from "passport";
import GoogleStrategy from "passport-google-oauth2";
import User from "./models/auth/user.js";
import { archiveCronJob } from "./lib/cron.js";

// Const declarations
dotenv.config();
const app = express();
const PORT = process.env.PORT;

// Configure Redis Client
export const redisClient = createClient({
  url: process.env.REDIS_URL
});
redisClient.connect().then(console.log(
  "Connected to Redis"
)).catch(console.error);

// Middlewares
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? [
          "http://localhost:3000",
          "http://localhost:3001",
          "http://localhost:8000",
          "http://localhost:5173",
          "http://localhost:5500",
          "https://facottrywebsite.vercel.app",
          "https://facottry-analytics.onrender.com",
          "https://client-sdk.vercel.app",
          "https://facottry-netflix.vercel.app",
          "https://facottry-hotstar.vercel.app",
          "https://facottry-ecommerce.vercel.app",
          "https://facottry-streamo.onrender.com",
          "https://facottry-landing-site.web.app",
          "https://facottry-zee5.onrender.com",
        ]
      : [
          "http://localhost:3000",
          "http://localhost:3001",
          "http://localhost:5173",
          "http://localhost:8000",
          "http://localhost:5500",
        ],
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

if (process.env.NODE_ENV === "production") app.set("trust proxy", 1);
app.use(express.json());
app.use(morgan("tiny"));
app.use(helmet());

app.use(
  session({
    store: new RedisStore({
      client: redisClient,
    }),
    credentials: true,
    name: "sid",
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESS_SECRET,
    cookie: {
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      httpOnly: true,
      expires: null,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },
    async function (request, accessToken, refreshToken, profile, done) {
      try {
        const user = await User.findOne({ email: profile.email });

        if (user) {
          return done(null, user);
        }

        const newUser = new User({
          googleId: profile.id,
          email: profile.email,
          name: profile.displayName,
          profilePic: profile.picture,
        });

        await newUser.save();
        return done(null, newUser);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// MongoDB Connection
mongoose
  .connect(process.env.MONG_URI)
  .then(
    app.listen(PORT, () => {
      console.log("Connected to MongoDB");
      archiveCronJob();
      if (process.env.NODE_ENV === "production") {
        console.log("Production Ready");
      } else {
        console.log(`Server: http://localhost:${PORT}`);
      }
    })
  )
  .catch((err) => {
    console.log(err);
  });

// Routes
app.get("/", (req, res) => {
  // const secret = crypto.randomBytes(32).toString('hex');
  // console.log(secret);
  return res.send("FacOTTry Backend");
});

app.use("/auth", authRouter);
app.use("/admin", adminRouter);
app.use("/config", configRouter);
app.use("/scale", scaleRouter);
