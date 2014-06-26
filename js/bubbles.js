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

var BeadClashObject = defineSubclass(
        AbstractClashObject,
        function BeadClashObject(figure){
            this.figure = figure;
        },
        {
            changeAngle: function(ball){
                ball.angle = 360 - ball.angle;
                Application.square.removeFigure(this.figure);
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
        this._figures = {};
        this.points = [];
        this._dynamic_figures = [];
    }, 
    {
        place:function(figure){
            var offset_x = (figure.start_x) ? Math.round(figure.start_x) : 0;
            var offset_y = (figure.start_y) ? Math.round(figure.start_y) : 0;
            var is_clash = false;
            var clashed_obj = null; // object wich initiates clash
            for(var i=1;i<=figure.width;i++){
                for(var j=1;j<=figure.height;j++){
                    if(this.points[i+offset_x] && this.points[i+offset_x][j+offset_y] && this.points[i+offset_x][j+offset_y].clash!=figure.last_clashed_obj){
                        clashed_obj = this.points[i+offset_x][j+offset_y].clash;
                        is_clash = true;
                        break;
                    }
                    
                    for(var k in this._dynamic_figures){
                        var res, object = this._dynamic_figures[k];
                        if((res = object.isIntersects(i+offset_x, j+offset_y)) && (!figure.last_clashed_obj || figure.last_clashed_obj != res)){
                            clashed_obj = res;
                            is_clash = true;
                            break;
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
                var figure = arguments[i];
                var hash = Square._hash();
                figure._square_hash = hash;
                this._figures[hash] = figure;
            }
        },
        removeFigure: function(figure){
            var points = figure.getPointsOnSquare();
            for(var key in points){
                key = 1*key;
                if(this.points[key] && points[key].obj){ 
                    this.points[key] = null;
                }
            }
            delete this._figures[figure._square_hash];
        },
        addDynamicFigure: function(){
            for(var i=0; i< arguments.length;i++){
                var figure = arguments[i];
                var hash = Square._hash();
                figure._square_hash = hash;
                this._dynamic_figures[hash] = figure;
            }            
        },
        showAllFigures: function(){
            for(hash in this._dynamic_figures){
                this._dynamic_figures[hash].show();
            }; 
            for(hash in this._figures){
                this._figures[hash].show();
            };             
        },
    },
    {
        _hash: (function(){
            var start = 0;
            
            return function(){
                start++;
                return 'Object#' + start;
            };
        })()          
    }
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
        isIntersects: function(i, j){
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
        isIntersects: function(i,j){
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
    function Bead(start_x, start_y, r){
        this.start_x = start_x;
        this.start_y = start_y;
        this.r = r;
        this.context = (new HandleCanvas()).getContext();
        this._points_on_square = [];
    },
    {
       show: function(){
           this.context.fillStyle = 'rgb(100,100,100)';
           this.context.beginPath();
           this.context.arc( this.start_x+this.r, this.start_y+this.r, 20, 0, Math.PI * 2, true );
           this.context.closePath();
           this.context.fill();
           return this;
       },
       isIntersects: function(i, j){
           return false;
       },
       putOnSquare: function(Square){
            var size = this.r*2;;
            for(var i = 1;i<=size;i++){
                for(var j = 1;j<=size;j++){
                    if(Math.sqrt(Math.pow((i-this.r),2) + Math.pow((j-this.r),2)) <= this.r){
                        Square.points[i+this.start_x] = [];
                        Square.points[i+this.start_x][j+this.start_y] = {obj:this, clash: (new BeadClashObject(this))};
                        this._points_on_square[i+this.start_x] = [];
                        this._points_on_square[i+this.start_x][j+this.start_y] = 1;                    
                    }
                } 
            }
            Square.addFigure(this);
       },
       getPointsOnSquare: function(){
           return this._points_on_square;
       }
       
    },
    null
); 

var BeadCollection = defineClass(
    function BeadCollection(){
        this.r = 20;
        this.arr = [];
    },
    {
        init: function(x_from, x_to, y_from, y_to, count, square){
            var width = this.r*2; var height = this.r*2, start_x = x_from;
            
            for(var n = 0;n<=count;n++){
                if((x_from + width) > x_to){
                    x_from = start_x;
                    y_from+=(height+1);
                }

                (new Bead(x_from, y_from, this.r)).putOnSquare(square);
                
                x_from+=(width+1);
            }
        }
    },
    null
);



function App(){
    this.square = new Square();
    this.border = new Border();
    this.ball = new Ball();
    this.cart = new Cart().init();
    this.square.addDynamicFigure(this.border, this.cart);
    this.beadCollect = new BeadCollection().init(this.border.thickness, this.border.width-this.border.thickness, this.border.thickness, this.border.height-this.border.thickness, 100, this.square);
}

var Application = new App();


function run(){
    Application.square.show();
    Application.square.showAllFigures();
    Application.square.place(Application.ball);
    Application.ball.run();    
}
animate();

function animate(){
    
    window.requestAnimationFrame(animate);
    run();
}


