const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const session = require("express-session");
const cors = require("cors");
const MongoDBStore = require("connect-mongodb-session")(session);
const { user } = require("./models/user");
const jwt = require("jsonwebtoken");
require('dotenv').config();

const port = process.env.PORT || 5000;
const dbUrl = process.env.DATABASE_URL;

const tags = require("./support/tags.js");
const { loginController, logOutController, checkLoginController } = require("./controllers/login.js");
const { SignInController } = require("./controllers/signIn.js");
const { questions } = require("./models/question");
const { constrainedMemory } = require("process");

const app = express();
app.use(express.json());
const store = new MongoDBStore({
  uri: dbUrl,
  collection: "sessions",
});


app.use(
  session({
    secret: "yourSecretKey",
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "Public")));

app.use((req, res, next) => {
  next();
});

const controllers = {};
controllers.addquestion = require("./controllers/addQuestion.js").addquestion;
controllers.questionRenderController =
  require("./controllers/question_render.js").questionRenderController;
controllers.quesSubmitController =
  require("./controllers/judge.js").quesSubmitController;
controllers.customJudge =
  require("./controllers/testCaseRunner.js").customJudge;
controllers.checkLoginController = require("./controllers/login.js").checkLoginController;
controllers.getSubmissionsController = require("./controllers/getSubmissions.js").getSubmissionsController;
controllers.submissionViewController = require("./controllers/getSubmissions.js").submissionViewController;
controllers.getTaggedDataController = require("./controllers/getTaggedData.js").getTaggedDataController;
controllers.runSampleTests = require("./controllers/sampleController.js").sampleTests;

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) return res.json({ message: "Token not found!" });
  try {
    const payload = jwt.verify(token, "SECRET");
    const findUser = await user.findOne({ user: payload.username });

    if (!findUser) {
      return res.json({ message: "User not found!" });
    }
    req.session.user = findUser;
    req.session.isLoggedIn = true;
    next();
  } catch(err) {
    res.json({ message: "Auth failed!" });
  }
};

app.get("/check-middleware", [authMiddleware], (req, res, next) => {
  res.json("Middleware passed");
});


app.post("/addquestion", controllers.addquestion);
app.use("/submissions/:ques?",[authMiddleware],controllers.getSubmissionsController);
app.use("/submission/view/:id",controllers.submissionViewController);
app.use("/submit",[authMiddleware],controllers.quesSubmitController);
app.use("/ques/:quesname",controllers.questionRenderController);
app.use("/testcase",[authMiddleware],controllers.customJudge);
app.use("/tagdata",[authMiddleware],controllers.getTaggedDataController);
app.post("/signin", SignInController);
app.post("/login", loginController);
app.use("/logout",[authMiddleware],logOutController);
app.get("/checklogin",[authMiddleware],checkLoginController);
app.post("/runsample",[authMiddleware],controllers.runSampleTests);
app.get("/gettaglist", (req, res) => {
  res.json({ tags: tags });
});

app.get("/questionlist", async (req, res) => {
  try {
    const result = (await questions.find({}, { name: 1, tags: 1, _id: 0 })).reverse();
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.get("/", (req, res) => {
  console.log("API hit");
  res.json({ msg: "Hi there" });
});


mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
