var TodoDao = function(){
  var name = 'localdb'
  var version = '1.0'
  var description = 'Web SQL Database'
  var size = 2 * 1024 * 1024
  var db = openDatabase(name, version, description, size)

  // テーブル作成
  db.transaction(function(tx){
    tx.executeSql(`
      create table if not exists search (
        id integer primary key autoincrement,
        name varchar(300) not null,
        url varchar(2083) not null,
        search_word varchar(100) null,
        memo text null
      )
    `)
  })

  // 全件検索
  this.findAll = function(callback){
    db.transaction(function (tx){
      tx.executeSql('select * from search', [],
        function (tx, results){
          var list = []
          for (i = 0; i < results.rows.length; i++){
            list.push({
              id: results.rows.item(i).id,
              name: results.rows.item(i).name,
              url: results.rows.item(i).url,
              search_word: results.rows.item(i).search_word,
              memo: results.rows.item(i).memo,
            })
          }
          callback(list)
        })
    })
  }




  // 登録
  this.insert = function(site, callback){
    db.transaction(function (tx){
      tx.executeSql('insert into search (name, url, search_word, memo) values (?, "url", "word", "memo")', [site], callback)
    })
  }

  // 更新
  this.update = function(id, site, callback){
    db.transaction(function (tx){
      tx.executeSql('update search set name = ? where id = ?', [site, id], callback)
    })
  }

  // 削除
  this.remove = function(id, callback){
    db.transaction(function (tx){
      tx.executeSql('delete from search where id = ?', [id], callback)
    })
  }

}




// ↑ TodoDao.js
// ↓ index.js



// DAOインスタンス
var tododao = new TodoDao()

$(document).ready(function(){
  // イベントハンドラ登録
  $('input[name=name_input]').keyup(function(v){
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
          <td>${e.id}</td>
          <td>${e.name}</td>
          <td>${e.url}</td>
          <td>${e.search_word}</td>
          <td>${e.memo}</td>
          <td><button type="button" name="edit" value="${e.id}">更新</button></td>
          <td><button type="button" name="remove" value="${e.id}">削除</button></td>
        </tr>
      `)
    })

    // TODOテキストボックス、ボタンの初期化
    $('input[name=name_input]').val('').focus().keyup()
  })
}

// 登録
var register = function(){
  var name = $('input[name=name_input]').val()
  tododao.insert(name, init)
}

// 更新
var edit = function(){
  var id = $(this).val()
  var name = $('input[name=name_input]').val()
  tododao.update(id, name, init)
}

// 削除
var remove = function(){
  var id = $(this).val()
  tododao.remove(id, init)
}
