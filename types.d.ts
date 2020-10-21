type AMPM = 'AM' | 'PM';

interface Meeting {
	url: string;
	time: Time;
	name: string;
}

interface Time {
	hour: number;
	minute: number;
	weekday: number;
}
