// $(function(){
//   $('#Bt_Regi').on('click',function(){
//     var memo = $('textarea#input_memo').val().trim();
//     dao.insert(site, url, word, memo, function() {
//       window.location.href = '/popup.html';
//     });
//   });
// })
// 
// var Dao = function(){
//   var name = 'localdb';
//   var version = '1.0';
//   var description = 'Web SQL Database';
//   var size = 5 * 1024 * 1024;
//   var db = openDatabase(name, version, description, size);
//
//   // 登録
//   this.insert = function(site, url, word, memo, callback){
//     db.transaction(function (tx){
//       tx.executeSql('insert into folders (name) values (?)', [site, url, word, memo]);
//       callback();
//     });
//   }
//
// }
