const FIRST_SEMESTER = CONFIG.FIRST_SEMESTER
const THIRD_SEMESTER = CONFIG.THIRD_SEMESTER
const FOUTH_SEMESTER = CONFIG.FOUTH_SEMESTER
const FIFTH_SEMESTER = CONFIG.FIFTH_SEMESTER


const getURL = (semester) => {
	return new Promise(resolve => {
		switch (semester) {
			case '1':
				resolve(FIRST_SEMESTER)
				break
			case '2':
				resolve(THIRD_SEMESTER)
				break
			case '3':
				resolve(FOUTH_SEMESTER)
				break
			case '4':
				resolve(FIFTH_SEMESTER)
				break
			case '5':
				resolve(SIXTH_SEMESTER)
				break
		}
	})
}

const structureData = (studentDetails, data) => {
	const count = studentDetails.countArray
	let formattedData, format = ''
	return new Promise((resolve) => {
		//concatenate name and register number first
		formattedData = `👤  : ${studentDetails.name} \n#️⃣  : ${studentDetails.regNum} \n\n`
		let br = `●▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬🖍`
		count.map((r, i) => {
			format = ''
			Number(data[i].THMarks) === 0 && Number(data[i].INMarks) === 0 ?
				Number(data[i].VIVAMarks) === 0 ?
				(format = `PRACTICAL : ${data[i].PRMarks} \n \t\t\t\t\t\t\t\t\t\t\t\t INTERNAL  : ${data[i].PRINMarks} \n \t\t\t\t\t\t\t\t\t\t\t\t `) :
				(format = `PRACTICAL : ${data[i].PRMarks} \n${checkEmpty(data[i].PRINMarks)} \t\t\t\t\t\t\t\t\t\t\t\t VIVA             : ${data[i].VIVAMarks} \n \t\t\t\t\t\t\t\t\t\t\t\t `) :
				Number(data[i].THMarks) === 0 ?
				format = `INTERNAL  : ${data[i].INMarks} \n \t\t\t\t\t\t\t\t\t\t\t\t ` :
				format = (`THEORY      : ${data[i].THMarks} \n \t\t\t\t\t\t\t\t\t\t\t\t INTERNAL  : ${data[i].INMarks} \n \t\t\t\t\t\t\t\t\t\t\t\t `)
			formattedData = formattedData + `${br}\n🔰${data[i].subjectName} \n \t\t\t\t\t\t\t\t\t\t\t\t ${format}TOTAL         : ${data[i].totalMarks} \n \t\t\t\t\t\t\t\t\t\t\t\t REMARKS   : ${passOrFail(data[i].remarks)} \n`
		})
		resolve(formattedData)
	})
}

let checkEmpty = marks => {
	return (Number(marks) === 0 ? '' : `\nINTERNAL: ${marks}`)
}
let passOrFail = remarks => {
	return (remarks === 'PASS' ? 'PASS   ❤️' : 'FAIL  💔')
}

module.exports = { getURL, structureData}