var TodoDao = function(){
  var name = 'localdb'
  var version = '1.0'
  var description = 'Web SQL Database'
  var size = 5 * 1024 * 1024
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
  this.insert = function(site, url, word, memo, callback){
    db.transaction(function (tx){
      tx.executeSql('insert into search (name, url, search_word, memo) values (?, ?, ?, ?)', [site, url, word, memo], callback)
    })
  }

  //選択
  this.select = function(id, callback) {
    db.transaction(function (tx){
      tx.executeSql('select * from search where id = ?', [id],
        function(tx, result) {
          var list = []
          list.push({
            id: result.rows.item(0).id,
            name: result.rows.item(0).name,
            url: result.rows.item(0).url,
            search_word: result.rows.item(0).search_word,
            memo: result.rows.item(0).memo,
          })
          callback(list[0])
        })
    })
  }

  // 更新
  this.update = function(id, site, url, word, memo, callback){
    db.transaction(function (tx){
      tx.executeSql('update search set name = ?, url = ?, search_word = ?, memo = ? where id = ?', [site, url, word, memo, id], callback)
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
  /*
  // イベントハンドラ登録
  $('input[name=site_input]').keyup(function(v){
    $('button[name=register], button[name=edit]')
      .prop('disabled', $(this).val() == 0)
  })
  */
  $('button[name=register]').on('click', register)
  $('#table tbody').on('click', 'tr td button[name=select]', select)
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
          <td><button type="button" name="select" value="${e.id}">選択</button></td>
          <td><button type="button" name="edit" value="${e.id}">更新</button></td>
          <td><button type="button" name="remove" value="${e.id}">削除</button></td>
        </tr>
      `)
    })

    // TODOテキストボックス、ボタンの初期化
    $('input#site_input').val('').focus().keyup()
    $('input#url_input').val('').focus().keyup()
    $('input#word_input').val('').focus().keyup()
    $('input#memo_input').val('').focus().keyup()
  })
}

// 登録
var register = function(){
  var site = $('input#site_input').val()
  var url = $('input#url_input').val()
  var word = $('input#word_input').val()
  var memo = $('input#memo_input').val()
  tododao.insert(site, url, word, memo, init)
}

//選択
var select = function() {
  var id = $(this).val()
  tododao.select(id, function(list){
    $('input#site_input').val(list.name)
    $('input#url_input').val(list.url)
    $('input#word_input').val(list.search_word)
    $('input#memo_input').val(list.memo)
  })
}

// 更新
var edit = function(){
  var id = $(this).val()
  var name = $('input#site_input').val()
  var url = $('input#url_input').val()
  var word = $('input#word_input').val()
  var memo = $('input#memo_input').val()
  /*$(this).html('<input type="text" value="' +name+ '"/>')
  $('input[name=site_input]').focus().blur(function(){
    val inputVal = $(this).val();
    if(inputVal ===''){
      inputVal = this.defaullValue;
    }
    $(this).parent().removeClass('on').text(inputVal)
  })*/
  tododao.update(id, name, url, word, memo, init)
}

// 削除
var remove = function(){
  var id = $(this).val()
  tododao.remove(id, init)
}
