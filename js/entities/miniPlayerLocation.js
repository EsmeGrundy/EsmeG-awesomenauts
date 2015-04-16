game.MiniPlayerLocation = me.Entity.extend({
    init: function(x, y, settings){
        this.settings = settings;
        this.r = 5;
        this.diameter = (this.r + 2) * 2;
        this.anchorPoint = new me.Vector2d(0, 0);
    },
    draw: function(){
        
    },
    update: function(){
        
    }
});


