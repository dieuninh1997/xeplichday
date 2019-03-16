const path = require('path')
const express = require('express')
const nunjucks = require('nunjucks')
const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    user: 'root',
    password: '12345678',
    database: 'xeplich'
  }
})
const bodyParser = require('body-parser')

const app = express()

app.use(express.static(path.resolve(__dirname, './public')))

app.set('views', path.resolve(__dirname, './views'))
nunjucks.configure(path.resolve(__dirname, './views'), {
  autoescape: true,
  express: app
})
app.set('view engine', 'html')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', async (req, res) => {
  const listTeacher = await knex('giangvien').select()
  const listClass = await knex('lop').select()
  const listSubject = await knex('monhoc').select()

  res.render('home/home.html', {
    listTeacher,
    listClass,
    listSubject
  })
})

app.post('/giangvien', async (req, res, next) => {
  try {
    const { name, note } = req.body
    if (!name) {
      throw new Error('Tên giảng viên là bắt buộc')
    }

    const idRow = await knex('giangvien').insert({ name, note })
    const infoGv = await knex('giangvien').select().where('id', idRow[0]).first()

    res.json({
      success: true,
      message: 'Thêm giảng viên thành công',
      data: infoGv
    })
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
      data: error
    })
  }
})

app.post('/monhoc', async (req, res, next) => {
  try {
    const { name, sotinchi, giangvien, lop } = req.body

    if (!name) {
      throw new Error('Tên lớp là bắt buộc')
    }
    if (!sotinchi) {
      throw new Error('Số tín chỉ là bắt buộc')
    }
    if (!giangvien) {
      throw new Error('Giảng viên là bắt buộc')
    }
    if (!lop) {
      throw new Error('Lớp là bắt buộc')
    }

    const idRow = await knex('monhoc').insert({ name, sotinchi, giangvien, lop })
    const infoMh = await knex('monhoc').select().where('id', idRow[0]).first()

    res.json({
      success: true,
      message: 'Thêm môn học thành công',
      data: infoMh
    })
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
      data: error
    })
  }
})

app.post('/lop', async (req, res, next) => {
  try {
    const { name, khoahoc } = req.body

    if (!name) {
      throw new Error('Tên lớp là bắt buộc')
    }
    if (!khoahoc) {
      throw new Error('Khoá học là bắt buộc')
    }

    const idRow = await knex('lop').insert({ name, khoahoc })
    const infoLop = await knex('lop').select().where('id', idRow[0]).first()

    res.json({
      success: true,
      message: 'Thêm lớp thành công',
      data: infoLop
    })
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
      data: error
    })
  }
})
module.exports = app
