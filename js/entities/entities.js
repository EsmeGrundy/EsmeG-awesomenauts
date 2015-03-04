game.PlayerEntity = me.Entity.extend({
    init: function(x, y, settings){
        this._super(me.Entity, "init", [x, y, {
                image: "orcSpear",
                height: 64,
                width: 64,
                spriteheight: "64",
                spritewidth: "64",
                getShape: function(){
                    return(new me.Rect(0, 0, 64, 64)).toPolygon();
                }
                
        }]);
        
    },
    
    update: function(){
        
    }
});