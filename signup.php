<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="css/bootstrap.css">
    <link rel="stylesheet" href="css/signup.css">
    <title>Sign Up</title>
</head>
<body>
    <div class="d-flex justify-content-center align-items-center" style="width: 100vw; height: 100vh;">
        <div class ="d-flex justify-content-center flex-column" style="width: 100vw;" id="main_container">
            <div class="d-flex justify-content-center flex-column">
                <div class="d-flex justify-content-center mb-3">
                    <div style="position: relative;" class="text-center">
                        <img src="" id="image_icon"> 
                    </div>
                </div>
                <div class="d-flex justify-content-center">
                    <div class="card login-form gradient-custom" id="card">
                        <div class="card-body">
                            <h1 class="card-title text-start text-success mb-2">REGISTER</h1>
                            <div class="card-text">
                                <div class="text-center" id="errors_div">
                                </div>
                                <form action="./signupprocess.php" method="POST">
                                    <div class="form-group mb-2">
                                        <label for="email" class="text-light">Email Address</label>
                                        <input type="email" class="form-control form-control-sm" name="email" placeholder="example@gmail.com">
                                    </div>

                                    <div class="form-group mb-2">
                                        <label for="username" class="text-light">User Name</label>
                                        <input type="text" class="form-control form-control-sm" name="username"  placeholder="NoobMaster69">
                                    </div>

                                    <div class="form-group mb-2">
                                        <label for="password1" class="text-light">Enter Password</label>
                                        <!-- <a href="#" style="float: right; font-size: 12px;" class="text-primary">Forgot Password?</a> -->
                                        <input type="password" class="form-control form-control-sm" name="password1"
                                            placeholder="Password">
                                    </div>

                                    <div class="form-group mb-2">
                                        <!-- <a href="#" style="float: right; font-size: 12px;" class="text-primary">Forgot Password?</a> -->
                                        <input type="password" class="form-control form-control-sm" name="password2"
                                            placeholder="Confirm Password">
                                    </div>

                                    <button type="submit" class="btn btn-success btn-block mb-2" name="submit_signup_btn">Sign Up</button>

                                    <div class="signup mb-2">
                                        <span class="text-light">Already have an account? </span><a href="signin.php" class="text-success   "> Sign In</a>
                                    </div>
                                    
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script src="./js/signup.js"></script>
    <?php
    if(isset($_GET['error']))
    {
        $error = $_GET['error'];
        echo '<script type="text/javascript"> 
                    checkError("'.$error.'");
              </script>';
    }
    ?>
</body>}
</html>