var levelLoader = {
    init:function(){
        //Populate levels combobox with html files in the levels folder
        $.ajax({
            url: "levels",
            success: function(data){
            $(data).find('a:contains("html")').each(function(){
                level = $(this).attr('href');
                $('#levelLoader select').append('<option>' + level + '</option>');
            });
            }
        });

        //Bind loading functionality to form
        $('#levelLoader').on('submit', function(e){
                selected = $('#levelLoader option:selected').val();
                //levelLoader.load('levels/' + selected);
                levelLoader.load(selected);
                //console.log(levelToLoad);
                e.preventDefault();
        });
    },
    load:function(level){
        // Load the level from external file, then inits the game at the callback
        $( "#scene" ).load(level, function(){
            initGame();
        });
    }
};


