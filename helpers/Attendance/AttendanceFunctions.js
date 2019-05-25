const lectures = (m, n) => {
	let ans = 0;
	if (n < Math.ceil(0.75 * m))
		ans = Math.ceil(((0.75 * m) - n) / 0.25) * -1;
	else {
		let i = (n * 100) / (++m);
		while (i >= 75) {
			ans++;
			i = (n * 100) / (++m);
		}
	}
	return ans;
}

const formatObject = ( object ) => {
	const attendanceData = [];
	for (let i = 0; i < object.length; i = i + 7) {
		const shortage = lectures(Number(object[i + 4]), Number(object[i + 3]));
		attendanceData.push({
			code: object[i],
			subject: object[i + 1],
			teachers: object[i + 2],
			attended: Number(object[i + 3]),
			total: Number(object[i + 4]),
			percentage: object[i + 6],
			lectures: {
				shortage: shortage < 0 ? true : false,
				classes: Math.abs(shortage)
			}
		})
	}
	return attendanceData;
}

const leaveOrattend = (lectures) => {
	return lectures.shortage === true
		? `❌ Off Track ❌ \nAttend next ${ lectures.classes } classes to get back on track.`
		: lectures.classes === 0
			? `❓ On Track ❓ \nDon't be absent.`
			: `✅ On Track ✅ \nYou may leave next ${ lectures.classes } classes.`
}

const messageReducer = (message, v) => {
	return message += `${ v.subject }\
	\n<b>Attended: ${ v.attended }\nTotal: ${ v.total }  \nPercentage: ${ v.percentage }</b> \
	\n<code>${ leaveOrattend(v.lectures) }</code> \n\n`;
}

module.exports = { formatObject, messageReducer };