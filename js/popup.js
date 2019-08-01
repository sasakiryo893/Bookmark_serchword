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
  $('#Bt_Add').on('click', function(){
    window.location.href = '/popupWindow.html';
  })

  //書き出し
  $('#Bt_Export').on('click', function(){
    dao.exportArray(function(array) {
      exportTSV(array);
    })
  })

  //読み込み
  $('#Bt_Import').on('click', function(){
    var array = importTSV(function(array) {
      dao.importArray(array);
      init(dao);
    });
  })

  //ブックマークからのインポート
  $('#Bt_Add_bookmark').on('click',function(){
    chrome.bookmarks.getTree(function(roots){
      roots.forEach(parser);
      function parser(node){
        if (node.children) {
          //今は分解して一個ずつインポートしてる
          //フォルダ作成後その処理もってきて修正
          node.children.forEach(parser);
        } else if(node) {
          dao.insert(node.title,node.url,"","");
        }
      }
      init(dao);
    });
  })

  $('#Bt_Add_folder').on('click', function(){
    window.location.href = '/popupFolder.html';
  })

  init(dao);
});



function exportTSV(array) {
    // 文字化け対策
    var bom = new Uint8Array([0xEF, 0xBB, 0xBF]);

    var tsv = array.map(
      function(l){
        return l.join('\t')
      }).join('\t\r\n');

    var blob = new Blob([bom, tsv], { type: 'text/tsv'});

    var url = (window.URL || window.webkitURL).createObjectURL(blob);

    var a = document.getElementById('downloadTSV');
    a.download = 'data.tsv';
    a.href = url;

    $('#downloadTSV')[0].click();
}

function importTSV(callback) {
  var file = $('#uploadTSV')[0];
  var result;
  file.click();
  file.onchange = function() {
    const filelist = file.files
    var reader = new FileReader()
    reader.readAsText(filelist[0])
    reader.onload = function(e) {
      result = txt2array(reader.result)
      callback(result);
    }
    reader.onerror = function() {
      alert("ファイルを読み込めませんでした。");
    }
  }
}


function txt2array(txt) {
  txt = txt.split("\t");
  var result = [];
  while(txt[0]) {
    result.push(txt.splice(0, 4));
  }

  return result;
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

    // seletionオブジェクトを取得します。
    var selection = window.getSelection();
    // rangeオブジェクトを生成します。
    var range = document.createRange();
    // rangeオブジェクトに p要素を与えます。
    range.selectNodeContents(prev);
    // 一旦、selectionオブジェクトの持つ rangeオブジェクトを削除します。
    selection.removeAllRanges();
    // 改めて先程生成した rangeオブジェクトを selectionオブジェクトに追加します。
    selection.addRange(range);
    // クリップボードにコピーします。
    document.execCommand('copy');
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

  // //folderの一覧表示
  dao.findAll_folder(0,function(list){

    console.log(list);
    $.each(list, function(i, e){
      $('.site_list').append(`
          <div class="folder">
            <div class="folder_name">${e.name}</div>
          </div>
        `)
    })
  })

  // TODO表の表示

  dao.findAll_bookmarks(function(list){
    $.each(list, function(i, e){
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
            <p>${e.name}</p>
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
  db.transaction(function(tx) {
    tx.executeSql(`
      create table if not exists bookmarks (
        id integer primary key autoincrement,
        name varchar(300) not null,
        url varchar(2083) not null,
        search_word varchar(100) null,
        memo text null,
        folder_id integer default 0
      )
    `);
    tx.executeSql(`
      create table if not exists folders (
        id integer primary key autoincrement,
        name varchar(300) not null,
        parent_id integer default 0
      )
    `);
  })

  // フォルダー全権検索
  this.findAll_folder = function(id, callback) {
    db.transaction(function(tx) {
      // tx.executeSql('select * from folders where parent_id=? order by id desc', [id],
      tx.executeSql('select * from folders',[],
        function(tx, results) {
          var list = [];
          for (i = 0; i < results.rows.length; i++){
            list.push({
              id: results.rows.item(i).id,
              name: results.rows.item(i).name,
              parent_id: results.rows.item(i).parent_id
            });
          };
          console.log(list);
          callback(list);
        });
    });
  }

  // ブックマーク全件検索
  this.findAll_bookmarks = function(callback) {
    db.transaction(function(tx) {
      tx.executeSql('select * from bookmarks order by id desc', [],
        function(tx, results) {
          var list = [];
          for (i = 0; i < results.rows.length; i++){
            list.push({
              id: results.rows.item(i).id,
              name: results.rows.item(i).name,
              url: results.rows.item(i).url,
              search_word: results.rows.item(i).search_word,
              memo: results.rows.item(i).memo
            });
          };
          callback(list);
        });
    });
  }

  // 配列ではき出す
  this.exportArray = function(callback) {
    db.transaction(function(tx) {
      tx.executeSql('select * from bookmarks', [],
        function(tx, results) {
          var list = [];
          for (i = 0; i < results.rows.length; i++){
            list.push([
              results.rows.item(i).name,
              results.rows.item(i).url,
              results.rows.item(i).search_word,
              results.rows.item(i).memo
            ]);
          };
          callback(list);
        });
    });
  }

  // 配列から読み込む
  this.importArray = function(array) {
    db.transaction(function(tx) {
      for(i = 0; i < array.length; i++) {
          tx.executeSql('insert into bookmarks (name, url, search_word, memo) values (?, ?, ?, ?)', [array[i][0], array[i][1], array[i][2], array[i][3]]);
      }
    })
  }

  //登録
  this.insert = function(site, url, word, memo){
    db.transaction(function (tx){
      tx.executeSql('insert into bookmarks (name, url, search_word, memo) values (?, ?, ?, ?)', [site, url, word, memo]);
    });
  }
}
