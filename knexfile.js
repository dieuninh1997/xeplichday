module.exports = {
  development: {
    client: 'mysql',
    connection: {
      host: '127.0.0.1',
      user: 'root',
      password: '12345678',
      database: 'xeplich'
    }
  },
  staging: {
    client: 'mysql',
    connection: {
      host: '127.0.0.1',
      user: 'root',
      password: '12345678',
      database: 'xeplich'
    }
  },
  production:
    {
      client: 'mysql',
      connection: {
        host: 'us-cdbr-iron-east-03.cleardb.net',
        user: 'bdbab7d3c26eb7',
        password: '1798c122',
        database: 'heroku_1b7e742606542ba'
      }
    }
}
