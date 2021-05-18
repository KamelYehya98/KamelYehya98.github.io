<?php
    session_start();
    if(!isset($_SESSION['username']))
    {
        header("Location: ./index.php");
        exit();
    }
    $username = $_SESSION['username'];
    $store = $_SESSION['store'];
?>


<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="css/bootstrap.css">
        <link rel="stylesheet" href="css/style.css">
        <title>Monke</title>
    </head>

    <body onload="games();">
        <audio id="monkeyaudio" src="./audio/MONKE.mp3"></audio>
        <form action="./score.php" method="POST" id="form_id" style="display: none;">
            <input name="playerscore" type="text" value="" id="playerscore_form">
            <input name="botscore" type="text" value="" id="botscore_form">
            <button name="submit_btn" type="submit" id="submit_button"></button>
        </form>
        <div class="d-flex justify-content-center align-items-center" id="themaincontainer" style="width: 100vw;">
            <div class="container"style="width: 100vw;">  
                <div class="row d-md-flex flex-md-row justify-content-md-between flex-md-nowrap d-flex flex-column align-content-around addopacitymonkey">
                    <div class="col-md-6 col-12 col-sm-12 d-flex justify-content-end justify-content-md-start m-0 p-0 order-md-1" id="assets-container-bot">
                        <div class="col-md-3 col-3 m-2 p-0 d-flex align-items-center order-md-3">
                            <img src="" class="img-fluid" id="botpick">
                        </div>
                        <div class="col-md-5 col-3 m-2 p-0 d-flex align-items-center order-md-2" id="specialdivbot">
                            <p class="text-center" id="specialtextbot"></p>
                            <img src="" class="img-fluid" id="specialimgbot">
                        </div>
                        <div class="col-md-3 col-4 d-flex flex-column justify-content-center m-1 p-0 order-md-2" id="botbuttons">
                            <button class="btn btn-primary mt-2 btn-sm" style="font-size: 0.8rem;" id="throwcardbot">THROW CARD</button>
                            <button class="btn btn-success mt-2 btn-sm" style="font-size: 0.8rem;" id="freethrowbot">FREE THROW</button>
                            <button class="btn btn-warning mt-2 btn-sm" style="font-size: 0.8rem;" id="monkebot">MONKE</button>
                            <button class="btn btn-dark mt-2 btn-sm" id="specialbot" style="font-size: 0.8rem;">ACTIVATE SPECIAL</button>
                        </div>
                        <div class="order-md-0 vertical-line rounded"></div>
                    </div>
                    <div class="col-md-6 d-flex flex-row justify-content-around col-12 m-md-1 m-2 p-0 order-md-0" id="cards-container-bot">
                        <div class="col-md-3 col-2 d-flex justify-content-center flex-column">
                            <img src="" class="img-fluid image-bot" index="0" bot="1">
                        </div>
                        <div class="col-md-3 col-2 d-flex justify-content-center flex-column">
                            <img src="" class="img-fluid image-bot" index="1" bot="1">
                        </div>
                        <div class="col-md-3 col-2 d-flex justify-content-center flex-column">
                            <img src="" class="img-fluid image-bot" index="2" bot="1">
                        </div>
                        <div class="col-md-3 col-2 d-flex justify-content-center flex-column">
                            <img src="" class="img-fluid image-bot" index="3" bot="1">
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-12 " id="ground-container">
                        <div class="d-flex justify-content-around flex-row col-md-2 offset-md-2 addopacitymonkey">
                            <div class="col-3 col-md-9 m-1 d-flex justify-content-center flex-row adddisablemonkey">
                                <img src="imgs/transparent.png" class="img-fluid" id="ground" onclick="game.playerAction(this);">
                            </div>
                        </div>
                        <div class="d-flex justify-content-center flex-row col-12" id="monkeyparentdiv">
                            <div id="monkeydiv" class="m-0 p-0 disableformonkey">
                                <span id="monkeyspan1">MON</span>
                                <span id="monkeyspan2">KE</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row d-md-flex flex-md-row justify-content-md-between flex-md-nowrap d-flex flex-column align-content-around addopacitymonkey">
                    <div class="col-md-6 d-flex flex-row justify-content-around col-12 m-1 p-0 order-md-0" id="cards-container-player">
                        <div class="col-md-3 col-2 d-flex justify-content-center flex-column image">
                            <img src="" class="img-fluid image-player" index="0" player="1">
                        </div>
                        <div class="col-md-3 col-2 d-flex justify-content-center flex-column image">
                            <img src="" class="img-fluid image-player" index="1" player="1">
                        </div>
                        <div class="col-md-3 col-2 d-flex justify-content-center flex-column image">
                            <img src="" class="img-fluid image-player" index="2" player="1">
                        </div>
                        <div class="col-md-3 col-2 d-flex justify-content-center flex-column image">
                            <img src="" class="img-fluid image-player" index="3" player="1">
                        </div>
                    </div>
                    <div class="col-md-6 col-12 col-sm-12 d-flex justify-content-start justify-content-md-start order-md-1 m-1 p-0" id="assets-container-player">
                        <div class="col-md-3 col-4 d-flex flex-column justify-content-center m-1 p-0 order-md-2" id="playerbuttons">
                            <button class="btn btn-primary mt-2 btn-sm" id="throwcard" onclick="player.throwCard();" style="font-size: 0.8rem;">THROW CARD</button>
                            <button class="btn btn-success mt-2 btn-sm" id="freethrow" onclick="player.freeThrow();" style="font-size: 0.8rem;">FREE THROW</button>
                            <button class="btn btn-warning mt-2 btn-sm" id="monke" onclick="player.monke();" style="font-size: 0.8rem;">MONKE</button>
                            <button class="btn btn-danger mt-2 btn-sm" id="endturn" onclick="player.endTurn();" style="font-size: 0.8rem;">END TURN</button>
                            <button class="btn btn-dark mt-2 btn-sm" id="special" onclick="player.specialPlayer();" style="font-size: 0.8rem;">ACTIVATE SPECIAL</button>
                        </div>
                        <div class="col-md-5 col-3 m-2 p-0 d-flex align-items-center order-md-1" id="specialdivplayer">
                            <p class="text-center font-bold text-white" id="specialtextplayer"></p>
                            <img src="" class="img-fluid" id="specialimgplayer">
                        </div>
                        <div class="col-md-3 col-3 m-2 p-0 d-flex align-items-center order-md-3">
                            <img src="" class="img-fluid" id="playerpick">
                        </div>
                        <div class="order-md-0 vertical-line rounded"></div>
                    </div>
                </div>

            </div>
        </div>
        <div style="display: none;" id="phpdiv"></div>
        <script src="./js/bootstrap.js"></script>
        <script src="./js/monkey.js"></script>
        <script type="text/javascript">
            function submitFormAndResetStore(){
                <?php $_SESSION['store'] = true; ?>
                let btn = document.getElementById("submit_button");
                btn.click();
            }
        </script>
        <?php
            require 'dbhandler.php';
            $sql_4 = "SELECT winner FROM round WHERE gameid=".$_SESSION['id']." ORDER BY ID DESC;";
            if($result_4 =  mysqli_query($conn, $sql_4))
            {
                    $row_4 = mysqli_fetch_assoc($result_4);
                    if($row_4['winner'] == "Player")
                    {
                        $playerdraw = 3;
                        $botdraw = 1;
                    }else if($row_4['winner'] == "Epsilon"){
                        $playerdraw = 1;
                        $botdraw = 3;
                    }else{
                        $playerdraw = 2;
                        $botdraw = 2;
                    }
            }
            else{
                $playerdraw = 2;
                $botdraw = 2;
            }
            echo "<script type=text/javascript> setDrawValues(".$playerdraw.", ".$botdraw."); </script>";
        ?>
    </body>
</html>