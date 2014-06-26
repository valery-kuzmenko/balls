less.watch();

var AbstractFigure = defineClass(
    function(){},
    {
        run: abstractMethod,
        show: abstractMethod,
    },
    null
);
var AbstractClashObject = defineClass(
    function(){},
    {
        changeAngle: abstractMethod,
    },
    null
);

var CartClashObject = defineSubclass(
        AbstractClashObject,
        function CartClashObject(){
            if(CartClashObject._instance){
                return CartClashObject._instance;
            }
            CartClashObject._instance = this;
        },
        {
            changeAngle: function(ball){
                ball.angle = 360 - ball.angle;
            }                
        },
        null
);
var BorderClashObjectSide1 = defineSubclass(
        AbstractClashObject,
        function BorderClashObjectSide1(){
            if(BorderClashObjectSide1._instance){
                return BorderClashObjectSide1._instance;
            }
            BorderClashObjectSide1._instance = this;            
        },
        {
            changeAngle: function(ball){
                ball.angle = 180 - ball.angle;
            }                
        },
        null
);

var BorderClashObjectSide2 = defineSubclass(
        AbstractClashObject,
        function BorderClashObjectSide2(){
            if(BorderClashObjectSide2._instance){
                return BorderClashObjectSide2._instance;
            }
            BorderClashObjectSide2._instance = this;            
        },
        {
            changeAngle: function(ball){
                ball.angle = 180 - ball.angle;
            }                
        },
        null
);
var BorderClashObjectSide3 = defineSubclass(
        AbstractClashObject,
        function BorderClashObjectSide3(){
            if(BorderClashObjectSide3._instance){
                return BorderClashObjectSide3._instance;
            }
            BorderClashObjectSide3._instance = this;            
        },
        {
            changeAngle: function(ball){
                ball.angle = 360 - ball.angle;
            }                
        },
        null
);

var BorderClashObjectSide4 = defineSubclass(
        AbstractClashObject,
        function BorderClashObjectSide4(){
            if(BorderClashObjectSide4._instance){
                return BorderClashObjectSide4._instance;
            }
            BorderClashObjectSide4._instance = this;            
        },
        {
            changeAngle: function(ball){
                ball.angle = 360 - ball.angle;
            }                
        },
        null
);

var HandleCanvas = defineClass(
    function HandleCanvas(container){
        if(!HandleCanvas.prototype._instance){
            var container = document.querySelectorAll('.container')[0];
            if(!container){
                throw new Error('Container not found!');
            }
            var sq_container = document.createElement('CANVAS'); 
            sq_container.setAttribute('id', 'square');
            sq_container.setAttribute('width', document.body.clientWidth);
            sq_container.setAttribute('height', document.body.clientHeight);
            container.appendChild(sq_container);

            this._context = sq_container.getContext('2d');
            this._sq_container = sq_container;
            this._width = document.body.clientWidth;
            this._height = document.body.clientHeight;            

            HandleCanvas.prototype._instance = this;
        }
    },
    {
        getContext: function(){
            return HandleCanvas.prototype._instance._context;
        },
        get width(){
            return HandleCanvas.prototype._instance._width;
        },
        get height(){
            return HandleCanvas.prototype._instance._height;
        }
    },
    null
);

var Square = defineClass(
    function Square(){
        this.cart = null;
        this.border = null;
        this.show();
        this._figures = [];
        this.points = [];
    }, 
    {
        place:function(figure){
            var offset_x = (figure.start_x) ? Math.round(figure.start_x) : 0;
            var offset_y = (figure.start_y) ? Math.round(figure.start_y) : 0;
            var is_clash = false;
            var clashed_obj = null; // object wich initiates clash
            for(var i=1;i<=figure.width;i++){
                for(var j=1;j<=figure.height;j++){
                    for(var k=0; k < this._figures.length; k++){
                        var res, object = this._figures[k];
                        if((res = object.is_intersects(i+offset_x, j+offset_y)) && (!figure.last_clashed_obj || figure.last_clashed_obj != res)){
                            if(!is_clash) clashed_obj = res;
                            is_clash = true;
                        };
                    }
                }            
            }
            if(is_clash && figure.clash){
                figure.last_clashed_obj = clashed_obj;
                figure.clash(clashed_obj);
            }
                    
            figure.show();
        },
        show: function(){
            (new HandleCanvas()).getContext().fillStyle = '#C6DEE7';
            (new HandleCanvas()).getContext().fillRect( 0, 0, (new HandleCanvas()).width, (new HandleCanvas()).height );
        },
        addFigure: function(){
            for(var i=0; i< arguments.length;i++){
                this._figures[this._figures.length] = arguments[i];
            }            
        },
        getFigures: function(){
            return this._figures;       
        },
    },
    null
);

var Border = defineSubclass(
    AbstractFigure, 
    function Border(){
        this.thickness = 25;
        this.width = (new HandleCanvas()).width;
        this.height = (new HandleCanvas()).height;
        
    },
    {
        show: function(){
            var context = (new HandleCanvas()).getContext();
            context.fillStyle = '#fff';
            context.strokeStyle = "#000";
            context.strokeRect( this.thickness, this.thickness, (new HandleCanvas()).width - this.thickness*2, (new HandleCanvas()).height - this.thickness*2);
            context.fillRect( this.thickness, this.thickness, (new HandleCanvas()).width - this.thickness*2, (new HandleCanvas()).height - this.thickness*2);
        },
        is_intersects: function(i, j){
            if(i<=this.thickness){
                return (new BorderClashObjectSide1());
            }else if(i >= this.width - this.thickness){
                return (new BorderClashObjectSide2());
            }else if(j<=this.thickness){
                return (new BorderClashObjectSide3());
            }else if(j >= this.height - this.thickness){
                return (new BorderClashObjectSide4());
            }else{
                return false;
            }            
        }
    },
    null
);

