//追加、検索処理

//検索
$(function(){
  // $('.site_list').append("ここに保存した検索ワード");

  $('.search').on('click',function(){
    alert($('.search_word').val() + "で検索！！！！！！！")
  })

  $('.add').on('click',function(){
    alert("追加！！！！！！！")
  })
});
