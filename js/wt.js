var victory,
    life;

var stage = {
    rows: 0,
    cols: 0,
    tileSize: 0,
    init: function(){
        //Queries the stage <table> DOM for: tileSize (first col), rows, cols
        this.tileSize = document.querySelectorAll('#stage td')[0].clientWidth;
        this.rows = $('#stage tr').length;
        this.cols = $($('#stage tr')[0]).children().length;
    },
    events: function(){
        // Reads all the cells and returns an array of events and properties
        var events = [];

        $('#stage td[class]').each(function(i){
            events[i]  = {
                element: this,
                type: $(this).attr('class'),
                row: $(this).parent().index(),
                col: $(this).index()
            }
        });

        return(events);
    }
}

var tim = {
    id: '#tim',
    location: {row:0, col:0},
    moving: false,
    move: function(rows, cols){
        var moveTime = 0.3;

        var nextRow = this.location.row + rows;
        var nextCol = this.location.col + cols;

        //Detect direction
        var dir;

        if(cols == 0) {
            dir = rows > 0? "down" : "up";
        } else {
            dir = cols > 0? "right" : "left";
        }

        //If the next move is inside of the stage's boundaries, verify the event
        if (nextRow >= 0 && nextRow < stage.rows && nextCol >= 0 && nextCol < stage.cols){
            tileEvent = verifyTile(nextRow,nextCol);

            if(tileEvent.type != 'hole'){
                tim.moving = true;

                $(this.id).removeClass();

                //hack to force the retrigger of the CSS animation
                setTimeout(function() {
                    $(tim.id).addClass(dir);
                },1);

                moveLeft = cols * stage.tileSize;
                moveTop = rows * stage.tileSize;

                this.location.row = nextRow;
                this.location.col = nextCol;

                TweenMax.to(this.id, moveTime, {left:"+=" + moveLeft, top:"+=" + moveTop, onComplete: function(){
                    //$(this.target).removeClass();
                    void this.offsetWidth;
                    tim.moving = false;
                    updateState(tileEvent);
                }});
            }
        }
    },
    place: function(row, col){
        var e = document.querySelector(this.id);
        e.style.top = (row * stage.tileSize) + 'px';
        e.style.left = (col * stage.tileSize) + 'px';
        this.location.row = row;
        this.location.col = col;
    },
    initPosition: function(){
        var row = 0, col = 0;
        var evtList = stage.events();

        //Searches for the start event, gets coordinates
        for(i=0; i<evtList.length; i++){
            if (evtList[i].type == 'start'){
                row = evtList[i].row;
                col = evtList[i].col;
            }
        }

        //Places Tim at 0,0 (no start defined on level) or coordinates
        this.place(row, col);
    }
};

var display = {
    init: function(){
        $('#msg span').html('').removeClass();
        $("#scene").css("opacity", "1");
    },
    disableScreen: function(){
        $("#scene").css("opacity", "0.5");
        $(document).off('keydown');
        $('#controls').off('click');
    },
    modal: function(){
        $(document).off('keydown');
        $('#controls').off('click');

        $('#modal').show();

        $(document).on('keydown', function(event){
            if(event.keyCode == 13){
                $('#modal').hide();
                resetGame();
            }
        });
    },
    victory: function(){
        this.modal();

        $('#msg span').html('VICTORY!').removeClass().addClass('victory');
         $('#modal p').html('VICTORY!');
    },
    defeat: function(){
        this.modal();

        $('#msg span').html('DEFEAT!').removeClass().addClass('gameOver');
        $('#modal p').html('DEFEAT!');
    }
}


function verifyTile(row, col){
    //Repopulate the events array
    evtList = stage.events();

    //Verify active tile for events
    for(i=0;i<evtList.length;i++){
        if(evtList[i].row == row) {
            if(evtList[i].col == col){
                console.log('Event Detected ' + evtList[i].type );
                return(evtList[i]);
            }
        }
    }
    return(false);
}

function updateState(tileEvent){
    if(tileEvent != false){
        switch(tileEvent.type){
            case 'gem3':
                gem(3);
            break;
            case 'gem5':
                gem(5);
            break;
            case 'exit':
                victory_sound.play();
                display.victory();
                victory = true;
            break;
        }

        //Clear tile's event
        $(tileEvent.element).removeAttr('class');
    }
    else{
        life--;
    }

    updateLife();

    //Verify Game Over
    if(life <= 0 && !victory){
        defeat_sound.play();
        display.defeat();
    }
}

function gem(type){
    if(type == 3){
        gem3_sound.play();
        $('#life').css('background-position', '0 0')
        life = 3;
    }
    else if(type == 5){
        gem5_sound.play();
        $('#life').css('background-position', '-24px 0')
        life = 5;
    }
    updateLife();
}


function updateLife(value){
    // updates the life variable if a value if passed. Else, just updates the UI
    if (value)
        life = value;

    $('#life span').html(life);
}

function initControls(){
    // Bind keys
    $(document).on('keydown', function(event){
        if(!tim.moving){
            switch(event.keyCode){
                case 38:
                    tim.move(-1,0);
                    //console.log('up');
                break;
                case 40:
                    tim.move(1,0);
                    //console.log('down');
                break;
                case 37:
                    tim.move(0,-1);
                    //console.log('left');
                break;
                case 39:
                    tim.move(0,1);
                    //console.log('right');
                break;
            }
        }
    });

    // Bind on-screen control clicks
    $('#controls').on('click', function(e){
        if(!tim.moving){
            switch(e.target.className){
                case 'up':
                    tim.move(-1,0);
                break;
                case 'down':
                    tim.move(1,0);
                break;
                case 'left':
                    tim.move(0,-1);
                break;
                case 'right':
                    tim.move(0,1);
                break;
            }
        }
    });

    // Modal button
    $('#modal button').on('click', function(){
        $('#modal').hide();
        resetGame();
    });
}

function initGame(){
    //Initialize global vars
    tim.moving = false;
    victory = false;
    life = 3;

    updateLife();
    initControls();
    stage.init();
    display.init();
    tim.initPosition();

    $('#fs').on('click', function(){
        if (screenfull.enabled) {
            screenfull.request();
        } else {
            // Ignore or do something else
        }
    });

}

function resetGame(){
    levelLoader.load('levels/01.html');
}

$(function(){
    levelLoader.init();
    levelLoader.load('levels/01.html');
    //theme.play();
});
