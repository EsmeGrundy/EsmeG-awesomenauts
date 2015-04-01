<?php
require_once (__DIR__ . "/../model/config.php");

unset($_SESSION["authenticated"]); //destroys the variable

session_destroy(); //destorys the session

header("location: " . $path . "/index.php"); //reutrns user to index page
