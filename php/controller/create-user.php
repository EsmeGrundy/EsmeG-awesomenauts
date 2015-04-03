<?php

require_once (__DIR__ . "/../model/config.php");

$username = filter_input(INPUT_POST, "username", FILTER_SANITIZE_STRING);
$password = filter_input(INPUT_POST, "password", FILTER_SANITIZE_STRING);


$salt = "$5$" . "rounds = 5000$" . uniqid(mt_rand(), true) . "$";

$hashedPassword = crypt($password, $salt); //encrypts the password given by the user

$query = $_SESSION["connection"]->query("INSERT INTO users SET "  //queries the database to put the users' email, username, hashed password and salt into database
        . "username='$username',"
        . "password='$hashedPassword',"
        . "salt='$salt',"
        . "exp = 0,"
        . "exp1 = 0, "
        . "exp2 = 0,"
        . "exp3 = 0,"
        . "exp4 = 0"
);

$_SESSION["name"] = $username;

if ($query) { //if the query is true...
    //needed for Ajax on index.php
    echo "true";
} else {
    echo "<p>" . $_SESSION["connection"]->error . "</p>"; //echoes error
}
 
