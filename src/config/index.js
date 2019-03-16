const dbConfig = process.env.NODE_ENV === 'production' ? {
  client: 'mysql',
  connection: {
    host: 'us-cdbr-iron-east-03.cleardb.net',
    user: 'bdbab7d3c26eb7',
    password: '1798c122',
    database: 'heroku_1b7e742606542ba'
  }
} : {
  client: 'mysql',
  connection: {
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'xeplich'
  }
}

module.exports = dbConfig
