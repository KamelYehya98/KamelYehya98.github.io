<?php
$servername = "us-cdbr-east-03.cleardb.com";
$username = "b0d4a32ee82d23";
$password = "e056e410";
$dbname = "heroku_609325a5102c7ea";

$conn = mysqli_connect($servername, $username, $password, $dbname);
if(!$conn)
{
    die("Connection failed: ".mysqli_connect_error());
}
?>
