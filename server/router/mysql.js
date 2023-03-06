import mysql2 from 'mysql2'
import dotenv from 'dotenv'

dotenv.config()

const con = mysql2.createConnection({
    host     : process.env.HOST,
    user     : process.env.USER,
    password : process.env.PASSWORD,
    database : process.env.DATABASE,
    port     : process.env.PORT
  });

export default con
  