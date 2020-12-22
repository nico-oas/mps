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

if (!empty($_POST) && isset($_POST['token'], $_POST['category'], $_POST['name'], $_POST['carbon'])) {
    require 'jwt_handler.php';
    $jwt = new JwtHandler();
    $mysqli = new mysqli("localhost", "mps", "=RCASrDR6+gZLf.@z^(EAR@CsE.B7!4!", "mps_db");
    $category = htmlspecialchars($_POST['category'], ENT_QUOTES);
    $name = htmlspecialchars($_POST['name'], ENT_QUOTES);
    $carbon = htmlspecialchars($_POST['carbon'], ENT_QUOTES);


    try {
        $user_id = ($jwt->_jwt_decode_data(htmlspecialchars($_POST['token'], ENT_QUOTES)))->user_id;
    } catch(\Exception $e) {
        echo(FALSE);
        exit(1);
    }
    
    if ($mysqli->connect_errno) {
        error_log("Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error);
        echo("Internal Server Error!");
        exit(1);
    }

    if (!($add_item_statement = $mysqli->prepare("INSERT INTO mps_user_items (user_id, item_name, item_category, carbon) VALUES (?, ?, ?, ?)"))) {
        error_log("Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error);
        echo("Internal Server Error!");
        exit(1);
    }

    if (!$add_item_statement->bind_param("issd", $user_id, $name, $category, $carbon)) {
        error_log("Binding parameters failed: (" . $add_item_statement->errno . ") " . $add_item_statement->error);
        echo("Internal Server Error!");
        exit(1);
    }

    if (!$add_item_statement->execute()) {
        error_log("Execute failed: (" . $add_item_statement->errno . ") " . $add_item_statement->error);
        echo("Internal Server Error!");
        exit(1);
    }

    http_response_code(200);
    echo(TRUE);
}
else { 
    echo(FALSE);
}

?>