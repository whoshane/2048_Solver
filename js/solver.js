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
        xtilecount += self.findMerges(pos, 0, self.grid)//rows
        ytilecount += self.findMerges(pos, 1, self.grid)//col
    }

    self.checkNextIter();
    
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

Solver.prototype.checkNextIter = function(){
    next = cloneGrid(this.grid);
    moveTiles(0, next);
    alert(next.cellContent({x:0, y:0}));
    alert(this.grid.cellContent({x:0, y:0}));
   
};

Solver.prototype.findMerges = function(apos, dir, grid){
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
        tile = grid.cellContent(cell);
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

cloneGrid = function(grid) {
    var copy = new Grid(grid.size);
    for (var x = 0; x < grid.size; x++) {
        for (var y = 0; y < grid.size; y++) {
            if (grid.cellOccupied({x:x,y:y})){
                oldTile = grid.cellContent({x:x, y:y});
                newTile = new Tile({x:oldTile.x, y:oldTile.y}, oldTile.value);
                copy.insertTile(newTile);
            }
        }
    }
    return copy;
};

moveTiles = function (direction, grid) {
  // 0: up, 1: right, 2:down, 3: left

  var cell, tile;

  var vector     = getVector(direction);
  var traversals = buildTraversals(vector);

  // Save the current tile positions and remove merger information
  prepareTiles(grid);

  // Traverse the grid in the right direction and move tiles
  traversals.x.forEach(function (x) {
    traversals.y.forEach(function (y) {
      cell = { x: x, y: y };
      tile = grid.cellContent(cell);

      if (tile) {
        var positions = findFarthestPosition(cell, vector,grid);
        var next      = grid.cellContent(positions.next);

        // Only one merger per row traversal?
        if (next && next.value === tile.value && !next.mergedFrom) {
          var merged = new Tile(positions.next, tile.value * 2);
          merged.mergedFrom = [tile, next];

          grid.insertTile(merged);
          grid.removeTile(tile);

          tile.updatePosition(positions.next);

        }else{
          moveTile(tile, positions.farthest, grid);
        }
      }
    });
  });
};

getVector = function (direction) {
  // Vectors representing tile movement
  var map = {
    0: { x: 0,  y: -1 }, // up
    1: { x: 1,  y: 0 },  // right
    2: { x: 0,  y: 1 },  // down
    3: { x: -1, y: 0 }   // left
  };

  return map[direction];
};

buildTraversals = function (vector) {
  var traversals = { x: [], y: [] };

  for (var pos = 0; pos < 4; pos++) {
    traversals.x.push(pos);
    traversals.y.push(pos);
  }

  // Always traverse from the farthest cell in the chosen direction
  if (vector.x === 1) traversals.x = traversals.x.reverse();
  if (vector.y === 1) traversals.y = traversals.y.reverse();

  return traversals;
};

prepareTiles = function (grid) {
  grid.eachCell(function (x, y, tile) {
    if (tile) {
      tile.mergedFrom = null;
      tile.savePosition();
    }
  });
};

findFarthestPosition = function (cell, vector, grid) {
  var previous;

  // Progress towards the vector direction until an obstacle is found
  do {
    previous = cell;
    cell     = { x: previous.x + vector.x, y: previous.y + vector.y };
  } while (grid.withinBounds(cell) &&
           grid.cellAvailable(cell));

  return {
    farthest: previous,
    next: cell // Used to check if a merge is required
  };
};

moveTile = function (tile, cell, grid) {
  grid.cells[tile.x][tile.y] = null;
  grid.cells[cell.x][cell.y] = tile;
  tile.updatePosition(cell);
};
