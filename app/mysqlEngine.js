const mysql = require('mysql');
module.exports = class mysqlEngine {
    constructor() {
        const _dbConfig = require('/var/_config/mysql/dev/dbConfig.json');
        this.connection = mysql.createConnection(_dbConfig)
    }
}
