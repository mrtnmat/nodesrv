'use strict'

const sqlite3 = require('sqlite3').verbose()
import { createServer } from 'http'
import { render } from 'ejs'
import { readFileSync } from 'fs'

const hostname = '127.0.0.1'
const port = 3000;
const dbpath = './db/test.db'
const db = new sqlite3.Database(dbpath, (err) => {
  if (err) {
    console.error(err.message)
  }
  console.log(`Connected to ${dbpath}`)
})

const r = []

let sql = `SELECT DISTINCT Name name FROM test
  ORDER BY name`

db.all(sql, [], (err, rows) => {
  if (err) {
    throw err
  }
  rows.forEach((e) => {
    r.push(e.name)
  })
})

const server = createServer((req, res) => {
    const htmlContent = readFileSync(__dirname + '/index.ejs', 'utf8')
    const htmlRenderized = render(htmlContent, {filename: 'index.ejs', r: r})
    console.log('prova')
    res.statusCode = 200
    res.setHeader('Content-Type', 'html')
    res.end(htmlRenderized)
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});