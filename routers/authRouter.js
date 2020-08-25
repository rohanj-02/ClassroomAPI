const express = require("express");
const { google } = require("googleapis");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const authRouter = express.Router();
const googleConfig = {
	clientId: process.env.GOOGLE_AUTH_CLIENT_ID,
	clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
	redirect: process.env.GOOGLE_AUTH_REDIRECT_URI,
};
const defaultScope = [
	"https://www.googleapis.com/auth/userinfo.email",
	"https://www.googleapis.com/auth/userinfo.profile",
	"https://www.googleapis.com/auth/classroom.courses.readonly",
	"https://www.googleapis.com/auth/classroom.coursework.me.readonly",
];
const oauth2Client = new google.auth.OAuth2(
	googleConfig.clientId,
	googleConfig.clientSecret,
	googleConfig.redirect,
);
google.options({
	auth: oauth2Client,
});
authRouter.get("/auth/get_url", async (req, res, next) => {
	const url = await oauth2Client.generateAuthUrl({
		access_type: "offline",
		scope: defaultScope,
		prompt: "consent",
	});
	res.status(200).send({ authURL: url });
});
authRouter.post("/auth/user_login", async (req, res, next) => {
	const code = req.body.code;
	const { tokens } = await oauth2Client.getToken(code);
	oauth2Client.setCredentials(tokens);
	const payload = jwt.decode(tokens.id_token);
	const email = payload.email;
	const username = payload.name;
	const classroom = google.classroom({ version: "v1", auth: oauth2Client });
	let courses = (await classroom.courses.list()).data.courses;

	courses = courses.filter((course) => {
		return course.courseState === "ACTIVE";
	});
	const coursesForDB = courses.map((course) => {
		return {
			courseID: course.id,
			courseName: course.name,
		};
	});
	userModel.find({ email: email }, (err, docs) => {
		if (err) {
			res.send(500);
		} else if (docs[0]) {
			const refresh_token = docs[0].refreshToken;
			console.log(tokens);
		} else {
			const newUser = new userModel({
				email: email,
				username: username,
				courses: coursesForDB,
				refreshToken: tokens.refresh_token,
			});
			newUser.save((err, result) => {
				if (err) {
					res.send(500);
				} else {
					courses = courses.map((course) => {
						return {
							courseID: course.id,
							courseName: course.name,
							courseSection: course.section,
							courseEnrollmentCode: course.enrollmentCode,
							courseLink: course.alternateLink,
						};
					});
					res.status(200).send({
						credentials: { email: email, username: username, new: true },
						courseArray: courses,
					});
				}
			});
		}
	});
});
authRouter.post("/auth/get_coursework", async (req, res, next) => {
	const classroom = google.classroom({ version: "v1", auth: oauth2Client });
	const courseworkList = await (
		await classroom.courses.courseWork.list({
			courseId: req.body.courseID,
			fields: "courseWork(id,title,description,maxPoints)",
		})
	).data["courseWork"];
	const finalList = [];
	for (let i = 0; i < courseworkList.length; i++) {
		const obj = await (
			await classroom.courses.courseWork.studentSubmissions.list({
				courseId: req.body.courseID,
				courseWorkId: courseworkList[i].id,
				userId: "me",
				states: "RETURNED",
				fields: "studentSubmissions(assignedGrade,late)",
			})
		).data.studentSubmissions;
		if (obj) {
			res.write(
				JSON.stringify({
					gradeList: {
						courseWorkID: courseworkList[i].id,
						courseWorkTitle: courseworkList[i].title,
						courseWorkMax: courseworkList[i].maxPoints,
						courseWorkDescription: courseworkList[i].description,
						courseWorkGrade: obj[0].assignedGrade,
						courseWorkLate: obj[0].late,
					},
				}),
			);
			console.log("Done");
		}
	}
	res.end();
	// console.log(finalList);
	// res.send({ gradeList: await finalList });
});
module.exports = authRouter;
