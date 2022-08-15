const knex = require('knex')
const knexConfig = require('../database/knexfile')

const db = knex(knexConfig.development)

module.exports = db