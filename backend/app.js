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

/*
pool.query('SELECT * FROM gifts', (err, results) => {
  if (err) {
    console.error('Error executing query:', err);
    return;
  }
  console.log('Query results:', results);
});
*/
const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
  const { pathname } = parse(req.url);
  const reqUrl = url.parse(req.url, true);

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
  }  if (reqUrl.pathname === '/api/tickets' && req.method === 'POST') {
    let body = '';

    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        try {
            const ticketInfo = JSON.parse(body);

            const query = `INSERT INTO tickets (Total_Price, Transaction_Date, Ticket_Date, Ticket_Time, Customer_ID, Num_Child_Tickets, Num_Teen_Tickets, Num_Adult_Tickets, Num_Senior_Tickets, Exhibition_Name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            const values = [
                ticketInfo.totalPrice,
                new Date().toISOString().slice(0, 10), 
                ticketInfo.ticketDate,
                ticketInfo.ticketTime,
                ticketInfo.userId,
                ticketInfo.numChild,
                ticketInfo.numYouth,
                ticketInfo.numAdult,
                ticketInfo.numSenior,
                ticketInfo.selectedMuseum
            ];

            db.query(query, values, (error, results) => {
                if (error) {
                    console.error('Error inserting data:', error);
                    res.writeHead(500, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({ message: 'Failed to submit ticket', error }));
                    return;
                }
                res.writeHead(201, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({ message: 'Ticket submitted successfully', ticketId: results.insertId }));
            });
        } catch (error) {
            console.error('Error parsing JSON:', error);
            res.writeHead(400, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({ message: 'Bad request' }));
        }
    });
} else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Route not found' }));
  }
});

const PORT = 4000; // backend routing port
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

// ------------------------------ DONATIONS ------------------------------

// GET
const fetchDonations = (req, res) => {
  pool.query("SELECT donations.Donation_ID, donations.Amount_Donated, donations.Donation_Note, donations.Donation_Date, donations.Donor_ID, users.User_First_Name, users.User_Last_Name FROM donations, users WHERE donations.Donor_ID = users.User_ID", (error, results) => {
    if (error) {
      console.error("Error fetching donations:", error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Internal server error" }));
    } else {
      console.log("Sending donations:", results); // Log the fetched gift items
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(results));
    }
  });
};

// POST
const addDonation = (req, res) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    try {
      const data = JSON.parse(body);
      console.log("POST request body:", data); // Log the request body
      const { Amount_Donated, Donation_Note, Donation_Date, Donor_ID } = data;
      pool.query(
        "INSERT INTO donations(Amount_Donated, Donation_Note, Donation_Date, Donor_ID) VALUES (?)",
        [data],
        (error, results) => {
          if (error) {
            console.error("Error adding donation:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Internal server error" }));
          } else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Donation added successfully" }));
          }
        },
      );
    } catch (error) {
      console.error("Error parsing request body:", error);
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Invalid request body" }));
    }
  });
};

// PUT
const updateDonation = (req, res) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    try {
      const data = JSON.parse(body);
      console.log("Update request body:", data); // Log the request body
      const {
        Donation_ID,
        Amount_Donated,
        Donation_Note,
        Donation_Date,
        Donor_ID,
      } = data;
      pool.query(
        "UPDATE donations SET Donation_ID=?, Amount_Donated=?, Donation_Note=?, Donation_Date=?, Donor_ID=? WHERE Donation_ID=?",
        [
          Donation_ID,
          Amount_Donated,
          Donation_Note,
          Donation_Date,
          Donor_ID,
          Donation_ID,
        ],
        (error, results) => {
          if (error) {
            console.error("Error updating donations:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Internal server error" }));
          } else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({ message: "Donations updated successfully" }),
            );
          }
        },
      );
    } catch (error) {
      console.error("Error parsing request body:", error);
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Invalid request body" }));
    }
  });
};

// DELETE
const deleteDonation = (req, res) => {
    let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    try {
      const data = JSON.parse(body);
      console.log("POST request body:", data); // Log the request body
      const { Donation_ID } = data;
      pool.query(
        "DELETE FROM donations WHERE Donation_ID=?",
        [Donation_ID],
        (error, results) => {
          if (error) {
            console.error("Error deleting donation:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Internal server error" }));
          } else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Donation added successfully" }));
          }
        },
      );
    } catch (error) {
      console.error("Error parsing request body:", error);
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Invalid request body" }));
    }
  });
};


// ------------------------------ USERS ------------------------------

// GET
const fetchUsers = (req, res) => {
  pool.query("SELECT * FROM users", (error, results) => {
    if (error) {
      console.error("Error fetching users:", error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Internal server error" }));
    } else {
      console.log("Sending users:", results); // Log the fetched gift items
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(results));
    }
  });
};

// GET
const getUser = (req, res) => {
    pool.query("SELECT * FROM users WHERE User_ID = ?", (error, results) => {
      if (error) {
        console.error("Error fetching users:", error);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Internal server error" }));
      } else {
        console.log("Sending users:", results); // Log the fetched gift items
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(results));
      }
    });
  };

// POST
const addUser = (req, res) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    try {
      const data = JSON.parse(body);
      console.log("POST request body:", data); // Log the request body
      const {
        User_First_Name,
        User_Last_Name,
        User_Email,
        User_Password,
        User_Address,
        User_City,
        User_State,
        User_Zipcode,
        isAdmin
    } = data;
    pool.query(
      "INSERT INTO users(User_First_Name, User_Last_Name, User_Email, User_Password, User_Address, User_City, User_State, User_Zipcode, isAdmin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        User_First_Name,
        User_Last_Name,
        User_Email,
        User_Password,
        User_Address,
        User_City,
        User_State,
        User_Zipcode,
        isAdmin],


        (error, results) => {
          if (error) {
            console.error("Error adding user:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Internal server error" }));
          } else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "User added successfully" }));
          }
        },
      );
    } catch (error) {
      console.error("Error parsing request body:", error);
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Invalid request body" }));
    }
  });
};

// PUT
const updateUser = (req, res) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    try {
      const data = JSON.parse(body);
      console.log("Update request body:", data); // Log the request body
      const {
        User_ID,
        User_First_Name,
        User_Last_Name,
        User_Email,
        User_Password,
        User_Address,
        User_City,
        User_State,
        User_Zipcode,
        isAdmin,
      } = data;
      pool.query(
        "UPDATE users SET User_First_Name=?, User_Last_Name=?, User_Email=?, User_Password=?, User_Address=?, User_City=?, User_State=?, User_Zipcode=?, isAdmin = ? WHERE User_ID = ?",
        [
          User_ID,
          User_First_Name,
          User_Last_Name,
          User_Email,
          User_Password,
          User_Address,
          User_City,
          User_State,
          User_Zipcode,
          isAdmin,
        ],
        (error, results) => {
          if (error) {
            console.error("Error updating user:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Internal server error" }));
          } else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "User updated successfully" }));
          }
        },
      );
    } catch (error) {
      console.error("Error parsing request body:", error);
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Invalid request body" }));
    }
  });
};

// DELETE
const deleteUser = (req, res) => {
    let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    try {
      const data = JSON.parse(body);
      console.log("POST request body:", data); // Log the request body
      const { User_ID } = data;
      pool.query(
        "DELETE FROM users WHERE User_ID=?",
        [User_ID],
        (error, results) => {
          if (error) {
            console.error("Error deleting user:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Internal server error" }));
          } else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "User deleted successfully" }));
          }
        },
      );
    } catch (error) {
      console.error("Error parsing request body:", error);
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Invalid request body" }));
    }
  });
};

// ------------------------------ DEPARTMENTS ------------------------------

// GET
const fetchDepartments = (req, res) => {
  pool.query("SELECT * FROM department", (error, results) => {
    if (error) {
      console.error("Error fetching departments:", error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Internal server error" }));
    } else {
      console.log("Sending departemnts:", results); // Log the fetched gift items
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(results));
    }
  });
};

// POST
const addDepartment = (req, res) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    try {
      const data = JSON.parse(body);
      console.log("POST request body:", data); // Log the request body
      const {
        department_name,
        manager_start_date,
        department_manager_id,
        Department_Description,
      } = data;
      console.log(data.department_name);
      pool.query(
        `INSERT INTO department VALUES (?, ?, ?, ?)`,
        [
          department_name,
          manager_start_date,
          department_manager_id,
          Department_Description,
        ],
        (error, results) => {
          if (error) {
            console.error("Error adding department:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Internal server error" }));
          } else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({ message: "Department added successfully" }),
            );
          }
        },
      );
    } catch (error) {
      console.error("Error parsing request body:", error);
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Invalid request body" }));
    }
  });
};

// PUT
const updateDepartment = (req, res) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    try {
      const data = JSON.parse(body);
      console.log("Update request body:", data); // Log the request body
      const {
        department_name,
        manager_start_date,
        department_manager_id,
        Department_Description,
      } = data;
      pool.query(
        "UPDATE department SET department_name=?, manager_start_date=?, department_manager_id=?, Department_Description=? WHERE department_name=?",
        [
          department_name,
          manager_start_date,
          department_manager_id,
          Department_Description,
          department_name,
        ],
        (error, results) => {
          if (error) {
            console.error("Error updating department:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Internal server error" }));
          } else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({ message: "Department updated successfully" }),
            );
          }
        },
      );
    } catch (error) {
      console.error("Error parsing request body:", error);
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Invalid request body" }));
    }
  });
};

// DELETE
const deleteDepartment = (req, res) => {};


// ------------------------------ TICKETS ------------------------------

// GET
const fetchTickets = (req, res) => {
    pool.query("SELECT *, SUM(Num_Child_Tickets + Num_Teen_Tickets + Num_Adult_Tickets + Num_Senior_Tickets) AS TotalCount FROM tickets GROUP BY TicketTransaction_ID;", (error, results) => {
      if (error) {
        console.error("Error fetching tickets:", error);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Internal server error" }));
      } else {
        console.log("Sending tickets:", results); // Log the fetched gift items
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(results));
      }
    });
  };


  // DELETE
const deleteTicket = (req, res) => {
    let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    try {
      const data = JSON.parse(body);
      console.log("POST request body:", data); // Log the request body
      const { TicketTransaction_ID } = data;
      pool.query(
        "DELETE FROM tickets WHERE TicketTransaction_ID=?",
        [TicketTransaction_ID],
        (error, results) => {
          if (error) {
            console.error("Error deleting ticket:", error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Internal server error" }));
          } else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Ticket deleted successfully" }));
          }
        },
      );
    } catch (error) {
      console.error("Error parsing request body:", error);
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Invalid request body" }));
    }
  });
};







