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

if (!empty($_POST) && isset($_POST['login_id']) && isset($_POST['password'])) {
    require 'jwt_handler.php';
    $jwt = new JwtHandler();
    $mysqli = new mysqli("localhost", "mps", "=RCASrDR6+gZLf.@z^(EAR@CsE.B7!4!", "mps_db");
    $password = htmlspecialchars($_POST['password'], ENT_QUOTES);
    $login_id = htmlspecialchars($_POST['login_id'], ENT_QUOTES);

    if ($mysqli->connect_errno) {
        error_log("Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error);
        echo("Internal Server Error!");
        exit(1);
    }

    if (!($auth_statement = $mysqli->prepare("SELECT user_id, name, mail, birthdate, gender, password_hash, real_name FROM mps_users WHERE (name = ? OR mail = ?)"))) {
        error_log("Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error);
        echo("Internal Server Error!");
        exit(1);
    }

    if (!$auth_statement->bind_param("ss", $login_id, $_login_id)) {
        error_log("Binding parameters failed: (" . $auth_statement->errno . ") " . $auth_statement->error);
        echo("Internal Server Error!");
        exit(1);
    }

    if (!$auth_statement->execute()) {
        error_log("Execute failed: (" . $auth_statement->errno . ") " . $auth_statement->error);
        echo("Internal Server Error!");
        exit(1);
    }

    $result = $auth_statement->get_result();
    if($result->num_rows === 0) {
        echo(FALSE);
        exit(0);
    }

    while($row = $result->fetch_assoc()) {
        if(password_verify($password, $row['password_hash'])) {
            $token = $jwt->_jwt_encode_data(['user_id' => $row['user_id']]);
            http_response_code(200);
            echo($token);
            exit(0);
        }
      }

    echo(FALSE);
}
else {
    echo("Error with api call!");
}
?>

