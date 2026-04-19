const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

async function run() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'salondb',
  });

  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS Appointments (
        Id INT AUTO_INCREMENT PRIMARY KEY,
        CustomerUserId INT NOT NULL,
        StaffUserId INT NOT NULL,
        ServiceId INT NOT NULL,
        AppointmentDate DATE NOT NULL,
        AppointmentTime TIME NOT NULL,
        Status VARCHAR(50) DEFAULT 'Pending',
        TotalPrice DECIMAL(10,2),
        DurationMinutes INT,
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (CustomerUserId) REFERENCES Users(Id) ON DELETE CASCADE,
        FOREIGN KEY (StaffUserId) REFERENCES Users(Id) ON DELETE CASCADE,
        FOREIGN KEY (ServiceId) REFERENCES Services(Id) ON DELETE CASCADE
      )
    `;
    await pool.query(createTableQuery);
    console.log("Appointments table created successfully.");
  } catch (err) {
    console.error("Error creating Appointments table:", err);
  }

  process.exit();
}

run();
