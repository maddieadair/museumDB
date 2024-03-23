const http = require('http');
const { parse } = require('url');
const mysql = require('mysql');

const pool = mysql.createPool({
  host: 'mysql-museum.mysql.database.azure.com',
  user: 'admin01',
  password: 'bananafish1!',
  database: 'museum' 
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database!');
  // Release the connection
  connection.release();
});

pool.query('SELECT * FROM gifts', (err, results) => {
  if (err) {
    console.error('Error executing query:', err);
    return;
  }
  console.log('Query results:', results);
});

const server = http.createServer((req, res) => {
  const { pathname } = parse(req.url);

  console.log("Incoming request:", req.method, pathname); // Log incoming requests

  if (pathname === '/api/update-gift-items' && req.method === 'POST') {
    updateGiftItems(req, res);
  } else if (pathname === '/api/gift-items' && req.method === 'GET') {
    fetchGiftItems(req, res);
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Route not found' }));
  }
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});


const updateGiftItems = (req, res) => {
  let body = '';
  
  req.on('data', (chunk) => {
    body += chunk.toString();
  });

  req.on('end', () => {
    try {
      const data = JSON.parse(body);
      console.log("Update request body:", data); // Log the request body
      const { itemId, newStock, newSold } = data;
      pool.query('UPDATE gifts SET gift_currStock = ?, gift_numSold = ? WHERE gift_index = ?', [newStock, newSold, itemId], (error, results) => {
        if (error) {
          console.error('Error updating gift items:', error);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Internal server error' }));
        } else {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Gift items updated successfully' }));
        }
      });
    } catch (error) {
      console.error('Error parsing request body:', error);
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Invalid request body' }));
    }
  });
};

const fetchGiftItems = (req, res) => {
  pool.query('SELECT * FROM gifts', (error, results) => {
    if (error) {
      console.error('Error fetching gift items:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Internal server error' }));
    } else {
      console.log("Sending gift items:", results); // Log the fetched gift items
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(results));
    }
  });
};


