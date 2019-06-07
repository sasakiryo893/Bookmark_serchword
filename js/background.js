//データベースから登録したサイトを表示

$(function(){
  console.log("aaaa");
  $('.site').before("aaaa");
  console.log(chrome.runtime.getURL("list_test.json"));

  //タイトルが長すぎたときに文末を省略
  $('.site_title').each(function(){
    let cutFigure = '60';
    let textLength = $(this).text().length;
    let textTrim = $(this).text().substr(0,(cutFigure));

    if(cutFigure < textLength) {
        $(this).html(textTrim + "...").css({visibility:'visible'});
    } else if(cutFigure >= textLength) {
        $(this).css({visibility:'visible'});
    }
  });
});
