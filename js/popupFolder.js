$(function() {
  $('input#input_folder_title').focus();
  $('#Bt_Regi').on('click',function() {
    var dao = new Dao;
    // console.log($('textarea[name="nanndemoii"]').val());
    var name = $('input#input_folder_title').val().trim();
    dao.add_folder(name, getParam(), function() {
      window.location.href = '/popup.html' + "?folder_id=" + getParam();
    });
  });

  $('#Bt_Cancel').on('click',function() {
    window.location.href = '/popup.html' + "?folder_id=" + getParam();
  });

  $('.close').on('click',function() {
    window.close();
  });
});

function getParam() {
  var url = location.href;
  parameters = url.split("?");
  // parent_folder_id取得
  params = parameters[1].split("=");
  parent_id = params[1];

  return parent_id;
}

var Dao = function() {
  var name = 'localdb';
  var version = '1.0';
  var description = 'Web SQL Database';
  var size = 5 * 1024 * 1024;
  this.db = openDatabase(name, version, description, size);
}

Dao.prototype = {
  add_folder: function(name, parent_id, callback) {
    this.db.transaction(function(tx) {
      tx.executeSql('insert into folders (name, parent_id) values (?, ?)', [name, parent_id]);
      callback();
    });
  }

}
