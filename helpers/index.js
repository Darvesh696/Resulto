const getURL = function (semester) {
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

module.exports = {
	getURL
}