<?php
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');
}

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");         

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
    exit(0);
}

if (!empty($_POST) && isset($_POST['token'])) {
    require 'jwt_handler.php';
    $jwt = new JwtHandler();

    try {
        $user_id = ($jwt->_jwt_decode_data(htmlspecialchars($_POST['token'], ENT_QUOTES)))->user_id;
    } catch(\Exception $e) {
        echo(FALSE);
        exit(1);
    }
    
    http_response_code(200);
    echo(TRUE);
}
else { 
    echo(FALSE);
}

?>