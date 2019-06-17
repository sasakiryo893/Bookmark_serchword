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
});
