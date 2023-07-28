const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");

// Middlewares
const logger = require("./middleware/logger");
const errorHandler = require("./middleware/error");

// Database connect
const connectDB = require("./config/db");

// Loading Env Variables
dotenv.config({ path: "./config/config.env" });


// Routes file
const bootcamps = require("./routes/bootcamps");


// Connect to the database
connectDB();

const app = express();

// If we are in the development mode
if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}

app.use(express.json());

// Mount routers
app.use("/api/v1/bootcamps", bootcamps);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  );
});

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error : ${err.message}`.red);

  //   Close server and exit process
  server.close(() => {
    process.exit(1);
  });
});
