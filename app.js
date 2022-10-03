const sqlite3 = require('sqlite3').verbose();
const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;
const db = new sqlite3.Database('./db/test.db', (err) => {
    if (err) {
        console.error(err.message)
    }
    console.log('Connected to the test database')
})

var rows = [];

db.serialize(() => {
    db.each(`SELECT Id as id,
                    Name as name
             FROM test`, (err, row) => {
        if (err) {
            console.error(err.message)
        }
        console.log(row.id + "\t" + row.name);
        rows.push(row.name);
    })
})

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  let r = "Database Query Result:\n"
  rows.forEach((entry) => {
    r += entry + '\n'
  })
  res.end(r);
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});