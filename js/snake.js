$(document).ready(function(){
  var logged = "";
  var LOREM = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

  var makeDiv = function (c) {
    return $('<div>').addClass(c);
  }

  var makeDiagram = function(items) {
    var result = makeDiv('container');
    for (var i = 0; i < items.length; i++) {
      result.append(items[i]);
    }

    return result;
  };

  var makeSource = function(text, count){
    var result = makeDiv('subcontainer');
    result.append(makeDiv('source').text(count));
    result.append($('<caption>').text(text));

    return result;
  };

  var makeArrow = function(){
    return makeDiv('arrow');
  };

  var makeNote = function(txt){
    return $('<p>').text(txt).addClass('big-text');
  };

  var makeTightDestination = function (text, wellInfo, startColor) {
    var result = makeDiv('subcontainer');
    var dest = makeDiv('plate2');

    //the wells
    var wells = [];

    //fill it out to 96
    for (var i = 0; i < 96; i++) {
      wells.push(makeDiv('well'));
    }

    var wc = 0;
    for (var i = 0; i < wellInfo.length; i++) {
      for (var j = 0; j < wellInfo[i]; j++) {
        wells[wc].addClass('c' + (5*(i+startColor))%36);
        wc++;
      }
    }

    //break out the columns
    for (var i = 0; i < 12; i++) {
      var col = makeDiv('column');
      col.append(wells.slice(i*8, (i+1)*8));
      dest.append(col);
    }

    result.append(dest);

    //finally, the text
    result.append($('<caption>').text(text));

    return result;
  }

  var makeLooseDestination = function (text, chunkSize, wellInfo, startColor) {
    var result = makeDiv('subcontainer');
    var dest = makeDiv('plate2');

    //the wells
    var wells = [];

    //fill it out to 96
    for (var i = 0; i < 96; i++) {
      wells.push(makeDiv('well'));
    }

    //TODO: This copy-paste is gross, see about refactoring
    for (var i = 0; i < wellInfo.length; i++) {
      var wc = i*chunkSize;
      for (var j = 0; j < wellInfo[i]; j++) {
        wells[wc].addClass('c' + (5*(i+startColor))%36);
        wc++;
      }
    }

    //break out the columns
    for (var i = 0; i < 12; i++) {
      var col = makeDiv('column');
      col.append(wells.slice(i*8, (i+1)*8));
      dest.append(col);
    }

    result.append(dest);

    //finally, the text
    result.append($('<caption>').text(text));

    return result;
  };


  var main = $("#main");
  main.empty();
  var board = makeDiv("board");
  main.append(board);

  for (var i = 0; i < 40; i++) {
    var r = makeDiv("row");
    board.append(r);
    for (var j = 0; j < 40; j++) {
      if (Math.random() < 0.3) {
        r.append(makeDiv("food"))
      }
      else if (Math.random() < 0.2) {
        r.append(makeDiv("snake"))
      }
      else {
        r.append(makeDiv("empty"))        
      }

    };
  };
});
