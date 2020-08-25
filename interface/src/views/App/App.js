import React, { useEffect, useState } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "./App.css";
import User from "../User/User";
import Course from "../Course/Course";
function App() {
	const [url, setUrl] = useState("");
	useEffect(() => {
		fetch("http://localhost:8080/api/auth/get_url").then(async (resp) => {
			if (resp.ok) {
				const res = await resp.json();
				setUrl(res.authURL);
			}
		});
	}, []);
	return (
		<div>
			<a href={url}>
				<sl-button type='default' size='large' circle>
					<sl-icon name='gear'></sl-icon>
				</sl-button>
			</a>
			<BrowserRouter>
				<Switch>
					<Route component={User} path='/user' />
					<Route component={Course} path='/course/:id' />
				</Switch>
			</BrowserRouter>
		</div>
	);
}

export default App;
