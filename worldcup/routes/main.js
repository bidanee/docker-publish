const express = require('express')
const morgan = require('morgan')
const fs = require('fs')
const path = require('path')
const mongoClient = require('mongodb').MongoClient
const env = require('dotenv').config({ path: '../.env' })

const app = express()
app.use(morgan('dev'))

HOST = process.env.MongoDB_Hostname
USERNAME = process.env.MongoDB_Username
PASSWORD = process.env.MongoDB_Password

var db
var databaseUrl = `mongodb://${USERNAME}:${PASSWORD}@${HOST}:27017`

app.get('/worldcup', (req, res) => {
  mongoClient.connect(databaseUrl, function (err, client) {
    if (err) throw err
    db = client.db('test')
    db.collection('worldcup')
      .find({}, { _id: 0, no: 1, nation: 1, date: 1, score: 1 })
      .toArray((err, result) => {
        if (err) throw err
        console.log('result : ', result)
        // res.send(result)
        res.writeHead(200, {
          'content-type': 'text/html charset=utf-8',
        })
        var template = `
        <table border="1" margin:auto; style="text-align:center;">
          <tr>
            <th>No</th>
            <th>Nation</th>
            <th>Date</th>
            <th>Score</th>
          </tr>
        `
        result.forEach((item) => {
          score = item.score
          if (score == undefined) {
            score = 'Before the game'
          } else {
            score = item.score
          }
          template += `
          <tr>
          <td>${item.no}</td>
          <td>${item.nation}</td>
          <td>${item.date}</td>
          <td>${score}</td>
          </tr>
          `
        })
        template += '</table>'
        res.end(template)
      })
  })
})

module.exports = app
