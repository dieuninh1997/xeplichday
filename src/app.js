const path = require('path')
const express = require('express')
const nunjucks = require('nunjucks')
const bodyParser = require('body-parser')

const dbConfig = require('./config')
const knex = require('knex')(dbConfig)
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

  res.render('giangvien/giangvien.html', {
    listTeacher,
    numberOfTeacher: listTeacher.length
  })
})

app.get('/:type', async (req, res) => {
  const { type } = req.params
  const template = `${type}/${type}.html`
  switch (type) {
    case 'monhoc':
      const [listTeacher, listClass, listSubject] = await Promise.all([
        await knex('giangvien').select(),
        await knex('lop').select(),
        await knex('monhoc').select()
      ])
      res.render(template, {
        listTeacher,
        listClass,
        listSubject,
        numberOfSuject: listSubject.length
      })
      break
    case 'tkb':
      const [listTeacherNew, listClassNew, listSubjectNew] = await Promise.all([
        await knex('giangvien').select(),
        await knex('lop').select(),
        await knex('monhoc').select()
      ])
      res.render(template, {
        listTeacher: listTeacherNew,
        listClass: listClassNew,
        listSubject: listSubjectNew,
        numberOfSuject: listSubjectNew.length
      })
      break
    case 'lop':
      const listClassNeww = await knex('lop').select()
      res.render(template, {
        listClass: listClassNeww,
        numberOfClass: listClassNeww.length
      })
      break
    default:
      break
  }
})

app.get('/edit/:type/:id', async (req, res) => {
  try {
    const { type, id } = req.params
    if (!id) { throw new Error('Không tìm thấy thông tin') }

    const dataEdit = await knex(type).select().where({ id }).first()
    const listTeacher = await knex('giangvien').select()
    const listClass = await knex('lop').select()
    const template = `${type}/edit-${type}.html`
    res.render(template, {
      dataEdit,
      listTeacher,
      listClass
    })
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
      data: error
    })
  }
})

app.post('/edit/:type/:id', async (req, res, next) => {
  try {
    const { type, id } = req.params
    const { name, note, khoahoc, sotinchi, giangvien, lop } = req.body
    if (!id) { throw new Error('Không tìm thấy thông tin') }
    switch (type) {
      case 'giangvien':
        if (!name) { throw new Error('Tên giảng viên là bắt buộc') }
        await knex(type).where({ id }).update({ name, note })
        return res.redirect('/giangvien')
      case 'monhoc':
        if (!name) { throw new Error('Tên môn học là bắt buộc') }
        if (!sotinchi) { throw new Error('Vui lòng chọn số tín chỉ') }
        if (!giangvien) { throw new Error('Vui lòng chọn giảng viên') }
        if (!lop) { throw new Error('Vui lòng chọn lớp') }
        await knex(type).where({ id }).update({ name, sotinchi, giangvien, lop })
        return res.redirect('/monhoc')
      case 'lop':
        if (!name) { throw new Error('Tên lớp là bắt buộc') }
        if (!khoahoc) { throw new Error('Khoá học là bắt buộc') }
        await knex(type).where({ id }).update({ name, khoahoc })
        return res.redirect('/lop')
      default:
        return res.redirect('/')
    }
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
      data: error
    })
  }
})

app.post('/giangvien', async (req, res, next) => {
  try {
    const { name, note } = req.body
    if (!name) { throw new Error('Tên giảng viên là bắt buộc') }

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

app.delete('/:type/:id', async (req, res, next) => {
  try {
    const { type, id } = req.params
    if (!id) { throw new Error('Không tìm thấy thông tin') }

    await knex(type).where({ id }).del()
    res.json({
      success: true,
      message: 'Xoá thành công',
      data: { id }
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

    if (!name) { throw new Error('Tên lớp là bắt buộc') }
    if (!sotinchi) { throw new Error('Số tín chỉ là bắt buộc') }
    if (!giangvien) { throw new Error('Giảng viên là bắt buộc') }
    if (!lop) { throw new Error('Lớp là bắt buộc') }

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

    if (!name) { throw new Error('Tên lớp là bắt buộc') }
    if (!khoahoc) { throw new Error('Khoá học là bắt buộc') }

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
