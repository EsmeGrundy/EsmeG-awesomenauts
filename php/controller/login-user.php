<?php

require_once (__DIR__ . "/../model/config.php");

$array = array(
    'exp' => '',
    'exp1' => '',
    'exp2' => '',
    'exp3' => '',
    'exp4' => ''
);

$username = filter_input(INPUT_POST, "username", FILTER_SANITIZE_STRING);
$password = filter_input(INPUT_POST, "password", FILTER_SANITIZE_STRING);


$query = $_SESSION["connection"]->query("SELECT * FROM users WHERE BINARY username = '$username'"); //requests the salt 
//and password from the table "users"
//where the username is the username input



if ($query->num_rows === 1) {  //if there is only one row where the username is equal to the variable $username, then...
    $row = $query->fetch_array(); //gets the data contained within the query
    if ($row["password"] === crypt($password, $row["salt"])) { //if the password in the table is equal to the encrypted password entered, then...
        $_SESSION["authenticated"] = true; //user is logged-in
        $array["exp"] = $row["exp"];
        $array["exp1"] = $row["exp1"];
        $array["exp2"] = $row["exp2"];
        $array["exp3"] = $row["exp3"];
        $array["exp4"] = $row["exp4"];
        $_SEESION["name"] = $username;
        echo json_encode($array);
    } else {
        echo "Invalid Username and Password";
    }
} else {
    echo "Invalid Username and Password"; //refreshes the login form
}
