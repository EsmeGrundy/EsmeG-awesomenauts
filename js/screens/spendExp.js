game.SpendExp = me.ScreenObject.extend({
    onResetEvent: function() {
        me.game.world.addChild(new me.Sprite(0, 0, me.loader.getImage("exp-screen")), -10);
        me.input.bindKey(me.input.KEY.F1, "F1");
        me.input.bindKey(me.input.KEY.F2, "F2");
        me.input.bindKey(me.input.KEY.F3, "F3");
        me.input.bindKey(me.input.KEY.F4, "F4");
        me.input.bindKey(me.input.KEY.F5, "F5");
        var goldProductionCost = ((Number(game.data.exp1) + 1) * 5);
        var startGoldCost = ((Number(game.data.exp2) + 1) * 5);
        var damageCost = ((Number(game.data.exp3) + 1) * 5);
        var healthCost = ((Number(game.data.exp4) + 1) * 5);
        me.game.world.addChild(new (me.Renderable.extend({
            init: function() {
                this._super(me.Renderable, 'init', [10, 10, 300, 50]);
                this.font = new me.Font("Arial", 26, "white");


            },
            draw: function(renderer) {
                this.font.draw(renderer.getContext(), "PRESS F1 to F4 TO BUY, PRESS F5 TO PICK A CHARACTER", this.pos.x, this.pos.y);
                this.font.draw(renderer.getContext(), "CURRENT EXP: " + game.data.exp.toString(), this.pos.x + 100, this.pos.y + 50);
                this.font.draw(renderer.getContext(), "F1: INCREASE GOLD PRODUCTION, CURRENT LEVEL: " + game.data.exp1.toString() + ", COST: " + goldProductionCost, this.pos.x, this.pos.y + 100);
                this.font.draw(renderer.getContext(), "F2: ADD STARTING GOLD, CURRENT LEVEL: " + game.data.exp2.toString() + ", COST: " + startGoldCost, this.pos.x, this.pos.y + 150);
                this.font.draw(renderer.getContext(), "F3: INCREASE DAMAGE, CURRENT LEVEL: " + game.data.exp3.toString() + ", COST: " + damageCost, this.pos.x, this.pos.y + 200);
                this.font.draw(renderer.getContext(), "F4: INCREASE STARTING HEALTH, CURRENT LEVEL: " + game.data.exp4.toString() + ", COST: " + healthCost, this.pos.x, this.pos.y + 250);
            }
        })));
        this.handler = me.event.subscribe(me.event.KEYDOWN, function(action, keyCode, edge) {
            if (action === "F1") {
                if (game.data.exp >= goldProductionCost) {
                    game.data.exp1 += 1;
                    game.data.exp -= goldProductionCost;
                }
                else {
                    alert("NOT ENOUGH EXP");
                }
            } else if (action === "F2") {
                if (game.data.exp >= startGoldCost) {
                    game.data.exp2 += 1;
                    game.data.gold += 10;
                    game.data.exp -= startGoldCost;
                }
                else {
                    alert("NOT ENOUGH EXP");
                }
            }
            else if (action === "F3") {
                if (game.data.exp >= damageCost) {
                    game.data.exp3 += 1;
                    game.data.playerAttack += 2;
                    game.data.exp -= damageCost;
                }
                else {
                    alert("NOT ENOUGH EXP");
                }
            }
            else if (action === "F4") {
                if (game.data.exp >= healthCost) {
                    game.data.exp4 += 1;
                    game.data.playerHealth += 10;
                    game.data.exp -= healthCost;
                }
                else {
                    alert("NOT ENOUGH EXP");
                }
            }
            else if (action === "F5") {
                me.state.change(me.state.CHAR);
            }
        });
    },
    /**	
     *  action to perform when leaving this screen (state change)
     */
    onDestroyEvent: function() {
        me.input.unbindKey(me.input.KEY.F1, "F1");
        me.input.unbindKey(me.input.KEY.F2, "F2");
        me.input.unbindKey(me.input.KEY.F3, "F3");
        me.input.unbindKey(me.input.KEY.F4, "F4");
        me.input.unbindKey(me.input.KEY.F5, "F5");
        me.event.unsubscribe(this.handler);
    }
});


