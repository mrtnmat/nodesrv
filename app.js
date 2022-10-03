'use strict'

const fs = require('fs')
const http = require('http')

const sqlite3 = require('sqlite3').verbose()
const ejs = require('ejs')
const mime = require('mime-types')

const { parse } = require('querystring');


const hostname = '192.168.1.251'
const port = 3000;
const dbpath = './db/test.db'
const db = new sqlite3.Database(dbpath, (err) => {
  if (err) {
    console.error(err.message)
  }
  console.log(`Connected to ${dbpath}`)
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
    case '/insegnanti':
    apiHandler(req, res)
    break;
    case '/insegnanti/add':
    postHandler(req, res)
    break;
    default:
    res.end('not found')
    break;
  }
});

function postHandler(req, res) {
  const htmlContent = fs.readFileSync(__dirname + '/aggiungi.html', 'utf8')
  console.log(req)
  res.writeHead(200);
  res.end(htmlContent)
}

function apiHandler(req, res) {
  let sql = ''
  switch (req.method) {
    case 'POST':
      let body = '';
      let data;
      req.on('data', chunk => {
        console.log(chunk)
          body += chunk.toString() // convert Buffer to string
      });
      req.on('end', () => {
          data = parse(body)
          sql = `INSERT INTO insegnanti (Name, Surname)
            VALUES (?, ?)`
          db.run(sql, [data.name, data.surname])
          res.writeHead(301, { "Location": '/' });
          res.end();
      });

      break;

    case 'GET':
    sql = `SELECT DISTINCT Name name,
    Surname surname FROM insegnanti
    ORDER BY name`
    
    db.all(sql, [], (err, rows) => {
      if (err) {
        throw err
      }
      const r = []
      rows.forEach((e) => {
        r.push(`${e.name} ${e.surname}`)
      })
      res.setHeader('Content-Type', mime.lookup('json'))
      res.writeHead(200);
      res.end(JSON.stringify(r))
    })
    break;
    
    default:
    break;
  }
  
}

function homeHandler(req, res) {
  const htmlContent = fs.readFileSync(__dirname + '/index.ejs', 'utf8')
  
  let sql = `SELECT DISTINCT Name name,
  Surname surname FROM insegnanti
  ORDER BY surname`
  
  db.all(sql, (err, rows) => {
    if (err) {
      throw err
    }
    const r = []
    rows.forEach((e) => {
      r.push({name: e.name, surname: e.surname})
    })
    console.log(r)
    const htmlRenderized = ejs.render(htmlContent, {filename: 'index.ejs', studenti: r})
    // send response
    res.statusCode = 200
    res.setHeader('Content-Type', 'html')
    res.end(htmlRenderized)
  })
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