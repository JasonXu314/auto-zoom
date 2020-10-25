import { useEffect, useState } from 'react';
import styles from './ZoomLink.module.scss';

interface Props {
	meeting: Meeting;
	del: () => void;
}

const inPast = (minute: number, hour: number) => {
	return new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), hour, minute).valueOf() < Date.now();
};

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const ZoomLink: React.FC<Props> = ({ meeting: { url, time, name }, del }) => {
	const [armed, setArmed] = useState<boolean>(new Date().getDay() === time.weekday && !inPast(time.minute, time.hour));
	const timeString = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), time.hour, time.minute).toLocaleTimeString();

	useEffect(() => {
		const interval = setInterval(() => {
			if (new Date().getDay() === time.weekday && !armed && !inPast(time.minute, time.hour)) {
				setArmed(true);
			}
		}, 60000);

		return () => {
			clearInterval(interval);
		};
	}, [time.weekday, armed]);

	useEffect(() => {
		if (armed) {
			const interval = setInterval(() => {
				if (inPast(time.minute, time.hour)) {
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
		<div className={styles.main}>
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
			<div>
				{name} at {timeString.slice(0, timeString.length - 6) + timeString.slice(timeString.length - 3) + ' '}
				on {weekdays[time.weekday]}
			</div>
			<a className={styles.link} href={url} target="_blank" rel="noreferrer noopener" onClick={() => setArmed(false)}>
				Join Manually
			</a>
			<button className={styles.delete} onClick={() => del()}>
				Delete
			</button>
		</div>
	);
};

export default ZoomLink;
