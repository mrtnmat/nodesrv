const sqlite3 = require('sqlite3').verbose();
const http = require('http');
const ejs = require('ejs');
var fs = require('fs'); 

const hostname = '127.0.0.1';
const port = 3000;
const dbpath = './db/test.db';
const db = new sqlite3.Database(dbpath, (err) => {
  if (err) {
    console.error(err.message)
  }
  console.log(`Connected to ${dbpath}`)
})

const server = http.createServer((req, res) => {
  let sql = `SELECT DISTINCT Name name FROM test
  ORDER BY name`;
  
  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    const r = []
    rows.forEach((e) => {
      r.push(e.name)
    })
    const htmlContent = fs.readFileSync(__dirname + '/index.ejs', 'utf8');
    const htmlRenderized = ejs.render(htmlContent, {filename: 'index.ejs', r: r});  
    res.statusCode = 200;
    res.setHeader('Content-Type', 'html');
    res.end(htmlRenderized)
  })
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});