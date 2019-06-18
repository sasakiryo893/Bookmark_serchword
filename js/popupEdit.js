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

    let input_text = substr(tab.title,36,'…');
    let input_text_url = substr(tab.url,38,'…');

    $('#input_site').html(input_text);
    $('#input_url').html(input_text_url);
  });

  // 最近の検索ワード10件を取得してプルダウンメニューに挿入
  chrome.history.search({
    text: '- Google 検索',
    maxResults: 30
  },
  function (results) {
    for(var i = 0; i < results.length; i++) {
      $('#search_word').append($('<option>').html(results[i].title.replace('- Google 検索', '')).val(results[i].title.replace('- Google 検索', '')));
    };
  });

  // 編集登録
  $('#Bt_Edit').on('click',function(){
      var id = getParam(0);
      var site = $('#input_site').val();;
      var url = getParam(2);
      var word = $('select#search_word').val();
      var memo = $('textarea#input_memo').val();
      dao.update(id, site, url, word, memo);
      alert("編集完了");
      window.location.href = '/popup.html';
  });

  $('#Bt_Remove').on('click',function(){
    const idx = getParam(0);
    //alert(idx)
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
});


function getParam(i){
  var url   = location.href
  parameters    = url.split("?")
  //id取得
  params   = parameters[1].split("=")
  id = params[1].replace(/%20/g, '')
  //サイト名取得
  params = parameters[2].split("=")
  siteName = params[0].replace(/%20+/g, '')
  name = decodeURI(siteName)
  //URL取得
  params = parameters[3].split("=")
  url = params[0].replace(/%20/g, '')
  //メモ取得
  params = parameters[4].split("=")
  memo = params[0].replace(/%20/g, '')
  //alert(memo)

  var list = [id, name, url, memo]

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


  //選択
  this.select = function(id, callback) {
    db.transaction(function (tx){
      tx.executeSql('select * from search where id = ?', [id],
        function(tx, result) {
          var list = []
          list.push({
            id: result.rows.item(0).id,
            name: result.rows.item(0).name,
            url: result.rows.item(0).url,
            search_word: result.rows.item(0).search_word,
            memo: result.rows.item(0).memo,
          })
          callback(list[0])
        })
    })
  }


  // 削除
  this.remove = function(id){
    db.transaction(function (tx){
      tx.executeSql('delete from search where id = ?', [id])
    })
  }


}
