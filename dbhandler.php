<?php
//host: ec2-54-87-112-29.compute-1.amazonaws.com
//database: d9m6c0k7qrk672
//users: qzlmlzgvvrxuus
//pass: 6146d8bb53db377168bf8f4a1b47ea1caa86d8c906e790597be8259a0fe9cf25
$servername = "ec2-54-87-112-29.compute-1.amazonaws.com";
$username = "qzlmlzgvvrxuus";
$password = "6146d8bb53db377168bf8f4a1b47ea1caa86d8c906e790597be8259a0fe9cf25";
$dbname = "d9m6c0k7qrk672";

$conn = mysqli_connect($servername, $username, $password, $dbname);
if(!$conn)
{
    die("Connection failed: ".mysqli_connect_error());
}
?>