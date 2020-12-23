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

// TODO WICHTIG: Checken dass es keinen user mit der selben mail/username bereits gibt!!

if (!empty($_POST) && isset($_POST['username'], $_POST['mail'], $_POST['birthdate'], $_POST['gender'], $_POST['password'], $_POST['real_name'], $_POST['region'])) {
    require 'jwt_handler.php';
    $jwt = new JwtHandler();
    $mysqli = new mysqli("localhost", "mps", "=RCASrDR6+gZLf.@z^(EAR@CsE.B7!4!", "mps_db");
    $name = htmlspecialchars($_POST['username'], ENT_QUOTES);
    $mail = htmlspecialchars($_POST['mail'], ENT_QUOTES);
    $birthdate  = htmlspecialchars($_POST['birthdate'], ENT_QUOTES);
    $gender  = htmlspecialchars($_POST['gender'], ENT_QUOTES);
    $password_hash = password_hash(htmlspecialchars($_POST['password'], ENT_QUOTES), PASSWORD_DEFAULT);
    $real_name  = htmlspecialchars($_POST['real_name'], ENT_QUOTES);
    $region  = htmlspecialchars($_POST['region'], ENT_QUOTES);

    if ($mysqli->connect_errno) {
        error_log("Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error);
        echo("Internal Server Error!");
        exit(1);
    }

    if (!($auth_statement = $mysqli->prepare("INSERT INTO mps_users (name, mail, birthdate, gender, password_hash, real_name, region) VALUES (?, ?, ?, ?, ?, ?, ?)"))) {
        error_log("Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error);
        echo("Internal Server Error!");
        exit(1);
    }

    if (!$auth_statement->bind_param("sssssss", $name, $mail, $birthdate, $gender, $password_hash, $real_name, $region)) {
        error_log("Binding parameters failed: (" . $auth_statement->errno . ") " . $auth_statement->error);
        echo("Internal Server Error!");
        exit(1);
    }

    if (!$auth_statement->execute()) {
        error_log("Execute failed: (" . $auth_statement->errno . ") " . $auth_statement->error);
        echo("Internal Server Error!");
        exit(1);
    }
    
    $res = $mysqli->query("SELECT LAST_INSERT_ID() AS last_insert_ID FROM mps_users");
    if (!$res) {
        error_log("Retrieve user_id failed: (" . $mysqli->errno . ") " . $mysqli->error);
        echo("Internal Server Error!");
        exit(1);
    }
    $res->data_seek(0);
    $user_id = $res->fetch_assoc()['last_insert_ID'];

    // after user has registered he should automatically be logged in
    $token = $jwt->_jwt_encode_data(['user_id' => $user_id]);
    http_response_code(200);
    echo($token);
}
else {
    echo(FALSE);
}
?>

