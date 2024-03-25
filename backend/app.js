const http = require('http');
const { parse } = require('url');
const mysql = require('mysql');

const pool = mysql.createPool({
  host: 'mysql-museum.mysql.database.azure.com',
  user: 'admin01',
  password: 'bananafish1!',
  database: 'museum',
  port: "3306" 
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

/*
pool.query('SELECT * FROM gifts', (err, results) => {
  if (err) {
    console.error('Error executing query:', err);
    return;
  }
  console.log('Query results:', results);
});
*/



const server = http.createServer((req, res) => {
  const { pathname } = parse(req.url);

  console.log("Incoming request:", req.method, pathname); // Log incoming requests

  if (pathname === '/api/update-gift-items' && req.method === 'POST') {
    updateGiftItems(req, res);
  } else if (pathname === '/api/gift-items' && req.method === 'GET') {
    fetchGiftItems(req, res);
  } else if (pathname == '/artworks') {
    pool.query('SELECT * FROM museum.artworks', (error, results, fields) => {
    if (error) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Error fetching artworks from artworks from database');
      return;
    }
    res.writeHead(200, {'Content-Type' : 'application/json' });
    res.end(JSON.stringify(results));
  });
  } else if (pathname === '/collections'){
    pool.query('SELECT * FROM museum.collections', (error, results, fields) => {
    if (error) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Error fetching artworks from artworks from database');
      return;
    }
    res.writeHead(200, {'Content-Type' : 'application/json' });
    res.end(JSON.stringify(results));
  });
  } else if (pathname === '/admin/collections'){
    pool.query(` Select collections.collection_name, users.User_First_Name, users.User_Last_Name, users.User_ID, employees.DOB, collections.collections_department
                        FROM museum.collections, museum.employees, museum.users
                         WHERE USER_ID = employee_id AND collection_curator_ID = employee_id;`, (error, results, fields) => {
    if (error) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Error fetching artworks from artworks from database');
      return;
    }
    res.writeHead(200, {'Content-Type' : 'application/json' });
    res.end(JSON.stringify(results));
  });
  } else if (req.method === 'POST' && pathname === '/admin/collections') {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });


      req.on("end", () => {
        try {
          const collectionData = JSON.parse(body);
          console.log("POST request body:", collectionData); // Log the request body
          const { collection_name, collection_curator_ID, collections_department} = collectionData;
          const query = `
              INSERT INTO collections
              (collection_name, collection_curator_ID, collections_department)
              VALUES (?, ?, ?)
              `;
          pool.query(query, [collection_name, collection_curator_ID, collections_department], (error, results) => {
          if (error) {
            console.error('Error inserting collection:', error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error adding collection');
            return;
          }
          console.log('Insert successful:', results);
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end(JSON.stringify({ message: 'Collection added successfully' }));
        });
      } catch (error) {
        console.error('Error parsing JSON:', error);
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Invalid JSON data');
      }
    });
  }
  else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Route not found' }));
  }
});

const PORT = process.env.PORT || 4000; // backend routing port
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
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


