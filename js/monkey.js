function Card(value, suit, viewed, index) {

    this.Value = value;
    this.Suit = suit;
    this.Viewed = viewed;
    this.Index = index;
    this.Locked = false;


    this.isActive = function () {
        if (this.Value == 0)
            return false;
        return true;
    }

    this.deActivate = function () {
        this.Value = 0;
    }

    this.isBurned = function () {
        if (this.Locked == true)
            return true;
        return false;
    }

    this.burnCard = function () {
        this.Locked = true;
    }

    this.cardValue = function () {
        switch (this.Value) {
            case 'J':
                return 11;
            case 'Q':
                return 12;
            case 'K':
                return 13;
            case 'A':
                return 1;
            default:
                return parseInt(this.Value);
        }
    }
}

function Deck() {

    let suits = ["C", "H", "S", "D"];
    let values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
    this.Cards = [];

    for (let i = 0; i < suits.length; i++) {
        for (let x = 0; x < values.length; x++) {
            this.Cards.push(new Card(values[x], suits[i], false, -1));
        }
    }

    this.shuffleCards = function () {
        for (let i = this.Cards.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * i);
            let temp = this.Cards[i];
            this.Cards[i] = this.Cards[j];
            this.Cards[j] = temp;
        }
    }
}



function Bot(){


    this.Cards = [];
    this.Monkey = false;
    this.Turn = false;
    this.Special = false;
    this.DrawCard = null;
    this.SwapCard = null;


    this.addCard = function(card){
        this.Cards.push(Object.assign({}, card));
    }

    this.calculateScore = function(){
        let sum = 0;
        for (var i = 0; i < this.Cards.length; i++)
            sum += this.Cards[i].cardValue();
        return sum;
    }

    this.removeCard = function(index){
        let element = game.getElement("image-bot", index);
        this.Cards[index].deActivate();
        element.parentElement.remove();
        element.remove();
    }

    this.imageBorder = function(element){
        element.classList.add("img-border");
        setTimeout(function(){
            element.classList.remove("img-border");
        }, 1000);
    }

    this.removeDrawImage = function(){
        let element = document.getElementById("botpick");
        element.setAttribute("src", "");
    }

    this.drawGround = function() {
        return new Promise(resolve =>{
            this.imageBorder(document.getElementById("botpick"));
            this.imageBorder(document.getElementById("ground"));
            setTimeout(()=>{
                game.setGroundCard(this.DrawCard); 
                this.removeDrawImage();
                resolve();
            }, 1500);
        });
    }

    this.throwCard = function(index) {
        return new Promise(resolve => {
            document.getElementById("throwcardbot").click();
            let element = game.getElement("image-bot", index);
            this.imageBorder(element);
            this.imageBorder(document.getElementById("ground"));
            this.imageBorder(document.getElementById("botpick"));
            setTimeout(() => {
                game.setGroundCard(this.Cards[index]);
                this.removeCard(index);
                resolve();
            }, 1500);
        });
    }

    this.drawPickedGround = function(index){
        return new Promise(resolve => {
            let picked;
            let element = game.getElement("image-bot", index);
            this.imageBorder(element);
            this.imageBorder(document.getElementById("botpick"));
            setTimeout(()=> {
                this.removeDrawImage();
                game.setGroundCard(this.Cards[index]);
                bot.freeThrow();
                picked = Object.assign({}, this.DrawCard);
                picked.Viewed = true;
                this.Cards[index] = Object.assign({}, picked);
                element.setAttribute("src", "/imgs/backcard.png");
                resolve();
            }, 1500);
        }); 
    }

    this.freeThrow = function() {
        if (game.GroundCard != null) {
            return new Promise(resolve => {
                setTimeout(()=>{
                    //console.log("free throw bot");
                    for (var i = 0; i < this.Cards.length; i++) {
                        let element = game.getElement("image-bot", i);
                        //console.log(this.Cards[i]);
                        if (this.Cards[i].Value != 0 && game.GroundCard.cardValue() == this.Cards[i].cardValue() && this.Cards[i].Viewed == true) {
                                document.getElementById("freethrowbot").click();
                                this.imageBorder(document.getElementById("ground"));
                                this.imageBorder(element);
                                game.setGroundCard(this.Cards[i]);
                                bot.removeCard(element.getAttribute("index"));
                        }
                    }
                resolve();
                }, 1500);
            });
        }else{
            //console.log("ground card was null so free thwo wasnt active.");
        }
        return;
    }

    this.cardsLeft = function() {
        let count = 0;
        for (var i = 0; i < this.Cards.length; i++)
            if (this.Cards[i].isActive()){
                //console.log(this.Cards[i]);
                count++;
            }
        return count;
    }

    this.endTurn = async function() {
        //document.getElementById("endturnbot").click();
        player.Turn = true;
        this.Turn = false;
        await this.timerFunction(1500);
        player.playerTurn();
    }

    this.timerFunction = function(time) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, time);
        });
    }

    this.addPickCardClass = function(element) {
        return new Promise(resolve => {
            element.classList.add("pick-card-bot");
            setTimeout(() => {
                element.classList.remove("pick-card-bot");
                resolve();
            }, 1000);
        });
    }

    this.BotTurn = async function() {
        player.Turn = false;
        this.Turn = true;
        this.DrawCard = deck.Cards.pop();
        let botdiv = document.getElementById("botpick");
        this.addPickCardClass(botdiv);
        botdiv.setAttribute("src", "/imgs/backcard.png");
        setTimeout(game.botAction, 1500);
    }

    this.checkForMonke = async function() {
        //console.log("called check for monke");
            if (this.cardsLeft() <= 2 && this.calculateScore() <= 3 && this.calculateScore() < player.calculateScore()) 
            {
                //console.log("gonna call me monke");
                if(player.Monkey == false && this.Monkey == false)
                {
                    document.getElementById("monkebot").click();
                    document.getElementById("monke").disabled = true;
                    //console.log("called monke");
                    this.Monkey = true;
                    document.getElementById("monkeyaudio").play();
                    game.monkeyOpacityEnable();
                    game.monkeyEnable();
                    await game.timerFunction(3000);
                    game.monkeyDisable();
                    game.monkeyOpacityDisable();
                }
            }
    }

    this.throwHighestCard = function() {
        //console.log("reached");
        let max = 0;
        let pos = 0
        for (var i = 0; i < this.Cards.length; i++) {
            if (max < this.Cards[i].cardValue() && this.Cards[i].cardValue() != 0 && this.Cards[i].Viewed == true) {
                max = this.Cards[i].cardValue();
                pos = i;
            }
        }
        if (max == 0 || max < this.DrawCard.cardValue()) {
            this.drawGround();
        } else {
            this.drawPickedGround(pos);
        }
        return;
    }

    this.removeClassFromAllElements = function(name) {
        var elems = document.querySelectorAll("." + name);
        [].forEach.call(elems, function (el) {
            el.classList.remove(name);
        });
    }

    this.burn = function(element) {
        let card = null;

        if (game.isBotDiv(element))
            card = this.Cards[parseInt(element.getAttribute("index"))];

        if (card != null) {
            card.burnCard();
            element.classList.add("burned-image");
        }
    }

    this.showCards = function(){
        let els = document.querySelectorAll(".image-bot");
        //console.log("this els are" + els);
        for(var i=0; i<els.length; i++){
            let index = parseInt(els[i].getAttribute('index'));
            els[i].setAttribute("src", "./imgs/" + this.Cards[index].Value + this.Cards[index].Suit + ".png");
        }
    }
}









