game.GameTimerManager = Object.extend({
    init: function(x, y, settings) {
        this.now = new Date().getTime();
        this.lastCreep = new Date().getTime();
        this.lastTeamCreep = new Date().getTime();
        this.lastTeamCreep2 = new Date().getTime();
        this.paused = false;
        this.alwaysUpdate = true;
    },
    update: function() {
        this.now = new Date().getTime();
        this.goldTimerCheck();
        this.creepTimerCheck();
        return true;
    },
    goldTimerCheck: function() {
        if (Math.round(this.now / 1000) % 20 === 0 && (this.now - this.lastCreep >= game.data.creepAttackTimer)) {
            game.data.gold += (Number(game.data.exp1) + 1);
            console.log("current gold: " + game.data.gold);
        }
    },
    creepTimerCheck: function() {
        if (Math.round(this.now / 2000) % 10 === 0 && (this.now - this.lastCreep >= game.data.creepAttackTimer)) {
            this.lastCreep = this.now;
            var creep = me.pool.pull("EnemyCreep", 2700, 0, {});
            me.game.world.addChild(creep, 5);
        } else if (Math.round(this.now / 1000) % 10 === 0 && ((this.now - this.lastTeamCreep) >= game.data.teamCreepAttackTimer)) {
            this.lastTeamCreep = this.now;
            var creept = me.pool.pull("TeamCreep", 2700, 0, {});
            me.game.world.addChild(creept, 5);
//            console.log("team creep");
        } 
//        else if (Math.round(this.now / 500) % 10 === 0 && ((this.now - this.lastTeamCreep2) >= game.data.teamCreep2AttackTimer)) {
//            this.lastTeamCreep2 = this.now;
//            var creept2 = me.pool.pull("TeamCreep2", 2000, 0, {});
//            me.game.world.addChild(creept2, 5);
////            console.log("team creep");
//        }
    }
});
game.HeroDeathManager = Object.extend({
    init: function(x, y, settings) {
        this.alwaysUpdate = true;
    },
    update: function() {
        if (game.data.player.dead) {
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
        this.gameover = false;
    },
    update: function() {
        if (game.data.win === true && !this.gameover) {
            this.gameOver(true);
            alert("YOU WIN!");
        } else if (game.data.win === false && !this.gameover) {
            this.gameOver(false);
            alert("YOU LOSE!");
        }
        return true;
    },
    gameOver: function(win) {
        if (win) {
            game.data.exp += 10;
        } else {
            game.data.exp += 1;
        }
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
                    if (response === "true") {
                        me.state.change(me.state.RESTART);
                    } else {
                        alert(response);
                    }
                })
                .fail(function(response) {
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
        if (me.input.isKeyPressed("buy") && (this.now - this.lastBuy) >= 1000) {
            this.lastBuy = this.now;
            if (!this.buying) {
                this.startBuying();
            }
            else {
                this.stopBuying();
            }
        }
        this.checkBuyKeys();
        return true;
    },
    startBuying: function() {
        this.buying = true;
        me.state.pause(me.state.PLAY);
        game.data.pausePos = me.game.viewport.localToWorld(0, 0);
        game.data.buyscreen = new me.Sprite(game.data.pausePos.x, game.data.pausePos.y, me.loader.getImage("gold-screen"));
        game.data.buyscreen.updateWhenPaused = true;
        game.data.buyscreen.setOpacity(0.8);
        me.game.world.addChild(game.data.buyscreen, 34);
        game.data.player.body.setVelocity(0, 0);
        me.input.bindKey(me.input.KEY.F1, "F1", true);
        me.input.bindKey(me.input.KEY.F2, "F2", true);
        me.input.bindKey(me.input.KEY.F3, "F3", true);
        me.input.bindKey(me.input.KEY.F4, "F4", true);
        me.input.bindKey(me.input.KEY.F5, "F5", true);
        me.input.bindKey(me.input.KEY.F6, "F6", true);
        this.setBuyText();
    },
    setBuyText: function() {
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
                this.font.draw(renderer.getContext(), "W ABILITY: EAT CREEP FOR HEALTH, CURRENT LEVEL: " + game.data.ability2 + ", COST: " + ((game.data.ability2 + 1) * 10), this.pos.x + 50, this.pos.y + 200);
                this.font.draw(renderer.getContext(), "E ABILITY: THROW SPEAR, CURRENT LEVEL: " + game.data.ability3 + ", COST: " + ((game.data.ability3 + 1) * 10), this.pos.x + 50, this.pos.y + 240);
            }
        }));
        me.game.world.addChild(game.data.buytext, 35);
    },
    stopBuying: function() {
        this.buying = false;
        me.state.resume(me.state.PLAY);
        game.data.player.body.setVelocity(game.data.playerMoveSpeed, 20);
        me.game.world.removeChild(game.data.buyscreen);
        me.input.unbindKey(me.input.KEY.F1, "F1", true);
        me.input.unbindKey(me.input.KEY.F2, "F2", true);
        me.input.unbindKey(me.input.KEY.F3, "F3", true);
        me.input.unbindKey(me.input.KEY.F4, "F4", true);
        me.input.unbindKey(me.input.KEY.F5, "F5", true);
        me.input.unbindKey(me.input.KEY.F6, "F6", true);
        me.game.world.removeChild(game.data.buytext);
    },
    checkBuyKeys: function() {
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
        if (skill === 1) {
            game.data.gold -= ((game.data.skill1 + 1) * 10);
            game.data.skill1 += 1;
            game.data.player.attack += 1;
            console.log(game.data.playerAttack);
        }
        else if (skill === 2) {
            game.data.gold -= ((game.data.skill2 + 1) * 10);
            game.data.skill2 += 1;
            game.data.playerMoveSpeed += 10;
            console.log(game.data.playerMoveSpeed);
        }
        else if (skill === 3) {
            game.data.gold -= ((game.data.skill3 + 1) * 10);
            game.data.skill3 += 1;
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
        if (me.input.isKeyPressed("pause")) {
            if (!this.pauseMenu) {
                this.startPause();
            }
            else {
                this.stopPause();
            }
        }
        return true;
    },
    startPause: function() {
        this.pauseMenu = true;
        me.state.pause(me.state.PLAY);
        game.data.pausePos = me.game.viewport.localToWorld(0, 0);
        game.data.pauseScreen = new me.Sprite(game.data.pausePos.x, game.data.pausePos.y, me.loader.getImage("restart-screen"));
        game.data.pauseScreen.updateWhenPaused = true;
        game.data.pauseScreen.setOpacity(0.8);
        me.game.world.addChild(game.data.pauseScreen, 34);
        game.data.player.body.setVelocity(0, 0);
        this.setPauseText();
    },
    setPauseText: function() {
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
        this.pauseMenu = false;
        me.state.resume(me.state.PLAY);
        game.data.player.body.setVelocity(game.data.playerMoveSpeed, 20);
        me.game.world.removeChild(game.data.pauseScreen);
        me.game.world.removeChild(game.data.pausetext);
    }
});




