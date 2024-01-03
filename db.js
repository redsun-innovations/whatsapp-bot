// db.js
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Whatsappbot',
  password: 'Roshan332',
  port: 5432,
});

async function getMechanicDetails() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM mechanic');
    console.log(result)
    client.release();
    return result.rows;
  } catch (error) {
    console.error('Error retrieving mechanic details from the database:', error);
    throw error;
  }
}

async function saveCustomerToDatabase(userId, userName, userPhoneNumber) {
    const query = 'INSERT INTO customer (userid, name, phonenumber) VALUES ($1, $2, $3)';
    try {
      const client = await pool.connect();
      await client.query(query, [userId, userName, userPhoneNumber]);
      console.log('Customer saved to the database successfully');
      client.release();
    } catch (error) {
      console.error('Error saving customer to the database:', error);
      throw error;
    }
}

module.exports = {
  getMechanicDetails,
  saveCustomerToDatabase,
};