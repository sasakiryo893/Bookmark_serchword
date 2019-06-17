// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Search the bookmarks when entering the search keyword.
$(function() {
  var dao = new Dao()

  $('#search').change(function() {
     $('#bookmarks').empty();
     dumpBookmarks($('#search').val());
  });
  //検索ワード検索
  $('#Bt_Search').on('click',function(){
    alert($('#Search_Word').val() + "で検索！！！！！！！");
    alert($('.site_info').children('.site_search_word').text());
  });

  //追加
  $('#Bt_Add').on('click',function(){
    window.location.href = '/popupWindow.html';
    // $('.dialog').show()
  })

  $('#Bt_Delete').on('click', function() {
    dao.delete(init(dao))
  })
  init(dao);
});

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

$('.site_list').ready(function(){
  let input_text = substr($('.site_title').text(),10,'…');
  let input_text_url = substr($('.site_url').text(),10,'…')

  $('.site_title').html(input_text);
  $('.site_url').html(input_text_url);

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
})

String.prototype.bytes = function () {
  return(encodeURIComponent(this).replace(/%../g,"x").length);
}

var init = function(dao){
  // TODO表の削除
  $('.site_list').empty()
  // TODO表の表示
  dao.findAll(function(list){
    $.each(list, function(i, e){
      if(e.name.bytes() > 36) name_short = e.name.slice(0,20)+"...";
      else name_short = e.name;
      if(e.url.bytes() > 38) url_short = e.url.slice(0,40)+"...";
      else url_short = e.url;
      $('.site_list').append(`
        <div class="site_info">
          <div class="site_title">
            <h5>${name_short}</h5>
          </div>
          <div class="site_search_word">
            ${e.search_word}
          </div>
          <div class="site_url">
            ${url_short}
          </div>
          <div class="hidden_url" style="display:none">
            ${e.url}
          </div>
        </div>
        `);
      });
  });
}

var Dao = function(){
  var name = 'localdb'
  var version = '1.0'
  var description = 'Web SQL Database'
  var size = 5 * 1024 * 1024
  var db = openDatabase(name, version, description, size)

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
      tx.executeSql('select * from search', [],
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

  this.delete = function(callback){
    db.transaction(function (tx){
      tx.executeSql('drop table search')
    })
  }

}





// Traverse the bookmark tree, and print the folder and nodes.
// function dumpBookmarks(query) {
//   var bookmarkTreeNodes = chrome.bookmarks.getTree(
//     function(bookmarkTreeNodes) {
//       $('#bookmarks').append(dumpTreeNodes(bookmarkTreeNodes, query));
//     });
// }
// function dumpTreeNodes(bookmarkNodes, query) {
//   var list = $('<ul>');
//   var i;
//   for (i = 0; i < bookmarkNodes.length; i++) {
//     list.append(dumpNode(bookmarkNodes[i], query));
//   }
//   return list;
// }
// function dumpNode(bookmarkNode, query) {
//   if (bookmarkNode.title) {
//     if (query && !bookmarkNode.children) {
//       if (String(bookmarkNode.title).indexOf(query) == -1) {
//         return $('<span></span>');
//       }
//     }
//     var anchor = $('<a>');
//     anchor.attr('href', bookmarkNode.url);
//     anchor.text(bookmarkNode.title);
//
//      //When clicking on a bookmark in the extension, a new tab is fired with
//      //the bookmark url.
//
//     anchor.click(function() {
//       chrome.tabs.create({url: bookmarkNode.url});
//     });
//     var span = $('<span>');
//     var options = bookmarkNode.children ?
//       $('<span>[<a href="#" id="addlink">Add</a>]</span>') :
//       $('<span>[<a id="editlink" href="#">Edit</a> <a id="deletelink" ' +
//         'href="#">Delete</a>]</span>');
//     var edit = bookmarkNode.children ? $('<table><tr><td>Name</td><td>' +
//       '<input id="title"></td></tr><tr><td>URL</td><td><input id="url">' +
//       '</td></tr></table>') : $('<input>');
//     // Show add and edit links when hover over.
//         span.hover(function() {
//         span.append(options);
//         $('#deletelink').click(function() {
//           $('#deletedialog').empty().dialog({
//                  autoOpen: false,
//                  title: 'Confirm Deletion',
//                  resizable: false,
//                  height: 140,
//                  modal: true,
//                  overlay: {
//                    backgroundColor: '#000',
//                    opacity: 0.5
//                  },
//                  buttons: {
//                    'Yes, Delete It!': function() {
//                       chrome.bookmarks.remove(String(bookmarkNode.id));
//                       span.parent().remove();
//                       $(this).dialog('destroy');
//                     },
//                     Cancel: function() {
//                       $(this).dialog('destroy');
//                     }
//                  }
//                }).dialog('open');
//          });
//         $('#addlink').click(function() {
//           $('#adddialog').empty().append(edit).dialog({autoOpen: false,
//             closeOnEscape: true, title: 'Add New Bookmark', modal: true,
//             buttons: {
//             'Add' : function() {
//                chrome.bookmarks.create({parentId: bookmarkNode.id,
//                  title: $('#title').val(), url: $('#url').val()});
//                $('#bookmarks').empty();
//                $(this).dialog('destroy');
//                window.dumpBookmarks();
//              },
//             'Cancel': function() {
//                $(this).dialog('destroy');
//             }
//           }}).dialog('open');
//         });
//         $('#editlink').click(function() {
//          edit.val(anchor.text());
//          $('#editdialog').empty().append(edit).dialog({autoOpen: false,
//            closeOnEscape: true, title: 'Edit Title', modal: true,
//            show: 'slide', buttons: {
//               'Save': function() {
//                  chrome.bookmarks.update(String(bookmarkNode.id), {
//                    title: edit.val()
//                  });
//                  anchor.text(edit.val());
//                  options.show();
//                  $(this).dialog('destroy');
//               },
//              'Cancel': function() {
//                  $(this).dialog('destroy');
//              }
//          }}).dialog('open');
//         });
//         options.fadeIn();
//       },
//       // unhover
//       function() {
//         options.remove();
//       }).append(anchor);
//   }
//   var li = $(bookmarkNode.title ? '<li>' : '<div>').append(span);
//   if (bookmarkNode.children && bookmarkNode.children.length > 0) {
//     li.append(dumpTreeNodes(bookmarkNode.children, query));
//   }
//   return li;
// }

// document.addEventListener('DOMContentLoaded', function () {
//   dumpBookmarks();
// });
