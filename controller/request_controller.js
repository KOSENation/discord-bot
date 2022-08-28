const request = require("request-promise");
const https = require('https');
const path = require("path");
const { json } = require("express");

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

exports.getGroupMatchData = async function(match_id){
    const options = {
        method : 'GET',
        url: process.env.API_URL + "/groupmatchdata/" + match_id,
        headers: {
            "content-type": "application/json",
            "apikey": process.env.API_KEY
        },
        json: true
    }
    let returnBody
    await request(options).then(function (body) {
        returnBody = body
    })
    if(returnBody.error_code != undefined){
        console.log(returnBody.error_code,returnBody.error_message)
        return 0
    }
    return returnBody
}

exports.getTeamDataByID = async function(team_id){
    const options = {
        method : 'GET',
        url: process.env.API_URL + "/team/" + team_id,
        headers: {
            "content-type": "application/json",
            "apikey": process.env.API_KEY
        },
        json: true
    }
    let returnBody
    await request(options).then(function (body) {
        returnBody = body
    })
    if(returnBody.error_code != undefined){
        console.log(returnBody.error_code,returnBody.error_message)
        return 0
    }
    return returnBody
}

exports.getGroupData = async function(){
    const options = {
        method : 'GET',
        url: process.env.API_URL + "/groupdata",
        headers: {
            "content-type": "application/json",
            "apikey": process.env.API_KEY
        },
        json: true
    }
    let returnBody
    await request(options).then(function (body) {
        returnBody = body
    })
    if(returnBody.error_code != undefined){
        console.log(returnBody.error_code,returnBody.error_message)
        return 0
    }
    return returnBody
}