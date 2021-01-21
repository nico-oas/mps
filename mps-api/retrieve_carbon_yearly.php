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
    $mysqli = new mysqli("localhost", "mps", "=RCASrDR6+gZLf.@z^(EAR@CsE.B7!4!", "mps_db");

    try {
        $user_id = ($jwt->_jwt_decode_data(htmlspecialchars($_POST['token'], ENT_QUOTES)))->user_id;
    } catch(\Exception $e) {
        echo("Error");
        exit(1);
    }

    if ($mysqli->connect_errno) {
        error_log("Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error);
        echo("Internal Server Error!");
        exit(1);
    }

    if (!($items_statement = $mysqli->prepare("SELECT SUM(carbon) AS total_carbon, YEAR(date_added) AS date FROM mps_user_items WHERE user_id = ? GROUP BY YEAR(date_added) ORDER BY YEAR(date_added) ASC"))) {
        error_log("Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error);
        echo("Internal Server Error!");
        exit(1);
    }

    if (!$items_statement->bind_param("i", $user_id)) {
        error_log("Binding parameters failed: (" . $items_statement->errno . ") " . $items_statement->error);
        echo("Internal Server Error!");
        exit(1);
    }

    if (!$items_statement->execute()) {
        error_log("Execute failed: (" . $items_statement->errno . ") " . $items_statement->error);
        echo("Internal Server Error!");
        exit(1);
    }

    $result = $items_statement->get_result()->fetch_all(MYSQLI_ASSOC);
    http_response_code(200);
    echo(json_encode($result));
}
else { 
    echo(FALSE);
}
?>