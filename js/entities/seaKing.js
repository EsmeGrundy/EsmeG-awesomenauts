game.SeaKing = me.Entity.extend({
    init: function(x, y, settings) {
        this.setSuper(x, y, settings);
        this.setPlayerTimers();
        this.setAttributes();
        this.type = "PlayerEntity";
        this.setFlags();
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
        this.addAnimation();
        this.renderable.setCurrentAnimation("idle");
    },
    setSuper: function(x, y, settings) {
        this._super(me.Entity, "init", [x, y, {
                image: "seaKing",
                height: 64,
                width: 64,
                spriteheight: "64",
                spritewidth: "64",
                getShape: function() {
                    return(new me.Rect(0, 0, 64, 64)).toPolygon();
                }

            }]);
    },
    setPlayerTimers: function() {
        this.now = new Date().getTime();
        this.lastHit = this.now;
        this.lastSpear = this.now;
         this.lastWhirlpool = this.now;
         this.lastBurst = this.now;
        this.lastAttack = new Date().getTime();
    },
    setAttributes: function() {
        this.health = 20;
        this.body.setVelocity(game.data.playerMoveSpeed, 20);
        this.attack = game.data.playerAttack;
    },
    setFlags: function() {
        this.facing = "right";
        this.dead = false;
        this.attacking = false;
    },
    addAnimation: function() {
        this.renderable.addAnimation("idle", [8]);
        this.renderable.addAnimation("walk", [8, 9, 10, 11, 12, 13, 14, 15], 80);
        this.renderable.addAnimation("attack", [0, 1, 2, 3, 4, 5, 6, 7], 80);
    },
    update: function(delta) {
        this.now = new Date().getTime();
        this.dead = this.checkIfDead();
        this.checkKeyPressesAndMove();
        this.checkAbilityKeys();
        this.setAnimation();

        me.collision.check(this, true, this.collideHandler.bind(this), true);
        this.body.update(delta);
        this._super(me.Entity, "update", [delta]);
        return true;

    },
    checkIfDead: function() {
        if (this.health <= 0) {
            return true;
            this.pos.x = 10;
            this.pos.y = 0;
            this.health = game.data.playerHealth;
        }
    },
    checkKeyPressesAndMove: function() {
        if (me.input.isKeyPressed("right")) {
            this.moveRight();
        }
        else if (me.input.isKeyPressed("left")) {
            this.moveLeft();
        }
        else {
            this.body.vel.x = 0;
        }
        //checks if the up arrow key is pressed
        if (me.input.isKeyPressed("jump")) {
            //checks if mario is not already jumping or falling
            if (!this.body.jumping && !this.body.falling) {
                this.jump();
            }
        }
        this.attacking = me.input.isKeyPressed("attack");
    },
    moveRight: function() {
        this.facing = "right";
        this.body.vel.x += this.body.accel.x * me.timer.tick;
        this.flipX(false);
    },
    moveLeft: function() {
        this.facing = "left";
        this.body.vel.x -= this.body.accel.x * me.timer.tick;
        this.flipX(true);
    },
    jump: function() {
        //sets mario's velocity in the y direction to the y velocity from setVelocity and smooths animation
        this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
        //makes jumping variable true
        this.body.jumping = true;
    },
    checkAbilityKeys: function() {
        if (me.input.isKeyPressed("skill1")) {
            game.data.ability1 += 1;
            this.Bubble();
        }
        else if (me.input.isKeyPressed("skill2")) {
            game.data.ability2 += 1;
            this.makeWhirlpool();
        }
        else if (me.input.isKeyPressed("skill3")) {
            game.data.ability3 += 1;
            console.log("ability3" + game.data.ability3);
            console.log("throw spear");
            this.throwSpear();
        }
    },
    throwSpear: function() {
        if (this.now - this.lastSpear >= game.data.spearTimer && game.data.ability3 > 0) {
            this.lastSpear = this.now;
            var spear = me.pool.pull("spear", this.pos.x, this.pos.y, {}, this.facing);
            me.game.world.addChild(spear, 10);
        }
    },
    makeWhirlpool: function() {
        if (this.now - this.lastWhirlpool >= game.data.whirlpoolTimer && game.data.ability2 > 0) {
            this.lastWhirlpool = this.now;
            var whirlpool = me.pool.pull("whirlpool", this.pos.x, this.pos.y, {}, this.facing);
            me.game.world.addChild(whirlpool, 10);
        }
    },
    Bubble: function(){
         if (this.now - this.lastBurst>= game.data.burstTimer && game.data.ability1 > 0) {
            this.lastBurst = this.now;
            var bubble = me.pool.pull("bubble", this.pos.x, this.pos.y, {}, this.facing);
            me.game.world.addChild(bubble, 10);
        }
    },
    setAnimation: function() {
        if (this.attacking) {
            if (!this.renderable.isCurrentAnimation("attack")) {
                this.renderable.setCurrentAnimation("attack", "idle");
                this.renderable.setAnimationFrame();
            }
        }
        else if (this.body.vel.x !== 0 && !this.renderable.isCurrentAnimation("attack")) {
            if (!this.renderable.isCurrentAnimation("walk")) {
                this.renderable.setCurrentAnimation("walk");
            }
        }
        else if (!this.renderable.isCurrentAnimation("attack")) {

            this.renderable.setCurrentAnimation("idle");
        }
    },
    loseHealth: function(damage) {
        this.health = this.health - damage;
        console.log(this.health);
    },
    collideHandler: function(response) {
        if (response.b.type === 'EnemyBaseEntity') {
            this.collideWithEnemyBase(response);
        }
        else if (response.b.type === 'EnemyCreep') {
            this.collideWithEnemyCreep(response);
        }
        else if (response.b.type === 'TeamCreep') {
            this.collideWithTeamCreep(response);
        }
        else if (response.b.type === 'TeamCreep2') {
            this.collideWithTeamCreep2(response);
        }
    },
    collideWithEnemyBase: function(response) {
        var ydif = this.pos.y - response.b.pos.y;
        var xdif = this.pos.x - response.b.pos.x;

        if (ydif < -60 && xdif < 60 && xdif > -40) {
            this.body.falling = false;
            this.body.vel.y = -1;
        }
        else if (xdif > -30 && this.facing === 'right') {
            this.body.vel.x = 0;
            this.pos.x = this.pos.x - 1;
        }
        else if (xdif < 70 && this.facing === 'left') {
            this.body.vel.x = 0;
            this.pos.x = this.pos.x + 1;
        }

        if (this.renderable.isCurrentAnimation("attack") && this.now - this.lastHit >= game.data.playerAttackTimer) {
            this.lastHit = this.now;
            response.b.loseHealth(game.data.playerAttack);
        }
    },
    collideWithEnemyCreep: function(response) {
        var xdif = this.pos.x - response.b.pos.x;
        var ydif = this.pos.y - response.b.pos.y;

        console.log("xdif: " + xdif);
        this.stopMovement(xdif);
        if (this.checkAttack(xdif, ydif)) {
            this.hitCreep(response);
        }
    },
    collideWithTeamCreep: function(response) {
        var xdif = this.pos.x - response.b.pos.x;
        var ydif = this.pos.y - response.b.pos.y;

        console.log("xdif: " + xdif);
        this.stopMovement(xdif);
        if (this.checkAttack(xdif, ydif)) {
            this.hitCreep(response);
        }
    },
    collideWithTeamCreep2: function(response) {
        var xdif = this.pos.x - response.b.pos.x;
        var ydif = this.pos.y - response.b.pos.y;

        console.log("xdif: " + xdif);
        this.stopMovement(xdif);
        if (this.checkAttack(xdif, ydif)) {
            this.hitCreep(response);
        }
    },
    stopMovement: function(xdif) {
        if (xdif > 30) {
            this.pos.x = this.pos.x + 1;
//            if (this.facing === "left") {
            this.body.vel.x === 0;
//            }
        } else if (xdif < -30) {
            this.pos.x = this.pos.x - 1;
//            if (this.facing === "right") {
            this.body.vel.x === 0;
//            }
        }
    },
    checkAttack: function(xdif, ydif) {
        if (this.renderable.isCurrentAnimation("attack") && (this.now - this.lastHit >= game.data.playerAttackTimer) && (Math.abs(ydif) <= 40) &&
                (((xdif > 0) && this.facing === "left") || ((xdif < 0) && this.facing === "right"))) {
            this.lastHit = this.now;
            return true;
        }
        return false;
    },
    hitCreep: function(response) {
        if (response.b.health <= this.attack) {
            game.data.gold += 1;
//            console.log("current gold: " + game.data.gold);
        }
        response.b.loseHealth(game.data.playerAttack);
    }
});