function Player(){

    this.Cards = [];
    this.Monkey = false;
    this.Turn = false;
    this.Special = false;
    this.SpecialEnabled = false;
    this.DrawCard = null;
    this.FreeThrow = false;
    this.ThrowCard = false;
    this.ThrewCard = false;
    this.SwapCard = null;


    this.addCard = function(card){
        this.Cards.push(Object.assign({}, card));
    }

    this.calculateScore = function(){
        let sum = 0;
        for (var i = 0; i < this.Cards.length; i++)
            sum += this.Cards[i].cardValue();
        return sum;
    }

    this.removeCard = function(index){
        let element = game.getElement("image-player", index);
        //console.log("element is: " + element);
        //console.log("function removeCard: " + this.Cards[index] + " index is: " + index);
        this.Cards[index].deActivate();
        element.parentElement.remove();
        element.remove();
    }

    this.removeDrawImage = function(){
        let element = document.getElementById("playerpick");
        element.setAttribute("src", "");
    }

    this.removeClassFromAllElements = function(name) {
        var elems = document.querySelectorAll("." + name);
        [].forEach.call(elems, function (el) {
            el.classList.remove(name);
        });
    }

    this.flipButtons = function(type) {
        document.getElementById("throwcard").disabled = !type;
        document.getElementById("special").disabled = true;
        document.getElementById("special").innerHTML = "ACTIVATE SPECIAL";
    }

    this.playerTurn = function() {
        this.Turn = true;
        bot.Turn = false;
        this.DrawCard = deck.Cards.pop();
        let playerdiv = document.getElementById("playerpick");
        document.getElementById("monke").disabled = false;
        this.addPickCardClass(playerdiv);
        playerdiv.setAttribute("src", "/imgs/" + this.DrawCard.Value + this.DrawCard.Suit + ".png");
        var aux = new Player();
        aux.flipButtons(true);
        if(player.cardsLeft() == 0)
            return;
        if (this.DrawCard.cardValue() >= 6 && this.DrawCard.cardValue() <= 8) {
            this.Special = true;
            this.specialPlayerDiv();
            document.getElementById("special").disabled = false;
        }
    }

    this.specialPlayerDiv = function() {
        let text = document.getElementById("specialtextplayer");
        let str;
        if (this.DrawCard.cardValue() == 6) {
            str = "SELECT A CARD OF YOUR OWN TO VIEW<br>(ENDS TURN)";
        } else if (this.DrawCard.cardValue() == 7) {
            str = "SELECT TWO CARDS<br>(YOUR'S & OPPONENT'S) TO SWAP<br>(ENDS TURN)";
        } else if (this.DrawCard.cardValue() == 8) {
            str = "SELECT A CARD FROM YOUR OPPONENT TO VIEW<br>(ENDS TURN)";
        }
        text.innerHTML = str;
        return;
    }

    this.throwCard = async function() {
        game.disableSevenEffects();
        this.FreeThrow = false;
        document.getElementById("freethrow").innerHTML = "FREE THROW";
        game.removeAnimation("freethrow");
        document.getElementById("special").innerHTML = "ACTIVATE SPECIAL";
        this.SpecialEnabled = false;
        if (this.ThrowCard == true) {
            this.ThrowCard = false;
            game.removeAnimation("throwcard");
            document.getElementById("throwcard").innerHTML = "THROW CARD";
            if (this.ThrewCard) {
                this.ThrewCard = false;
                game.setGroundCard(this.DrawCard);
                bot.freeThrow();
                this.playerTurn();
            }
        } else {
            this.ThrowCard = true;
            game.addAnimation("throwcard");
            document.getElementById("throwcard").innerHTML = "CANCEL THROWCARD";
        }
    }

    this.freeThrow = async function() {
        game.disableSevenEffects();
        this.ThrowCard = false;
        document.getElementById("throwcard").innerHTML = "THROW CARD";
        game.removeAnimation("throwcard");
        document.getElementById("special").innerHTML = "ACTIVATE SPECIAL";
        this.SpecialEnabled = false;
        if (this.FreeThrow == true) {
            this.FreeThrow = false;
            game.removeAnimation("freethrow");
            document.getElementById("freethrow").innerHTML = "FREE THROW";
        } else {
            this.FreeThrow = true;
            game.addAnimation("freethrow");
            document.getElementById("freethrow").innerHTML = "CANCEL FREETHROW";
        }
    }

    this.specialPlayer = async function() {
        this.ThrowCard = false;
        document.getElementById("throwcard").innerHTML = "THROW CARD";
        this.FreeThrow = false;
        document.getElementById("freethrow").innerHTML = "FREE THROW";
        if (this.SpecialEnabled == false) {
            this.SpecialEnabled = true;
            document.getElementById("special").innerHTML = "CANCEL SPECIAL";
            if (this.DrawCard.cardValue() == 6)
                game.addAnimation("six");
            else if (this.DrawCard.cardValue() == 7)
                game.addAnimation("seven");
            else if (this.DrawCard.cardValue() == 8)
                game.addAnimation("eight");
        }
        else {
            this.SpecialEnabled = false;
            document.getElementById("special").innerHTML = "ACTIVATE SPECIAL";
            if (this.DrawCard.cardValue() == 6)
                await game.removeAnimation("six");
            else if (this.DrawCard.cardValue() == 7)
                await game.removeAnimation("seven");
            else if (this.DrawCard.cardValue() == 8)
                await game.removeAnimation("eight");
        }
    }

    this.endTurn = async function() {
        if(player.cardsLeft() == 0){
            player.monke();
        }
        if (NbViewedCardsPlayer != viewedCardsPlayer) {
            window.alert("SELECT YOUR GODDAMN CARDS MAN.....TF");
            return;
        }
        let element = document.getElementById("playerpick");
        var aux = new Player();
        aux.flipButtons(false);
        document.getElementById("endturn").disabled = true;
        this.ThrowCard = false;
        document.getElementById("throwcard").innerHTML = "THROW CARD";
        this.FreeThrow = false;
        document.getElementById("freethrow").innerHTML = "FREE THROW";
        this.SpecialEnabled = false;
        this.Special = false;
        document.getElementById("special").innerHTML = "ACTIVATE SPECIAL";
        this.Turn = false;
        bot.Turn = true;
        if (element.getAttribute("src") != "") {
            game.setGroundCard(player.DrawCard);
            this.removeDrawImage();
            bot.freeThrow();
        }
        document.getElementById("specialtextplayer").innerHTML = "";
        document.getElementById("specialimgplayer").setAttribute("src", "");
        if(bot.Monkey){
            game.calculateResult();
            return;
        }
        bot.BotTurn();
    }

    this.burn = function(element) {
        let card = null;

        if (game.isPlayerDiv(element))
            card = this.Cards[parseInt(element.getAttribute("index"))];

        if (card != null) {
            card.burnCard();
            element.classList.add("burned-image");
        }
    }

    this.isBurntImage = function(element) { 
        if (game.isPlayerDiv(element)) {
            let card = this.Cards[parseInt(element.getAttribute("index"))];
            //console.log(card);
            if (card.isBurned() == true)
                return true;
            return false;
        }
    }

    this.addPickCardClass = function(element) {
        return new Promise(resolve => {
            element.classList.add("pick-card-player");
            setTimeout(() => {
                element.classList.remove("pick-card-player");
                resolve();
            }, 1000);
        });
    }

    this.nothingToDo = function() {
        document.getElementById("endturn").disabled = false;
        document.getElementById("monke").disabled = false;
        var aux = new Player();
        aux.flipButtons(false);
        this.Turn = false;
    }

    this.calculateScore = function() {
        let sum = 0;
        for (var i = 0; i < this.Cards.length; i++)
            sum += this.Cards[i].cardValue();
        return sum;
    }

    this.monke = async function() {
        if(!bot.Monkey)
        {
            document.getElementById("monke").disabled = true;
            this.Monkey = true;
            document.getElementById("monkeyaudio").play();
            game.monkeyOpacityEnable();
            game.monkeyEnable();
            await game.timerFunction(3000);
            game.monkeyDisable();
            game.monkeyOpacityDisable();
            this.endTurn();
        }
    }

    this.cardsLeft = function() {
        let count = 0;
        for (var i = 0; i < this.Cards.length; i++)
            if (this.Cards[i].isActive()){
                //console.log(this.Cards[i]);
                count++;
            }
        return count;
    }

    this.showCards = function(){
        let els = document.querySelectorAll(".image-player");
        for(var i=0; i<els.length; i++){
            let index = parseInt(els[i].getAttribute('index'));
            els[i].setAttribute("src", "./imgs/" + this.Cards[index].Value + this.Cards[index].Suit + ".png");
        }
    }
}







