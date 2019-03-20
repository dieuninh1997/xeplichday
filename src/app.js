const path = require('path')
const express = require('express')
const nunjucks = require('nunjucks')
const bodyParser = require('body-parser')
const _ = require('lodash')
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
  res.render('home/home.html')
})

function filterTkb (tkb) {
  const tkbTiet1 = _.filter(tkb, { tietBatDau: 1 })
  const tkbTiet2 = _.filter(tkb, (item) => {
    return (item.tietBatDau > 1 && item.tietBatDau < 3) || (item.tietKetThuc > 1 && item.tietKetThuc < 3)
  })
  const tkbTiet3 = _.filter(tkb, (item) => {
    return (item.tietBatDau > 2 && item.tietBatDau < 4) || (item.tietKetThuc > 2 && item.tietKetThuc < 4)
  })
  const tkbTiet4 = _.filter(tkb, (item) => {
    return (item.tietBatDau > 3 && item.tietBatDau < 5) || (item.tietKetThuc > 3 && item.tietKetThuc < 5)
  })
  const tkbTiet5 = _.filter(tkb, (item) => {
    return (item.tietBatDau > 4 && item.tietBatDau < 6) || (item.tietKetThuc > 4 && item.tietKetThuc < 6)
  })
  const tkbTiet6 = _.filter(tkb, (item) => {
    return (item.tietBatDau > 5 && item.tietBatDau < 7) || (item.tietKetThuc > 5 && item.tietKetThuc < 7)
  })
  const tkbTiet7 = _.filter(tkb, (item) => {
    return (item.tietBatDau > 6 && item.tietBatDau < 8) || (item.tietKetThuc > 6 && item.tietKetThuc < 8)
  })
  const tkbTiet8 = _.filter(tkb, (item) => {
    return (item.tietBatDau > 7 && item.tietBatDau < 9) || (item.tietKetThuc > 7 && item.tietKetThuc < 9)
  })
  const tkbTiet9 = _.filter(tkb, (item) => {
    return (item.tietBatDau > 8 && item.tietBatDau < 10) || (item.tietKetThuc > 8 && item.tietKetThuc < 10)
  })
  const tkbTiet10 = _.filter(tkb, (item) => {
    return (item.tietBatDau > 9 && item.tietBatDau < 11) || (item.tietKetThuc > 9 && item.tietKetThuc < 11)
  })
  return [
    tkbTiet1,
    tkbTiet2,
    tkbTiet3,
    tkbTiet4,
    tkbTiet5,
    tkbTiet6,
    tkbTiet7,
    tkbTiet8,
    tkbTiet9,
    tkbTiet10
  ]
}

