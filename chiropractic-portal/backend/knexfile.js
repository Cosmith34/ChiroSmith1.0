require('dotenv').config();

const configs = {
  local: {
    client: 'pg',
    connection: {
      host: process.env.LOCAL_DB_HOST,
      user: process.env.LOCAL_DB_USER,
      password: process.env.LOCAL_DB_PASSWORD,
      database: process.env.LOCAL_DB_NAME,
      port: process.env.LOCAL_DB_PORT
    },
    migrations: {
      directory: './migrations'
    }
  }

  // Add production config here later
};

module.exports = configs;
