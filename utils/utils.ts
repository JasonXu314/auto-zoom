export function compareDates(a: Time, b: Time): number {
	const now = new Date();
	const weekDay = now.getDay();
	const hour = now.getHours();
	const minute = now.getMinutes();

	if (a.weekday === b.weekday) {
		if (a.hour === b.hour) {
			return (a.minute < minute ? a.minute - minute + 60 : a.minute - minute) < (b.minute < minute ? b.minute - minute + 60 : b.minute - minute) ? -1 : 1;
		}
		return (a.hour < hour ? a.hour - hour + 24 : a.hour - hour) < (b.hour < hour ? b.hour - hour + 24 : b.hour - hour) ? -1 : 1;
	}
	return (a.weekday < weekDay ? a.weekday - weekDay + 7 : a.weekday - weekDay) < (b.weekday < weekDay ? b.weekday - weekDay + 7 : b.weekday - weekDay)
		? -1
		: 1;
}
