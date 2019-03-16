
exports.up = function (knex, Promise) {
  return knex.schema.createTable('monhoc', function (table) {
    table.increments()
    table.string('name')
    table.integer('sotinchi')
    table.integer('giangvien')
    table.integer('lop')
    table.timestamp('created_at').defaultTo(knex.fn.now())
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('monhoc')
}
