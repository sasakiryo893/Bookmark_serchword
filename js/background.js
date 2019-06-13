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
  $('.site_title').each(function(){
    let cutFigure = '60';
    let textLength = $(this).text().length;
    let textTrim = $(this).text().substr(0,(cutFigure));

    if(cutFigure < textLength) {
        $(this).html(textTrim + "...").css({visibility:'visible',fontSize:'15px'});
    } else if(cutFigure >= textLength) {
        $(this).css({visibility:'visible'});
    }
  });
});
