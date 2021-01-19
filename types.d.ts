type AMPM = 'AM' | 'PM';

interface Meeting {
	url: string;
	time: Time;
	name: string;
	armed: boolean;
}

interface Time {
	hour: number;
	minute: number;
	weekday: number;
}
