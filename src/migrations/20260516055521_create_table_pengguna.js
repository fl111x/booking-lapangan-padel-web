/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('pengguna', (table) => {
    table.increments('id_pengguna').primary();
    table.string('nama', 255).notNullable();
    table.string('email', 255).notNullable().unique();
    table.string('password', 255).notNullable();
    table.string('nomor_telepon', 20).notNullable();
    table.enum('role', ['admin', 'pelanggan']).defaultTo('pelanggan');
    table.string('foto_profil', 255).nullable();
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('pengguna');
};
