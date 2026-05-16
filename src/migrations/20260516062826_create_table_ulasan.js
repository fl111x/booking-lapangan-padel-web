/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('ulasan', (table) => {
    table.increments('id_ulasan').primary();
    table.integer('id_pengguna').unsigned().notNullable()
         .references('id_pengguna').inTable('pengguna')
         .onDelete('CASCADE');
    table.integer('id_gor').unsigned().notNullable()
         .references('id_gor').inTable('gor')
         .onDelete('CASCADE');
    table.integer('rating').nullable();
    table.text('komentar').nullable();
    table.check('rating >= 1 AND rating <= 5');
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('ulasan');
};
