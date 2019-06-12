$(function(){
  // $('.site_list').append("ここに保存した検索ワード");

  //検索
  $('.search').on('click',function(){
    alert($('.search_word').val() + "で検索！！！！！！！")
  })

  //追加
  $('.add').on('click',function(){

    alert("追加！！！！！！！")
    window.location.href = '/popupWindow.html';
  })

  //mausehoverで色を変える
  $('.site_info').hover(function(){
    $(this).css('background', '#f0f8ff');
  },function(){
    $(this).css('background', '');
  });

  //遷移後のURLを取得し新しいタブで開く
  $('.site_info').on('click',function(){
    let url = $(this).children('.site_url').text();
    window.open(url,'_brank');
  });


});
