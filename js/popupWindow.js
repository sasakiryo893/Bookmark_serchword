$(function(){
  // サイト名、URLを取得
  chrome.tabs.getSelected(null, function(tab) {
    $('#input_site').html(tab.title);
    $('#input_url').html(tab.url);
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
});
