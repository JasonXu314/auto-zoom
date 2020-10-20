import { useState } from 'react';
import ZoomLink from '../components/ZoomLink/ZoomLink';

const Home: React.FC = () => {
	const [meetings, setMeetings] = useState<Meeting[]>([]);
	const [url, setUrl] = useState<string>('');
	const [hour, setHour] = useState<number>(10);
	const [minute, setMinute] = useState<number>(0);
	const [name, setName] = useState<string>('');

	return (
		<div>
			{meetings.map((meeting, i) => (
				<ZoomLink key={i} {...meeting} />
			))}
			<h4>Name: </h4>
			<input onChange={(evt) => setName(evt.target.value)} value={name} />
			<h4>Url: </h4>
			<input onChange={(evt) => setUrl(evt.target.value)} value={url} />
			<h4>Time: </h4>
			<input type="number" onChange={(evt) => setHour(parseInt(evt.target.value))} value={hour} />:
			<input type="number" onChange={(evt) => setMinute(parseInt(evt.target.value))} value={minute} />
			<br />
			<button
				onClick={() => {
					setMeetings([...meetings, { url, time: { hour, minute }, name }]);
				}}>
				Add Meeting
			</button>
		</div>
	);
};

export default Home;
