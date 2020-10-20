import { useEffect } from 'react';

const ZoomLink: React.FC<Meeting> = ({ url, time, name }) => {
	useEffect(() => {
		const day = new Date().getDate();
		const month = new Date().getMonth();
		const year = new Date().getFullYear();

		const target = new Date(year, month, day, time.hour, time.minute).valueOf();

		const interval = setInterval(() => {
			const now = Date.now();

			if (now > target) {
				const newWindow = window.open(url, '_blank');
				if (!newWindow) {
					alert('blocked');
				}
				clearInterval(interval);
			}
		}, 60000);

		return () => {
			clearInterval(interval);
		};
	}, []);

	return (
		<div>
			{name} at {new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), time.hour, time.minute).toLocaleTimeString()}:{' '}
			<a href={url} target="_blank" rel="noreferrer noopener">
				Join
			</a>
		</div>
	);
};

export default ZoomLink;
