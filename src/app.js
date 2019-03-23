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

function demGioDayY (tkb, idgiangvien, thu) {
  return _.filter(tkb, { idgiangvien, thu }).length
}

// Không giảng viên nào dạy 2 lớp trong cùng thời gian
function giangBuocHC1 (tkb, idgiangvien, idmonhoc, thu, tiet) {
  const result = _.filter(tkb, { idgiangvien, idmonhoc, thu, tiet })
  if (result.length >= 2) {
    console.log('Loi giang buoc 1')
    return false
  }
  return true
}
//  Không lớp nào phải học 2 môn trong cùng 1 thời gian
function giangBuocHC2 (tkb, idlop, thu, tiet) {
  const result = _.filter(tkb, { idlop, thu, tiet })
  if (result.length >= 2) {
    console.log('Loi giang buoc 2')
    return false
  }
  return true
}
// Giảng viên phải dạy đúng lớp và đúng môn học được giao
function giangBuocHC3 (tkb, A, idgiangvien, idmonhoc, idlop, thu, tiet) {
  return true
}
// Mỗi giảng viên dạy 1 môn nào đó phải đủ số lớp theo phân công
function giangBuocHC4 (tkb, monhoc, A, idgiangvien, idmonhoc) {
  const resultTkb = _.filter(tkb, { idgiangvien, idmonhoc })
  const filterMon = _.filter(monhoc, { id: idmonhoc })[0]
  const resultA = _.filter(A, { idgiangvien, idmonhoc, duocdaylop: 0 })
  if (resultTkb.length / filterMon.sotinchi === resultA.length) {
    return true
  }
  console.log('Loi giang buoc 4')
  return false
}
// Mỗi giảng viên phải dạy đủ số môn
function giangBuocHC5 (tkb, monhoc, A, idgiangvien) {
  // const resultTkb = _.filter(tkb, { idgiangvien })
  // const resultA = _.filter(A, { idgiangvien, duocdaylop: 0 })
  // if (resultTkb.length / filterMon.sotinchi === resultA.length) {
  //   return true
  // }
  // console.log('================================================')
  // console.log('filterMon', filterMon)
  // console.log('resultTkb', resultTkb.length, filterMon.sotinchi, resultA.length)
  // console.log('================================================')

  // console.log('Loi giang buoc 5')
  return true
}
// Các lớp học đúng thời gian được phân công
function giangBuocHC6 () {
  return true
}

function kiemTra (arrayX, A, monhoc, listTkbOke = []) {
  for (let index = 0; index < arrayX.length; index++) {
    const tkb = arrayX[index]
    let KT = true
    for (let indexTkb = 0; indexTkb < tkb.length; indexTkb++) {
      const { idgiangvien, idmonhoc, idlop, thu, tiet } = tkb[indexTkb]
      if (
        giangBuocHC1(tkb, idgiangvien, idmonhoc, thu, tiet) === false ||
        giangBuocHC2(tkb, idlop, thu, tiet) === false ||
        giangBuocHC3(tkb, A, idgiangvien, idmonhoc, idlop, thu, tiet) === false ||
        giangBuocHC4(tkb, monhoc, A, idgiangvien, idmonhoc) === false ||
        giangBuocHC5(tkb, monhoc, A, idgiangvien, idmonhoc) === false ||
        giangBuocHC6() === false
      ) {
        KT = false
        break
      }
    }
    KT && listTkbOke.push(tkb)
  }
  console.log('================================================')
  console.log('listTkbOke', listTkbOke.length)
  console.log('================================================')
  return listTkbOke
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
app.get('/tkb/sinhtkb', async (req, res) => {
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
  const arrayX = []
  for (let indexArrX = 0; indexArrX < 1; indexArrX++) {
    const X = []
    for (let index = 0; index < A.length; index++) {
      const listLop = _.filter(L, { idlop: A[index].idlop })
      for (let indexLop = 0; indexLop < listLop.length; indexLop++) {
        X.push({
          ...A[index],
          ...listLop[indexLop],
          duocdayloptaitiet: 0 // 0 Là không được dạy lớp này tại tiết này
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

              // Xet giang buoc HC1
              const filterHC1 = {
                idgiangvien: phanCongGiangDayHientai.idgiangvien, thu: thuhocRandom, tiet: tietHocRandom, duocdayloptaitiet: 1
              }
              const xemgiangviendadaylopnaotaitietchua = _.filter(X, filterHC1)
              if (xemgiangviendadaylopnaotaitietchua.length) {
                KT = true
              } else {
                // Xet giang buoc HC2
                const filterHC2 = {
                  idlop: phanCongGiangDayHientai.idlop,
                  thu: thuhocRandom,
                  tiet: tietHocRandom,
                  duocdayloptaitiet: 1
                }
                const xemlopdahocmonnaochua = _.filter(X, filterHC2)
                if (xemlopdahocmonnaochua.length) {
                  KT = true
                } else {
                  if (Xpsctd[0].duocdayloptaitiet === 0) {
                    const indexOfXpsctd = X.indexOf(Xpsctd[0])
                    X[indexOfXpsctd] = {
                      ...Xpsctd[0], duocdayloptaitiet: 1
                    }
                    KT = false
                  } else {
                    KT = false
                  }
                }
              }
            } else {
              KT = true
            }
          }
        }
      }
    }
    arrayX.push(_.filter(X, { duocdayloptaitiet: 1 }))
  }

  const listCuoi = kiemTra(arrayX, A, listSubjectNew, [])
  const listPromise = []
  for (let index = 0; index < listCuoi.length; index++) {
    const tkb = listCuoi[index]
    listPromise.push(knex('xrandom').insert({ value: JSON.stringify(tkb) }))
  }
  const listDone = await Promise.all(listPromise)
  console.log('================================================')
  console.log('Da them ', listDone)
  console.log('================================================')

  return res.redirect('/tkb/sinhtkb')
})

