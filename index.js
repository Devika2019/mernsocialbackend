const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const postsRouter = require("./routes/posts");
const multer = require("multer");
const path = require("path");


dotenv.config();
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to Mongo");
    app.listen(8800, () => {
      console.log("Backend server is ready");
    });
  })
  .catch(error => {
    console.error("Error connecting to MongoDB:", error);
  });
  app.use("/images", express.static(path.join(__dirname, "public/images")));
  //middleware
  app.use(express.json());
  app.use(helmet());
  app.use(morgan("common"));
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/images");
    },
    filename: (req, file, cb) => {
      cb(null, req.body.name);
    },
  });
  
  const upload = multer({ storage: storage });
  app.post("/api/upload", upload.single("file"), (req, res) => {
    try {
      return res.status(200).json("File uploded successfully");
    } catch (error) {
      console.error(error);
    }
  });
  
  app.use("/api/users", userRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/posts", postsRouter);
  app.get("/",(req,res)=>{
    res.send("Welcome homepage");
  })
  
  app.get("/users",(req,res)=>{
    res.send("Welcome to users");
  })