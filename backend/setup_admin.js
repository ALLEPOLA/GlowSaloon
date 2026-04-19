const { Sequelize } = require('sequelize');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mssql', // assuming MSSQL, check env
    logging: false,
  }
);

async function addAdmin() {
  try {
    const hash = await bcrypt.hash('admin123', 10);
    await sequelize.query(
      `INSERT INTO Users (Name, Email, Password, Phone, RoleId, CreatedAt, UpdatedAt) 
       VALUES ('Super Admin', 'admin@glowvault.com', '${hash}', '555-5555', 1, GETDATE(), GETDATE())`
    );
    console.log('Admin inserted successfully!');
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      console.log('Admin already exists.');
    } else {
      console.error('Failed to insert admin:', error);
    }
  } finally {
    await sequelize.close();
  }
}

addAdmin();
