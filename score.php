<?php
    session_start();
    $username = $_SESSION['username'];
    $id = $_SESSION['id'];
    $store = $_SESSION['store'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Profile</title>
    <link rel="stylesheet" href="css/bootstrap.css">
    <link rel="stylesheet" href="css/score.css">
</head>
<body style="width: 100vw;">
    <div class="container d-flex justify-content-center flex-column">
        <div class="row d-flex flex-row justify-content-between" id="welcome_div">
            <div class="col-8">
                <span id="welcome_message">WELCOME </span>
                <span id="username_message"><?php echo $username ?></span>
            </div>
            <div class="col-4 d-flex align-items-center justify-content-end flex-row">
                <button id="logout_btn" class="btn btn-danger">
                    <a href="./logout.php">SIGN OUT</a>
                </button>
            </div>
        </div>
        <hr class="bg-dark border-2 border-top border-dark">
        <div calss="row" id="personal_info">
            <div class="d-md-flex justify-content-md-around flex-md-row">
                <div class="col-md-4 col-12 d-md-flex align-items-md-end justify-content-md-end flex-md-columns order-md-1">
                    <div class="col-md-8 mt-2">
                        <p class="text_tutorial">Still a noob?<br>Consider this useless tutorial.</p>
                        <button id="tutorial_btn" class="btn btn-success w-100">TUTORIAL</button>
                    </div>
                </div>
                <div class="col-md-8 order-md-0">
                    <table class="col-12 float-left mt-2 table gradient-custom text-center text-light table-striped">
                        <caption class="caption-top table_caption">Personal Info</caption>
                        <thead>
                            <tr>
                                <th>Rounds</th>
                                <th>Winrate</th>
                                <th>Games</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td id="rounds" class="text-light"></td>
                                <td id="winrate" class="text-light"></td>
                                <td id="games" class="text-light"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div calss="row">
            <div class="col-12 mt-2">
                
            </div>
        </div>

        <div calss="row">
            <div class="col-12 mt-2">
                <table class="table table-dark table-striped" id="table_id">
                    <div class="d-flex justify-content-start justify-content-between flex-row align-items-center">
                        <button id="game_btn" class="btn btn-warning order-1 mt-3"><a href="./index.php">PLAY GAME</a></button>
                        <span class="table_caption order-0">
                                Game Log 
                        </span>
                    </div>
                    <thead class="text-center">
                        <tr>
                            <th>Username</th>
                            <th>Score</th>
                            <th>Status</th>
                            <th>TimeStamp</th>
                        </tr>
                    </thead>
                    <tbody class="text-center" id="table_body">

                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <script src="./js/score.js"></script>
    <?php
        require 'dbhandler.php';
        if(isset($_POST['submit_btn']) && isset($_SESSION['store']))
        {
            if($_SESSION['store'] == true)
            {
                $sql_1 = "call finishgame(".intval($_POST['playerscore']).", ".intval($_POST['botscore']).", ".$id.");";
                mysqli_query($conn, $sql_1);
                $_SESSION['store'] = false;
            }
        }
    ?>
    <?php
        require 'dbhandler.php';
        if(isset($_POST['submit_btn']) || isset($_GET['login']))
        {
            $sql_2 = "SELECT * FROM player WHERE id=".$id;
            if($result_2 = mysqli_query($conn, $sql_2)){
                $row_2 = mysqli_fetch_assoc($result_2);
                echo "<script type=text/javascript>fillData(".$row_2['rounds'].",".$row_2['winrate'].",".$row_2['games'].");</script>";
                mysqli_free_result($result_2);
            }
        }
    ?>
    <?php
        require 'dbhandler.php';
        if(isset($_POST['submit_btn']) || isset($_GET['login']))
        {
            $sql_3 = "call getrounds($id);";
            if($result_3 = mysqli_query($conn, $sql_3))
            {
                while($row_3 = mysqli_fetch_assoc($result_3))
                {
                    if($row_3['winner'] == "Player"){
                        $playerstatus="Win";
                        $botstatus="Lose";
                    }else if($row_3['winner'] == "Epsilon"){
                        $playerstatus="Lose";
                        $botstatus="Win";
                    }else{
                        $playerstatus="Draw";
                        $botstatus="Draw";
                    }
                    $username = $_SESSION['username'];
                    echo "<script type=text/javascript>createRow('".$username."','Epsilon',".$row_3['playerscore'].",".$row_3['botscore'].",'".$playerstatus."','".$botstatus."','".$row_3['timedate']."');</script>";
                }
                mysqli_free_result($result_3);
            }
        }
    ?>
    <?php
        require 'dbhandler.php';
        if(isset($_POST['submit_btn']))
        {
            $sql_4 = "SELECT botwins, playerwins FROM game WHERE id=$id;";
            if($result_4 =  mysqli_query($conn, $sql_4))
            {
                while($row_4 = mysqli_fetch_assoc($result_4))
                {
                    if($row_4['botwins'] >= 10 || $row_4['playerwins'] >= 10)
                    {
                        if($row_4['botwins'] >= 10)
                            echo "<script type=text/javascript>changeTable('bot')</script>";
                        else
                            echo "<script type=text/javascript>changeTable('player')</script>";
                        $sql_4 = "call resetgame($id);";
                        mysqli_query($conn, $sql_4);
                    }
                }
                mysqli_free_result($result_4);
            } 
        }
    ?>
</body>
</html>