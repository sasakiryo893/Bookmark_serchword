var domain;

$(function() {
  var dao = new Dao()

  //検索ワード検索
    $('#Bt_Search').on('click', function () {
        var searchText = $('#Search_Word').val(); // 検索ボックスに入力された値
        var targetText;
        var gParent;

        //タイトルと検索ワード比較
        $('.hidden_name').each(function () {
            targetText = $(this).text();
            gParent = $(this).parent();

            // 検索対象となるリストに入力された文字列が存在するかどうかを判断
            if (targetText.indexOf(searchText) != -1 || searchText == "") {
                $(gParent).removeClass('hidden');
            } else {
                $(gParent).addClass('hidden');
            }
        });
        
        //inputの中身(検索履歴ワード)と検索ワード比較
        $('.site_list input').each(function () {
            targetText = $(this).text(); //pの中身取得
            gParent = $(this).parent();

            // 検索対象となるリストに入力された文字列が存在するかどうかを判断
            if (targetText.indexOf(searchText) != -1) {
                $(gParent).removeClass('hidden');
            }
        });
        
        //memoの中身と検索ワード比較
        $('.hidden_memo').each(function () {
            targetText = $(this).text(); //pの中身取得
            gParent = $(this).parent();

            // 検索対象となるリストに入力された文字列が存在するかどうかを判断
            if (targetText.indexOf(searchText) != -1) {
                $(gParent).removeClass('hidden');
            }
        });
    });

  //Enterキーを押したら検索
  $('#Search_Word').keydown(function() {
    if(event.keyCode==13){
        $('#Bt_Search').trigger('click');
    }
  });

  //追加
  $('#Bt_Add').on('click',function(){
    window.location.href = '/popupWindow.html';
  })

  init(dao);
});

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

$(document).on('click','.site_info',function(event){
    var target = event.target;
    var clickCheck = false;
    target.classList.forEach(function(value){
        var test = value;
       if(value =='btn' || value == 'fas'){
           clickCheck = true;
       }
    });
    if(clickCheck == false){
        let url = $(this).children('.hidden_url').text();
        window.open(url,'_brank');
    }
    
});

$(document).on('click','.copy-btn',function(){
    var prev = this.previousElementSibling;
    // コピー対象のテキストを選択する
    prev.select();
    // 選択しているテキストをクリップボードにコピーする
    document.execCommand("Copy");
    
});

$(document).on('mouseover','.site_info',function(){
    $(this).css('background', '#f0f8ff');
    
    $(this).children('.hidden').removeClass('hidden');
    $(this).children('.hidden').removeClass('hidden');

    var text =$(this).children('.hidden_memo').text();
    var option =
    (`
      <p id='hidden_memo'>
        ${text}
      </p>
    `);
    $(this).append(option);

});

$(document).on('mouseout','.site_info',function(){
    $(this).css('background', '');
    $(this).find('p:last').remove();
    
    $(this).children('.site_search_word').addClass('hidden');
    $(this).children('.site_url').addClass('hidden');
});

$(document).on('contextmenu','.site_info',function(){
  window.location.href = '/popupEdit.html' + "?id=" +  $(this).children('.hidden_id').text().trim()
                                           + "?site=" + $(this).children('.hidden_name').text().trim()
                                           + "?url=" + $(this).children('.hidden_url').text().trim()
                                           + "?memo=" + $(this).children('.hidden_memo').text().trim()
                                           + "?word=" + $(this).children('.hidden_word').text().trim();
});

String.prototype.bytes = function () {
  return(encodeURIComponent(this).replace(/%../g,"x").length);
}

var init = function(dao){
  // TODO表の削除
  $('.site_list').empty()
  // TODO表の表示
  dao.findAll(function(list){
    $.each(list, function(i, e){

      name_short = substr(e.name, 24, '…');
      url_short = substr(e.url, 38, '…');
      var url = e.url;
      domain = url.match(/^https?:\/{2,}(.*?)(?:\/|\?|#|$)/);
      if(domain != null){
        domain = "http://www.google.com/s2/favicons?domain=" + domain[0];
      } else {
        domain = "http://www.google.com/s2/favicons?domain=" + domain;
      }
      console.log(domain);
      if(e.search_word == "") search_word = ""
      else search_word = e.search_word
      $('.site_list').append(`
        <div class="site_info choice">
          <div class="site_title">
            <div class="favicon-image-box">
            <img src=${domain} width=10 height=10>
            </div>
            <p>${name_short}</p>
          </div>
          <div class="site_search_word hidden">
            <img src="resources/search_word.png" alt="" class="glass">
            <div class="container-fluid mx-0">
                <div class="form-group row">
                   <p class="form-control border border-info col-10 input-sm" type="text">${search_word}</p>
                    <button type="button" class="btn btn-info col copy-btn" data-toggle="tooltip" data-placement="top" title="コピーする">
                        <i class="fas fa-clipboard"></i>
                    </button>
                </div>
            </div>
          </div>
          <div class="site_url hidden">
            ${url_short}
          </div>
          <div class="hidden_url" style="display:none">
            ${e.url}
          </div>
          <div class="hidden_id" style="display:none">
            ${e.id}
          </div>
          <div class="hidden_name" style="display:none">
            ${e.name}
          </div>
          <div class="hidden_word" style="display:none">
            ${e.search_word}
          </div>
          <div class="hidden_memo" style="display:none">
            ${e.memo}
          </div>
        </div>
      `);
    });
  });
}

var Dao = function(){
  var name = 'localdb';
  var version = '1.0';
  var description = 'Web SQL Database';
  var size = 5 * 1024 * 1024;
  var db = openDatabase(name, version, description, size);

  // テーブル作成
  db.transaction(function(tx){
    tx.executeSql(`
      create table if not exists search (
        id integer primary key autoincrement,
        name varchar(300) not null,
        url varchar(2083) not null,
        search_word varchar(100) null,
        memo text null
      )
    `)
  })

  // 全件検索
  this.findAll = function(callback){
    db.transaction(function (tx){
      tx.executeSql('select * from search order by id desc', [],
        function (tx, results){
          var list = []
          for (i = 0; i < results.rows.length; i++){
            list.push({
              id: results.rows.item(i).id,
              name: results.rows.item(i).name,
              url: results.rows.item(i).url,
              search_word: results.rows.item(i).search_word,
              memo: results.rows.item(i).memo,
            });
          };
          callback(list);
        });
    });
  }
}
