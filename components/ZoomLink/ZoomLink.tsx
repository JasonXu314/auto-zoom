import { useEffect, useState } from 'react';
import styles from './ZoomLink.module.scss';

interface Props {
	meeting: Meeting;
	del: () => void;
}

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const ZoomLink: React.FC<Props> = ({ meeting: { url, time, name }, del }) => {
	const [armed, setArmed] = useState<boolean>(new Date().getDay() === time.weekday);
	const timeString = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), time.hour, time.minute).toLocaleTimeString();

	useEffect(() => {
		const interval = setInterval(() => {
			const day = new Date().getDate();
			const month = new Date().getMonth();
			const year = new Date().getFullYear();
			const target = new Date(year, month, day, time.hour, time.minute).valueOf();
			const now = Date.now();

			if (new Date().getDay() === time.weekday && !armed && now < target) {
				setArmed(true);
			}
		}, 60000);

		return () => {
			clearInterval(interval);
		};
	}, [time.weekday, armed]);

	useEffect(() => {
		if (armed) {
			const day = new Date().getDate();
			const month = new Date().getMonth();
			const year = new Date().getFullYear();

			const target = new Date(year, month, day, time.hour, time.minute).valueOf();

			const interval = setInterval(() => {
				const now = Date.now();

				if (now > target) {
					const newWindow = window.open(url, '_blank');
					if (!newWindow) {
						alert('Unable to auto-start');
					}
					setArmed(false);
				}
			}, 60000);

			return () => {
				clearInterval(interval);
			};
		}
	}, [armed]);

	return (
		<div className={styles.main + (armed ? ' ' + styles.active : '')}>
			<label className={styles.toggle + (armed ? ' ' + styles.checked : '')}>
				<input
					type="checkbox"
					onClick={() => {
						setArmed(!armed);
					}}
					checked={armed}
				/>
				<span />
			</label>
			<div className={styles.meetingText + (armed ? ' ' + styles.active : '')}>
				Meeting {name} at {timeString.slice(0, timeString.length - 6) + timeString.slice(timeString.length - 3) + ' '}
				on {weekdays[time.weekday]}
			</div>
			<a className={armed ? styles.active : ''} href={url} target="_blank" rel="noreferrer noopener" onClick={() => setArmed(false)}>
				Join Manually
			</a>
			<button className={styles.delete} onClick={() => del()}>
				Delete
			</button>
		</div>
	);
};

export default ZoomLink;
