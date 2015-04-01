<?php
    require_once(__DIR__ . "/../model/config.php");
    
    $query2 = $_SESSION["connection"] -> query("CREATE TABLE users (" //creates users table
            . "id int(11) NOT NULL AUTO_INCREMENT,"
            . "username varchar(30) NOT NULL,"
            . "password char(128) NOT NULL, "
            . "salt char(128) NOT NULL,"
            . "exp int(4),"
            . "exp1 int(4),"
            . "exp2 int(4),"
            . "exp3 int(4),"
            . "exp4 int(4), "
            . "PRIMARY KEY (id))");

    if($query2){ //if query2 is successful...
        echo "Successfully created table: users";
    }
    else{
        echo "<p class='queries'>" . $_SESSION["connection"]->error . "</p>";
    }
