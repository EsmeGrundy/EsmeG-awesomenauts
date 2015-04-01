<?php
require_once (__DIR__ . "/../model/config.php");
    
$username = filter_input(INPUT_POST, "username", FILTER_SANITIZE_STRING);
$newPassword = filter_input(INPUT_POST, "new-password", FILTER_SANITIZE_STRING);
$oldPassword = filter_input(INPUT_POST, "old-password", FILTER_SANITIZE_STRING);
$confirmPassword = filter_input(INPUT_POST, "confirm-password", FILTER_SANITIZE_STRING);

$salt = "$5$" . "rounds = 5000$" . uniqid(mt_rand(), true) . "$";

$hashedPassword = crypt($newPassword, $salt);

$query = $_SESSION["connection"]->query("SELECT salt, password FROM users WHERE BINARY username='$username'");

 if($query -> num_rows === 1){  //if there is only one row where the username is equal to the variable $username, then...
        $row = $query->fetch_array(); //gets the data contained within the query
        if($row["password"] === crypt($oldPassword, $row["salt"])){ //if the password in the table is equal to the encrypted password entered, then...
            if($newPassword===$confirmPassword){ //if the new password is the same as the confirm password...
                $query2 = $_SESSION["connection"]->query("UPDATE users SET password='$hashedPassword' WHERE username='$username'");//query the databasee to update the users table
                if(!$query2){//if query2 is not true
                      echo "<p class='error-message'>" . $_SESSION["connection"]->error . "</p>"; //display error message
                }
                else{
                   echo "<p class='error-message'>" . "Successfully changed password" . "</p>";
                   header("location: " . $path . "/index.php");
                }
            }
            else{
              echo "<pclass='error-message'>" . "Passwords do not match" . "</p>"; 
              header("location: " . $path . "/index.php");
            }
        }
        else{
            echo "<p class='error-message'>" . "Invalid Username and Password" . "</p>";
            header("location: " . $path . "/index.php");
        }
    }
    else{
         echo "<p class='error-message'>" . $_SESSION["connection"]->error . "</p>";
    }

