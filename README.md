# 2048 Solver

Spend too much time playing this game without winning. Made to try to beat the game 2048
[The game itself](http://gabrielecirulli.github.io/2048/)

###Version 1
Basic logic. For each direction, check how many tiles will be merged if moved in that direction. Moves in the direction with the maximum number of merged tiles (or randomly chooses if there is a tie).
High score: 6302

###Version 1.1
Slightly improved algorithm. Instead of choosing directions randomly in the case of a tie, choose the direction which results in the largest number of merge opportunities for the next turn.
High score: 11788
