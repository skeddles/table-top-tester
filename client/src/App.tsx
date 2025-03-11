import { useState } from 'react';
import { FC } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Layout from './Layout';
import Home from './pages/Home';
import Client from './pages/Client';

const App:FC = () => {

    return (<Router>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route index element={<Home/>} />
					<Route path="/table" element={<Client />} />
				</Route>
			</Routes>
	</Router>);
};

export default App;