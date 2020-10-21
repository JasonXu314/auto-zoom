import { useEffect, useState } from 'react';
import styles from './ZoomLink.module.scss';

interface Props {
	meeting: Meeting;
	del: () => void;
}

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const ZoomLink: React.FC<Props> = ({ meeting: { url, time, name }, del }) => {
	const [armed, setArmed] = useState<boolean>(new Date().getDay() === time.weekday);

	useEffect(() => {
		const interval = setInterval(() => {
			if (new Date().getDay() === time.weekday && !armed) {
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
		<div className={styles.main}>
			<div>
				Meeting {name} at {new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), time.hour, time.minute).toLocaleTimeString()}{' '}
				on {weekdays[time.weekday]}
			</div>
			<a href={url} target="_blank" rel="noreferrer noopener" onClick={() => setArmed(false)}>
				Join Manually
			</a>
			<button className={styles.delete} onClick={() => del()}>
				Delete
			</button>
		</div>
	);
};

export default ZoomLink;
