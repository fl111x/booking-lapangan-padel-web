/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('gor', (table) => {
    table.increments('id_gor').primary();
    table.string('nama_gor', 255).notNullable();
    table.text('alamat').notNullable();
    table.time('jam_buka').notNullable();
    table.time('jam_tutup').notNullable();
    table.enum('status_gor', ['buka', 'tutup']).defaultTo('buka');
    table.string('foto_gor', 255).nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('gor');
};
