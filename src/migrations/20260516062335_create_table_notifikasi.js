/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('notifikasi', (table) => {
        table.increments('id_notifikasi').primary();
        table.integer('id_pengguna').unsigned().notNullable()
            .references('id_pengguna').inTable('pengguna')
            .onDelete('CASCADE');
        table.string('judul', 255).notNullable();
        table.text('pesan').notNullable();
        table.boolean('is_read').defaultTo(false);
        table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('notifikasi');
};
