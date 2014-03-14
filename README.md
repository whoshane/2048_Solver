# 2048 Solver

Spend too much time playing this game without winning. Made to try to beat the game 2048
[The game itself](http://gabrielecirulli.github.io/2048/)

###Version 1
Basic logic. For each direction, check how many tiles will be merged if moved in that direction. Moves in the direction with the maximum number of merged tiles (or randomly chooses if there is a tie).

High score: 6302 (512 Tile)

###Version 1.1
Slightly improved algorithm. Instead of choosing directions randomly in the case of a tie, choose the direction which results in the largest number of merge opportunities for the next turn.

High score: 12176 (1024 Tile)

###Version 1.2
Prioritizing merge tile value over the number of cells merged. Logic behind it is that larger numbers are rarer, therefore less likely to be aligned for merging. Needs more testing to see which priorizitation produces better results.

High score: 12148 (1024 Tile)

###Version 1.3
Added a closeness factor to the decision tree. The closeness factor is determined by the number of tiles which are within a factor of 2 from each other. Reasoning being that to chain a collection of merges, it's easier when a lower tier value is right next to its successor. I don't know if this even changes anything.

Seems to be able to consistently reach the 512 tile, but can't get over the next hump...

High score: 14016 (1024 Tile)


