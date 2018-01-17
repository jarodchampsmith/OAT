import moment from 'moment';

export function timeAgo (date) {
	return moment.utc(date, 'MMMM, DD YYYY HH:mm:ss').utc().fromNow();
}

export function dateOnly (date) {
	return moment.utc(date, 'MMMM, DD YYYY HH:mm:ss').utc().format('MMM Do YYYY');
}

export function yesNo (bit) {
	return bit ? 'Yes' : 'No';
}
