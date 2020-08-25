const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	refreshToken: {
		type: String,
		required: true,
	},
	courses: {
		type: Array,
	},
});

const userModel = mongoose.model("USER", userSchema);
module.exports = userModel;
