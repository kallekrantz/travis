var strada = function(){
    var url = "server/database.json";
    var stradaData = [];

    return {
        init: function(callback){
            $.getJSON(url, function(data){
                stradaData = data;
                callback();
            }).fail(function(error){
                console.log("Failed parsing of strada-json");
                console.log(error);
            })
        },
        data: function(){
            return stradaData;
        }
    }
}();

