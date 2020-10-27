import Head from 'next/head';
import { useEffect, useState } from 'react';
import ZoomLink from '../components/ZoomLink/ZoomLink';
import styles from '../sass/Index.module.scss';

const Home: React.FC = () => {
	const [meetings, setMeetings] = useState<Meeting[]>([]);
	const [ampm, setAMPM] = useState<AMPM>('AM');
	const [url, setUrl] = useState<string>('');
	const [hour, setHour] = useState<number>(10);
	const [minute, setMinute] = useState<number>(0);
	const [name, setName] = useState<string>('');
	const [err, setErr] = useState<string>('');
	const [weekday, setWeekday] = useState<number>(new Date().getDay());

	useEffect(() => {
		setMeetings(JSON.parse(localStorage.getItem('meetings') || '[]') as Meeting[]);
	}, []);

	useEffect(() => {
		localStorage.setItem('meetings', JSON.stringify(meetings));
	}, [meetings]);

	return (
		<div className={styles.main}>
			<Head>
				<title>Auto-Zoom</title>
			</Head>
			<div className={styles.form}>
				<h2 className={styles.formHeader}>New Meeting</h2>
				<div className={styles.field}>
					<h4 className={styles.label}>Name</h4>
					<input className={styles.input} onChange={(evt) => setName(evt.target.value)} value={name} />
				</div>
				<div className={styles.field}>
					<h4 className={styles.label}>Url</h4>
					<input className={styles.input} onChange={(evt) => setUrl(evt.target.value)} value={url} />
				</div>
				<h4 className={styles.label}>Time</h4>
				<div className={styles.time}>
					<input
						type="number"
						className={`${styles.num} ${styles.input}`}
						min={1}
						max={12}
						onChange={(evt) => setHour(parseInt(evt.target.value))}
						value={hour}
					/>
					:
					<input
						type="number"
						className={`${styles.num} ${styles.input}`}
						min={0}
						max={59}
						onChange={(evt) => setMinute(parseInt(evt.target.value))}
						value={minute}
					/>
					<select
						className={styles.AMPM}
						onChange={(evt) => {
							setAMPM(evt.target.value as AMPM);
						}}
						value={ampm}>
						<option value="AM">AM</option>
						<option value="PM">PM</option>
					</select>
					<h4> on </h4>
					<select
						className={styles.weekday}
						onChange={(evt) => {
							setWeekday(parseInt(evt.target.value));
						}}
						value={weekday}>
						<option value={0}>Sunday</option>
						<option value={1}>Monday</option>
						<option value={2}>Tuesday</option>
						<option value={3}>Wednesday</option>
						<option value={4}>Thursday</option>
						<option value={5}>Friday</option>
						<option value={6}>Saturday</option>
					</select>
				</div>
				<div className={styles.err}>{err}</div>
				<button
					className={styles.newMeeting}
					onClick={() => {
						if (name !== '' && url !== '') {
							setMeetings([
								...meetings,
								{ url, time: { hour: ampm === 'PM' ? (hour === 12 ? hour : hour + 12) : hour === 12 ? 0 : hour, minute, weekday }, name }
							]);
							setName('');
							setUrl('');
							setHour(10);
							setMinute(0);
							setWeekday(new Date().getDay());
							setErr('');
						} else {
							setErr('You must include both a name and a Zoom URL');
						}
					}}>
					Add Meeting
				</button>
			</div>
			<div className={styles.list}>
				<h1 className={styles.heading}>Scheduled Zooms</h1>
				<div className={styles.labels}>
					<div>Active</div>
					<div>Details</div>
					<div>Link</div>
					<div>Delete</div>
				</div>
				{meetings.map((meeting, i) => (
					<ZoomLink key={i} meeting={meeting} del={() => setMeetings(meetings.filter((_, idx) => i !== idx))} />
				))}
			</div>
		</div>
	);
};

export default Home;
