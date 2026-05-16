/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('pembayaran_membership', (table) => {
        table.increments('id_pembayaran').primary();
        table.integer('id_langganan').unsigned().notNullable()
            .references('id_langganan').inTable('langganan_membership')
            .onDelete('CASCADE');
            
        // Kolom Integrasi Midtrans
        table.string('order_id', 100).notNullable().unique();      // ID Invoice khusus membership
        table.string('transaction_id', 100).nullable();            // Dari Midtrans
        table.string('snap_token', 255).nullable();                // Token pop-up Snap Midtrans
        table.string('payment_type', 50).nullable();               // Cth: gopay, qris, bca_va
        
        table.integer('jumlah_bayar').notNullable();
        
        table.enum('status_pembayaran_membership', ['pending', 'berhasil', 'gagal', 'expired']).defaultTo('pending');
        table.timestamp('tanggal_pembayaran').nullable();
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('pembayaran_membership');
};
