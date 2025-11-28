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
  },

  development: {
    client: 'pg',
    connection: {
      host: process.env.SUPABASE_HOST,
      user: process.env.SUPABASE_USER,
      password: process.env.SUPABASE_PASSWORD,
      database: process.env.SUPABASE_DB,
      port: process.env.SUPABASE_PORT,
      ssl: { rejectUnauthorized: false }
    },
    migrations: {
      directory: './migrations'
    }
  }

  // Add production config here later
};

module.exports = configs;