function Monke(){
 
    this.GroundCards = [];
    this.GroundCard = null;
    this.NbCardsPickedSeven = 0;


    this.dealCards = function(){
        let img, card;
        for(var i=1; i<=4; i++)
        {
            card = deck.Cards.pop();
            if(viewedCardsBot < NbViewedCardsBot)
            {
                card.Viewed = true;
                viewedCardsBot++;
            }
            bot.Cards.push(Object.assign({}, card));
            img = game.getElement("image-bot", i-1);
            img.setAttribute("src", "/imgs/backcard.png");
        }
        for(var i=1; i<=4; i++)
        {
            card = deck.Cards.pop();
            player.Cards.push(Object.assign({}, card));
            img = game.getElement("image-player", i-1);
            img.setAttribute("src", "/imgs/backcard.png");
        }
    }

    this.isPlayerDiv = function(element) {
        if(element.getAttribute("player"))
            return true;
        return false;
    }

    this.isBotDiv = function(element){
        if(element.getAttribute("bot"))
            return true;
        return false;
    }

    this.getElement = function(classname, index) {
        var elements = document.getElementsByClassName(classname);
        for(var i=0; i < elements.length; i++) {
            if(parseInt(elements[i].getAttribute("index")) == index)
                return elements[i];
        }
        return null;
    }

    this.setGroundCard = function(card) {
        //console.log(card);
        game.GroundCard = new Card(card.Value, card.Suit, card.Index);
        //console.log(game.GroundCard);
        //console.log(this.GroundCards);
        game.GroundCards.push(game.GroundCard);
        //console.log("goundcard is : " + game.GroundCard.Value + game.GroundCard.Suit);
        let img = document.getElementById("ground");
        img.setAttribute("src", "/imgs/" + game.GroundCard.Value + game.GroundCard.Suit + ".png");
    }

    this.swapCards = function() {
        let cardone, cardtwo, aux, playerindex, botindex;

        playerindex = this.getIndexValue(player.SwapCard);
        botindex = this.getIndexValue(bot.SwapCard);

        cardone = player.Cards[playerindex];
        cardtwo = bot.Cards[botindex];
        aux = Object.assign({}, cardone);

        cardone.Value = cardtwo.Value;
        cardone.Suit = cardtwo.Suit;
        cardone.Viewed = false;

        cardtwo.Value = aux.Value;
        cardtwo.Suit = aux.Suit;
        cardtwo.Viewed = false;


        let element;
        element = game.getElement("image-bot", botindex);
        element = game.getElement("image-player", playerindex);
        

        player.SwapCard = null;
        bot.SwapCard = null;
        this.NbCardsPickedSeven = 0;
        return;
    }

    this.getIndexValue = function(element){
        return parseInt(element.getAttribute("index"));
    }

    this.flipCardBack = async function(element) {
        return new Promise(resolve => {
            setTimeout(() => {
                element.setAttribute("src", "/imgs/backcard.png");
                resolve();
            }, 2000);
        });
    }

    this.disableSevenEffects = async function(){
        player.SwapCard = null;
        bot.SwapCard = null;
        await this.removeAnimation("seven");
        this.removeAnimationSeven();
        this.resetSevenSpecial();
        this.NbCardsPickedSeven = 0;
    }

    this.playerAction = async function(element) {

        if(!didViewCards())
        {
           if(this.isPlayerDiv(element))
           {
               element.classList.add("flip-image");
               let i = this.getIndexValue(element);
               setTimeout(function(){
                   element.setAttribute("src", "/imgs/" + player.Cards[i].Value + player.Cards[i].Suit + ".png");
               }, 100);
               setTimeout(function(){
                   //console.log("OK babe");
                   element.classList.remove("flip-image");
                   element.classList.add("unflip-image");
                   element.setAttribute("src", "/imgs/backcard.png");
               }, 2000);
               setTimeout(function(){
                    //console.log("ok babe again");
                    element.classList.remove("unflip-image");
                }, 3000);
                viewedCardsPlayer++;
                //INSERT CODE TO DECIDE WHO PLAYS FIRST.
                if(viewedCardsPlayer == NbViewedCardsPlayer)
                {
                    if(NbViewedCardsPlayer <= 2)
                        player.playerTurn();
                    else{
                        bot.BotTurn();
                        document.getElementById("monke").disabled = true;
                        document.getElementById("throwcard").disabled = true;
                        document.getElementById("endturn").disabled = true;
                    }
                }
                    
                return;
           }
           return;
        }
        if (!player.isBurntImage(element)) {
            if (player.Special && player.SpecialEnabled && player.Turn && player.cardsLeft() != 0) {
                if (player.DrawCard.cardValue() == 6) {
                    if (this.isPlayerDiv(element)) {
                        let card = player.Cards[this.getIndexValue(element)];
                        element.setAttribute("src", "/imgs/" + card.Value + card.Suit + ".png");
                        await this.flipCardBack(element);
                        //console.log("Viewed card of index: " + this.getIndexValue(element));
                        player.removeDrawImage();
                        this.setGroundCard(player.DrawCard);
                        await this.removeAnimation("six");
                        bot.freeThrow();
                        setTimeout(player.nothingToDo, 1000);
                        return;
                    } else
                        return;
                }
                else if (player.DrawCard.cardValue() == 8) {
                    if (this.isBotDiv(element)) {
                        let card = bot.Cards[this.getIndexValue(element)];
                        element.setAttribute("src", "/imgs/" + card.Value + card.Suit + ".png");
                        await this.flipCardBack(element);
                        //console.log("Viewed bot card of index: " + this.getIndexValue(element));
                        player.removeDrawImage();
                        this.setGroundCard(player.DrawCard);
                        await this.removeAnimation("eight");
                        bot.freeThrow();
                        setTimeout(player.nothingToDo, 1000)
                        return;
                    } else
                        return;
                }
                else if (player.DrawCard.cardValue() == 7) {
                    if (this.NbCardsPickedSeven == 0) {
                        this.NbCardsPickedSeven++;
                        if (this.isPlayerDiv(element) || this.isBotDiv(element)) {
                            if (this.isPlayerDiv(element)){
                                element.classList.add("image-bot-select");
                                player.SwapCard = element;
                            }
                            if (game.isBotDiv(element)){
                                element.classList.add("image-player-select");
                                bot.SwapCard = element;
                            }
                        }
                    }
                    else if (this.NbCardsPickedSeven == 1) {
                        if (this.isBotDiv(element) && bot.SwapCard != null) {
                            bot.SwapCard = element;
                            bot.removeClassFromAllElements("image-player-select");
                            bot.SwapCard.classList.add("image-player-select");
                        } else if (this.isPlayerDiv(element) && player.SwapCard != null) {
                            player.SwapCard = element;
                            player.removeClassFromAllElements("image-bot-select");
                            player.SwapCard.classList.add("image-bot-select");
                        } else {
                            this.NbCardsPickedSeven++;
                            if(bot.SwapCard == null){
                                bot.SwapCard = element;
                                bot.SwapCard.classList.add("image-player-select");
                            }else{
                                player.SwapCard = element;
                                player.SwapCard.classList.add("image-bot-select");
                            }   
                        }
                    }
                    if (this.NbCardsPickedSeven == 2) {
                        this.NbCardsPickedSeven = 0;
                        this.swapCards();
                        await this.timerFunction(1000);
                        await this.removeAnimation("seven");
                        if(this.GroundCards == undefined || this.GroundCards == null)
                            this.GroundCards = new Array();
                        this.GroundCards.push(Object.assign({}, player.DrawCard));
                        setTimeout(this.setGroundCard, 1000, player.DrawCard);
                        bot.freeThrow();
                        // let aux = new Player();
                        // aux.removeDrawImage();
                        player.removeDrawImage();
                        setTimeout(this.removeAnimationSeven, 1000);
                        //setTimeout(finishSwapCards, 2000, swapOneSeven, swapTwoSeven);
                        setTimeout(this.resetSevenSpecial, 1000);
                        setTimeout(player.nothingToDo, 1000);
                        return;
                    }
                }
                return;
            }
            else if (!this.isBotDiv(element)) {
                let index = this.getIndexValue(element);
                let pickedcard = player.Cards[index];
                //console.log(pickedcard);
                if (element.getAttribute("id") == "ground" && player.Turn) {
                    player.removeDrawImage();
                    this.setGroundCard(player.DrawCard);
                    bot.freeThrow();
                    player.nothingToDo();
                    return;
                }
                else if (player.ThrowCard && player.Turn) {
                    if (pickedcard.cardValue() == player.DrawCard.cardValue()) {
                        this.setGroundCard(pickedcard);
                        player.removeCard(this.getIndexValue(element));
                        bot.freeThrow();
                        player.ThrewCard = true;
                        if(player.cardsLeft() == 0){
                            await player.monke();
                            return;
                        }
                        return;
                    } else {
                        player.burn(element);
                    }
                } else if (player.FreeThrow) {
                    if (pickedcard.cardValue() == this.GroundCard.cardValue()) {
                        this.setGroundCard(pickedcard);
                        bot.freeThrow();
                        player.removeCard(index);
                        if(player.cardsLeft() == 0){
                            await player.monke();
                            return;
                        }
                        return;
                    } else {
                        player.burn(element);
                    }
                } else if (!player.FreeThrow && !player.ThrowCards && player.Turn) {
                    //console.log(pickedcard);
                    this.setGroundCard(pickedcard);
                    bot.freeThrow();
                    if (player.DrawCard.cardValue() == pickedcard.cardValue()) {
                        player.removeCard(element.getAttribute("index"));
                        if(player.cardsLeft() == 0){
                            await player.monke();
                            return;
                        }
                    } else {
                        pickedcard.Value = player.DrawCard.Value;
                        pickedcard.Suit = player.DrawCard.Suit;
                        element.setAttribute("src", "/imgs/backcard.png");
                    }
                    player.removeDrawImage();
                    player.nothingToDo();
                    return;
                }
            }
            return;
        }
    }

    this.botAction = async function() {
        //console.log(this.GroundCards);
        if (this.GroundCard != null)
            bot.freeThrow();
        let allcardsviewed = true;
        let viewedindex = 0;
        //CHECK FOR THROW CARD
        if (!player.Monkey) {
            //ITERATE TO CHECK FOR VIEWED CARDS
            for (var i = 0; i < bot.Cards.length; i++) {
                if (bot.Cards[i].Viewed == true && bot.Cards[i].cardValue() != 0) {
                    if (bot.Cards[i].cardValue() == bot.DrawCard.cardValue()) {
                        await bot.throwCard(i);
                        bot.removeDrawImage();
                        game.setGroundCard(bot.DrawCard);
                        bot.freeThrow();
                        await bot.checkForMonke();
                        await bot.BotTurn();
                        return;
                    }
                }
                else if (bot.Cards[i].cardValue() != 0 && bot.Cards[i].Viewed == false) {
                    bot.Cards[i].Viewed = true;
                    viewedindex = i;
                    if (bot.Cards[i].cardValue() == bot.DrawCard.cardValue()) {
                        await bot.throwCard(i);
                        bot.removeDrawImage();
                        await bot.checkForMonke();
                        await bot.endTurn();
                        return;
                    }
                    allcardsviewed = false;
                    break;
                }
            }
            if (allcardsviewed == false) {
                await bot.drawPickedGround(viewedindex);
                await bot.checkForMonke();
                await bot.endTurn();
                return;
            }
            //ITERATE TO THROW A CARD
            bot.ThrewCard = false; //////////////////INCASE OF PROBLEMS CHANGE TO LOCAL ATTRIBUTE
            for (var i = 0; i < bot.Cards.length; i++) {
                if (bot.Cards[i].Viewed) {
                    if (bot.Cards[i].cardValue() == bot.DrawCard.cardValue()) {
                        bot.ThrewCard = true;
                        await bot.throwCard(i);
                    }
                }
            }
            if (bot.ThrewCard == true) {
                game.setGroundCard(bot.DrawCard);
                bot.removeDrawImage();
                await bot.checkForMonke();
                bot.BotTurn();
                return;
            }
            //ITERATE TO EXCHANGE A CARD
            let difference = 13, cardindex = 0;
            if (bot.DrawCard.cardValue() <= 2) {
                for (var i = 0; i < bot.Cards.length; i++) {
                    if (bot.DrawCard.cardValue() < bot.Cards[i].cardValue() && bot.Cards[i].cardValue() > 2) {
                        if (difference > bot.Cards[i].cardValue() - bot.DrawCard.cardValue()) {
                            difference = bot.Cards[i].cardValue() - bot.DrawCard.cardValue();
                            cardindex = i;
                        }
                    }
                }
                if (difference == 13) {
                    if (bot.DrawCard.cardValue() == 8 && player.Turn == true)//CHANGE PLAYERTURN IS TRUE
                    {
                        await bot.drawGround();
                        //INSERT VIEW PLAYER CARD HERE; 
                    }
                    else
                        await bot.drawGround();
                }
                else {
                    await bot.drawPickedGround(cardindex);
                }
            }
            else {
                for (var i = 0; i < bot.Cards.length; i++) {
                    if (bot.DrawCard.cardValue() > bot.Cards[i].cardValue() && bot.Cards[i].cardValue() > 2) {
                        if (difference > bot.Cards[i].cardValue() - bot.DrawCard.cardValue()) {
                            difference =  bot.Cards[i].cardValue() - bot.DrawCard.cardValue();
                            cardindex = i;
                        }
                    }
                }
                if (difference == 13)
                    await bot.drawGround();
                else {
                    await bot.drawPickedGround(cardindex);
                }
            }
            //sleep(1000);
            await bot.checkForMonke();
            await bot.endTurn();
            return;
        }
        else {
            //ITERATE TO THROW A CARD
            let threwcard = false;
            let unviewedcards = [];
            for (var i = 0; i < bot.Cards.length; i++) {
                if (bot.Cards[i].Viewed) {
                    if (bot.Cards[i].cardValue() == bot.DrawCard.cardValue()) {
                        threwcard = true;
                        game.setGroundCard(bot.Cards[i]);
                        await bot.throwCard(i);
                    }
                }
                else
                    unviewedcards.push(Object.assign({}, bot.Cards[i]));
            }
            if (threwcard == true) {
                bot.removeDrawImage();
                game.setGroundCard(bot.DrawCard);
                await bot.BotTurn();
                return;
            }
            //VIEW UNVIEWED CARDS
            if (unviewedcards.length != 0) {
                let diff1 = 0;
                let i1 = 0;
                for (var i = 0; i < bot.Cards.length; i++) {
                    if (bot.Cards[i].Viewed) {
                        if (diff1 < (bot.Cards[i].cardValue() - bot.DrawCard.cardValue()) && bot.Cards[i].cardValue() != 0) {
                            diff1 = bot.Cards[i].cardValue() - bot.DrawCard.cardValue();
                            i1 = i;
                        }
                    }
                }
                if (diff1 < bot.DrawCard.cardValue()) {
                    let found = false;
                    for (var i = 0; i < bot.Cards.length; i++) {
                        if (bot.Cards[i].Viewed == false) {
                            if (bot.Cards[i].cardValue() == bot.DrawCard.cardValue()) {
                                found = true;
                                await bot.throwCard(i);
                                game.setGroundCard(bot.DrawCard);
                                break;
                            } else {
                                let element = game.getElement("image-bot", i);
                                bot.burn(element);
                                
                            }
                        }
                    }
                    bot.removeDrawImage();
                    game.calculateResult();
                    return;
                } else {
                    bot.throwHighestCard();
                    game.calculateResult();
                    return;
                }
            }
            //THROW THE HIGHEST CARD
            bot.throwHighestCard();
            game.calculateResult();
            return;
        }
    }

    this.addAnimation = function(specialtype) {

        player.removeClassFromAllElements("removeAnimation");
        if(specialtype != "six" && specialtype != "seven" && specialtype != "eight"){
            document.getElementById("specialdivplayer").classList.add("addAnimation");
            document.getElementById("special").classList.add("addAnimation");
            document.getElementById("playerpick").classList.add("addAnimation");
        }
        if(specialtype != "seven" && specialtype != "eight"){
            document.getElementById("cards-container-bot").classList.add("addAnimation");
        }
        if(specialtype == "eight"){
            document.getElementById("cards-container-player").classList.add("addAnimation");
        }
        if(specialtype != "freethrow"){
            document.getElementById("freethrow").classList.add("addAnimation");
        }
        if(specialtype != "throwcard"){
            document.getElementById("throwcard").classList.add("addAnimation");
        }
        document.getElementById("assets-container-bot").classList.add("addAnimation");
        document.getElementById("monke").classList.add("addAnimation");
        document.getElementById("endturn").classList.add("addAnimation");
    }

    this.removeAnimation = function(specialtype) {
        return new Promise(resolve => {
            player.removeClassFromAllElements("addAnimation");
            if(specialtype != "six" && specialtype != "seven" && specialtype != "eight"){
                document.getElementById("specialdivplayer").classList.add("removeAnimation");
                document.getElementById("special").classList.add("removeAnimation");
                document.getElementById("playerpick").classList.add("removeAnimation");
            }
            if(specialtype != "seven" && specialtype != "eight"){
                document.getElementById("cards-container-bot").classList.add("removeAnimation");
            }
            if(specialtype == "eight"){
                document.getElementById("cards-container-player").classList.add("removeAnimation");
            }
            if(specialtype != "freethrow"){
                document.getElementById("freethrow").classList.add("removeAnimation");
            }
            if(specialtype != "throwcard"){
                document.getElementById("throwcard").classList.add("removeAnimation");
            }
            document.getElementById("assets-container-bot").classList.add("removeAnimation");
            document.getElementById("monke").classList.add("removeAnimation");
            document.getElementById("endturn").classList.add("removeAnimation");

            setTimeout(()=>{
                player.removeClassFromAllElements("removeAnimation");
                resolve();
            }, 1000);
        });
    }

    this.monkeyOpacityEnable = function(){

        let el = document.querySelectorAll(".addopacitymonkey");
        for(var i=0; i<el.length; i++)
            el[i].classList.add("opacityformonkey");
    }

    this.monkeyOpacityDisable = function(){

        let el = document.querySelectorAll(".opacityformonkey");
        for(var i=0; i<el.length; i++)
            el[i].classList.remove("opacityformonkey");
    }

    this.monkeyEnable = function(){
        let el = document.querySelector(".adddisablemonkey");
        let monk = document.querySelector(".disableformonkey");

        game.removeClassFromAllElements("disableformonkey");
        game.removeClassFromAllElements("adddisablemonkey");

        monk.classList.add("adddisablemonkey");
        el.classList.add("disableformonkey");
    }

    this.monkeyDisable = function(){
        let monk = document.querySelector(".adddisablemonkey");
        let el = document.querySelector(".disableformonkey");

        game.removeClassFromAllElements("disableformonkey");
        game.removeClassFromAllElements("adddisablemonkey");

        el.classList.add("adddisablemonkey");
        monk.classList.add("disableformonkey");  
    }
    
    this.removeAnimationSeven = function() {
        player.removeClassFromAllElements("image-bot-select");
        player.removeClassFromAllElements("image-player-select");
    }

    this.removeFinishSwapCards = function() {
        player.removeClassFromAllElements("finish-swap-cards");
    }

    this.finishSwapCards = function(element1, element2) {
        element1.classList.add("finish-swap-cards");
        element2.classList.add("finish-swap-cards");
    }

    this.removeSelectBorder = function(element) {
        element.setAttribute("style", "border: none;");
    }

    this.resetSevenSpecial = function() {
        game.removeAnimationSeven();
        player.SwapCard = null, bot.SwapCard = null;
        this.NbCardsPickedSeven = 0;
    }

    this.timerFunction = function(time) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, time);
        });
    }

    this.calculateResult = function() {
        setTimeout(player.showCards(), 2000);
        setTimeout(bot.showCards(), 2000);
        setTimeout(bot.showCards(), 4000);
        setTimeout(sendForm, 7000);
    }

    this.enableOnclick = function(){
        let arr = [];
        arr = document.getElementsByClassName("image-player");
        for(var i=0; i<arr.length; i++)
            arr[i].setAttribute("onclick", "game.playerAction(this);");

        arr = document.getElementsByClassName("image-bot");
        for(var i=0; i<arr.length; i++)
            arr[i].setAttribute("onclick", "game.playerAction(this);");
    }

    this.removeClassFromAllElements = function(name) {
        var elems = document.querySelectorAll("." + name);
        [].forEach.call(elems, function (el) {
            el.classList.remove(name);
        });
    }
}

let viewedCardsPlayer = 0, viewedCardsBot = 0;
let NbViewedCardsPlayer, NbViewedCardsBot;
let player = new Player();
let bot = new Bot();
let game = new Monke();
let deck = new Deck();


function setDrawValues(val1, val2){
    NbViewedCardsPlayer = val1;
    NbViewedCardsBot = val2;
}

function games() {
    deck.shuffleCards();
    game.dealCards();
    setTimeout(game.enableOnclick, 1100);    
}

function didViewCards() {
    if (NbViewedCardsPlayer > viewedCardsPlayer)
        return false;
    return true;
}

function sendForm(){
    document.getElementById("playerscore_form").setAttribute("value", parseInt(player.calculateScore()));
    document.getElementById("botscore_form").setAttribute("value", parseInt(bot.calculateScore()));
    setTimeout(submitFormAndResetStore, 1000);
}

