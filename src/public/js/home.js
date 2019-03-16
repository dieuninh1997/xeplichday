(function (cbFn) {
  cbFn(window.jQuery, window)
})(function cbFn ($, window) {
  $(pageHomeReady)

  function pageHomeReady () {
    $('select').formSelect()
    var btnGv = $('#btn-gv')
    var btnMh = $('#btn-mh')
    var btnLop = $('#btn-lop')
    var formAddGv = $('#form-add-gv')
    var formAddLop = $('#form-add-lop')
    var formAddMh = $('#form-add-mh')

    var gvContainer = $('.gv-container')
    var mhContainer = $('.mh-container')
    var lopContainer = $('.lop-container')

    mhContainer.hide()
    lopContainer.hide()
    btnGv.on('click', handleClickGv)
    btnMh.on('click', handleClickMh)
    btnLop.on('click', handleClickLop)
    formAddGv.on('submit', handleAddGv)
    formAddLop.on('submit', handleAddLop)
    formAddMh.on('submit', handleAddMh)

    function handleClickGv (event) {
      gvContainer.show()
      mhContainer.hide()
      lopContainer.hide()
    }

    function handleClickMh (event) {
      gvContainer.hide()
      mhContainer.show()
      lopContainer.hide()
    }

    function handleClickLop (event) {
      gvContainer.hide()
      mhContainer.hide()
      lopContainer.show()
    }

    function handleAddGv (event) {
      event.preventDefault()
      var formData = formAddGv.serializeArray()
      if (!formData[0].value) {
        window.toastr.remove()
        window.toastr.error('Tên giảng viên là bắt buộc')
        return
      }
      $.ajax({
        type: 'POST',
        url: formAddGv.attr('action'),
        data: formAddGv.serialize(),
        success: function (response) {
          console.log('response', response)

          $('.gv-table-body').append(
            `
            <tr>
              <td>${response.data.id}</td>
              <td>${response.data.name}</td>
              <td>${response.data.note}</td>
            </tr>
            `
          )
          $('#select-gv').append(
            `
            <option value=${response.data.id}>${response.data.name}</option>
            `
          )
          $('select').formSelect()
          formAddGv.trigger('reset')
          window.toastr.remove()
          window.toastr.success(response.message)
        }
      })
    }

    function handleAddLop (event) {
      event.preventDefault()
      var formData = formAddLop.serializeArray()
      if (!formData[0].value) {
        window.toastr.remove()
        window.toastr.error('Tên lớp là bắt buộc')
        return
      }
      if (!formData[1].value) {
        window.toastr.remove()
        window.toastr.error('Khoá học là bắt buộc')
        return
      }

      $.ajax({
        type: 'POST',
        url: formAddLop.attr('action'),
        data: formAddLop.serialize(),
        success: function (response) {
          console.log('response', response)

          $('.lop-table-body').append(
            `
            <tr>
              <td>${response.data.id}</td>
              <td>${response.data.name}</td>
              <td>${response.data.khoahoc}</td>
            </tr>
            `
          )
          $('#select-lop').append(
            `<option value=${response.data.id}>${response.data.name}</option>`
          )
          $('select').formSelect()
          formAddLop.trigger('reset')
          window.toastr.remove()
          window.toastr.success(response.message)
        }
      })
    }

    function handleAddMh (event) {
      event.preventDefault()
      var formData = formAddMh.serializeArray()
      if (!formData[0].value) {
        window.toastr.remove()
        window.toastr.error('Tên môn học là bắt buộc')
        return
      }
      if (!formData[1]) {
        window.toastr.remove()
        window.toastr.error('Vui lòng chọn số tín chỉ')
        return
      }
      if (!formData[2]) {
        window.toastr.remove()
        window.toastr.error('Vui lòng chọn giảng viên')
        return
      }
      if (!formData[3]) {
        window.toastr.remove()
        window.toastr.error('Vui lòng chọn lớp')
        return
      }

      $.ajax({
        type: 'POST',
        url: formAddMh.attr('action'),
        data: formAddMh.serialize(),
        success: function (response) {
          console.log('response', response)

          $('.mh-table-body').append(
            `
            <tr>
              <td>${response.data.id}</td>
              <td>${response.data.name}</td>
              <td>${response.data.sotinchi}</td>
              <td>${response.data.giangvien}</td>
              <td>${response.data.lop}</td>
            </tr>
            `
          )
          formAddMh.trigger('reset')
          window.toastr.remove()
          window.toastr.success(response.message)
        }
      })
    }
  }
})
