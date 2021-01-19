import { useEffect } from 'react';
import styles from './ZoomLink.module.scss';

interface Props {
	meeting: Meeting;
	del: () => void;
	setArmed: (armed: boolean) => void;
	firstChild: boolean;
}

function closeEnough(target: Time): boolean {
	const now = new Date();
	return now.getDay() === target.weekday && now.getHours() === target.hour && now.getMinutes() === target.minute;
}

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const ZoomLink: React.FC<Props> = ({ meeting: { url, time, name, armed }, del, setArmed, firstChild }) => {
	const timeString = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), time.hour, time.minute).toLocaleTimeString();

	useEffect(() => {
		if (armed) {
			const interval = setInterval(() => {
				if (closeEnough(time)) {
					const newWindow = window.open(url, '_blank');
					if (!newWindow) {
						alert(`Unable to auto-start meeting ${name}`);
					}
				}
			}, 60000);

			return () => {
				clearInterval(interval);
			};
		}
	}, [armed]);

	return (
		<div className={styles.main + (firstChild ? '' : ' ' + styles.notFirst)}>
			<label className={styles.toggle + (armed ? ' ' + styles.checked : '')}>
				<input
					type="checkbox"
					onChange={() => {
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
