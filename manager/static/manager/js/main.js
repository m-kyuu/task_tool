$(function() {
    checkAdd();

    $(document).on('click', '.add-btn', function(e){
        e.preventDefault();
        var icon = $(this).find('i');
        if(icon.hasClass('fa-plus-circle')){
            icon.removeClass('fa-plus-circle').addClass('fa-minus-circle');
        }else{
            icon.removeClass('fa-minus-circle').addClass('fa-plus-circle');
        }
        $('.add-form').slideToggle('normal');
        $('#id_start_date').val(getToday);
    });

    $('#task-form').submit(function() {
        if(inputCheck() == 1){
            return false;
        }else{
            return true;
        }
    });

    $('.form-control').focus(function() {
        $(this).css('border', '1px solid #87cefa');
    }).blur(function() {
        $(this).css('border', '1px solid #ced4da');
    });

    $(document).on('click', '.upload-btn', function(e) {
        e.preventDefault();
        var icon = $(this).find('i');
        if(icon.hasClass('fa-plus-circle')){
            icon.removeClass('fa-plus-circle').addClass('fa-minus-circle');
        }else{
            icon.removeClass('fa-minus-circle').addClass('fa-plus-circle');
        }
        $('.upload-form').slideToggle('normal');
    })

    $('#file-input').on('change', function() {
        var file = $(this).prop('files')[0];
        var extension = file.name.split('.').pop();
        if(extension != 'csv') {
            errorToast('csvファイルを選択してください。');
            $(this).empty();
        }else{
            $('.file-name').text(file.name);
            $('.confirm-btn').show();
        }
    });

    $(document).on('click', '.confirm-btn', function() {
        var tableBody = document.getElementById('id_upload_table');
        var reader = new FileReader();
        var file = $('#file-input').prop('files')[0];
        console.log(file);
        reader.onload = function() {
            var cols = reader.result.split('\n');
            var data = [];
            for (var i = 0; i < cols.length; i++) {
                data[i] = cols[i].split(',');
            }
            var insert = getTask(data);
            tableBody.appendChild(insert);
        }
        reader.readAsText(file);
        $('.first-modal').modal('show');
    });

    $(document).on('click', 'tr[id^="task"]', function() {
        var task_id = $(this).attr('id').replace(/task/, '');
        var url = $(this).attr('data-url');
        setAjax();
        $.ajax({
            'url': url,
            'type': 'POST',
            'data': {
                'id': task_id,
            },
            'dataType': 'json',
            'success': function(response) {
                var detail = response.detail;
                $('.project-info').text(detail);
                $('.second-modal').modal('show');
            },
        });
        return false;
    });

});

function checkAdd() {
    var message = $('.message')
    console.log(message.text().length);
    if(message.text().match('add')){
        successToast('タスクを追加しました。');
        message.text('');
    }else if(message.text().match('upload')){
        successToast('タスクをアップロードしました。');
        message.text('');
    }
}

function inputCheck() {
    var flag = 0;
    var start_date = $('#id_start_date');
    var title = $('#id_title');
    var project = $('#id_project');
    if(start_date.val() == '' || start_date.val() == null){
        errorToast('開始日を入力してください。');
        start_date.css('border', '1px solid #ff8c00');
        flag = 1;
    }
    if(title.val() == '' || title.val() == null) {
        errorToast('内容を入力してください。');
        title.css('border', '1px solid #ff8c00');
        flag = 1;
    }
    if(project.val() == '' || project.val() == null) {
        errorToast('プロジェクトを選択してください。');
        project.css('border', '1px solid #ff8c00');
        flag = 1;
    }
    return flag;
}

var successToast = function(str) {
    $.toast({
        text: str,
        icon: 'success',
        heading: 'Success',
        showHideTransition: 'fade',
        allowToastClose: true,
        hideAfter: 3500,
        stack: false,
        textAlign: 'left',
        position: 'bottom-right',
        loader: false
    })
}

var errorToast = function(str) {
    $.toast({
        text: str,
        icon: 'error',
        heading: 'Error',
        showHideTransition: 'fade',
        allowToastClose: true,
        hideAfter: 4500,
        stack: 3,
        textAlign: 'left',
        position: 'bottom-left',
        loader: false
    })
}

//テーブルを生成
function getTask(data) {
    var tableBody = document.createElement('tbody');
    for(var i = 0; i < data.length; i++) {
        var newTask = document.createElement("tr");
        for(var ii = 0; ii < data[i].length - 1; ii++) {
            //セルを作成
            var detail = document.createElement("td");
            detail.textContent = data[i][ii];
            newTask.appendChild(detail);
        }
        tableBody.appendChild(newTask);
    }
    return tableBody;
}

//今日の日付を生成
function getToday() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var toTargetDigits = function(num) {
        num += "";
        if(num.length === 1) {
            num = "0" + num;
        }
        return num;
    }
    var yyyy = toTargetDigits(year);
    var mm = toTargetDigits(month);
    var dd = toTargetDigits(day);
    return(yyyy + "-" + mm + "-" + dd);
}

function setAjax() {
    function getCookie(name) {
          var cookieValue = null;
          if (document.cookie && document.cookie !== '') {
              var cookies = document.cookie.split(';');
              for (var i = 0; i < cookies.length; i++) {
                  var cookie = jQuery.trim(cookies[i]);
                  // Does this cookie string begin with the name we want?
                  if (cookie.substring(0, name.length + 1) === (name + '=')) {
                      cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                      break;
                  }
              }
          }
          return cookieValue;
      }
      var csrftoken = getCookie('csrftoken');

      function csrfSafeMethod(method) {
          // these HTTP methods do not require CSRF protection
          return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
      }
      $.ajaxSetup({
          beforeSend: function(xhr, settings) {
              if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                  xhr.setRequestHeader("X-CSRFToken", csrftoken);
              }
          }
      });
}


