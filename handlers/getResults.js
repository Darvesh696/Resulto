require("../config/config")
const puppeteer = require('puppeteer')
const R = require('ramda')
const { getURL, structureData } = require('../helpers/index.js')

const FIRST_SEMESTER =CONFIG.FIRST_SEMESTER
const THIRD_SEMESTER =CONFIG.THIRD_SEMESTER
const FOUTH_SEMESTER = CONFIG.FOUTH_SEMESTER
const FIFTH_SEMESTER = CONFIG.FIFTH_SEMESTER


const sendResults = async (ctx) => {
	let {message:{text:message}} = ctx
	//gets the register number from the {message} with regex expression
	let registerNumber = message.match(/\d{9}/)[0]
	//gets the semester number from the {message} with regex expression
	let semesterNumber = message.match(/\d/)[0]
	if( Number(semesterNumber)<1 || Number(semesterNumber)>5){
		ctx.reply("Not available. Please choose a number from the list provided, to get the list \nclick here 👉🏼 /start")
		return
	}
	//{getURL} function retuns the URL of the passed semester's results webpage
	const URL = await getURL(semesterNumber)
	const browser = await puppeteer.launch({
		headless: true,
		args: [
			'--no-sandbox',
			'--disable-setuid-sandbox',
			'--disable-dev-shm-usage',
			// '--single-process',
		],
	})
	const page = await browser.newPage()
	//goes to the {URL} and waits until page loads.....
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
	const studentDetails = await page.evaluate(() => {
		//Stores name of the student
		let name
		//stores register number of the student
		let regNum
		rowCount = document.querySelectorAll("#gvResults > tbody:nth-child(1) > tr").length
		//Creates array from 1 TO rowCount.
		//countArray = Array.from({ length: rowCount}, (v, k) => k + 1).splice(1)
		//gets the name of the student
		console.log(rowCount)
		name = document.querySelector('#lblStudentName').textContent || ''
		//gets the register number of th student
		regNum = document.querySelector('#lblRegisterNumber').textContent || ''
		return {
			regNum,
			name,
			rowCount
		}
	})
	//results store all the subjects and marks
	const results = await page.evaluate(() => {
		let subjectScore = []
		/*
		*@{THMarks} marks in theory 
		*@{INMarks} marks in theory internal
		*@{PRMarks} marks in practical 
		*@{PRINMarks} marks in practical internal
		*@{subjectScore} gets all the subject names and marks 
		*/
		//countArray.forEach(row => {
		console.log("Joooooo" +rowCount)
		for(let row=1;i<rowCount;row++){
			try{
					let THMarks = document.querySelector(`#gvResults > tbody:nth-child(1) > tr:nth-child(${row}) > td:nth-child(4)`).textContent || ''
					let INMarks = document.querySelector(`#gvResults > tbody:nth-child(1) > tr:nth-child(${row}) > td:nth-child(5)`).textContent || ''
					let PRMarks = document.querySelector(`#gvResults > tbody:nth-child(1) > tr:nth-child(${row}) > td:nth-child(6)`).textContent || ''
					let PRINMarks = document.querySelector(`#gvResults > tbody:nth-child(1) > tr:nth-child(${row}) > td:nth-child(7)`).textContent || ''
					let VIVAMarks = document.querySelector(`#gvResults > tbody:nth-child(1) > tr:nth-child(${row}) > td:nth-child(8)`).textContent || ''
					let totalMarks = document.querySelector(`#gvResults > tbody:nth-child(1) > tr:nth-child(${row}) > td:nth-child(9)`).textContent || ''
					let remarks = document.querySelector(`#gvResults > tbody:nth-child(1) > tr:nth-child(${row}) > td:nth-child(10)`).textContent || ''
					let subjectName = document.querySelector(`#gvResults > tbody:nth-child(1) > tr:nth-child(${row}) > td:nth-child(2)`).textContent || ''
				subjectScore.push({
					subjectName,
					totalMarks,
					THMarks,
					INMarks,
					PRMarks,
					PRINMarks,
					VIVAMarks,
					remarks
				})
			}catch(error){
				new Error("doesn't have textContent")
			}
		}
		//})
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

module.exports.sendResults = sendResults