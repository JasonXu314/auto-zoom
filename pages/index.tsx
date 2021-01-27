import Head from 'next/head';
import { useEffect, useMemo, useState } from 'react';
import ZoomLink from '../components/ZoomLink/ZoomLink';
import styles from '../sass/Index.module.scss';
import { compareDates } from '../utils/utils';

const makeMeeting = (i: number, meeting: Meeting, setMeetings: React.Dispatch<React.SetStateAction<Meeting[]>>, meetings: Meeting[]) => {
	return (
		<ZoomLink
			key={i}
			meeting={meeting}
			del={() => setMeetings(meetings.filter((_, idx) => i !== idx))}
			setArmed={(armed) => {
				setMeetings(meetings.map((prevMeeting, idx) => (idx === i ? { ...prevMeeting, armed } : { ...prevMeeting })));
			}}
			firstChild={i === 0}
		/>
	);
};

const Home: React.FC = () => {
	const [meetings, setMeetings] = useState<Meeting[]>([]);
	const [ampm, setAMPM] = useState<AMPM>('AM');
	const [url, setUrl] = useState<string>('');
	const [hour, setHour] = useState<number>(10);
	const [minute, setMinute] = useState<number>(0);
	const [name, setName] = useState<string>('');
	const [err, setErr] = useState<string>('');
	const [weekday, setWeekday] = useState<number>(new Date().getDay());
	const sortedMeetings = useMemo(() => meetings.sort((ma, mb) => compareDates(ma.time, mb.time)), [meetings]);
	const todayIndex = useMemo(() => sortedMeetings.findIndex((meeting) => meeting.time.weekday !== new Date().getDay()), [sortedMeetings]);
	const tomorrowIndex = useMemo(
		() => sortedMeetings.findIndex((meeting) => meeting.time.weekday > new Date().getDay() + 1 || meeting.time.weekday < new Date().getDay()),
		[sortedMeetings]
	);
	const todayMeetings = useMemo(() => (todayIndex === -1 ? sortedMeetings : sortedMeetings.slice(0, todayIndex)), [sortedMeetings, todayIndex]);
	const tomorrowMeetings = useMemo(
		() => (tomorrowIndex === -1 ? (todayIndex === -1 ? [] : sortedMeetings.slice(todayIndex)) : sortedMeetings.slice(todayIndex, tomorrowIndex)),
		[todayIndex, tomorrowIndex, sortedMeetings]
	);
	const futureMeetings = useMemo(() => (tomorrowIndex === -1 ? [] : sortedMeetings.slice(tomorrowIndex)), [sortedMeetings, tomorrowIndex]);

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
					<div className={styles.row}>
						<select onChange={(evt) => setHour(parseInt(evt.target.value))} value={hour}>
							{new Array(12).fill(null).map((_, i) => (
								<option value={i + 1} key={i}>
									{i + 1}
								</option>
							))}
						</select>
						:
						<select onChange={(evt) => setMinute(parseInt(evt.target.value))} value={minute}>
							{new Array(60).fill(null).map((_, i) => (
								<option value={i} key={i}>
									{i.toString().length < 2 ? '0' + i : i}
								</option>
							))}
						</select>
						<select onChange={(evt) => setAMPM(evt.target.value as AMPM)}>
							<option value="AM">AM</option>
							<option value="PM">PM</option>
						</select>
					</div>
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
								{
									url,
									time: { hour: ampm === 'PM' ? (hour === 12 ? hour : hour + 12) : hour === 12 ? 0 : hour, minute, weekday },
									name,
									armed: true
								}
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
				<div className={styles.list}>
					<h1 className={styles.heading}>Scheduled Zooms</h1>
					<h4>Today</h4>
					{todayMeetings.length !== 0 ? (
						todayMeetings.map((meeting, i) => makeMeeting(i, meeting, setMeetings, meetings))
					) : (
						<h5 className={styles.noMeeting}>No Meetings Today!</h5>
					)}
					<h4>Tomorrow</h4>
					{tomorrowMeetings.length !== 0 ? (
						tomorrowMeetings.map((meeting, i) => makeMeeting(i, meeting, setMeetings, meetings))
					) : (
						<h5 className={styles.noMeeting}>No Meetings Tomorrow!</h5>
					)}
					<h4>Later this Week</h4>
					{futureMeetings.length !== 0 ? (
						futureMeetings.map((meeting, i) => makeMeeting(i, meeting, setMeetings, meetings))
					) : (
						<h5 className={styles.noMeeting}>No Meetings for this week!</h5>
					)}
				</div>
			</div>
		</div>
	);
};

export default Home;
