var TodoDao = function(){
  var name = 'localdb'
  var version = '1.0'
  var description = 'Web SQL Database'
  var size = 2 * 1024 * 1024
  var db = openDatabase(name, version, description, size)

  // テーブル作成
  db.transaction(function(tx){
    tx.executeSql(`
      create table if not exists todo (
        id integer primary key autoincrement,
        todo varchar
      )
    `)
  })

  // 全件検索
  this.findAll = function(callback){
    db.transaction(function (tx){
      tx.executeSql('select * from todo', [],
        function (tx, results){
          var list = []
          for (i = 0; i < results.rows.length; i++){
            list.push({
              id: results.rows.item(i).id,
              todo: results.rows.item(i).todo
            })
          }
          callback(list)
        })
    })
  }




  // 登録
  this.insert = function(todo, callback){
    db.transaction(function (tx){
      tx.executeSql('insert into todo (todo) values (?)', [todo], callback)
    })
  }

  // 更新
  this.update = function(id, todo, callback){
    db.transaction(function (tx){
      tx.executeSql('update todo set todo = ? where id = ?', [todo, id], callback)
    })
  }

  // 削除
  this.remove = function(id, callback){
    db.transaction(function (tx){
      tx.executeSql('delete from todo where id = ?', [id], callback)
    })
  }

}


// ↑ TodoDao.js
// ↓ index.js

// DAOインスタンス
var tododao = new TodoDao()

$(document).ready(function(){
  // イベントハンドラ登録
  $('input[name=todo]').keyup(function(v){
    $('button[name=register], button[name=edit]')
      .prop('disabled', $(this).val() == 0)
  })
  $('button[name=register]').on('click', register)
  $('#table tbody').on('click', 'tr td button[name=edit]', edit)
  $('#table tbody').on('click', 'tr td button[name=remove]', remove)

  init()
})

// 初期化（全件表示）
var init = function(){
  // TODO表の削除
  $('#table tbody').empty()
  // TODO表の表示
  tododao.findAll(function(list){
    $.each(list, function(i, e){
      $('#table tbody').append(`
        <tr>
          <td>${i+1}</td>
          <td>${e.todo}</td>
          <td><button type="button" name="edit" value="${e.id}">更新</button></td>
          <td><button type="button" name="remove" value="${e.id}">削除</button></td>
        </tr>
      `)
    })

    // TODOテキストボックス、ボタンの初期化
    $('input[name=todo]').val('').focus().keyup()
  })
}

// 登録
var register = function(){
  var todo = $('input[name=todo]').val()
  tododao.insert(todo, init)
}

// 更新
var edit = function(){
  var id = $(this).val()
  var todo = $('input[name=todo]').val()
  tododao.update(id, todo, init)
}

// 削除
var remove = function(){
  var id = $(this).val()
  tododao.remove(id, init)
}
