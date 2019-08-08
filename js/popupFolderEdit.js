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

    deleteByfolderId_All(id, dao);
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

function deleteByfolderId_All(id, dao){
  dao.deleteByFolderId_bookmarks(id);
  dao.listupByParentFolderId_folders(id, function(list){
    if(list[0] != null){
      for (var i = 0; i < list.length; i++) {
        deleteByfolderId_All(list[i], dao);
    }}
    dao.deleteById_folder(id);
  });
}

var Dao = function() {
  var name = 'localdb';
  var version = '1.0';
  var description = 'Web SQL Database';
  var size = 5 * 1024 * 1024;
  this.db = openDatabase(name, version, description, size);
}

Dao.prototype = {
  update: function(id, name, callback) {
    this.db.transaction(function(tx) {
      tx.executeSql('update folders SET name=? WHERE id=?', [name, id]);
      callback();
    });
  },

  deleteByFolderId_bookmarks: function(id) {
    this.db.transaction(function(tx) {
      tx.executeSql(`delete from bookmarks where folder_id=?`, [id])
    });
  },

  deleteById_folder: function(id) {
    this.db.transaction(function(tx) {
      tx.executeSql(`delete from folders where id=?`, [id])
    });
  },

  listupByParentFolderId_folders: function(id, callback) {
    this.db.transaction(function(tx) {
      tx.executeSql(`select id from folders where parent_id=?`, [id],
        function(tx, results){
          var list = [];
          if(results.rows.length > 0){
            for (var i = 0; i < results.rows.length; i++) {
              list.push([
                results.rows.item(i).id
              ]);
          }}
          callback(list);
      });
    });
  }
}
