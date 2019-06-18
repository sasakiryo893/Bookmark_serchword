$(function() {
  var dao = new Dao()

  // $('#search').change(function() {
  //    $('#bookmarks').empty();
  //    dumpBookmarks($('#search').val());
  // });
  //検索ワード検索
    $('#Bt_Search').on('click', function () {
        var searchText = $('#Search_Word').val(); // 検索ボックスに入力された値
        var targetText;
        var gParent;

        //h2の中身(タイトル)と検索ワード比較
        $('.site_list h5').each(function () {
            targetText = $(this).text();
            gParent = $(this).parent();
            gParent = $(gParent).parent();

            // 検索対象となるリストに入力された文字列が存在するかどうかを判断
            if (targetText.indexOf(searchText) != -1 || searchText == "") {
                $(gParent).removeClass('hidden');
            } else {
                $(gParent).addClass('hidden');
            }
        });

        //pの中身(検索履歴ワード)と検索ワード比較
        $('.site_list p').each(function () {
            targetText = $(this).text(); //pの中身取得
            gParent = $(this).parent();
            gParent = $(gParent).parent();

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

$(document).on('click','.site_info',function(){
    let url = $(this).children('.hidden_url').text();
    window.open(url,'_brank');
});

$(document).on('mouseover','.site_info',function(){
    $(this).css('background', '#f0f8ff');
});

$(document).on('mouseout','.site_info',function(){
    $(this).css('background', '');
});

$(document).on('contextmenu','.site_info',function(){
  //alert($(this).children('.hidden_id').text());
  window.location.href = '/popupEdit.html' + "?id=" +  $(this).children('.hidden_id').text() + "?site=" + $(this).children('.hidden_name').text()  + "?url=" + $(this).children('.hidden_url').text() + "?memo=" + $(this).children('.hidden_memo').text();
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
      name_short = substr(e.name, 28, '…');
      url_short = substr(e.url, 38, '…');
      $('.site_list').append(`
        <div class="site_info">
          <div class="site_title">
            <h5>${name_short}</h5>
          </div>
          <div class="site_search_word">
            <p>
                ${e.search_word}
            </p>
          </div>
          <div class="site_url">
            <p>${url_short}</p>
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
