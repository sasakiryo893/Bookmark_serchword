$(function(){
  var dao = new Dao();
  // サイト名を取得
  chrome.tabs.getSelected(null, function(tab) {
  });

  // 編集登録
  $('#Bt_Edit').on('click',function(){
      var id = getParam(0);
      var name = $('#input_name').val().trim();
      dao.update(id, name, function() {
        window.location.href = '/popup.html';
      });
  });

  //削除
  $('#Bt_Remove').on('click',function(){
    const idx = getParam(0);
    dao.remove(idx, function() {
      window.location.href = '/popup.html';
    });
  })

  // topに戻る
  $('#Bt_Cancel').on('click',function(){
    window.location.href = '/popup.html';
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
  siteName = params[1];
  name = decodeURI(siteName);

  var list = [id, name];

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
