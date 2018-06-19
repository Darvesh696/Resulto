require("../config/config")
const puppeteer = require('puppeteer')

/*
* gets results page url from CONFIG
*I kept it private. You can find it from google
*/
const FIRST_SEMESTER =CONFIG.FIRST_SEMESTER
const THIRD_SEMESTER =CONFIG.THIRD_SEMESTER
const FOUTH_SEMESTER = CONFIG.FOUTH_SEMESTER
const FIFTH_SEMESTER = CONFIG.FIFTH_SEMESTER

//this function being exported at the end
const sendResults = async (ctx) => {
	//gets the message from ctx object.
	let {message:{text:message}} = ctx
	//gets the register number from the {message} with regex expression
	let registerNumber = message.match(/\d{9}/)[0]
	//gets the semester number from the {message} with regex expression
	let semesterNumber = message.match(/\d/)[0]
	/*
	*@{getURL} function retuns the URL of the passed semester's results webpage
	*/
	let URL = await getURL(semesterNumber)
	const browser = await puppeteer.launch({
		headless: true,
		args: [
			'--no-sandbox',
			'--disable-setuid-sandbox'
		],
	})
	const page = await browser.newPage()
	//goes to the {URL} and waits until page loads
	await page.goto(URL, {
		waitUntil: 'networkidle2'
	})
	//types register number in the input field
	await page.type('.right input', registerNumber)
	//clicks the button with #btnViewResult after typing the register number
	await page.click('#btnViewResult')
	// wait until table loads
	const resultsSelector = 'table'
	await page.waitForSelector(resultsSelector)
	//rowCount stores the number of rows in the table (which equals to number of subjects)
	let rowCount
	//countArray creates array with elements  1 to {rowCount}
	let countArray = []
	//studentDetails stores an object which has regNum, name and countArray
	let studentDetails = await page.evaluate(() => {
		//Stores name of the student
		let name
		//stores register number of the student
		let regNum
		rowCount = document.querySelectorAll("#gvResults > tbody:nth-child(1) > tr").length
		//Creates array from 1 TO rowCount.
		countArray = Array.from({ length: rowCount}, (v, k) => k + 1).splice(1)
		//gets the name of the student
		name = document.querySelector('#lblStudentName').innerHTML
		//gets the register number of th student
		regNum = document.querySelector('#lblRegisterNumber').innerHTML
		return {
			regNum,
			name,
			countArray
		}
	})
	//results store all the subjects and marks
	let results = await page.evaluate(() => {
		let subjectScore = []
		/*
		*@{THMarks} marks in theory 
		*@{INMarks} marks in theory internal
		*@{PRMarks} marks in practical 
		*@{PRINMarks} marks in practical internal
		*@{subjectScore} gets all the subject names and marks 
		*/
		countArray.map(row => {
			let THMarks = document.querySelector(`#gvResults > tbody:nth-child(1) > tr:nth-child(${row}) > td:nth-child(4)`).textContent || ''
			let INMarks = document.querySelector(`#gvResults > tbody:nth-child(1) > tr:nth-child(${row}) > td:nth-child(5)`).textContent || ''
			let PRMarks = document.querySelector(`#gvResults > tbody:nth-child(1) > tr:nth-child(${row}) > td:nth-child(6)`).textContent || ''
			let PRINMarks = document.querySelector(`#gvResults > tbody:nth-child(1) > tr:nth-child(${row}) > td:nth-child(7)`).textContent || ''
			let totalMarks = document.querySelector(`#gvResults > tbody:nth-child(1) > tr:nth-child(${row}) > td:nth-child(9)`).textContent
			let subjectName = document.querySelector(`#gvResults > tbody:nth-child(1) > tr:nth-child(${row}) > td:nth-child(2)`).textContent
			subjectScore.push({
				subjectName,
				totalMarks,
				THMarks,
				INMarks,
				PRMarks,
				PRINMarks
			})
		})
		return subjectScore
	})
	//structuredData store the data to be replied back to the user
	let structuredData = await structureData(studentDetails,results)
	//replies with the data
	ctx.reply(structuredData )
	//closes puppeteer page and browser
	await page.close()
	await browser.close()
}

/*
*@{semester} : semester number 
* returns the results page url of that particular semester
*/
let getURL = (semester) =>{
	return new Promise(resolve=>{
		switch(semester){
		case '1' : resolve(FIRST_SEMESTER) 
			break
		case '3' : resolve(THIRD_SEMESTER)
			break
		case '4' : resolve(FOUTH_SEMESTER)
			break
		case '5' : resolve(FIFTH_SEMESTER)
			break
		}
	})
}

/*
*@{studentDetails} is an object which has name and register number of the student
*@{data} contains the subject names and marks obtained from each subjects
*returns @{formattedData} formatted data to send back to the user.
*/
let structureData = (studentDetails, data) => {
	let count = studentDetails.countArray
	let formattedData
	return new Promise((resolve) => {
		//concatinate name and register number first
		formattedData = `${studentDetails.name} \n${studentDetails.regNum} \n\n`
		let theory
		let internal
		/*
		*
		*    @THMarks ==" "        &&   @ INMarks==" "            =>    @theory = PRMarks    &&   @internal = PRINMarks
		*	 @THMarks == " "       &&   @INMarks == value       =>   @thoery = ""  		       &&   @internal = ""
		*    @THMarks== value   &&   @ INMarks==vlaue        =>   @thoery = THMarks   &&   @internal =THINMarks
		* 
		*/
		count.map((r, i) => {
			(Number(data[i].THMarks) === 0 && Number(data[i].INMarks) === 0) ?
				((theory = `${data[i].PRMarks} +`) && (internal=`${data[i].PRINMarks} =` ))   :
				(Number(data[i].THMarks) === 0 ?
					((theory=" ") && (internal=""))   :
					((theory = `${data[i].THMarks} +`) && (internal = `${data[i].INMarks} =`)))
			//concatinates all the marks with corresponding subject names
			formattedData = formattedData + `${data[i].subjectName} \n  ${theory} ${internal} ${data[i].totalMarks} \n\n`
		})
		resolve(formattedData)
	})
}

module.exports.sendResults = sendResults