function filterTkbNew (tkb) {
  return [
    _.filter(tkb, { tiet: 1 }),
    _.filter(tkb, { tiet: 2 }),
    _.filter(tkb, { tiet: 3 }),
    _.filter(tkb, { tiet: 4 }),
    _.filter(tkb, { tiet: 5 }),
    _.filter(tkb, { tiet: 6 }),
    _.filter(tkb, { tiet: 7 }),
    _.filter(tkb, { tiet: 8 }),
    _.filter(tkb, { tiet: 9 }),
    _.filter(tkb, { tiet: 10 })
  ]
}
app.get('/:type', async (req, res) => {
  const { type } = req.params
  const template = `${type}/${type}.html`
  switch (type) {
    case 'giangvien':
      const listTeacher = await knex('giangvien').select()

      res.render(template, {
        listTeacher,
        numberOfTeacher: listTeacher.length
      })
      return
    case 'monhoc':
      const [listSubject] = await Promise.all([
        await knex('monhoc').select()
      ])
      res.render(template, {
        listSubject,
        numberOfSuject: listSubject.length
      })
      break
    case 'phanconggiangday':
      const [listTeacherGiangDay, listClassGiangDay, listSubjectGiangDay, listPhanCongGiangDay] = await Promise.all([
        await knex('giangvien').select(),
        await knex('lop').select(),
        await knex('monhoc').select(),
        await knex('phanconggiangday').select()
      ])
      for (let index = 0; index < listPhanCongGiangDay.length; index++) {
        const giangVien = _.filter(listTeacherGiangDay, { id: listPhanCongGiangDay[index].idgiangvien })
        const lopHoc = _.filter(listClassGiangDay, { id: listPhanCongGiangDay[index].idlop })
        const monHoc = _.filter(listSubjectGiangDay, { id: listPhanCongGiangDay[index].idmonhoc })
        listPhanCongGiangDay[index].chiTietGv = giangVien[0]
        listPhanCongGiangDay[index].chiTietLopHoc = lopHoc[0]
        listPhanCongGiangDay[index].chiTietMonHoc = monHoc[0]
      }
      res.render(template, {
        listTeacherGiangDay,
        listClassGiangDay,
        listSubjectGiangDay,
        listPhanCongGiangDay,
        numberOfSuject: listSubjectGiangDay.length
      })
      break
    case 'tkb':
      const { giangvien } = req.query
      const [listTeacherNew, listClassNew, listSubjectNew, listPhanCongGiangDayNew] = await Promise.all([
        await knex('giangvien').select(),
        await knex('lop').select(),
        await knex('monhoc').select(),
        await knex('phanconggiangday').select()
      ])
      const danhSachThuHoc = [2, 3, 4, 5, 6]
      const danhTietHocTrongNgay = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

      // Tao mang A phan cong mon hoc: { idgiangvien: 2, idmonhoc: 2, idlop: 2, duocdaylop: 0 }
      const A = []
      for (let giangvien = 0; giangvien < listTeacherNew.length; giangvien++) {
        for (let monhoc = 0; monhoc < listSubjectNew.length; monhoc++) {
          for (let lop = 0; lop < listClassNew.length; lop++) {
            const filter = {
              idgiangvien: listTeacherNew[giangvien].id,
              idmonhoc: listSubjectNew[monhoc].id,
              idlop: listClassNew[lop].id
            }
            const phanCong = _.filter(listPhanCongGiangDayNew, filter)
            if (phanCong.length) {
              A.push({ ...filter, duocdaylop: 0 }) // 0 là được dạy lớp này
            } else {
              A.push({ ...filter, duocdaylop: 1 }) // 1 là không được dạy lớp này
            }
          }
        }
      }

      const L = []
      // Tao mang L thời gian có thể học của lớp: { idlop: 2, thu: 2, tiet: 1, duocdaytiet: 0 }
      for (let lop = 0; lop < listClassNew.length; lop++) {
        for (let thuhoc = 0; thuhoc < danhSachThuHoc.length; thuhoc++) {
          for (let tiethoc = 0; tiethoc < danhTietHocTrongNgay.length; tiethoc++) {
            if (listClassNew[lop].buoihoc === 's') {
              if (danhTietHocTrongNgay[tiethoc] >= 1 && danhTietHocTrongNgay[tiethoc] <= 5) {
                L.push({
                  idlop: listClassNew[lop].id,
                  thu: danhSachThuHoc[thuhoc],
                  tiet: danhTietHocTrongNgay[tiethoc],
                  duocdaytiet: 0 // 0 là được dạy tiết này
                })
              } else {
                L.push({
                  idlop: listClassNew[lop].id,
                  thu: danhSachThuHoc[thuhoc],
                  tiet: danhTietHocTrongNgay[tiethoc],
                  duocdaytiet: 1 // 1 là không được dạy tiết này
                })
              }
            } else {
              if (danhTietHocTrongNgay[tiethoc] >= 1 && danhTietHocTrongNgay[tiethoc] <= 5) {
                L.push({
                  idlop: listClassNew[lop].id,
                  thu: danhSachThuHoc[thuhoc],
                  tiet: danhTietHocTrongNgay[tiethoc],
                  duocdaytiet: 1 // 1 là không được dạy tiết này
                })
              } else {
                L.push({
                  idlop: listClassNew[lop].id,
                  thu: danhSachThuHoc[thuhoc],
                  tiet: danhTietHocTrongNgay[tiethoc],
                  duocdaytiet: 0 // 0 là được dạy tiết này
                })
              }
            }
          }
        }
      }

      // Tạo mảng X biểu diễn khả năng giảng viên P được dạy môn S lớp C thứ D tiết T
      // A - { idgiangvien: 2, idmonhoc: 2, idlop: 2, duocdaylop: 1 } L - { idlop: 2, thu: 2, tiet: 1, duocdaytiet: 0 }
      const X = []
      for (let index = 0; index < A.length; index++) {
        const listLop = _.filter(L, { idlop: A[index].idlop })
        for (let indexLop = 0; indexLop < listLop.length; indexLop++) {
          // if (A[index].duocdaylop === 0) { // Được dạy lớp này
          //   if (listLop[indexLop].duocdaytiet === 0) { // Được dạy tiết này
          //     X.push({
          //       ...A[index],
          //       ...listLop[indexLop],
          //       duocdayloptaitiet: 1 // 1 Là được dạy lớp này tại tiết này
          //     })
          //   } else {
          //     X.push({
          //       ...A[index],
          //       ...listLop[indexLop],
          //       duocdayloptaitiet: 0 // 0 Là không được dạy lớp này tại tiết này
          //     })
          //   }
          // } else {
          //   X.push({
          //     ...A[index],
          //     ...listLop[indexLop],
          //     duocdayloptaitiet: 0 // 0 Là không được dạy lớp này tại tiết này
          //   })
          // }
          X.push({
            ...A[index],
            ...listLop[indexLop],
            duocdayloptaitiet: 0 // 1 Là được dạy lớp này tại tiết này
          })
        }
      }

      // For mảng A phân công giảng dạy : 0 được dạy - 1 không được dạy ({ idgiangvien: 2, idmonhoc: 2, idlop: 2, duocdaylop: 0 })
      for (let index = 0; index < A.length; index++) {
        if (A[index].duocdaylop === 0) {
          const phanCongGiangDayHientai = A[index] // có P, S, C
          const thongtinmonhochientai = _.filter(listSubjectNew, { id: phanCongGiangDayHientai.idmonhoc })[0]
          const thongtinlophientai = _.filter(listClassNew, { id: phanCongGiangDayHientai.idlop })[0]
          for (let tinchi = 1; tinchi <= thongtinmonhochientai.sotinchi; tinchi++) {
            let KT = true
            while (KT) {
              let danhSachTietHoc = []
              if (thongtinlophientai.buoihoc === 's') {
                danhSachTietHoc = [1, 2, 3, 4, 5]
              } else {
                danhSachTietHoc = [6, 7, 8, 9, 10]
              }
              const tietHocRandom = danhSachTietHoc[Math.floor(Math.random() * 5)]
              const thuhocRandom = danhSachThuHoc[Math.floor(Math.random() * 5)]
              const filterL = {
                idlop: thongtinlophientai.id,
                thu: thuhocRandom,
                tiet: tietHocRandom,
                duocdaytiet: 0
              }
              const kiemtratiethoccualoptaithu = _.filter(L, filterL) // L { idlop: 2, thu: 2, tiet: 1, duocdaytiet: 0 }
              if (kiemtratiethoccualoptaithu.length) {
                const Xpsctd = _.filter(X, { ...phanCongGiangDayHientai, ...kiemtratiethoccualoptaithu[0] })

                if (Xpsctd[0].duocdayloptaitiet === 0) {
                  const indexOfXpsctd = X.indexOf(Xpsctd[0])
                  X[indexOfXpsctd] = {
                    ...Xpsctd[0], duocdayloptaitiet: 1
                  }
                  KT = false
                }
              } else {
                KT = true
              }
            }
          }
        }
      }

      let danhsachDuocSapXep = _.sortBy(X, ['thu', 'tiet'])
      let thongTinGiangVien
      if (giangvien) {
        danhsachDuocSapXep = _.filter(danhsachDuocSapXep, { idgiangvien: parseInt(giangvien), duocdayloptaitiet: 1 })
        thongTinGiangVien = _.filter(listTeacherNew, { id: parseInt(giangvien) })[0]
      }
      const tkbThu2 = _.filter(danhsachDuocSapXep, { thu: 2 })
      const tkbThu3 = _.filter(danhsachDuocSapXep, { thu: 3 })
      const tkbThu4 = _.filter(danhsachDuocSapXep, { thu: 4 })
      const tkbThu5 = _.filter(danhsachDuocSapXep, { thu: 5 })
      const tkbThu6 = _.filter(danhsachDuocSapXep, { thu: 6 })

      const danhSachTkb = {
        thuHai: filterTkbNew(tkbThu2),
        thuBa: filterTkbNew(tkbThu3),
        thuTu: filterTkbNew(tkbThu4),
        thuNam: filterTkbNew(tkbThu5),
        thuSau: filterTkbNew(tkbThu6)
      }

      return res.render('tkb/tkb.html', {
        danhSachTkb,
        listTeacherNew,
        giangvien: thongTinGiangVien
      })
    case 'lop':
      const listClassNeww = await knex('lop').select()
      res.render(template, {
        listClass: listClassNeww,
        numberOfClass: listClassNeww.length
      })
      break
    default:
      res.redirect('/')
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
    const listSubject = await knex('monhoc').select()
    const template = `${type}/edit-${type}.html`
    res.render(template, {
      dataEdit,
      listTeacher,
      listClass,
      listSubject
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
    const { name, note, khoahoc, sotinchi, giangvien, lop, idmonhoc, idgiangvien, idlop, mamonhoc } = req.body
    if (!id) { throw new Error('Không tìm thấy thông tin') }
    switch (type) {
      case 'giangvien':
        if (!name) { throw new Error('Tên giảng viên là bắt buộc') }
        await knex(type).where({ id }).update({ name, note })
        return res.redirect('/')
      case 'monhoc':
        if (!name) { throw new Error('Tên môn học là bắt buộc') }
        if (!mamonhoc) { throw new Error('Mã môn học là bắt buộc') }
        if (!sotinchi) { throw new Error('Vui lòng chọn số tín chỉ') }
        await knex(type).where({ id }).update({ name, sotinchi, mamonhoc })
        return res.redirect('/monhoc')
      case 'phanconggiangday':
        if (!idmonhoc) { throw new Error('Tên môn học là bắt buộc') }
        if (!idgiangvien) { throw new Error('Vui lòng chọn giảng viên') }
        if (!idlop) { throw new Error('Vui lòng chọn lớp') }
        await knex(type).where({ id }).update({ idmonhoc, idgiangvien, idlop })
        return res.redirect('/phanconggiangday')
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
    const { mamonhoc, name, sotinchi } = req.body

    if (!name) { throw new Error('Tên môn học là bắt buộc') }
    if (!mamonhoc) { throw new Error('Mã môn học là bắt buộc') }
    if (!sotinchi) { throw new Error('Số tín chỉ là bắt buộc') }
    const listMonTheoMa = await knex('monhoc').select().where('mamonhoc', mamonhoc)
    if (listMonTheoMa.length) {
      throw new Error('Mã môn học đã tồn tại')
    }

    const idRow = await knex('monhoc').insert({ mamonhoc, name, sotinchi })
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

app.post('/phanconggiangday', async (req, res, next) => {
  try {
    const { idMonHoc, giangvien, lop } = req.body

    if (!idMonHoc) { throw new Error('Môn học là bắt buộc') }
    if (!giangvien) { throw new Error('Giảng viên là bắt buộc') }
    if (!lop) { throw new Error('Lớp là bắt buộc') }

    const idRow = await knex('phanconggiangday').insert({ idmonhoc: idMonHoc, idgiangvien: giangvien, idlop: lop })
    const infoPCMH = await knex('phanconggiangday').select().where('id', idRow[0]).first()

    res.json({
      success: true,
      message: 'Thêm phân công giảng dạy thành công',
      data: infoPCMH
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
    const { name, khoahoc, buoihoc } = req.body

    if (!name) { throw new Error('Tên lớp là bắt buộc') }
    if (!khoahoc) { throw new Error('Khoá học là bắt buộc') }
    if (!buoihoc) { throw new Error('Buổi học là bắt buộc') }

    const idRow = await knex('lop').insert({ name, khoahoc, buoihoc })
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
