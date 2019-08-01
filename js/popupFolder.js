$(function(){
  $('#Bt_Regi').on('click',function(){
    console.log($('textarea[name="nanndemoii"]').val());
    var name = $('textarea[name="nanndemoii"]').val().trim();
    dao.insert(name,0, function() {
      window.location.href = '/popup.html';
    });
  });
})

var Dao = function(){
  var name = 'localdb';
  var version = '1.0';
  var description = 'Web SQL Database';
  var size = 5 * 1024 * 1024;
  var db = openDatabase(name, version, description, size);

  // 登録
  this.add_folder = function(name, parent_id, callback){
    db.transaction(function(tx){
      tx.executeSql('insert into folders (name, parent_id)', [name, parent_id]);
      callback();
    });
  }

}
