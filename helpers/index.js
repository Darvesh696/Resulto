const FIRST_SEMESTER = CONFIG.FIRST_SEMESTER
const THIRD_SEMESTER = CONFIG.THIRD_SEMESTER
const FOUTH_SEMESTER = CONFIG.FOUTH_SEMESTER
const FIFTH_SEMESTER = CONFIG.FIFTH_SEMESTER
const SIXTH_SEMESTER = CONFIG.SIXTH_SEMESTER

const getURL = function (semester) {
	switch (semester) {
		case '1':
			return FIRST_SEMESTER
			break
		case '2':
			return THIRD_SEMESTER
			break
		case '3':
			return FOUTH_SEMESTER
			break
		case '4':
			return FIFTH_SEMESTER
			break
		case '5':
			return SIXTH_SEMESTER
			break
	}
}

module.exports = {
	getURL
}