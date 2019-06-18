$(function(){
  var dao = new Dao()
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

    let input_text_url = substr(getParam(2),34,'…');
    $('#input_url').html(input_text_url);

  });

  // 編集登録
  $('#Bt_Edit').on('click',function(){
      var id = getParam(0);
      var site = $('#input_site').val().trim();
      var url = getParam(2).trim();
      var word = $('input#search_word').val().trim();
      var memo = $('textarea#input_memo').val().trim();
      dao.update(id, site, url, word, memo);
      alert("編集完了");
      window.location.href = '/popup.html';
  });

  //削除
  $('#Bt_Remove').on('click',function(){
    const idx = getParam(0);
    dao.remove(idx);
    window.location.href = '/popup.html';
  })

  // topに戻る
  $('#Bt_Cancel').on('click',function(){
    window.location.href = '/popup.html';
  })

  // close
  $('.close').on('click',function(){
    window.close();
  })

  $('#input_site').val(getParam(1))
  $('.memo').val(getParam(3))
  $('#search_word').val(getParam(4));
});


function getParam(i){
  var url   = location.href
  parameters    = url.split("?")
  //id取得
  params   = parameters[1].split("=")
  id = params[1]
  //サイト名取得
  params = parameters[2].split("=")
  siteName = params[1]
  name = decodeURI(siteName)
  //URL取得
  params = parameters[3].split("=")
  url = params[1]
  //メモ取得
  params = parameters[4].split("=")
  decodeMemo = params[1]
  memo = decodeURI(decodeMemo)
  //検索ワード取得
  params = parameters[5].split("=")
  decodeWord = params[1]
  word = decodeURI(decodeWord)

  var list = [id, name, url, memo, word]

  return list[i]
}

var Dao = function(){
  var name = 'localdb'
  var version = '1.0'
  var description = 'Web SQL Database'
  var size = 5 * 1024 * 1024
  var db = openDatabase(name, version, description, size)

  // 編集保存
  this.update = function(id, site, url, word, memo){
    db.transaction(function (tx){
      tx.executeSql('update search SET name=?, url=?, search_word=?, memo=? WHERE id=?', [site, url, word, memo,id])
    })
  }

  // 削除
  this.remove = function(id){
    db.transaction(function (tx){
      tx.executeSql('delete from search where id = ?', [id])
    })
  }


}
