/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('membership', (table) => {
    table.increments('id_membership').primary();
    table.string('nama_membership', 255).notNullable();
    table.integer('harga').notNullable();
    table.integer('diskon').nullable();
    table.integer('durasi_hari').notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('membership');
};
