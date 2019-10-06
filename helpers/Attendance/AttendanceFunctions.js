'use strict'
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
	//object.forEach(d => console.log(d))
	for (let i = 0; i < object.length; i = i + 7) {
		const shortage = lectures(Number(object[i + 4]), Number(object[i + 3]) + Number(object[i+5]));
		//console.log([i+1])
		attendanceData.push({
			subject: object[i],
			code: object[i + 1],
			teachers: object[i + 2],
			attended: Number(object[i + 3]),
			total: Number(object[i + 4]),
			fa: Number(object[i + 5]),
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

const messageReducer = (v) => {
	return `<b>${ v.code }</b> \n${ v.subject }\
	\n<b>Attended: ${ v.attended }\nTotal: ${ v.total } \nFA: ${ v.fa } \nPercentage: ${ v.percentage }</b> \
	\n<code>${ leaveOrattend(v.lectures) }</code> \n\n`;
}

const withDates = (date) => {
	const DAYSINWEEK = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
	const d = date.split("/");
	const newDate = d[1] + "-" + d[0] + "-" + d[2];
	const day = new Date(Date.parse(newDate)).getDay();
	return date + " ≈" + DAYSINWEEK[day];
}

const formatDates = dates => {
	const reg = /\d{2}\/\d{2}\/\d{4}/g;
	return dates === 'Not Absent for Any Class !! '
		? dates
		: !!(Symbol.iterator in Object(dates.match(reg)))
			? [...dates.match(reg)].map(date => withDates(date.replace("2019", "19"))).join("\n")
			: '';
}

module.exports = { formatObject, messageReducer, formatDates };