game.GameTimerManager = Object.extend({
    init: function(x, y, settings) {
        //sets timers and flags to use to create creeps and produce gold
        this.now = new Date().getTime();
        this.lastCreep = new Date().getTime();
        this.lastTeamCreep = new Date().getTime();
        this.lastTeamCreep2 = new Date().getTime();
        this.lastBubble = new Date().getTime();
        this.paused = false;
        this.alwaysUpdate = true;
    },
    update: function() {
        this.now = new Date().getTime();
        //calls functions
        this.goldTimerCheck();
        this.creepTimerCheck();
        return true;
    },
    goldTimerCheck: function() {
        //if a second has passed and the time minus the last time a creep was spawned is less than a second...
        if (Math.round(this.now / 1000) % 20 === 0 && (this.now - this.lastCreep >= game.data.creepAttackTimer)) {
            //the gold is increased by the exp1 variable plus 1
            game.data.gold += (Number(game.data.exp1) + 1);
        }
    },
    creepTimerCheck: function() {
        //if two seconds have passed and the time minus the last time a creep was spawned is less than two seconds...
        if (Math.round(this.now / 2000) % 10 === 0 && (this.now - this.lastCreep >= game.data.creepAttackTimer)) {
            //the lastCreep timer is reset
            this.lastCreep = this.now;
            //a new creep is added
            var creep = me.pool.pull("EnemyCreep", 2700, 0, {});
            me.game.world.addChild(creep, 5);
        } 
        //if a second has passed and the time minus the last time a creep was spawned is less than a second...
        else if (Math.round(this.now / 1000) % 10 === 0 && ((this.now - this.lastTeamCreep) >= game.data.teamCreepAttackTimer)) {
            //the last teamCreep timer is reset
            this.lastTeamCreep = this.now;
            //a new team creep is added
            var creept = me.pool.pull("TeamCreep", 2700, 0, {});
            me.game.world.addChild(creept, 5);
        } 
        //if half a second has passed and the time minus the last time a creep was spawned is less than half a second...
        else if (Math.round(this.now / 500) % 10 === 0 && ((this.now - this.lastTeamCreep2) >= game.data.teamCreep2AttackTimer)) {
            //the lastTeamCreep2 timer is reset
            this.lastTeamCreep2 = this.now;
            //a second team creep is added
            var creept2 = me.pool.pull("TeamCreep2", 2700, 0, {});
            me.game.world.addChild(creept2, 5);
        }
    }
});
//manages what happens of the player's health is less than 0
game.HeroDeathManager = Object.extend({
    init: function(x, y, settings) {
        this.alwaysUpdate = true;
    },
    update: function() {
        //if the player dies...
        if (game.data.player.dead) {
            //the player and the player tracker on the miniMap is reset to the beginning of the level
            me.game.world.removeChild(game.data.player);
            me.game.world.removeChild(game.data.miniPlayer);
            me.state.current().resetPlayer(10, 0);
        }
        return true;
    }
});
game.ExperienceManager = Object.extend({
    init: function(x, y, settings) {
        this.alwaysUpdate = true;
        //the game is not over yet
        this.gameover = false;
    },
    update: function() {
        //if the player has killed the enemy base and the game is not already over
        if (game.data.win === true && !this.gameover) {
            //the gameOver function is called and passed a value of true
            this.gameOver(true);
        } 
        //if the player has not killed the enemy base and the game is not already over
        else if (game.data.win === false && !this.gameover) {
            //the gameOver function is called and passed a value of false
            this.gameOver(false);
        }
        return true;
    },
    gameOver: function(win) {
        //if the value passed to the function is win
        if (win) {
            //the exp variable goes up by 10
            game.data.exp += 10;
        } else {
            //otherwise the exp only goes up by 1
            game.data.exp += 1;
        }
        //the game is over
        this.gameover = true;
        me.save.exp = game.data.exp;
        $.ajax({
            type: "POST",
            url: "php/controller/save-user.php",
            data: {
                exp: game.data.exp,
                exp1: game.data.exp1,
                exp2: game.data.exp2,
                exp3: game.data.exp3,
                exp4: game.data.exp4
            },
            dataType: "text"
        })
                .success(function(response) {
                    //if the value passed to the function is true
                    if (response === "true") {
                        //the state changes to the game over screen
                        me.state.change(me.state.RESTART);
                    } else {
                        //if this fails then an alert with the error is created
                        alert(response);
                    }
                })
                //if the variables fail to save
                .fail(function(response) {
                    //an alert is created that says "fail"
                    alert("fail");
                });

    }
});
game.SpendGold = Object.extend({
    init: function(x, y, settings) {
        this.now = new Date().getTime();
        this.lastBuy = new Date().getTime();
        this.paused = false;
        this.alwaysUpdate = true;
        this.updateWhenPaused = true;
        this.buying = false;
    },
    update: function() {
        this.now = new Date().getTime();
        //if the player preses the "B" key and they have not pressed it in the last second
        if (me.input.isKeyPressed("buy") && (this.now - this.lastBuy) >= 1000) {
            //the lastBuy variable is reset
            this.lastBuy = this.now;
            //if the buy screen is not on...
            if (!this.buying) {
                //create the buy screen
                this.startBuying();
            }
            else {
                //otherwise, destroy the buy screen
                this.stopBuying();
            }
        }
        this.checkBuyKeys();
        return true;
    },
    startBuying: function() {
        //the buy screen is running
        this.buying = true;
        //pauses the game
        me.state.pause(me.state.PLAY);
        game.data.pausePos = me.game.viewport.localToWorld(0, 0);
        //creates the buy screen
        game.data.buyscreen = new me.Sprite(game.data.pausePos.x, game.data.pausePos.y, me.loader.getImage("gold-screen"));
        //tells the game to continue to update even while paused
        game.data.buyscreen.updateWhenPaused = true;
        //sets the opacity of the buy screen to 80%
        game.data.buyscreen.setOpacity(0.8);
        //adds the buy screen to the world (makes it visible)
        me.game.world.addChild(game.data.buyscreen, 34);
        //stops the player
        game.data.player.body.setVelocity(0, 0);
        //binds the keys used for buying things
        me.input.bindKey(me.input.KEY.F1, "F1", true);
        me.input.bindKey(me.input.KEY.F2, "F2", true);
        me.input.bindKey(me.input.KEY.F3, "F3", true);
        me.input.bindKey(me.input.KEY.F4, "F4", true);
        me.input.bindKey(me.input.KEY.F5, "F5", true);
        me.input.bindKey(me.input.KEY.F6, "F6", true);
        this.setBuyText();
    },
    setBuyText: function() {
        //draws what goes on the buy screen
        game.data.buytext = new (me.Renderable.extend({
            init: function() {
                this._super(me.Renderable, 'init', [game.data.pausePos.x, game.data.pausePos.y, 300, 50]);
                this.font = new me.Font("Arial", 26, "white");
                this.updateWhenPaused = true;
                this.alwaysUpdate = true;
            },
            draw: function(renderer) {
                this.font.draw(renderer.getContext(), "PRESS F1 to F6 TO BUY, B TO EXIT, CURRENT GOLD: " + game.data.gold, this.pos.x, this.pos.y);
                this.font.draw(renderer.getContext(), "SKILL 1: INCREASE DAMAGE, CURRENT LEVEL: " + game.data.skill1 + " COST: " + ((game.data.skill1 + 1) * 10), this.pos.x + 50, this.pos.y + 40);
                this.font.draw(renderer.getContext(), "SKILL 2: RUN FASTER, CURRENT LEVEL: " + game.data.skill2 + ", COST: " + ((game.data.skill2 + 1) * 10), this.pos.x + 50, this.pos.y + 80);
                this.font.draw(renderer.getContext(), "SKILL 3: INCREASE HEALTH, CURRENT LEVEL: " + game.data.skill3 + ", COST: " + ((game.data.skill3 + 1) * 10), this.pos.x + 50, this.pos.y + 120);
                this.font.draw(renderer.getContext(), "Q ABILITY: SPEED BURST, CURRENT LEVEL: " + game.data.ability1 + ", COST: " + ((game.data.ability1 + 1) * 10), this.pos.x + 50, this.pos.y + 160);
                this.font.draw(renderer.getContext(), "W ABILITY: MAKE WHIRLPOOL, CURRENT LEVEL: " + game.data.ability2 + ", COST: " + ((game.data.ability2 + 1) * 10), this.pos.x + 50, this.pos.y + 200);
                this.font.draw(renderer.getContext(), "E ABILITY: THROW SPEAR, CURRENT LEVEL: " + game.data.ability3 + ", COST: " + ((game.data.ability3 + 1) * 10), this.pos.x + 50, this.pos.y + 240);
            }
        }));
        me.game.world.addChild(game.data.buytext, 35);
    },
    stopBuying: function() {
        this.buying = false;
        //resumes play
        me.state.resume(me.state.PLAY);
        //makes the player move again
        game.data.player.body.setVelocity(game.data.playerMoveSpeed, 20);
        //removes the buy screen from the world
        me.game.world.removeChild(game.data.buyscreen);
        //unbinds the buy keys so they can be used for other purposes
        me.input.unbindKey(me.input.KEY.F1, "F1", true);
        me.input.unbindKey(me.input.KEY.F2, "F2", true);
        me.input.unbindKey(me.input.KEY.F3, "F3", true);
        me.input.unbindKey(me.input.KEY.F4, "F4", true);
        me.input.unbindKey(me.input.KEY.F5, "F5", true);
        me.input.unbindKey(me.input.KEY.F6, "F6", true);
        //removes the text on the buy screen from the game
        me.game.world.removeChild(game.data.buytext);
    },
    checkBuyKeys: function() {
        //if a key is pressed, then the checkCost function is checked for if the player has enough exp, 
        //then the makePurchase is passed a value which is used to determine what they are purchasing 
        if (me.input.isKeyPressed("F1")) {
            if (this.checkCost(1)) {
                this.makePurchase(1);
            }
        }
        else if (me.input.isKeyPressed("F2")) {
            if (this.checkCost(2)) {
                this.makePurchase(2);
            }
        }
        else if (me.input.isKeyPressed("F3")) {
            if (this.checkCost(3)) {
                this.makePurchase(3);
            }
        }
        else if (me.input.isKeyPressed("F4")) {
            if (this.checkCost(4)) {
                this.makePurchase(4);
            }
        }
        else if (me.input.isKeyPressed("F5")) {
            if (this.checkCost(5)) {
                this.makePurchase(5);
            }
        }
        else if (me.input.isKeyPressed("F6")) {
            if (this.checkCost(6)) {
                this.makePurchase(6);
            }
        }
    },
    checkCost: function(skill) {
        //if the player presses a certain button and they have enough gold to purchase, then a value of true is returned
        if (skill === 1 && game.data.gold >= ((game.data.skill1 + 1) * 10)) {
            return true;
        }
        else if (skill === 2 && game.data.gold >= ((game.data.skill2 + 1) * 10)) {
            return true;
        }
        else if (skill === 3 && game.data.gold >= ((game.data.skill3 + 1) * 10)) {
            return true;
        }
        else if (skill === 4 && game.data.gold >= ((game.data.ability1 + 1) * 10)) {
            return true;
        }
        else if (skill === 5 && game.data.gold >= ((game.data.ability2 + 1) * 10)) {
            return true;
        }
        else if (skill === 6 && game.data.gold >= ((game.data.ability3 + 1) * 10)) {
            return true;
        }
        else {
            return false;
        }
    },
    makePurchase: function(skill) {
        //if the F1 key is pressed...
        if (skill === 1) {
            //the cost is subtracted from the player's gold
            game.data.gold -= ((game.data.skill1 + 1) * 10);
            //the level is upped 1
            game.data.skill1 += 1;
            //the damage the player does is increased by one
            game.data.player.attack += 1;
        }
        else if (skill === 2) {
            game.data.gold -= ((game.data.skill2 + 1) * 10);
            game.data.skill2 += 1;
            //the player moves faster by increments of 10
            game.data.playerMoveSpeed += 10;
            console.log(game.data.playerMoveSpeed);
        }
        else if (skill === 3) {
            game.data.gold -= ((game.data.skill3 + 1) * 10);
            game.data.skill3 += 1;
            //the player's health is increased by 5
            game.data.player.health += 5;
            console.log(game.data.player.health);
        }
        else if (skill === 4) {
            game.data.gold -= ((game.data.ability1 + 1) * 10);
            game.data.ability1 += 1;
        }
        else if (skill === 5) {
            game.data.gold -= ((game.data.ability2 + 1) * 10);
            game.data.ability2 += 1;
        }
        else if (skill === 6) {
            game.data.gold -= ((game.data.ability3 + 1) * 10);
            game.data.ability3 += 1;
        }
    }
});
game.Pause = Object.extend({
    init: function(x, y, settings) {
        this.paused = false;
        this.alwaysUpdate = true;
        this.updateWhenPaused = true;
        this.pauseMenu = false;
    },
    update: function() {
        //if the "p" key is pressed
        if (me.input.isKeyPressed("pause")) {
            //if the pause menu isn't already running
            if (!this.pauseMenu) {
                //start the pause menu
                this.startPause();
            }
            else {
                //otherwise, stop the pause menu
                this.stopPause();
            }
        }
        return true;
    },
    startPause: function() {
        //see comments for SpendGold startBuying function
        this.pauseMenu = true;
        me.state.pause(me.state.PLAY);
        game.data.pausePos = me.game.viewport.localToWorld(0, 0);
        game.data.pauseScreen = new me.Sprite(game.data.pausePos.x, game.data.pausePos.y, me.loader.getImage("restart-screen"));
        game.data.pauseScreen.updateWhenPaused = true;
        game.data.pauseScreen.setOpacity(0.9);
        me.game.world.addChild(game.data.pauseScreen, 34);
        game.data.player.body.setVelocity(0, 0);
        this.setPauseText();
    },
    setPauseText: function() {
        //see comments for SpendGold setBuyText function
        game.data.pausetext = new (me.Renderable.extend({
            init: function() {
                this._super(me.Renderable, 'init', [game.data.pausePos.x, game.data.pausePos.y, 300, 50]);
                this.font = new me.Font("Arial", 26, "white");
                this.updateWhenPaused = true;
                this.alwaysUpdate = true;
            },
            draw: function(renderer) {
                this.font.draw(renderer.getContext(), "PAUSE MENU", this.pos.x, this.pos.y);
                this.font.draw(renderer.getContext(), "Press P to unpause", this.pos.x + 50, this.pos.y + 40);
            }
        }));
        me.game.world.addChild(game.data.pausetext, 35);
    },
    stopPause: function() {
        //see comments for SpendGold stopBuying function
        this.pauseMenu = false;
        me.state.resume(me.state.PLAY);
        game.data.player.body.setVelocity(game.data.playerMoveSpeed, 20);
        me.game.world.removeChild(game.data.pauseScreen);
        me.game.world.removeChild(game.data.pausetext);
    }
});




