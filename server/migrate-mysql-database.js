/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
'use strict';
// Getting environment
let ENVIRONMENT = process.env.NODE_ENV;
if (ENVIRONMENT === '' || ENVIRONMENT === undefined) {
    ENVIRONMENT = 'development';
}
// Loading configuration
const config = require('./config');
const {Sequelize} = require('sequelize');
const ROOT_PATH = __dirname;// jshint ignore:line

const migrationPath = ROOT_PATH + '/migrations';
// const database = CONFIG.mysql.name;

// if (process.env.Database && process.env.Database === 'default_values') {
//   migrationPath = ROOT_PATH + '/migrations-for-default-values';
//   database = CONFIG.cockroach.dbNameForDefaultValues;
// }

doMigration();

async function doMigration() {
    try {
        const sequelize = new Sequelize(config.mysql.database, config.mysql.username, config.mysql.password, {
            dialect: 'mysql',
            port: config.mysql.port,
            host: config.mysql.host,
            pool: {
                max: 10,
                min: 0,
                idle: 1000,
            },
           
        });

        // await sequelize.authenticate();
        const {Umzug, SequelizeStorage} = require('umzug');

        const umzug = new Umzug({
            migrations: { glob: `${ROOT_PATH}/migrations/*.js` },
            context: sequelize.getQueryInterface(),
            storage: new SequelizeStorage({ sequelize }),
        });

        await umzug.up();
        console.info('MySql Migrations Completed.');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
