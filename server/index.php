<?php
    $ch = curl_init();
    $url = $_GET["url"];
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_HEADER, false);

//Execute request 

    header('Content-Type: application/json');
    header("Access-Control-Allow-Origin: *");
    echo "Begin Test <br/>";
    $response = curl_exec($ch);
    echo "End Test <br/>";

//get the default response headers 


//close connection 
    curl_close($ch);
    flush();
    echo "Test";
    var_dump($response);
?>
