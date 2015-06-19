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
  }


  var main = $("#main");
  main.empty();

  main.append($("<h2>").text("Many to one"));
  main.append($("<p>").html("These workflows take a known maximum number of wells <b>N</b>\
    from a known number of source plates, and consolidate them into destination plates as best as it can.\
    The choice of <b>N</b> and the number of colonies that are actually on the source plates will have\
    effects on the final layout that may not be immediatly obvious."));

  main.append($("<p>").html("Say <b>N</b> = 8, and we always have enough colonies to pick.\
    If we have 24 source plates, we'll completely fill up 2 destinations and leave the remaining colonies on our sources."));
  main.append(
    makeDiagram([makeSource("24 sources plates. Remainders left on source.", ">=8"),
      makeArrow(),
      makeTightDestination("1st", [8,8,8,8,8,8,8,8,8,8,8,8], 0),
      makeTightDestination("2nd", [8,8,8,8,8,8,8,8,8,8,8,8], 12)]));
  main.append($("<br>"));

  main.append($("<p>").html("There are 2 ways of approaching gaps. \
    We can compact them, or more simply, leave them scattered throughout\
    Say <b>N</b> = 8, but we only have 7-8 colonies per source.\
    If we will leave some gaps at then end of our plates:"));
  main.append(
    makeDiagram([makeSource("24 sources plates", "7-8"),
      makeArrow(),
      makeTightDestination("1st", [8,7,8,8,8,8,7,8,8,8,8,8], 0),
      makeTightDestination("2nd", [8,8,8,8,7,7,8,8,8,8,8,7], 12)]));

  main.append($("<p>").html("Here we have the same situation, but leave gaps where we find them.\
    This is simpler for SAMI to deal with, as it can be known at schedule-time."));
  main.append(
    makeDiagram([makeSource("24 sources plates", "7-8"),
      makeArrow(),
      makeLooseDestination("1st", 8, [8,7,8,8,8,8,7,8,8,8,8,8], 0),
      makeLooseDestination("2nd", 8, [8,8,8,8,7,7,8,8,8,8,8,7], 12)]));
  main.append($("<br>"));


  main.append($("<p>").html("Let's take a more extreme example. \
    Say <b>N</b> = 8, but we only have 5 colonies to be picked on each plate.\
    With our compacting approach, we would end up with something like this."));
  main.append(
    makeDiagram([makeSource("24 sources plates", "5"),
      makeArrow(),
      makeTightDestination("1st", [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5], 0),
      makeTightDestination("2nd", [5,5,5,5,5,5], 18)]));
  main.append($("<p>").html("And here we leave the gaps as they come."));
  main.append(
    makeDiagram([makeSource("24 sources plates", "5"),
      makeArrow(),
      makeLooseDestination("1st", 8, [5,5,5,5,5,5,5,5,5,5,5,5], 0),
      makeLooseDestination("2nd", 8, [5,5,5,5,5,5,5,5,5,5,5,5], 12)]));
  main.append($("<br>"));

  main.append($("<h2>").text("One to one & One to many"));
  main.append($("<p>").html("Now let's take the case where we have reasonably dense\
    sources, and we want to create a set number of destination plates with as few gaps as we reasonably can. \
    One of the constraints that we would have to impose is to have a maximum number of destination plates per source plate."));

  main.append($("<p>").html("For our first example, let's say that we want to \
    make 5 destination plates, and we will leave any set of colonies less than 96 on the source plate."));
  main.append(
    makeDiagram([makeSource("4 colonies left behind", "100"),
      makeArrow(),
      makeTightDestination("1st", [96], 0)]));
  main.append(
    makeDiagram([makeSource("8 colonies left behind", "200"),
      makeArrow(),
      makeTightDestination("1st", [96], 1),
      makeTightDestination("2nd", [96], 1)]));
  main.append(
    makeDiagram([makeSource("95 colonies left behind!", "191"),
      makeArrow(),
      makeTightDestination("1st", [96], 2)]));
  main.append(
    makeDiagram([makeSource("4 colonies left behind", "100"),
      makeArrow(),
      makeTightDestination("1st", [96], 3)]));

  main.append($("<p>").html("During the conversation Friday, Lee proposed having \
    a certain amount of slack in this. For example, we may leave up to 8 empty wells on a plate."));
  main.append(
    makeDiagram([makeSource("4 colonies left behind", "100"),
      makeArrow(),
      makeTightDestination("1st", [96], 0)]));
  main.append(
    makeDiagram([makeSource("8 colonies left behind", "200"),
      makeArrow(),
      makeTightDestination("1st", [96], 1),
      makeTightDestination("2nd", [96], 1)]));
  main.append(
    makeDiagram([makeSource("0 colonies left behind.", "191"),
      makeArrow(),
      makeTightDestination("1st", [96], 2),
      makeTightDestination("2nd", [95], 2)]));

  main.append($("<p>").html("Lee, with what you proposed, what happens with 176 colonies? I could see the boundary conditions getting messy."));
  main.append(
    makeDiagram([makeSource("80 colonies left behind", "176"),
      makeArrow(),
      makeTightDestination("1st", [96], 0)]));
  main.append(
    makeDiagram([makeSource("0 colonies left behind", "176"),
      makeArrow(),
      makeTightDestination("1st", [88], 1),
      makeTightDestination("2nd", [88], 1)]));

  main.append($("<h2>").text("One to many with 2nd pass consolidation"));
  main.append($("<p>").html("Finally, we have the case where we have a known number of source plates and want to harvest \
    as many colonies as possible with complete disregard for any gaps left on \
    destination plates. Later we run a 2nd method to consolidate these wells using the Biomek. \
    This will result in some wasted plates, and may take some extra time. \
    Again, one of the constraints that we would have to impose is to have a maximum number of destination plates per source plate. \
    For example:"));

  main.append(
    makeDiagram([makeSource("", "100"),
      makeArrow(),
      makeTightDestination("1st", [96], 0),
      makeTightDestination("2nd", [4], 0)]));
  main.append(
    makeDiagram([makeSource("", "188"),
      makeArrow(),
      makeTightDestination("1st", [96], 1),
      makeTightDestination("2nd", [92], 1)]));
  main.append(
    makeDiagram([makeSource("", "200"),
      makeArrow(),
      makeTightDestination("1st", [96], 2),
      makeTightDestination("2nd", [96], 2),
      makeTightDestination("3rd", [8], 2)]));

  //$("#content").text("Hello World!")

});
