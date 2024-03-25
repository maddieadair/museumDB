const http = require('http');
const url = require('url');
const mysql = require("mysql");

// Connect To Database
const db = mysql.createPool({
    host: "mysql-museum.mysql.database.azure.com",
    user: "admin01",
    password: "bananafish1!",
    database: "museum",
});

db.getConnection((err, connection) => {
    if (err) {
      console.error("Error connecting to database:", err);
      return;
    }
    console.log("Connected to database!");
    // Release the connection
    connection.release();
  });

// Create A Server
const server = http.createServer((req, res) => {
    
    // Handle Cors Function To Allow Axios
    handleCors(req, res);
    
    const { pathname } = parse(req.url);

    // GET Requests 
    if (req.method === "GET") {
        if (req.url === "/") {
            res.setHeader('Content-Type', 'text/html');
            res.write('<html><head><title>Hello, World!</title></head><body><h1>Hello, World!</h1></body></html>');
            res.end();
        }

        // Get ALl Users
        else if (pathname === "/gift-items") {
            db.query("SELECT * FROM gifts", (error, results) => {
                if (error) {
                  console.error("Error fetching gift items:", error);
                  res.writeHead(500, { "Content-Type": "application/json" });
                  res.end(JSON.stringify({ message: "Internal server error" }));
                } else {
                  console.log("Sending gift items:", results); // Log the fetched gift items
                  res.writeHead(200, { "Content-Type": "application/json" });
                  res.end(JSON.stringify(results));
                }
              });
        }
        
    } 
});

// Handle Cors Function To Allow Axios
const handleCors = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
};

// Set Up Server To Listen For Requests From Port 3001
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});