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

    // OPTIONAL: (dann koennen nur eingeloggte user (gueltiger token) auch das ranking abfragen)
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

    if (!($ranking_statement = $mysqli->prepare("SELECT mps_users.name AS username, SUM(mps_user_items.carbon) AS total_carbon FROM mps_users JOIN mps_user_items ON (mps_users.user_id = mps_user_items.user_id) GROUP BY mps_users.user_id ORDER BY SUM(mps_user_items.carbon) ASC LIMIT 5"))) {
        error_log("Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error);
        echo("Internal Server Error!");
        exit(1);
    }

    if (!$ranking_statement->execute()) {
        error_log("Execute failed: (" . $ranking_statement->errno . ") " . $ranking_statement->error);
        echo("Internal Server Error!");
        exit(1);
    }

    $result = $ranking_statement->get_result();
    $result = $result->fetch_all(MYSQLI_ASSOC);
    http_response_code(200);
    echo(json_encode($result));
}
else { 
    echo(FALSE);
}

?>
