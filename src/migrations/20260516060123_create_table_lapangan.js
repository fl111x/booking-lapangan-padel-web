/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('lapangan', (table) => {
        table.increments('id_lapangan').primary();
        table.integer('id_gor').unsigned().notNullable()
            .references('id_gor').inTable('gor')
            .onDelete('CASCADE');
        table.string('nama_lapangan', 255).notNullable();
        table.enum('tipe', ['Indoor', 'Outdoor']).notNullable();
        table.integer('harga_per_jam').notNullable();
        table.enum('status_lapangan', ['tersedia', 'perbaikan']).defaultTo('tersedia').notNullable;
        table.string('foto_lapangan', 255).nullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('lapangan');
};
