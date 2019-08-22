var domain;

$(function() {
  $("#sortableArea").sortable();
});

$(function() {
  var dao = new Dao();

  $('#Bt_Search').on('click', function () {
    var searchText = $('#Search_Word').val(); // 検索ボックスに入力された値

    $('.site_info').remove();   //現在表示しているブックマークの削除
    $('.folder_name').remove(); //現在表示しているフォルダの削除

    if( searchText == "" ){
        var currentFolderId = $('.current_folder_id').attr('id');
        findByFolderId_All(currentFolderId, dao);
    } else {
      dao.findAll_bookmarks(function (list) {
        $.each(list, function (i, e) {
          var name = e.name;
          var searchWord = e.search_word;
          var memo = e.memo;

          if(name.indexOf(searchText) != -1 || searchWord.indexOf(searchText) != -1 ||
            memo.indexOf(searchText) != -1 ){
            domain = e.url.match(/^https?:\/{2,}(.*?)(?:\/|\?|#|$)/);
            if(domain != null){
              domain = "http://www.google.com/s2/favicons?domain=" + domain[0];
            } else {
              domain = "http://www.google.com/s2/favicons?domain=" + domain;
            }
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
           }
        });
      });
    }
  });

  //Enterキーを押したら検索
  $('#Search_Word').keydown(function() {
    if(event.keyCode==13){
        $('#Bt_Search').trigger('click');
    }
  });

  //追加
  $('#Bt_Add').on('click', function(){
    window.location.href = '/popupWindow.html' + "?folder_id=" + $('.current_folder_id').attr('id');
  });

  //書き出し
  $('#Bt_Export').on('click', function(){
     dao.exportArray(function(array) {
       exportTSV(array);
     });
    //dao.deleteAllTables();
  });

  //読み込み
  $('#Bt_Import').on('click', function(){
    var array = importTSV(function(array) {
      dao.importArray(array);
      init(dao);
    });
  });

  //ブックマークからのインポート
  $('#Bt_Add_bookmark').on('click',function(){
    let folderId = 0;
    chrome.bookmarks.getTree(function(roots){
      roots.forEach(parser);
      function parser(node){
        if (node.children) {
          new Promise(function(resove){
            if(node.title !== ""){
              dao.add_folder(node.title,folderId,function(id){
                folderId = id;
                resove(id);
              });
            } else {
              node.children.forEach(parser);
            }
          }).then(function(folderId){
            node.children.forEach(parser);
          })
        } else if(node) {
          dao.insert(node.title,node.url,"","",folderId);
        }
      }
      findByFolderId_All(0, dao);
    });
  })

  $('#Bt_Add_folder').on('click', function(){
    window.location.href = '/popupFolder.html' + "?folder_id=" + $('.current_folder_id').attr('id');
  });

  $('#Bt_Go_Back').on('click', function(){
    if($('.current_folder_id').attr('id') == 0){
      return;
    } else {
      dao.getFolderInfoByFolderId($('.current_folder_id').attr('id'), function(list){
        parent_folder_id = list[0][1];
        dao.getFolderInfoByFolderId(parent_folder_id, function(list){
          parent_folder_name = list[0][0];
          $('.site_list').empty();
          $('.site_list').append(`
            <div class="current_folder_id" id="${parent_folder_id}">
              現在のフォルダ：${parent_folder_name}
            </div>
          `);

            findByFolderId_All(parent_folder_id, dao);
        })
      });
    }
  });

  $('#Bt_Go_Root').on('click', function(){
    $('.site_list').empty();
    $('.site_list').append(`
      <div class="current_folder_id" id="0">
        現在のフォルダ：root
      </div>
    `);

    findByFolderId_All(0, dao);
  });

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

$(document).on('contextmenu','.folder_name',function(){
  window.location.href = '/popupFolderEdit.html' + "?id=" +  $(this).attr('id').trim()
                                                 + "?name=" + $(this).html().trim()
                                                 + "?folder_id=" + $('.current_folder_id').attr('id');
});

$(document).on('contextmenu','.site_info',function(){
  window.location.href = '/popupEdit.html' + "?id=" +  $(this).children('.hidden_id').text().trim()
                                           + "?site=" + $(this).children('.hidden_name').text().trim()
                                           + "?url=" + $(this).children('.hidden_url').text().trim()
                                           + "?memo=" + $(this).children('.hidden_memo').text().trim()
                                           + "?word=" + $(this).children('.hidden_word').text().trim()
                                           + "?folder_id=" + $('.current_folder_id').attr('id');
});

$(document).on('mouseout','.site_info',function(){
  $(this).css('background', '');
  $(this).find('p:last').remove();

  $(this).children('.site_search_word').addClass('hidden');
  $(this).children('.site_url').addClass('hidden');
});

String.prototype.bytes = function () {
  return(encodeURIComponent(this).replace(/%../g,"x").length);
}

function getParam() {
  var url = location.href;
  parameters = url.split("?");

  if(parameters[1] == null) {
    pre_folder_id = 0;
  } else {
    params = parameters[1].split("=");
    pre_folder_id = params[1];
  }

  return pre_folder_id;
}

var init = function(dao){
  pre_folder_id = getParam();
  if(pre_folder_id == 0){
    $('.site_list').empty();
    $('.site_list').append(`
      <div class="current_folder_id" id="0">
        現在のフォルダ：root
      </div>
    `);
    findByFolderId_All(0, dao);
  } else {
    dao.getFolderInfoByFolderId(pre_folder_id, function(list){
      folder_name = list[0][0];
      $('.site_list').empty();
      $('.site_list').append(`
        <div class="current_folder_id" id="${pre_folder_id}">
          現在のフォルダ：${folder_name}
        </div>
      `);

        findByFolderId_All(pre_folder_id, dao);
    });
  }


  $(document).on('click','.folder_name',function(){
    var current_folder_id = $(this).attr('id');
    var current_folder_name = $(this).html();
    $('.site_list').empty();
    $('.site_list').append(`
      <div class="current_folder_id" id="${current_folder_id}">
        現在のフォルダ：${current_folder_name}
      </div>
    `);

    findByFolderId_All(current_folder_id, dao);
  });
}

var findByFolderId_All = function(folder_id, dao){
  dao.findByParentId_folders(folder_id, function(list){
    $.each(list, function(i, e){
      $('.site_list').append(`
        <div class="folder_name" id="${e.id}">
          ${e.name}
        </div>
      `);
    });
  });

  dao.findByFolderId_bookmarks(folder_id, function(list){
    $.each(list, function(i, e){
      var url = e.url;
      domain = url.match(/^https?:\/{2,}(.*?)(?:\/|\?|#|$)/);
      if(domain != null){
        domain = "http://www.google.com/s2/favicons?domain=" + domain[0];
      } else {
        domain = "http://www.google.com/s2/favicons?domain=" + domain;
      }

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
  this.db = openDatabase(name, version, description, size);

  this.db.transaction(function(tx) {
    tx.executeSql(`
      create table if not exists folders (
        id integer primary key autoincrement,
        name varchar(300) not null,
        parent_id integer default 0
      )
      `);
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
  });
}

Dao.prototype = {
  findByParentId_folders: function(id, callback) {
    this.db.transaction(function(tx) {
      tx.executeSql('select * from folders where parent_id=? order by id desc', [id],
      function(tx, results) {
        var list = [];
        for(i = 0; i < results.rows.length; i++) {
          list.push({
            id: results.rows.item(i).id,
            name: results.rows.item(i).name,
            parent_id: results.rows.item(i).parent_id
          });
        }
        callback(list);
      });
    });
  },

  findByFolderId_bookmarks: function(id,callback) {
    this.db.transaction(function(tx) {
      tx.executeSql('select * from bookmarks where folder_id = ? order by id desc', [id],
      function(tx, results) {
        var list = [];
        for(i = 0; i < results.rows.length; i++) {
          list.push({
            id: results.rows.item(i).id,
            name: results.rows.item(i).name,
            url: results.rows.item(i).url,
            search_word: results.rows.item(i).search_word,
            memo: results.rows.item(i).memo
          });
        }
        callback(list);
      });
    });
  },

  findAll_bookmarks: function(callback) {
    this.db.transaction(function(tx) {
      tx.executeSql('select * from bookmarks', [],
      function(tx, results) {
        var list = [];
        for(i = 0; i < results.rows.length; i++) {
          list.push({
            id: results.rows.item(i).id,
            name: results.rows.item(i).name,
            url: results.rows.item(i).url,
            search_word: results.rows.item(i).search_word,
            memo: results.rows.item(i).memo
          });
        }
        callback(list);
      });
    });
  },

  exportArray: function(callback) {
    this.db.transaction(function(tx) {
      tx.executeSql('select * from bookmarks', [],
      function(tx, results) {
        var list = [];
        for(i = 0; i < results.rows.length; i++) {
          list.push([
            results.rows.item(i).name,
            results.rows.item(i).url,
            results.rows.item(i).search_word,
            results.rows.item(i).memo,
            results.rows.item(i).folder_id
          ]);
        }
        callback(list);
      });
    });
  },

  importArray: function(array) {
    this.db.transaction(function(tx) {
      for(i = 0; i < array.length; i++) {
        tx.executeSql('insert into bookmarks (name, url, search_word, memo) values (?, ?, ?, ?)', [array[i][0], array[i][1], array[i][2], array[i][3]]);
      }
    });
  },

  insert: function(site, url, word, memo, folderId) {
    this.db.transaction(function(tx) {
      tx.executeSql('insert into bookmarks (name, url, search_word, memo, folder_id) values (?, ?, ?, ?, ?)', [site, url, word, memo, folderId]);
    });
  },

  getFolderInfoByFolderId: function(folder_id, callback) {
    var list = [];
    if(folder_id == 0) {
      list.push([
        "root", 0
      ]);
      callback(list);
    } else {
      this.db.transaction(function(tx) {
        tx.executeSql('select name, parent_id from folders where id=?', [folder_id],
        function(tx, results) {
          list.push([
            results.rows.item(0).name,
            results.rows.item(0).parent_id
          ]);
          callback(list);
        });
      });
    }
  },

  deleteAllTables: function() {
    this.db.transaction(function(tx) {
      tx.executeSql('drop table bookmarks');
      tx.executeSql('drop table folders');
    })
  },

  add_folder: function(name, parent_id, callback) {
    this.db.transaction(function(tx) {
      tx.executeSql('insert into folders (name, parent_id) values (?, ?)', [name, parent_id],
      function(transaction, result) {
        callback(result.insertId);
      }, function() {
        alert("DB SELECT Error!");
      });
    });
  }
}
