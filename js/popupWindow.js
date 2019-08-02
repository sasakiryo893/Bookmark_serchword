$(function(){
  var dao = new Dao();
  // サイト名、URLを取得
  chrome.tabs.getSelected(null, function(tab) {
    //バイト数が35バイト以上なら3点リーダをつける
    function substr(text, len, truncation) {
      if (truncation === undefined) { truncation = '…'; }
      var text_array = text.split('');
      var count = 0;
      var str = '';
      for (i = 0; i < text_array.length; i++) {
        var n = escape(text_array[i]);
        if (n.length < 4) count++;
        else count += 2;
        if (count > len) {
          return str + truncation;
        }
        str += text.charAt(i);
      }
      return text;
    }

    let input_text = substr(tab.title,30,'…');

    $('#input_site').html(input_text);

  });

  // 最近の検索ワード20件を取得してプルダウンメニューに挿入
  chrome.history.search({
    text: '- Google 検索',
    maxResults: 20
  },
  function (results) {
    for(var i = 0; i < results.length; i++) {
      $('#search_word').append($('<option>').html(results[i].title.replace('- Google 検索', '')).val(results[i].title.replace('- Google 検索', '')));
    };
  });

  // 登録
  $('#Bt_Regi').on('click',function(){
    chrome.tabs.getSelected(null, function(tab){
      var site = tab.title;
      var url = tab.url;
      var word = $('select#search_word').val();
      var memo = $('textarea#input_memo').val().trim();
      var folder_id = getParam(0);
      dao.add_bookmark(site, url, word, memo, folder_id, function() {
        window.location.href = '/popup.html' + "?folder_id=" + getParam(0);
      });
    });
  });

  // topに戻る
  $('#Bt_Cancel').on('click',function(){
    window.location.href = '/popup.html' + "?folder_id=" + getParam(0);
  })

  // close
  $('.close').on('click',function(){
    window.close();
  })
});

function getParam(i) {
  var url = location.href;
  parameters = url.split("?");
  // current_folder_id取得
  params = parameters[1].split("=");
  folder_id = params[1];

  var list = [folder_id];

  return list[i];
}

var Dao = function(){
  var name = 'localdb';
  var version = '1.0';
  var description = 'Web SQL Database';
  var size = 5 * 1024 * 1024;
  var db = openDatabase(name, version, description, size);

  // 登録
  this.add_bookmark = function(site, url, word, memo, folder_id, callback){
    db.transaction(function (tx){
      tx.executeSql('insert into bookmarks (name, url, search_word, memo, folder_id) values (?, ?, ?, ?, ?)', [site, url, word, memo, folder_id]);
      callback();
    });
  }

}
