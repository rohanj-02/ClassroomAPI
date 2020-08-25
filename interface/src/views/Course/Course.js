import React, { useEffect, useState } from "react";
import "./Course.css";
import { ShoelaceSpinner, ShoelaceCard } from "../ShoelaceComponents";
import { useParams } from "react-router-dom";
function Course() {
	const { id } = useParams();
	const [courseWorkArray, setCourseWorkArray] = useState(null);
	const [loading, setLoading] = useState(<ShoelaceSpinner className='loader'></ShoelaceSpinner>);
	useEffect(() => {
		const fetchOptions = {
			method: "POST",
			headers: {
				"Content-Type": "Application/json",
			},
			body: JSON.stringify({ courseID: id }),
		};
		fetch("http://localhost:8080/api/auth/get_coursework", fetchOptions).then(async (response) => {
			if (response.ok) {
				const jsonResponse = await response.json();
				const gradeList = jsonResponse.gradeList;
				console.log(gradeList);
				setLoading(null);
				setCourseWorkArray(() => {
					return gradeList.map((grade) => {
						return (
							<ShoelaceCard className='course-card'>
								<div slot='header'>
									{grade.courseWorkTitle}
									<br />
									{grade.courseWorkDescription}
								</div>
								Grade: {grade.courseWorkGrade} / {grade.courseWorkMax}
								<div slot='footer'>Submitted : {grade.courseWorkLate ? "Late" : "On-Time"}</div>
							</ShoelaceCard>
						);
					});
				});
			}
		});
	}, []);
	return (
		<div>
			{loading}
			{courseWorkArray}
		</div>
	);
}

export default Course;
