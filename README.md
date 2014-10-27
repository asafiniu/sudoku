sudoku
======

An online Sudoku game by Asaf Nachmany (asafiniu@gmail.com)

The game consists of two layers -
1. "The Head" (page.js/page.html and the CSS skins)
2. "The Heart" - the game logic itself (sudoku.js)

------------
| THE HEAD |
------------
The Head is in charge of initiating any user action that is irrelevant to the game logic itself. It deals with everything UI as well as the game's external controls (e.g. Start/Restart).
In this implementation, page.js is the Head, and controls the basic functions for the game as well as a theme selector.

-------------
| THE HEART |
-------------
The Heart does not know with which display it is interacting, it is a game machine that initiates, checks and validates everything SUDOKU.
It holds a solved board and the displayed board.
The solved board in this implementation is a fixed one, revealing only some tiles, according to a given set of initially-displayed tiles (from http://en.wikipedia.org/wiki/File:Sudoku-by-L2G-20050714.svg).
When a game is initiated on an existing board (already filled with the right values), a copy is made under a list of tiles that should be displayed (that could help create different levels to the game later on, where more tiles exposed is an easier level) and only then the HTML is generated to show the exposed values.

NOTE: Once the board-generator is called into action, a single solution of the board (an expensive action to take in terms of efficiency) when the board is generated suffices for ANY future validation (instead of traversing through matrices every time a new input is set).

------------------------------------------------------------------------------------

--------------
| TECHNOLOGY |
--------------
Javascript code is written in JQuery (imported v1.11.1).
JQuery provides cleaner, more maintainable code and allows for easier DOM manipilation (mostly in syncing the game matrix with the displayed HTML structure).

CSS code is CSS2.1 compliant in favor of supporting different browsers.

NOTE: I generate classes for every JS file I create in order to keep private methods unreachable to webconsole users. It is not really "code-hiding" in the sense of securing code, but it's a start.

------------------------------------------------------------------------------------

---------------------------
| NICE TO HAVES I SKIPPED |
---------------------------
DISCLAIMER: I could have added so much more to this game but insisted on finishing it in time, and with a lean, working version of it. The following are things I wish I could do in time and will add myself after submission.

1. Board Generator:
    I did begin to implement a board generator, using a Backtracking algorithm (http://en.wikipedia.org/wiki/Backtracking). In favor of standing at the finish line with something working in my hand, I had decided to drop it there and then. (Please see sudoku.js '_generator' object for the code itself).

2. Value suggestions:
    Another little thing I would add is a tooltip, showing the player suggested tiles (valid input values) for a selected cell on the board. Pulling these is already implemented as part of the board solver. A click on a cell would trigger a call to this function, and the valid tiles would be unlocked on the bottom tile strip (possible values)

3. Multiple themes:
     Different strokes for different folks :)
     My theme picker could have had nicer themes. I added a second CSS file, skin2.css, to allow switching between themes, just to show its purpose.
     I did not pay much attentions to the choice of colors but that is definitely something I would do if I had more time.