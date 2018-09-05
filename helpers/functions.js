require('../config/config')
const findTotal = (total, value) => {
	return total += Number(value.total)
}

const formatMessage = (message, v, k) => {
	if (Object.keys(v).length === 6) {
		return message += `<b>Subject : ${v.subject}</b>\n<b>Marks : ${v.marks}</b>\n<b>Internal : ${v.internal}</b>\n<b>Viva : ${v.viva}</b>\n<b>Total : ${v.total}</b>\n<b>${passOrFail(v.remarks)}</b>\n\n`
	} else if (Object.keys(v).length === 5) {
		return message += `<b>Subject : ${v.subject}</b>\n<b>Marks : ${v.marks}</b>\n<b>Internal : ${v.internal}</b>\n<b>Total : ${v.total}</b>\n<b>${passOrFail(v.remarks)}</b>\n\n`
	} else {
		return message += `<b>Subject : ${v.subject}</b>\n<b>Marks : ${v.marks}</b>\n<b>Total : ${v.total}</b>\n<b>${passOrFail(v.remarks)}</b>\n\n`
	}
}

const passOrFail = remarks => {
	return (remarks === 'PASS' ? '✅PASS' : '❌FAIL')
}

const getURL = (semester) =>{
	switch (semester) {
		case '1':
			return CONFIG.FIRST_SEMESTER
			break
		case '2':
			return CONFIG.THIRD_SEMESTER
			break
		case '3':
			return CONFIG.FOUTH_SEMESTER
			break
		case '4':
			return CONFIG.FIFTH_SEMESTER
			break
		case '5':
			return CONFIG.SIXTH_SEMESTER
			break
	}
}

module.exports = {findTotal,formatMessage,getURL}