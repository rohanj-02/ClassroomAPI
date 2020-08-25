import React, { useState, useEffect } from "react";
import { useLocation, withRouter, Link } from "react-router-dom";
import {
	ShoelaceButton,
	ShoelaceCard,
	ShoelaceDrawer,
	ShoelaceIconButton,
	ShoelaceSpinner,
} from "../ShoelaceComponents";
import "./User.css";

function useQuery() {
	return new URLSearchParams(useLocation().search);
}
function User() {
	const query = useQuery();
	const [prompt, setPrompt] = useState(null);
	const [displayCourses, setDisplayCourses] = useState(null);
	const [loading, setLoading] = useState(<ShoelaceSpinner className='loader'></ShoelaceSpinner>);
	// const courses = [
	// 	{
	// 		courseName: "Course1",
	// 		courseSection: "A and B",
	// 		courseLink: "www.something.com",
	// 		courseEnrollmentCode: "abcdef",
	// 	},
	// 	{
	// 		courseName: "Course2",
	// 		courseSection: "A and B",
	// 		courseLink: "www.something.com",
	// 		courseEnrollmentCode: "abcdef",
	// 	},
	// 	{
	// 		courseName: "Course3",
	// 		courseSection: "A and B",
	// 		courseLink: "www.something.com",
	// 		courseEnrollmentCode: "abcdef",
	// 	},
	// 	{
	// 		courseName: "Course4",
	// 		courseSection: "A and B",
	// 		courseLink: "www.something.com",
	// 		courseEnrollmentCode: "abcdef",
	// 	},
	// 	{
	// 		courseName: "Course5",
	// 		courseSection: "A and B",
	// 		courseLink: "www.something.com",
	// 		courseEnrollmentCode: "abcdef",
	// 	},
	// ];
	useEffect(() => {
		// setTimeout(() => {
		// 	setPrompt(() => {
		// 		return (
		// 			<ShoelaceDrawer label={`Hi, there Saatvik`} placement='left' id='drawer1' open={true}>
		// 				<ShoelaceButton
		// 					type='primary'
		// 					slot='footer'
		// 					onClick={() => {
		// 						document.getElementById("drawer1").hide();
		// 					}}
		// 				>
		// 					Close
		// 				</ShoelaceButton>
		// 			</ShoelaceDrawer>
		// 		);
		// 	});
		// 	setLoading(null);
		// 	setDisplayCourses(() => {
		// 		return courses.map((course) => {
		// 			return (
		// 				<ShoelaceCard className='course-card'>
		// 					<div slot='header'>
		// 						{course.courseName}
		// 						<ShoelaceIconButton name='arrow-right-circle'></ShoelaceIconButton>
		// 					</div>
		// 					Section: {course.courseSection}
		// 					<br />
		// 					Link to Classroom: {course.courseLink}
		// 					<br />
		// 					<div slot='footer'>Code: {course.courseEnrollmentCode}</div>
		// 				</ShoelaceCard>
		// 			);
		// 		});
		// 	});
		// }, 5000);
		if (query.get("code")) {
			const code = query.get("code");
			console.log(code);
			const fetchOptions = {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ code: code }),
			};
			fetch("http://localhost:8080/api/auth/user_login", fetchOptions).then(async (res) => {
				if (res.ok) {
					const responseObj = await res.json();
					console.log(responseObj);
					if (responseObj.credentials.new) {
						setPrompt(() => {
							return (
								<ShoelaceDrawer
									label={`Hi, there ${responseObj.credentials.username}`}
									placement='left'
									id='drawer1'
									open={true}
								>
									<ShoelaceButton
										type='primary'
										slot='footer'
										onClick={() => {
											document.getElementById("drawer1").hide();
										}}
									>
										Close
									</ShoelaceButton>
								</ShoelaceDrawer>
							);
						});
						setLoading(null);
					}
					const courses = responseObj.courseArray;
					setDisplayCourses(() => {
						return courses.map((course) => {
							return (
								<ShoelaceCard className='course-card'>
									<div slot='header'>
										{course.courseName}
										<Link to={`/course/${course.courseID}`}>
											<ShoelaceIconButton name='arrow-right-circle'></ShoelaceIconButton>
										</Link>
									</div>
									Section: {course.courseSection}
									<br />
									Link to Classroom: {course.courseLink}
									<br />
									<div slot='footer'>Code: {course.courseEnrollmentCode}</div>
								</ShoelaceCard>
							);
						});
					});
				}
			});
		}
	}, []);
	return (
		<div className='dashboard-container'>
			{loading}
			{prompt}
			{displayCourses}
		</div>
	);
}

export default withRouter(User);

//1//0g5-LiKr9X_5BCgYIARAAGBASNwF-L9IrxQHeg_dvpJbFvRLB5Cga6DDILlW-S-l2Z5MdcGEd7klq0WFFFkhGdkfghIso_8XYuco
