$(function(){
  var dao = new Dao();
  // サイト名を取得
  chrome.tabs.getSelected(null, function(tab) {
  });

  $('#input_name').focus();

  // 編集登録
  $('#Bt_Edit').on('click',function(){
      var id = getParam(0);
      var name = $('#input_name').val().trim();
      var parent_id = getParam(2);
      dao.update(id, name, function() {
        window.location.href = '/popup.html' + "?folder_id=" + parent_id;
      });
  });

  //削除
  $('#Bt_Remove').on('click',function(){
    const id = getParam(0);
    var parent_id = getParam(2);
    dao.remove(id, function() {
      window.location.href = '/popup.html' + "?folder_id=" + parent_id;
    });
  })

  // リストに戻る
  $('#Bt_Cancel').on('click',function(){
  var parent_id = getParam(2);
    window.location.href = '/popup.html' + "?folder_id=" + parent_id;
  })

  // close
  $('.close').on('click',function(){
    window.close();
  })

  $('#input_name').val(getParam(1));
});


function getParam(i){
  var url = location.href;
  parameters = url.split("?");
  //id取得
  params = parameters[1].split("=");
  id = params[1];
  //サイト名取得
  params = parameters[2].split("=");
  rawName = params[1];
  name = decodeURI(rawName);

  params = parameters[3].split("=");
  parent_id = params[1];

  var list = [id, name, parent_id];

  return list[i];
}

var Dao = function(){
  var name = 'localdb';
  var version = '1.0';
  var description = 'Web SQL Database';
  var size = 5 * 1024 * 1024;
  var db = openDatabase(name, version, description, size);

  // 編集保存
  this.update = function(id, name, callback){
    db.transaction(function (tx){
      tx.executeSql('update folders SET name=? WHERE id=?', [name, id]);
      callback();
    });
  }

  // 削除
  this.remove = function(id, callback){
    db.transaction(function (tx){
      tx.executeSql('delete from folders where id=?', [id]);
      callback();
    });
  }


}
