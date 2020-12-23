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

if (!empty($_POST) && isset($_POST['token'], $_POST['password_old'], $_POST['password_new'])) {
    require 'jwt_handler.php';
    $jwt = new JwtHandler();
    $mysqli = new mysqli("localhost", "mps", "=RCASrDR6+gZLf.@z^(EAR@CsE.B7!4!", "mps_db");
    $password_old = htmlspecialchars($_POST['password_old'], ENT_QUOTES);

    if ($mysqli->connect_errno) {
        error_log("Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error);
        echo("Internal Server Error!");
        exit(1);
    }

    if (!($auth_statement = $mysqli->prepare("SELECT password_hash FROM mps_users WHERE user_id = ?"))) {
        error_log("Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error);
        echo("Internal Server Error!");
        exit(1);
    }

    try {
        $user_id = ($jwt->_jwt_decode_data(htmlspecialchars($_POST['token'], ENT_QUOTES)))->user_id;
    } catch(\Exception $e) {
        echo("Error");
        exit(1);
    }

    if (!$auth_statement->bind_param("i", $user_id)) {
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
    if ($result->num_rows != 1) {
        echo("Wrong number of results from DB");
        exit(0);
    }
    
    $result = $result->fetch_assoc();
    $old_db_pw_hash = $result['password_hash'];
    if (password_verify($password_old, $old_db_pw_hash)) {
        if (!($change_statement = $mysqli->prepare("UPDATE mps_users SET password_hash = ? WHERE user_id = ? AND password_hash = ?"))) {
            error_log("Prepare failed: (" . $mysqli->errno . ") " . $mysqli->error);
            echo("Internal Server Error!");
            exit(1);
        }

        $new_db_pw_hash = password_hash(htmlspecialchars($_POST['password_new'], ENT_QUOTES), PASSWORD_DEFAULT);

        if (!$change_statement->bind_param("sis", $new_db_pw_hash, $user_id, $old_db_pw_hash)) {
            error_log("Binding parameters failed: (" . $auth_statement->errno . ") " . $auth_statement->error);
            echo("Internal Server Error!");
            exit(1);
        }

        if (!$change_statement->execute()) {
            error_log("Execute failed: (" . $auth_statement->errno . ") " . $auth_statement->error);
            echo("Internal Server Error!");
            exit(1);
        }

        http_response_code(200);
        echo(TRUE);
        exit(0);
    } else {
        echo(FALSE);
    }
}
else { 
    echo(FALSE);
}

?>