const { formatObject, messageReducer } = require('./AttendanceFunctions');

const formatMessage = ( message, name, regNum ) => {
	const formattedObject = formatObject(message);
	let formattedMessage = `<b>${ name } \n${ regNum }</b>\n➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖\n `;
	formattedMessage += formattedObject.reduce(messageReducer, '');
	return formattedMessage;
}
module.exports = { formatMessage };