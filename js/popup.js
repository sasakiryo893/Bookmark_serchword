$(function(){
  // $('.site_list').append("ここに保存した検索ワード");

  //検索ワード検索
  $('.search').on('click',function(){
    alert($('.search_word').val() + "で検索！！！！！！！");
    alert($('.site_info').children('.site_search_word').text());
  })

  //追加
  $('.add').on('click',function(){
    window.location.href = '/popupWindow.html';
    // $('.dialog').show()
  })

  $('.site_info').on({
    // 遷移後のURLを取得し新しいタブで開く
    'click' : function(){
      let url = $(this).children('.site_url').text();
      window.open(url,'_brank');
    },
    'contextmenu' : function(){
      alert("みぎくり")
    },
    // mausehoverで色を変える
    'mouseenter' : function(){
      $(this).css('background', '#f0f8ff');
    },
    // 色消す
    'mouseleave' : function(){
      $(this).css('background', '');
    }
    
  });
});
