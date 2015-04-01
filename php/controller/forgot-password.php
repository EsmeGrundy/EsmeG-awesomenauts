<?php

require_once (__DIR__ . "/../model/config.php");

$username = filter_input(INPUT_POST, "username", FILTER_SANITIZE_STRING);

$query = $_SESSION["connection"]->query("SELECT * FROM users WHERE BINARY username='$username'");

function random_password($length = 8) {
    $chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-=+;:,.?";
    $randPassword = substr(str_shuffle($chars), 0, $length);
    return $randPassword;
}

if ($query->num_rows === 1) {
    $row = $query->fetch_array();
    if ($row) {
        $to = $row["email"];
        $subject = "Your New Password";
        $message = "Your Password: " . random_password();
        $headers = "From: eg2485@gmail.com";
        $mail = mail($to, $subject, $message, $headers);
        if($mail){
            echo "Check your email. Copy the random password given to you and change your password please.";
        }
        else{
            echo "Email was not sent.";
        }
    }
} else {
    echo "<p>" . $_SESSION["connection"]->error . "</p>";
}
