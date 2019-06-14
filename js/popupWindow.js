$(function(){
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
    let input_text_url = substr(tab.url,36,'…');

    $('#input_site').html(input_text);
    $('#input_url').html(input_text_url);

  });

  // 最近の検索ワード10件を取得してプルダウンメニューに挿入
  chrome.history.search({
    text: '- Google 検索',
    maxResults: 10
  },
  function (results) {
    for(var i = 0; i < results.length; i++) {
      $('#search_word').append($('<option>').html(results[i].title.replace('- Google 検索', '')).val(results[i].title.replace('- Google 検索', '')));
    };
  });

  // 登録
  $('#Bt_Regi').on('click',function(){
    alert($('#input_site').text());
    alert($('#input_url').text());
    alert($('#search_word option:selected').text());
    alert($('.memo').val());
  });

  // topに戻る
  $('#Bt_Cancel').on('click',function(){
    window.location.href = '/popup.html';
  })

  // close
  $('.close').on('click',function(){
    window.close();
  })
});
