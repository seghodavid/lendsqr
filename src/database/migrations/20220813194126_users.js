/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .createTable('users', (table) => {
        table.primary('userId')
        table.increments('userId')
        table.string('name').notNullable()
        table.string('mobile_number', 11).notNullable()
        table.string('work_email').unique().notNullable()
        table.string('business_name').notNullable()
        table.string('password').notNullable()
        table.timestamp("createdAt").defaultTo(knex.raw("CURRENT_TIMESTAMP"));
        table.timestamp("updatedAt").defaultTo(knex.raw("CURRENT_TIMESTAMP"));
    })
    .createTable('wallets', (table) => {
        table.increments('walletId', {primaryKey: true})
        table.integer('balance')
        table.timestamps({useTimestamps: true})
        table.integer('user').unsigned().notNullable()

        table.foreign('user').references('userId').inTable('users')
    })
    .createTable('transactions', (table) => {
        table.increments('transactionId', {primaryKey: true})
        table.integer('amount')
        table.enu('transactionTypes', ['deposit', 'withdrawal', 'transfer'], {enumName: 'TransactionTypes'})
        table.timestamps({useTimestamps: true})
        table.integer("wallet").unsigned().notNullable();

        table.foreign("wallet").references("walletId").inTable("wallets");
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
  .dropTable("users")
  .dropTable('wallets')
  .dropTable('transactions')
};
