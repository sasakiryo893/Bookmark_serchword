$(function(){
  var dao = new Dao();
  // サイト名を取得
  chrome.tabs.getSelected(null, function(tab) {
  });

  // 編集登録
  $('#Bt_Edit').on('click',function(){
      var id = getParam(0);
      var site = $('#input_site').val().trim();
      var url = getParam(2).trim();
      var word = $('input#search_word').val().trim();
      var memo = $('textarea#input_memo').val().trim();
      var folder_id = getParam(5);
      dao.update(id, site, url, word, memo, function(){
        window.location.href = '/popup.html' + "?folder_id=" + folder_id;
      });
  });

  //削除
  $('#Bt_Remove').on('click', function(){
    const id = getParam(0);
    var folder_id = getParam(5);
    dao.remove(id, function() {
      window.location.href = '/popup.html' + "?folder_id=" + folder_id;
    });
  })

  // リストに戻る
  $('#Bt_Cancel').on('click', function(){
  var folder_id = getParam(5);
    window.location.href = '/popup.html' + "?folder_id=" + folder_id;
  })

  // close
  $('.close').on('click', function(){
    window.close();
  })

  $('#input_site').val(getParam(1));
  $('.memo').val(getParam(3));
  $('#search_word').val(getParam(4));
});


function getParam(i){
  var url = location.href;
  parameters = url.split("?");
  //id取得
  params = parameters[1].split("=");
  id = params[1];
  //サイト名取得
  params = parameters[2].split("=");
  siteName = params[1];
  name = decodeURI(siteName);
  //URL取得
  params = parameters[3].split("=");
  url = params[1];
  //メモ取得
  params = parameters[4].split("=");
  decodeMemo = params[1];
  memo = decodeURI(decodeMemo);
  //検索ワード取得
  params = parameters[5].split("=");
  decodeWord = params[1];
  word = decodeURI(decodeWord);

  params = parameters[6].split("=");
  folder_id = params[1];

  var list = [id, name, url, memo, word, folder_id];

  return list[i];
}

var Dao = function(){
  var name = 'localdb';
  var version = '1.0';
  var description = 'Web SQL Database';
  var size = 5 * 1024 * 1024;
  var db = openDatabase(name, version, description, size);

  // 編集保存
  this.update = function(id, site, url, word, memo, callback){
    db.transaction(function (tx){
      tx.executeSql('update bookmarks SET name=?, url=?, search_word=?, memo=? WHERE id=?', [site, url, word, memo,id]);
      callback();
    });
  }

  // 削除
  this.remove = function(id, callback){
    db.transaction(function (tx){
      tx.executeSql('delete from bookmarks where id = ?', [id]);
      callback();
    });
  }


}
