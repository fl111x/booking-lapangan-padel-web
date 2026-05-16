/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('langganan_membership', (table) => {
    table.increments('id_langganan').primary();
    table.integer('id_pengguna').unsigned().notNullable()
         .references('id_pengguna').inTable('pengguna')
         .onDelete('CASCADE');
    table.integer('id_membership').unsigned().notNullable()
         .references('id_membership').inTable('membership')
         .onDelete('CASCADE');
    table.date('tanggal_mulai').notNullable();
    table.date('tanggal_berakhir').notNullable();
    table.enum('status_langganan', ['aktif', 'tidak aktif', 'pending']).defaultTo('pending');
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('langganan_membership');
};