app.get('/tkb/giangvien', async (req, res) => {
  try {
    const { giangvien = 2 } = req.query
    const [listTeacherNew, listClassNew, listSubjectNew] = await Promise.all([
      await knex('giangvien').select(),
      await knex('lop').select(),
      await knex('monhoc').select()
    ])

    const tkb = await knex('xrandom').select().where('id', 2).first()
    const tkbCuoi = JSON.parse(tkb.value)
    let danhsachDuocSapXep = _.sortBy(tkbCuoi, ['thu', 'tiet'])
    let tkbThemThongTin = []
    for (let thongtin = 0; thongtin < danhsachDuocSapXep.length; thongtin++) {
      const thongtinhientai = danhsachDuocSapXep[thongtin]
      const thongtinGiangVien = _.filter(listTeacherNew, { id: thongtinhientai.idgiangvien })[0]
      const thongtinLop = _.filter(listClassNew, { id: thongtinhientai.idlop })[0]
      const thongtinMonHoc = _.filter(listSubjectNew, { id: thongtinhientai.idmonhoc })[0]
      tkbThemThongTin.push({
        ...thongtinhientai,
        thongtinGiangVien,
        thongtinLop,
        thongtinMonHoc
      })
    }

    let thongTinGiangVien
    if (giangvien) {
      tkbThemThongTin = _.filter(tkbThemThongTin, { idgiangvien: parseInt(giangvien) })
      thongTinGiangVien = _.filter(listTeacherNew, { id: parseInt(giangvien) })[0]

      const tkbThu2 = _.filter(tkbThemThongTin, { thu: 2 })
      const tkbThu3 = _.filter(tkbThemThongTin, { thu: 3 })
      const tkbThu4 = _.filter(tkbThemThongTin, { thu: 4 })
      const tkbThu5 = _.filter(tkbThemThongTin, { thu: 5 })
      const tkbThu6 = _.filter(tkbThemThongTin, { thu: 6 })

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
    }
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
      data: error
    })
  }
})

app.get('/tkb/lop', async (req, res) => {
  try {
    const { lop = 2 } = req.query
    const [listTeacherNew, listClassNew, listSubjectNew] = await Promise.all([
      await knex('giangvien').select(),
      await knex('lop').select(),
      await knex('monhoc').select()
    ])

    const tkb = await knex('xrandom').select().where('id', 2).first()
    const tkbCuoi = JSON.parse(tkb.value)
    let danhsachDuocSapXep = _.sortBy(tkbCuoi, ['thu', 'tiet'])
    let tkbThemThongTin = []
    for (let thongtin = 0; thongtin < danhsachDuocSapXep.length; thongtin++) {
      const thongtinhientai = danhsachDuocSapXep[thongtin]
      const thongtinGiangVien = _.filter(listTeacherNew, { id: thongtinhientai.idgiangvien })[0]
      const thongtinLop = _.filter(listClassNew, { id: thongtinhientai.idlop })[0]
      const thongtinMonHoc = _.filter(listSubjectNew, { id: thongtinhientai.idmonhoc })[0]
      tkbThemThongTin.push({
        ...thongtinhientai,
        thongtinGiangVien,
        thongtinLop,
        thongtinMonHoc
      })
    }

    let thongTinLop
    if (lop) {
      tkbThemThongTin = _.filter(tkbThemThongTin, { idlop: parseInt(lop) })
      thongTinLop = _.filter(listClassNew, { id: parseInt(lop) })[0]

      const tkbThu2 = _.filter(tkbThemThongTin, { thu: 2 })
      const tkbThu3 = _.filter(tkbThemThongTin, { thu: 3 })
      const tkbThu4 = _.filter(tkbThemThongTin, { thu: 4 })
      const tkbThu5 = _.filter(tkbThemThongTin, { thu: 5 })
      const tkbThu6 = _.filter(tkbThemThongTin, { thu: 6 })

      const danhSachTkb = {
        thuHai: filterTkbNew(tkbThu2),
        thuBa: filterTkbNew(tkbThu3),
        thuTu: filterTkbNew(tkbThu4),
        thuNam: filterTkbNew(tkbThu5),
        thuSau: filterTkbNew(tkbThu6)
      }
      return res.render('tkb/tkb-lop.html', {
        danhSachTkb,
        listClassNew,
        lop: thongTinLop
      })
    }
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
      data: error
    })
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
