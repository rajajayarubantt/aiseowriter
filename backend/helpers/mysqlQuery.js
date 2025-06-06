
const MysqlConnection = require('./MysqlConnection')
const mysqlConnection = new MysqlConnection()

async function runQuery(query) {
    let data = new Promise((resolve, reject) => {
        mysqlConnection.pool.query(query, (error, elements) => {

            if (error) {
                console.log(error.message);
                return reject(error);
            }
            return resolve(elements);
        });
    });
    data.then(result => {

    }).catch(err => {
        return err
    })
    if (data) return data
}

async function runPreparedQuery(query, values = []) {

    if (!mysqlConnection.pool || !query || !Array.isArray(values) || !values.length) return false
    return new Promise((resolve, reject) => {
        mysqlConnection.pool.query(query, values, (error, elements) => {
            if (error) {
                console.log(error, 'query error');
                return reject(error.message);
            }
            return resolve(elements);
        });
    });
}

module.exports = { runQuery, runPreparedQuery }

