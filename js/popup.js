//追加、検索処理

//検索
$(function(){
  // $('.site_list').append("ここに保存した検索ワード");

  $('.search').on('click',function(){
    alert($('.search_word').val() + "で検索！！！！！！！")
  })

  $('.add').on('click',function(){

    alert("追加！！！！！！！")
    window.location.href = '/popupWindow.html';
  })

  $('.site_info').hover(function(){
    $(this).css('background', '#f0f8ff');
  },function(){
    $(this).css('background', '');
  });

  $('.site_info').on('click',function(){
    // alert($(this).children('.site_url'));
    alert(JSON.stringify($(this)));
  });


});
