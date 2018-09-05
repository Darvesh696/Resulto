/* eslint-disable */
require("dotenv").config() //instatiate environment variables

CONFIG = {} //Make this global to use all over the application
CONFIG.BOT_API_TOKEN = process.env.BOT_API_TOKEN || ''
CONFIG.PORT = process.env.PORT || ''
CONFIG.FIRST_SEMESTER = process.env.FIRST_SEMESTER || ''
CONFIG.THIRD_SEMESTER = process.env.THIRD_SEMESTER || ''
CONFIG.FOUTH_SEMESTER = process.env.FOURTH_SEMESTER || ''
CONFIG.FIFTH_SEMESTER = process.env.FIFTH_SEMESTER || ''
CONFIG.SIXTH_SEMESTER = process.env.SIXTH_SEMESTER || ''
CONFIG.URL = process.env.URL || ''