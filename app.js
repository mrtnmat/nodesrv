'use strict'

const sqlite3 = require('sqlite3').verbose()
const http = require('http')
const ejs = require('ejs')
const mime = require('mime-types')
const fs = require('fs')

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

const server = http.createServer((req, res) => {
  switch (req.url) {
    case '/':
    case '/index.html':
      homeHandler(req, res)
      break;
    case '/script.js':
    case '/favicon.ico':
      serveFile(req, res)
      break;
    default:
      res.end('not found')
      break;
  }
    
});

function homeHandler(req, res) {
  const htmlContent = fs.readFileSync(__dirname + '/index.ejs', 'utf8')
  const htmlRenderized = ejs.render(htmlContent, {filename: 'index.ejs', r: r})
  console.log(req.url)
  res.statusCode = 200
  res.setHeader('Content-Type', 'html')
  res.end(htmlRenderized)
}

function serveFile(req, res) {
  fs.readFile(__dirname + req.url, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
    res.setHeader('Content-Type', mime.lookup(req.url))
    res.writeHead(200);
    res.end(data);
  })
}

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});