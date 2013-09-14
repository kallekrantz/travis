/*
var getStrada = function(){
    var baseurl = "http://salongerna.se/travis/index.php";

    return function(url,callback){
        var sendurl = baseurl + '?url=' + url;
        console.log(sendurl);
        $.getJSON( sendurl , callback);
    }
}();
url = "http://api.apitekt.se/transportstyrelsen/olyckor-2003-2012/list.json?kommun=Linköping&page=" 

var stradaCallback = function(page){
    return function(data){
        console.log(data);
        if(data.rows.length == 0){
            console.log("EXIT!");
            return;
        }
        nextPage = page + 1000;
        
        getStrada(url+nextPage, stradaCallback(nextPage));
    }
}

for (var i = 1000; i <= 2000; i++){
    console.log("Starting " + url + i)
    getStrada(url+i, stradaCallback(i));
}*/


var strada = function(){
    var url = "js/database.json";
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


strada.init(function(){

    strada.data().forEach(function(entry){
        console.log(entry.vaderleksforhallanden);
    });
})

