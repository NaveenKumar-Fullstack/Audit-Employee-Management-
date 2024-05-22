import dotenv from 'dotenv';
import mysql from 'mysql';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
};

const con = mysql.createConnection(dbConfig);

con.connect(function(err){
    if (err){
        console.log(err);
    }
    else {
        console.log("database connection established");
    }
})
export default con;