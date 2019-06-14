//データベースから登録したサイトを表示

$(function(){
  chrome.history.search({
    text: '- Google 検索',
    maxResults: 10
  },
  function (results) {
    for(var i = 0; i < results.length; i++) {
      console.table(results[i].title.replace('- Google 検索', ''));
    };
  });

  //タイトルが長すぎたときに文末を省略
  //バイト数が35バイト以上なら3点リーダをつける
  let input_text = substr($('.site_title').text(),120,'…');
  let input_text_url = substr($('.site_url').text(),80,'…')

  $('.site_title').html(input_text);
  $('.site_url').html(input_text_url);

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
});
