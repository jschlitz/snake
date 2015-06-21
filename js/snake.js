//Add a snake segment onto the front. Does no checking for walls, food, etc.
var insertSegment = function(x,y, boardInfo, snakeInfo) {
  boardInfo[x][y].div.removeClass();
  boardInfo[x][y].div.addClass('snake');
  snakeInfo.unshift([x,y]);
};

var randInt = function (x){
  return Math.floor(Math.random()*x);
};

var addFood = function(x, boardInfo) {
  for (var i = 0; i < x; i++) {
    var bi = boardInfo[randInt(40)][randInt(40)].div;
    if (!bi.hasClass('snake')) {
      bi.removeClass();
      bi.addClass('food');
    }
  }
};

var newCoords = function(direction, coords) {
  switch (direction.toLowerCase()) {
    case 'w':
      return [coords[0], coords[1]-1];
      break;
    case 'a':
      return [coords[0]-1, coords[1]];
      break;
    case 's':
      return [coords[0], coords[1]+1];
      break;
    default:
      return [coords[0]+1, coords[1]];
  };
};

var willDie = function(direction, boardInfo, snakeInfo){
  var nc = newCoords(direction, snakeInfo[0]);
  if (nc[0]<0 || nc[1]<0 || nc[0]>=40 || nc[1]>=40){
    return true;
  };
  //self collision
  if (boardInfo[nc[0]][nc[1]].div.hasClass('snake')){
    return true;
  };

  return false;
};


$(document).ready(function(){

  var makeDiv = function (c) {
    return $('<div>').addClass(c);
  }

  var main = $("#main");
  main.empty();
  var boardDiv = makeDiv("board");
  main.append(boardDiv);
  var boardInfo = []
  var snakeInfo = [];
  var direction = 'd';

  //initial setup
  for (var i = 0; i < 40; i++) {
    var r = makeDiv("row");
    boardDiv.append(r);
    boardInfo[i] = [];
    for (var j = 0; j < 40; j++) {
      var tmp = {div:makeDiv("empty")}; //may need more data per cell
      boardInfo[i][j] = tmp;
      r.append(tmp.div);
    };
  };
  insertSegment(20,20,boardInfo, snakeInfo);
  addFood(16, boardInfo);

  //main event loop
  while(1){
    if(willDie(direction, boardInfo, snakeInfo)){
      //bah, we can't do a sleep wait.
      alert("He's dead, Jim.");
      break;
    }
    break;
  }
});


































;
