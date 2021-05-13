<?php

if(isset($_POST['submit_signup_btn']))
{
    require 'dbhandler.php';

    $username = $_POST['username'];
    $password1 = $_POST['password1'];
    $password2 = $_POST['password2'];
    $email = $_POST['email'];

    if(empty($username) || empty($password1) || empty($password2) || empty($email))
    {
        header("Location: ./signup.php?error=emptyfields&username=".$username."&mail=".$email);
        exit();
    }
    else if(!filter_var($email, FILTER_VALIDATE_EMAIL) && !preg_match("/^[a-zA-Z0-9]*$/", $username))
    {
        header("Location: ./signup.php?error=invalidemailandusername");
        exit();
    }
    else if(!filter_var($email, FILTER_VALIDATE_EMAIL))
    {
        header("Location: ./signup.php?error=invalidemail&username=".$username);
        exit();
    }
    else if(!preg_match("/^[a-zA-Z0-9]*$/", $username))
    {
        header("Location: ./signup.php?error=invalidusername&mail=".$email);
        exit(); 
    }
    else if($password1 !== $password2)
    {
        header("Location: ./signup.php?error=passwordnotmatch&username=".$username."&mail=".$email);
        exit();
    }
    else
    {
        $sql = "SELECT username FROM users WHERE username=?";
        $stmt = mysqli_stmt_init($conn);
        if(!mysqli_stmt_prepare($stmt, $sql))
        {
            header("Location: ./signup.php?error=sqlerror");
            exit();
        }
        else
        {
            mysqli_stmt_bind_param($stmt, "s", $username);
            mysqli_stmt_execute($stmt);
            mysqli_stmt_store_result($stmt);
            $resultcheck = mysqli_stmt_num_rows($stmt);
            if($resultcheck > 0)
            {
                header("Location: ./signup.php?error=usernametaken&mail=".$email);
                exit();
            }
            else
            {
                $sql = "call createUser(?, ?, ?);";
                $stmt = mysqli_stmt_init($conn);
                if(!mysqli_stmt_prepare($stmt, $sql))
                {
                    header("Location: ./signup.php?error=sqlerror");
                    exit();
                }
                else
                {
                    $hashedpass = password_hash($password1, PASSWORD_DEFAULT);
                    mysqli_stmt_bind_param($stmt, "sss", $username, $hashedpass, $email);
                    mysqli_stmt_execute($stmt);
                    header("Location: ./index.php?error=success");
                    exit();
                }
            }
        }
    }
    mysqli_stmt_close($stmt);
    mysqli_close($conn);
}
else
{
    header("Location: ../signup.php");
    exit();
}

?>
