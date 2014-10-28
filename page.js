(function(){
    var _page = {
        attachEvents:function(){
            $("a#play").on("click", function(e){
                $("ul#tiles,div#board").show();
                $(this).siblings().removeClass("locked").parents("div#buttons").addClass("all");
                $(this).text("Restart");
                if ( $("div.cell").length === 0 || confirm("Are you sure you wish to restart the game?") ) {
                    Sudoku.Start("div#board", {
                        generateBoard:false
                    })
                }
            }).trigger("click");
            $("a#check").on("click", function(e){
                Sudoku.Check()
            });
            $("a#solve").on("click", function(e){
                if ( !$(this).hasClass("locked") ) {
                    $(this).addClass("locked");
                    Sudoku.Solve("div#board")
                }
            })
            $("select").on("change", function(e){
                $("body").attr("class", $(e.target).find("option:selected").attr("name"))
            })
        },
        setDevice:function(){
            var ua = navigator.userAgent;
            $("body").addClass(ua.match(/iphone|android|ipod|ipad/i) ? "mobile" : "")
        }
    };

    $(document).on("ready", function(e){
        _page.setDevice()
        _page.attachEvents()
    })

    return {}
})()