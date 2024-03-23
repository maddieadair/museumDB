const http = require('http');
const mysql = require('mysql');

// Create a connection to the database
const connection = mysql.createConnection({
  host: 'mysql-museum.mysql.database.azure.com',
  user: 'admin01',
  password: 'bananafish1!',
  database: 'museum' 
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    
    return;
  }
  console.log('Connected to database');
});




connection.query(` Select collections.collection_name, users.User_First_Name, users.User_Last_Name, users.User_ID, employees.DOB, collections.collections_department
FROM museum.collections, museum.employees, museum.users
 WHERE USER_ID = employee_id AND collection_curator_ID = employee_id;`, (err, results) => {
  if (err) {
    console.error('Error executing query:', err);
    return;
  }
  console.log('Query results:', results);
});

const server = http.createServer((req, res) => {
  // Routing
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello, world!');
  } else if (req.url === '/about') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('About page');
  } else if (req.url == '/artworks') {
    connection.query('SELECT * FROM museum.artworks', (error, results, fields) => {
    if (error) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Error fetching artworks from artworks from database');
      return;
    }
    res.writeHead(200, {'Content-Type' : 'application/json' });
    res.end(JSON.stringify(results));
  });
  } else if (req.url === '/collections'){
    connection.query('SELECT * FROM museum.collections', (error, results, fields) => {
    if (error) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Error fetching artworks from artworks from database');
      return;
    }
    res.writeHead(200, {'Content-Type' : 'application/json' });
    res.end(JSON.stringify(results));
  });
  } else if (req.url === '/admin/collections'){
    connection.query(` Select collections.collection_name, users.User_First_Name, users.User_Last_Name, users.User_ID, employees.DOB, collections.collections_department
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
  } else if (req.method === 'POST' && req.url === '/admin/collections') {
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
          connection.query(query, [collection_name, collection_curator_ID, collections_department], (error, results) => {
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
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Page not found');
  }
});

const port = 4000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});