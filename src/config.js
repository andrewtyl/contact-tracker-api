let knex_con_value = "";
if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== undefined) {
  knex_con_value = {
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    password: process.env.PG_PASS,
    database: process.env.PG_DB,
    port: process.env.PG_PORT
  }
}
else {
  knex_con_value = process.env.DATABASE_URL
}

module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'production',
  KNEX_CON: knex_con_value
}