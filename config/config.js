/* eslint-disable */
require("dotenv").config() //instatiate environment variables

CONFIG = {} //Make this global to use all over the application
CONFIG.BOT_API_TOKEN = process.env.BOT_API_TOKEN || ''
CONFIG.PORT = process.env.PORT || ''
CONFIG.ATTENDANCEURL = process.env.ATTENDANCEURL || ''