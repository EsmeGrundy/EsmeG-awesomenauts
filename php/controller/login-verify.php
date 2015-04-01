<?php
    require_once (__DIR__ . "/../model/config.php");
    
    function authenticateUser(){
        if(!isset($_SESSION["authenticated"])){ //if the variable is not created...
            return false; //the variable $_SESSION["authenticated"] returns false
        }
        else{
            if($_SESSION["authenticated"] != true){ //if the user is not logged in...
                return false; //the variable $_SESSION["authenticated"] returns false
            }
            else{
                return true; //the variable $_SESSION["authenticated"] returns true
            }
        }
    }