var Ball = defineClass(
    function Ball(){
        this.r = 20;
        this.width = this.r*2;
        this.height = this.r*2;
        this.start_x = 200;
        this.start_y = 200;
        this.old_x = 200;
        this.old_y = 200;
        this.context = (new HandleCanvas()).getContext();
        this.angle = -45;
        this.spead = 0.000000000002;
        this.last_clashed = [];
    },
    {
       show: function(){
           this.r = Math.floor(Math.random() * (21 - 19 + 1)) + 19;
           var clr1 = Math.floor(Math.random() * 100), clr2 = Math.floor(Math.random() * 100);
           this.context.fillStyle = 'rgb(200,'+clr1+','+clr2+')';
           this.context.beginPath();
           this.context.arc( this.old_x+this.r, this.old_y+this.r, 20, 0, Math.PI * 2, true );
           this.context.closePath();
           this.context.fill();
       },
       run: function(){
           var time = new Date().getTime() * this.spead;
           var x = Math.cos(this.angle/180*Math.PI)*time;
           var y = Math.sin(this.angle/180*Math.PI)*time;
           this.old_x = this.start_x;
           this.old_y = this.start_y;
           this.start_x = this.start_x + x;
           this.start_y = this.start_y + y;
       },
       clash: function(object){
           if(object == null) debugger;
           object.changeAngle(this);

           if(this.angle > 360){
               this.angle = this.angle - 360;
           }
       },
    },
    null
);

var Cart = defineClass(
    function Cart(square_for_cart){
        var border = new Border();
        this.element_id = 'cart';
        this.element = document.getElementById(this.element_id);
        this.width = 300;
        this.height = 25;
        this.border_thickness = 1*border.thickness;
        this.border_width = 1*border.width;
        this.start_x = border.thickness;
        this.start_y = border.height - this.border_thickness - this.height;
        this.square_for_cart = square_for_cart;
    },
    {
        init: function(){
            this.initEvents();
            return this;
        },
        initEvents: function(){
            var self = this;
            document.addEventListener('mousemove', function(e){
                var x = e.clientX - self.width/2;

                if(x < self.border_thickness){
                    self.start_x = self.border_thickness;
                }else{                    
                    self.start_x = x;
                }
                if(x < self.border_thickness){
                    x = self.border_thickness;
                }
                if(e.clientX + self.width/2 > self.border_width - self.border_thickness){
                    x = self.border_width - self.border_thickness - self.width;
                }
                self.element.style.left = x + 'px';
            });
        },
        is_intersects: function(i,j){
            if((j>=this.start_y && j<=this.start_y + this.height) && i >= this.start_x && i <= (this.start_x + this.width)){
                return (new CartClashObject());
            }
            return false;
        },
        show: function(){return true;}
        
    },
    null
);

var Bead = defineSubclass(
    AbstractFigure, 
    function Bead(start_x, start_y){
        this.start_x = start_x;
        this.start_y = start_y;
        this.context = (new HandleCanvas()).getContext();
    },
    {
       show: function(){
           this.context.fillStyle = 'rgb(100,100,100)';
           this.context.beginPath();
           this.context.arc( this.start_x+Bead.r, this.start_y+Bead.r, 20, 0, Math.PI * 2, true );
           this.context.closePath();
           this.context.fill();
           return this;
       },
       is_intersects: function(i, j){
           console.log(11);
           return false;
       }
    },
    {
        r:20,
        is_initialized: false,
        placedBeads:{},
        initBeads: function(x_from, x_to, y_from, y_to, count){
            var start_x = x_from;
            for(var k=1; k<=count; k++){
                var hash = Bead._stored_hash();
                if(x_from+Bead.r*2 + 1 < x_to){
                     var obj = new Bead(x_from + 1, y_from + 1);
                     obj._bead_hash = hash;
                     Bead.placedBeads[hash] = obj;
                     x_from = x_from + Bead.r*2 + 1;
                }else{
                     y_from = y_from + Bead.r*2 + 1;
                     x_from = start_x;
                     var obj = new Bead(x_from+ 1, y_from + 1);
                     obj._bead_hash = hash;
                     Bead.placedBeads[hash] = obj;
                }                   
            }
        },
        showBeads: function(){
            for(hash in Bead.placedBeads){
                Bead.placedBeads[hash].show();
            }
        },
        _stored_hash: function(){
            Bead._stored_hash.start++;
            return  'BeadObject#' + Bead._stored_hash.start;
        }        
    }
); 
Bead._stored_hash.start = 0;

var BeadCollection = defineSubclass(
    AbstractFigure,
    function BeadCollection(){
        
    },
    {
        
    },
    null
);



function App(){
    this.square = new Square();
    this.border = new Border();
    this.ball = new Ball();
    this.cart = new Cart(this.square_for_cart).init();
    Bead.initBeads(this.border.thickness, this.border.width-this.border.thickness, this.border.thickness, this.border.height-this.border.thickness, 200);
    this.square.addFigure(this.border, this.cart);
    for(hash in Bead.placedBeads){
        this.square.addFigure(Bead.placedBeads[hash]);
    }
}

var app = new App();


function run(){
    app.square.show();
    app.border.show();
    Bead.showBeads();
    app.square.place(app.ball);
    app.ball.run();    
}
animate();

function animate(){
    
    //window.requestAnimationFrame(animate);
    run();
}


