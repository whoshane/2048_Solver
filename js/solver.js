function Solver() {
  this.listen();
  this.events = {};
}

Solver.prototype.passGrid = function(Grid){
	this.grid = Grid;
}

Solver.prototype.on = function (event, callback) {
  if (!this.events[event]) {
    this.events[event] = [];
  }
  this.events[event].push(callback);
};

Solver.prototype.emit = function (event, data) {
  var callbacks = this.events[event];
  if (callbacks) {
    callbacks.forEach(function (callback) {
      callback(data);
    });
  }
};

Solver.prototype.listen = function () {
  var self = this;

  document.addEventListener("keydown", function (event) {
    var modifiers = event.altKey || event.ctrlKey || event.metaKey ||
                    event.shiftKey;

    if (!modifiers) {
      if (event.which == 13) {
        event.preventDefault();
		var direction = self.solve();
        self.emit("move", direction);
      }

      if (event.which === 32) self.restart.bind(self)(event);
    }
  });

  var retry = document.getElementsByClassName("retry-button")[0];
  retry.addEventListener("click", this.restart.bind(this));
  retry.addEventListener("touchend", this.restart.bind(this));
};

Solver.prototype.restart = function (event) {
  event.preventDefault();
  this.emit("restart");
};

Solver.prototype.solve = function(){
    var self = this;
    var xtilecount = 0;
    var ytilecount = 0;
    for (var pos = 0; pos < 4; pos++){
        xtilecount += self.findMerges(pos, 0)//rows
        ytilecount += self.findMerges(pos, 1)//col
    }
    
    if (xtilecount == 0 && ytilecount == 0){
        return Math.floor((Math.random()*4));
        //return self.MovableSpace();
    }else if (xtilecount == ytilecount){
        return Math.floor((Math.random()*4));
    }else{
       var dir = (xtilecount > ytilecount)?0:1; 
       return Math.floor((Math.random()*2))*2 +dir;
    }
};

Solver.prototype.checkNextIter(){
}

Solver.prototype.findMerges = function(apos, dir){
    var self = this;
    var counter = 0;
    var length = 1;
    var cellVal = null;
    var cells = [];

    for (var bpos = 0; bpos < 4; bpos ++){
        if (dir == 0){
            cells.push({x:apos, y:bpos});
        }else{
            cells.push({x:bpos, y:apos});
        }
    }
    
    cells.forEach(function(cell){
        tile = self.grid.cellContent(cell);
        if (tile){
            if (tile.value == cellVal){
                length++;
                if (length%2 == 0){
                    counter++;
                } 
            }else{
                length = 1;
                cellVal = tile.value;
            }
        }
    });
    return counter;
};

function clone(obj) {
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }  
    return copy;
}

