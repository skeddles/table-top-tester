import { Link } from 'react-router-dom';
import '../styles/Home.css';

interface HomeProps {

}

export default function Home({}: HomeProps) {
	return (<div className="Home">
	 	<div>
			<h1>Tabletop Playtester</h1>
			<p>Welcome to the Tabletop Playtester application!</p>
			<Link to="/table">Start New Table</Link>
		</div>
	</div>);
}