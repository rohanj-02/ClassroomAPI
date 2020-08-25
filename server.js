require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const { google } = require("googleapis");
const bodyParser = require("body-parser");
const errorHandler = require("errorhandler");
const morgan = require("morgan");
const cors = require("cors");
const authRouter = require("./routers/authRouter");
const PORT = process.env.PORT || 8080;
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(bodyParser());
app.use(morgan("dev"));
mongoose.connect(
	`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@reviewerdb.n4mee.mongodb.net/USERS?retryWrites=true&w=majority`,
	{ useUnifiedTopology: true, useNewUrlParser: true },
	(error) => {
		if (error) {
			console.log("Trouble Connecting to USERS DB", error);
		} else {
			console.log("Connected to USERS DB");
		}
	},
);
app.use("/api", authRouter);
app.use(errorHandler());
app.listen(PORT, () => {
	console.log(`Listening at port ${PORT}`);
});
