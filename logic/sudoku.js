Sudoku = (function(){
    /*
     * This is an online Sudoku game
     * Public methods:
     * -
     * -
     */
    var _board = {
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
        matrix:[
            ["","","","","","","","",""],
            ["","","","","","","","",""],
            ["","","","","","","","",""],
            ["","","","","","","","",""],
            ["","","","","","","","",""],
            ["","","","","","","","",""],
            ["","","","","","","","",""],
            ["","","","","","","","",""],
            ["","","","","","","","",""]
        ],
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
                            "data-section-section": [section.row, section.col].join(""),
                            "data-section-col": b/3,
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
            return [
                "0,0", "0,1", "0,4", "1,0", "1,3", "1,4", "1,5", "2,1", "2,2", "2,7",
                "3,0", "3,4", "3,8", "4,0", "4,3", "4,5", "4,8", "5,0", "5,4", "5,8",
                "6,1", "6,6", "6,7", "7,3", "7,4", "7,5", "7,8", "8,4", "8,7", "8,8"
            ];

            var tiles = [];
            for(var i = 0; i < 30; i++) {
                tiles.push(Math.floor(Math.random() * 8) + "," + Math.floor(Math.random() * 8));
            }

            return tiles
        },
        start:function(appendTo, options){
            _board.solution = _board.example_matrix;
            $.each(_board.tilesToExpose(), function(i, ab){
                ab = ab.split(",");
                var a = parseInt(ab[0]);
                var b = parseInt(ab[1])
                _board.matrix[a][b] = _board.solution[a][b]
            });

            _board.tiles.attachEvents();

            return _board.generate(appendTo)
        },
        check:function(){
            for(var a = 0; a < _board.matrix.length; a++) {
                for(var b = 0; b < _board.matrix[a].length; b++) {
                    if ( _board.matrix[a][b] != _board.solution[a][b] ) {
                        $("div.cell[data-row="+a+"][data-col="+b+"]").addClass("error")
                    }
                }
            }
        },
        solve:function(appendTo){
            _board.matrix = _board.solution;
            return _board.generate(appendTo)
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
                    _board.tiles.lock()
                }
                else {
                    cell.addClass("selected")
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

    return {
        Check:function(){ return _board.check() },
        Start:function(appendTo, options){ return _board.start(appendTo, options) },
        Solve:function(appendTo){ return _board.solve(appendTo) }
    }
})()