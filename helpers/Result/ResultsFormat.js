const {findTotal,formatMessage} = require('./ResultFunctions')

const formatObject = (data) => {
	let formattedData = []
	data.slice(2).forEach((v) => {
		if (Number(v.theory) !== 0) {
			formattedData.push({
				subject: v.subjectName,
				marks: v.theory,
				internal: v.internal,
				total: Number(v.theory === "AB" ? 0 : v.theory) + Number(v.internal),
				remarks:v.remarks
			})
		} else if (Number(v.practical) !== 0) {
			if (Number(v.viva) !== 0) {
				formattedData.push({
					subject: v.subjectName,
					marks: v.practical,
					internal: v.practicalInternal,
					viva: v.viva,
					total: Number(v.practical === "AB" ? 0 : v.practical) + Number(v.practicalInternal) + Number(v.viva === "AB" ? 0 : v.viva),
					remarks: v.remarks
				})
			} else {
				formattedData.push({
					subject: v.subjectName,
					marks: v.practical,
					internal: v.practicalInternal,
					total: Number(v.practical) + Number(v.practicalInternal),
					remarks: v.remarks
				})
			}
		} else {
			formattedData.push({
				subject: v.subjectName,
				marks: v.internal,
				total: v.internal,
				remarks: v.remarks
			})
		}
	})
	let formattedMessage = `<b>Register No: ${data[1]}</b>\n<b>Name: ${data[0]}</b>\n\n`
	formattedMessage += formattedData.reduce(formatMessage,'')
	const  totalMarks = formattedData.reduce(findTotal,0);
	formattedMessage+=`\n\n<b>Total Marks: ${totalMarks}</b>`
	return formattedMessage;
}

module.exports = {
	formatObject
}