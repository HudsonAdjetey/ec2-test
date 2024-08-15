const express = require("express");
require("dotenv").config();

const path = require("path");
const PORT = process.env.PORT || 5091;
const CORS = require("cors");
const corsOptions = require("./config/corsOptions");

const AuthRouter = require("./router/authRouter");
const CourseRouter = require("./router/courseRouter");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const { connDB } = require("./config/dbConfig");

const cookieParser = require("cookie-parser");

connDB();

const app = express();
app.use(CORS(corsOptions));

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  next();
});

app.use(cookieParser());

app.use(express.json());

app.use("/api/auth", AuthRouter);
app.use("/api/course", CourseRouter);

app.use(express.static(path.join(__dirname, "./public")));
console.log(path.join(__dirname, "./public"));

if (process.env.NODE_ENV == "development") {
  app.all("*", (req, res) => {
    res.status(404);
    if (req.accepts("html")) {
      return res.sendFile(path.join(__dirname, "views", "404.html"));
    } else if (req.accepts("json")) {
      return res.json({ error: "Not found" });
    } else {
      return res.type("txt" || "text").send("Not found");
    }
  });
}

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, "0.0.0.0", () => {
  if (process.env.NODE_ENV == "development") {
    console.log(`Server running on Port ${PORT}`);
  } else if (process.env.NODE_ENV == "production") {
    console.log("Server has started");
  }
});
