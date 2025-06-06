const mysql = require("mysql2");
const config = require("config");

class MySQL {

  constructor() {

    this.db_config = config.get("mysqlConfig");
    // console.log(this.db_config)

    this.pool = mysql.createPool({
      user: this.db_config.DB_USER,
      password: this.db_config.DB_PASSWORD,
      host: this.db_config.DB_SERVER,
      database: this.db_config.DB_NAME,
      multipleStatements: true,
      connectionLimit: 10,
    });
    // console.log(this.pool,"pool");
    this.pool.getConnection(function (err, connection) {
      if (err) {
        console.log("Error getting mysql_pool connection: " + err);
        const configurationError = new Error('Oops! There seems to be a configuration error in MysqlConnection.');
        // Display the error message
        console.error(configurationError);
      }
      connection.release();

      console.log("Database connected Successfully");
    });

  }

  runQuery = (query) => {

    if (!this.pool || !query || typeof query != 'string') return false

    return new Promise((resolve, reject) => {
      this.pool.query(query, (error, elements) => {
        if (error) {
          // console.log(error);
          return reject(error);
        }
        return resolve(elements);
      });
    });
  }



  runPreparedQuery = (query, values) => {
    if (!this.pool || !query || !Array.isArray(values) || !values.length) return false

    return new Promise((resolve, reject) => {
      this.pool.query(query, values, (error, elements) => {
        if (error) {
          console.log(error);
          return reject(error);
        }
        return resolve(elements);
      });
    });
  }

  insertQuery = async (table, data) => {

    const query = `INSERT INTO ${table} (${Object.keys(data).join(', ')}) VALUES (${Object.values(data).map(i => `'${i}'`).join(', ')}) `

    const result = await this.runQuery(query)

    return result



  }


}



module.exports = MySQL
