game.MiniMap = me.Entity.extend({
    init: function(x, y, settings){
        this.setSuper(x, y, settings);
        this.floating = true;
        this.map = true;
    },
     setSuper: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
                image: "mini-map",
                width: 701,
                height: 159,
                spritewidth: "701",
                spriteheight: "159",
                getShape: function() {
                    return (new me.Rect(0, 0, 701, 159)).toPolygon();
                }
            }]);
    },
    update: function(){
        return true;
    }
});


