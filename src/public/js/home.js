(function (cbFn) {
  cbFn(window.jQuery, window)
})(function cbFn ($, window) {
  $(pageHomeReady)

  function pageHomeReady () {
    $('select').formSelect()

    var $formAddGv = $('#form-add-gv')
    var $formAddLop = $('#form-add-lop')
    var $formAddMh = $('#form-add-mh')
    var $formAddPCGD = $('#form-add-phanconggiangday')
    var numberOfTeacher = $formAddGv.data('number')
    var numberOfSubject = $formAddMh.data('number')
    var numberOfClass = $formAddLop.data('number')
    $formAddGv.on('submit', handleAddGv)
    $formAddLop.on('submit', handleAddLop)
    $formAddMh.on('submit', handleAddMh)
    $formAddPCGD.on('submit', handleAddPCGD)
    $('body').on('click', '.btn-delete-gv', handleDeleteGv)
    $('body').on('click', '.btn-delete-lop', handleDeleteLop)
    $('body').on('click', '.btn-delete-mh', handleDeleteMh)
    $('body').on('click', '.btn-delete-pcgd', handleDeletePCMH)

    function handleAddGv (event) {
      event.preventDefault()
      var formData = $formAddGv.serializeArray()
      if (!formData[0].value) {
        return showToastr('Tên giảng viên là bắt buộc', true)
      }
      $.ajax({
        type: 'POST',
        url: $formAddGv.attr('action'),
        data: $formAddGv.serialize(),
        success: function (response) {
          numberOfTeacher += 1
          $('.gv-table-body').append(
            `
            <tr id="giangvien-${response.data.id}">
              <td>${numberOfTeacher}</td>
              <td>${response.data.name}</td>
              <td>${response.data.note}</td>
              <td>
                <a href="/edit/giangvien/${response.data.id}" class="waves-effect waves-light btn btn-small" >
                  <i class="material-icons">edit</i>
                </a>
                <a href="/giangvien/${response.data.id}" class="waves-effect waves-light btn btn-small red lighten-2 btn-delete-gv">
                  <i class="material-icons">delete</i>
                </a>
              </td>
            </tr>
            `
          )
          $('select').formSelect()
          $formAddGv.trigger('reset')
          showToastr(response.message)
        }
      })
    }

    function handleAddLop (event) {
      event.preventDefault()
      var formData = $formAddLop.serializeArray()
      if (!formData[0].value) {
        return showToastr('Tên lớp là bắt buộc', true)
      }
      if (!formData[1].value) {
        return showToastr('Khoá học là bắt buộc', true)
      }
      if (!formData[2]) {
        return showToastr('Vui lòng chọn buổi học', true)
      }

      $.ajax({
        type: 'POST',
        url: $formAddLop.attr('action'),
        data: $formAddLop.serialize(),
        success: function (response) {
          showToastr(response.message)
          setTimeout(() => {
            window.location.reload()
          }, 1000)
        }
      })
    }

    function handleAddMh (event) {
      event.preventDefault()
      var formData = $formAddMh.serializeArray()
      if (!formData[0].value) { return showToastr('Tên môn học là bắt buộc', true) }
      if (!formData[1]) { return showToastr('Vui lòng chọn số tín chỉ', true) }

      $.ajax({
        type: 'POST',
        url: $formAddMh.attr('action'),
        data: $formAddMh.serialize(),
        success: function (response) {
          numberOfSubject += 1
          $('.mh-table-body').append(
            `
            <tr id="monhoc-${response.data.id}">
              <td>${numberOfSubject}</td>
              <td>${response.data.name}</td>
              <td>${response.data.sotinchi}</td>
              <td>
                <a href="/edit/monhoc/${response.data.id}" class="waves-effect waves-light btn btn-small" >
                  <i class="material-icons">edit</i>
                </a>
                <a href="/monhoc/${response.data.id}" class="waves-effect waves-light btn btn-small red lighten-2 btn-delete-mh">
                  <i class="material-icons">delete</i>
                </a>
              </td>
            </tr>
            `
          )
          $formAddMh.trigger('reset')
          showToastr(response.message)
        }
      })
    }

    function handleAddPCGD (event) {
      event.preventDefault()
      var formData = $formAddPCGD.serializeArray()
      if (!formData[0]) { return showToastr('Vui lòng chọn môn học', true) }
      if (!formData[1]) { return showToastr('Vui lòng chọn giảng viên', true) }
      if (!formData[1]) { return showToastr('Vui lòng chọn lớp', true) }

      $.ajax({
        type: 'POST',
        url: $formAddPCGD.attr('action'),
        data: $formAddPCGD.serialize(),
        success: function (response) {
          showToastr(response.message)
          setTimeout(() => {
            window.location.reload()
          }, 1000)
        }
      })
    }

    function handleDeleteGv (event) {
      event.preventDefault()
      window.Swal.fire({
        title: 'Bạn có chắc không?',
        text: 'Thông xin sẽ bị xoá vĩnh viễn!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Huỷ',
        confirmButtonText: 'Vâng, tiếp tục!'
      }).then((result) => {
        if (result.value) {
          var currentBtn = $(event.currentTarget)
          $.ajax({
            type: 'DELETE',
            url: currentBtn.attr('href'),
            success: function (response) {
              if (response.success) {
                numberOfTeacher -= 1
                $(`#giangvien-${response.data.id}`).remove()
                window.Swal.fire(
                  'Thành công!',
                  'Xoá thông tin thành công.',
                  'success'
                )
                setTimeout(() => {
                  window.location.reload()
                }, 2000)
              }
            }
          })
        }
      })
    }
    function handleDeleteLop (event) {
      event.preventDefault()
      window.Swal.fire({
        title: 'Bạn có chắc không?',
        text: 'Thông xin sẽ bị xoá vĩnh viễn!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Huỷ',
        confirmButtonText: 'Vâng, tiếp tục!'
      }).then((result) => {
        if (result.value) {
          var currentBtn = $(event.currentTarget)
          $.ajax({
            type: 'DELETE',
            url: currentBtn.attr('href'),
            success: function (response) {
              if (response.success) {
                numberOfClass -= 1
                $(`#lop-${response.data.id}`).remove()
                window.Swal.fire(
                  'Thành công!',
                  'Xoá thông tin thành công.',
                  'success'
                )
                setTimeout(() => {
                  window.location.reload()
                }, 2000)
              }
            }
          })
        }
      })
    }
    function handleDeleteMh (event) {
      event.preventDefault()
      window.Swal.fire({
        title: 'Bạn có chắc không?',
        text: 'Thông xin sẽ bị xoá vĩnh viễn!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Huỷ',
        confirmButtonText: 'Vâng, tiếp tục!'
      }).then((result) => {
        if (result.value) {
          var currentBtn = $(event.currentTarget)
          $.ajax({
            type: 'DELETE',
            url: currentBtn.attr('href'),
            success: function (response) {
              if (response.success) {
                numberOfSubject -= 1
                $(`#monhoc-${response.data.id}`).remove()
                window.Swal.fire(
                  'Thành công!',
                  'Xoá thông tin thành công.',
                  'success'
                )
                setTimeout(() => {
                  window.location.reload()
                }, 2000)
              }
            }
          })
        }
      })
    }
    function handleDeletePCMH (event) {
      event.preventDefault()
      window.Swal.fire({
        title: 'Bạn có chắc không?',
        text: 'Thông xin sẽ bị xoá vĩnh viễn!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Huỷ',
        confirmButtonText: 'Vâng, tiếp tục!'
      }).then((result) => {
        if (result.value) {
          var currentBtn = $(event.currentTarget)
          $.ajax({
            type: 'DELETE',
            url: currentBtn.attr('href'),
            success: function (response) {
              if (response.success) {
                $(`#pcgd-${response.data.id}`).remove()
                window.Swal.fire(
                  'Thành công!',
                  'Xoá thông tin thành công.',
                  'success'
                )
                setTimeout(() => {
                  window.location.reload()
                }, 2000)
              }
            }
          })
        }
      })
    }

    function showToastr (message, error) {
      window.toastr.remove()
      if (error) {
        return window.toastr.error(message)
      }
      window.toastr.success(message)
    }
  }
})
