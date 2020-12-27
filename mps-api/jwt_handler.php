<?php
require './vendor/firebase/php-jwt/src/JWT.php';
require './vendor/firebase/php-jwt/src/ExpiredException.php';
require './vendor/firebase/php-jwt/src/SignatureInvalidException.php';
require './vendor/firebase/php-jwt/src/BeforeValidException.php';

use \Firebase\JWT\JWT;
\Firebase\JWT\JWT::$leeway = 50;

class JwtHandler {
    protected $jwt_secrect;
    protected $token;
    protected $jwt;

    public function __construct() {
        $this->jwt_secrect = "bVdp3KY67fEx8TXej4JcKM5cjsxb4uSHnACswDTx6PqajtSgXkkpKnZXshmJUXPf";  
    }

    // ENCODING THE TOKEN
    public function _jwt_encode_data($data) {   
        $iat = time(); // time of token issued at
        $nbf = $iat; //not before in seconds
        $exp = $iat + (60 * 60 * 24); // expire time of token in seconds

        $this->token = array(
            "iss" => "http://mps-api.phildree.de",
            "aud" => "http://mps-api.phildree.de",
            "iat" => $iat,
            "nbf" => $nbf,
            "exp" => $exp,
            "data" => $data
        );

        $this->jwt = JWT::encode($this->token, $this->jwt_secrect);
        return $this->jwt;
    }
    
    //DECODING THE TOKEN
    public function _jwt_decode_data($jwt_token) {
        try{
            $decode = JWT::decode($jwt_token, $this->jwt_secrect, array('HS256'));
            return $decode->data;
        }
        catch(\Exception $e) {
            throw new Exception("Error while decoding");
        }
    }
}