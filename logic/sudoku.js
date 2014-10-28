Sudoku = (function(){
    /*
     * An online Sudoku game by Asaf Nachmany (asafiniu@gmail.com)
     * Public methods:
     * - Check:
     *      Check if the game is solved and if not, mark the missing/invalid values in red
     * - Start:
     *      Start a new game
     * - Solve:
     *      Solve the current board
     */
    var _board = {
        options:{
            generateBoard:false,
            tilesToExpose:30
        },
        example_matrix:[
            [5,3,4,6,7,8,9,1,2],
            [6,7,2,1,9,5,3,4,8],
            [1,9,8,3,4,2,5,6,7],
            [8,5,9,7,6,1,4,2,3],
            [4,2,6,8,5,3,7,9,1],
            [7,1,3,9,2,4,8,5,6],
            [9,6,1,5,3,7,2,8,4],
            [2,8,7,4,1,9,6,3,5],
            [3,4,5,2,8,6,1,7,9]
        ],
        matrix:"",
        generate:function(appendTo){
            appendTo = $(appendTo);
            if ( appendTo.length ) {
                var board = $("<table>", {"class":"sudoku-board"});
                for(var a = 0; a < 9; a++) {
                    var row = $("<tr>", {"class":"sudoku-board-row", "colspan": 9, "data-row": a});
                    for(var b = 0; b < 9; b++) {
                        var section = {row: Math.floor(a/3), col: Math.floor(b/3)};
                        row.append($("<td>", {"html":$("<div>", {
                            "class": "cell" + ((section.row + section.col) % 2 == 0 ? " grey" : ""),
                            "data-row": a,
                            "data-col": b,
                            "html":_board.matrix[a][b]
                        })}))
                    }

                    board.append(row)
                }

                appendTo.html(board);
                appendTo.find("div").on("click", _board.cell.onClick);
                $(document).on("click", function(e){
                    var elem = $(e.target);
                    if ( !elem.hasClass("cell") ) {
                        $("div.cell.selected").trigger("click")
                    }
                    else {
                        $("div.cell.error").removeClass("error")
                    }
                }).on("keyup", function(e){
                    var ch = String.fromCharCode(e.which);
                    if ( $("div.cell.selected").length && !isNaN(ch) ) {
                        $("ul#tiles li.tile:contains("+ch+")").click()
                    }
                })
            }

            return appendTo
        },
        tilesToExpose:function(){
            var tiles = [];
            if ( _board.options.generateBoard ) {
                for(var i = 0; i < _board.options.tilesToExpose; i++) {
                    tiles.push(Math.floor(Math.random() * 8) + "," + Math.floor(Math.random() * 8));
                }
            }
            else {
                tiles = [
                    "0,0", "0,1", "0,4", "1,0", "1,3", "1,4", "1,5", "2,1", "2,2", "2,7",
                    "3,0", "3,4", "3,8", "4,0", "4,3", "4,5", "4,8", "5,0", "5,4", "5,8",
                    "6,1", "6,6", "6,7", "7,3", "7,4", "7,5", "7,8", "8,4", "8,7", "8,8"
                ]
            }

            return tiles
        },
        start:function(appendTo, options){
            if ( options ){
                _board.options = $.extend(_board.options, options || {});
                if ( _board.options.generateBoard ) {
                    _board.solution = _board.matrix;
                    _generator.solve()
                }
                else {
                    _board.solution = _board.example_matrix
                }
            }

            _board.matrix = [
                ["","","","","","","","",""],
                ["","","","","","","","",""],
                ["","","","","","","","",""],
                ["","","","","","","","",""],
                ["","","","","","","","",""],
                ["","","","","","","","",""],
                ["","","","","","","","",""],
                ["","","","","","","","",""],
                ["","","","","","","","",""]
            ];
            var tiles = _board.tilesToExpose();
            for(var i = 0; i < tiles.length; i++){
                var tileLoc = tiles[i].split(",");
                var a = parseInt(tileLoc[0]);
                var b = parseInt(tileLoc[1]);
                _board.matrix[a][b] = _board.solution[a][b]
            }

            _board.tiles.attachEvents();
            _board.unlock()

            return _board.generate(appendTo)
        },
        getCellOnBoard:function(a, b){
            return $("div.cell[data-row="+a+"][data-col="+b+"]")
        },
        updateMatrix:function(){
            for(var a = 0; a < _board.matrix.length; a++){
                for(var b = 0; b < _board.matrix[a].length; b++){
                    var value = _board.getCellOnBoard(a, b).html();
                    if ( !isNaN(value) ) {
                        _board.matrix[a][b] = parseInt(value)
                    }
                }
            }
        },
        check:function(){
            var gameOver = true;
            for(var a = 0; a < _board.matrix.length; a++) {
                for(var b = 0; b < _board.matrix[a].length; b++) {
                    if ( _board.matrix[a][b] != _board.solution[a][b] ) {
                        gameOver = false;
                        _board.getCellOnBoard(a, b).addClass("error")
                    }
                }
            }

            if ( gameOver ) {
                alert("Congratulations!\nYou did it!")
            }
        },
        solve:function(appendTo){
            _board.matrix = _board.solution;
            _board.generate(appendTo);
            _board.tiles.lock();
            _board.lock()
        },
        lock:function(){
            $("div.cell").addClass("locked")
        },
        unlock:function(){
            $("div.cell.locked").removeClass("locked")
        },
        tiles:{
            lock:function(){ return $("ul#tiles").addClass("locked") },
            unlock:function(){ return $("ul#tiles").removeClass("locked") },
            attachEvents:function(){
                $("ul#tiles li.tile").on("click", function(e){
                    if ( !$(this).parents("ul").hasClass("locked") ) {
                        var value = $(e.target).html();
                        if ( isNaN(value) ) {
                            if ( confirm("Something weird happened.. Found '" + value + "' instead of a valid number.\nRestart the game?") ) {
                                window.location.reload()
                            }
                        }
                        else {
                            $("div.cell.selected").html(value).removeClass("selected");
                            _board.updateMatrix();
                            _board.unlock();
                            _board.tiles.lock()
                        }
                    }
                })
            }
        },
        cell:{
            onClick:function(e){
                var cell = $(e.target);
                var unselect = cell.hasClass("selected");
                $("div.cell.selected").removeClass("selected");
                if ( unselect ) {
                    cell.removeClass("selected");
                    cell.parents("table").removeClass("selected");
                    _board.tiles.lock()
                }
                else {
                    cell.addClass("selected");
                    cell.parents("table").addClass("selected");
                    _board.tiles.unlock()
                }

                return cell
            },
            onBlur:function(e){
                var elem = $(e.target);
                if ( !elem.hasClass("tooltip") && !elem.parents(".tooltip").length ) {
                    $(".tooltip").fadeOut();
                    $("div.selected").removeClass("selected");
                    _board.tiles.lock()
                }
            }
        }
    };

    var _generator = {
        solve:function(){
            var solved = _generator.isBoardFull(_board.solution)
            if ( !solved ) {
                var cell = _generator.getNextEmptyCell(_board.solution);
                var values = _generator.getPossibleValues(_board.solution, cell.row, cell.col).sort(function(a, b){ return Math.random()*a < Math.random()*b });
                for(var i = 0; i < values.length; i++){
                    _board.solution[cell.row][cell.col] = values[i];
                    if ( _generator.solve(_board.solution) ) {
                        solved = true
                    }
                    else {
                        _board.solution[cell.row][cell.col] = ""
                    }
                }
            }

            return solved
        },
        getNextEmptyCell:function(board){
            var emptyCell = "";
            for(var a = 0; !emptyCell && a < board.length; a++) {
                for(var b = 0; !emptyCell && b < board[a].length; b++) {
                    emptyCell = (board[a][b] ? "" : {row:a, col: b})
                }
            }

            return emptyCell
        },
        getPossibleValues:function(board, a, b){
            var values = [1,2,3,4,5,6,7,8,9];
            for(var i = 0; i < 9; i++) { // Find in row
                var inValues = values.indexOf(board[a][i])
                if ( inValues > 0 ) {
                    values.splice(inValues, 1)
                }
            }

            for(var i = 0; i < 9; i++) { // Find in column
                var inValues = values.indexOf(board[i][b])
                if ( inValues > 0 ) {
                    values.splice(inValues, 1)
                }
            }

            for(var i = 0; i < values.length; i++) { // Find in section
                if ( _generator.isValueInSection(board, a, b, values[i]) ) {
                    values.splice(i, 1)
                }
            }

            return values
        },
        isBoardFull:function(board) {
            return board && board.toString().match(/\,\,/) == null
        },
        isValueInSection:function(board, a, b, val){
            var sectionA = Math.floor(a/3);
            var sectionB = Math.floor(b/3);
            for(var x = (3*sectionA); x < (3*sectionA) + 3; x++){
                for(var y = (3*sectionB); y < (3*sectionB) + 3; y++){
                    var sectionX = Math.floor(x/3);
                    var sectionY = Math.floor(y/3);
                    if ( sectionX == sectionA && sectionY == sectionB && board[x][y] == val ) {
                        return true
                    }
                }
            }

            return false
        }
    };

    return {
        Check:function(){ return _board.check() },
        Start:function(appendTo, options){ return _board.start(appendTo, options) },
        Solve:function(appendTo){ return _board.solve(appendTo) }
    }
})()