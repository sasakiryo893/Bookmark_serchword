$(function(){
  $('#Bt_Regi').on('click',function(){
    var dao = new Dao
    // console.log($('textarea[name="nanndemoii"]').val());
    var name = $('input#input_folder_title').val().trim();
    dao.add_folder(name, getParam(0), function() {
      window.location.href = '/popup.html';
    });
  });

  // topに戻る
  $('#Bt_Cancel').on('click',function(){
    window.location.href = '/popup.html';
  });

  // close
  $('.close').on('click',function(){
    window.close();
  });

})

function getParam(i) {
  var url = location.href;
  parameters = url.split("?");
  // parent_folder_id取得
  params = parameters[1].split("=");
  parent_id = params[1];

  var list = [parent_id];

  return list[i];
}

var Dao = function(){
  var name = 'localdb';
  var version = '1.0';
  var description = 'Web SQL Database';
  var size = 5 * 1024 * 1024;
  var db = openDatabase(name, version, description, size);

  // 登録
  this.add_folder = function(name, parent_id, callback){
    db.transaction(function(tx){
      tx.executeSql('insert into folders (name, parent_id) values (?, ?)', [name, parent_id]);
      callback();
    });
  }

}
