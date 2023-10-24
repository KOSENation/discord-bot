/*
    MySQLを操作するための関数を定義
*/

const mysql = require('mysql')
const path = require("path")
const util = require('util')
if(process.argv[2] == undefined || process.argv[2] == "dev"){
    const ENV_PATH = path.join(__dirname, '.env_dev');
    require("dotenv").config({path: ENV_PATH})
}else if(process.argv[2] == "kose"){
    const ENV_PATH = path.join(__dirname, '.env_kose');
    require("dotenv").config({path: ENV_PATH})
}else if(process.argv[2] == "pro"){
    const ENV_PATH = path.join(__dirname, '.env_product');
    require("dotenv").config({path: ENV_PATH})
}else if(process.argv[2] == "realkose"){
    const ENV_PATH = path.join(__dirname, '.env_realkose');
    require("dotenv").config({path: ENV_PATH})
}

const pool_connection = mysql.createPool({
    host: process.env.SQL_HOST,
    port: process.env.SQL_PORT,
    //socketPath: `/cloudsql/${process.env.SQL_CONNECTION_NAME}`,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASS,
    database: process.env.SQL_DB
})
pool_connection.query = util.promisify(pool_connection.query).bind(pool_connection)

exports.DB_query = async function(query,data){
    try {
        if(data == undefined){   
            return await pool_connection.query(query)
        }else{
            return await pool_connection.query(query ,data)
        }
    } catch (error) {
        console.log(error)
        return 0
    }
}