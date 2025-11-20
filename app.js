const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./db.js");
const router = require("./routes/route.js");
const cors = require("cors");

connectDB();

const app = express();

let corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5175",
    "https://nearpay-frontend-machine-task-mwsk4lumq.vercel.app",
  ],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// app.use(express.static(path.join(__dirname, "public")));

app.use("/", router);

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});
