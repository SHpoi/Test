var WINDOW_WIDTH=1024;
var WINDOW_HEIGHT=768;
var RADIUS=8;
var MARGIN_TOP=60;
var MARGIN_LEFT=30;
var endTime=new Date();
endTime.setTime(endTime.getTime()+3600*1000);
var curShowTimeSeconds=0;
var balls=[];
const colors = ["#33B5E5","#0099CC","#AA66CC","#9933CC","#99CC00","#669900","#FFBB33","#FF8800","#FF4444","#CC0000"];
window.onload=function(){
    
    WINDOW_HEIGHT=document.documentElement.clientHeight;
    WINDOW_WIDTH=document.documentElement.clientWidth;
    MARGIN_LEFT=Math.round(WINDOW_WIDTH/10);
    RADIUS=Math.round(WINDOW_WIDTH*4/5/108)-1;
    MARGIN_TOP=Math.round(WINDOW_HEIGHT/5);

	var canvas=document.getElementById("canvas");
	var context=canvas.getContext("2d");

	canvas.width=WINDOW_WIDTH;
	canvas.height=WINDOW_HEIGHT;
	curShowTimeSeconds=getCurrentShowTimeSeconds();
    setInterval(
        function(){
            render(context);
            update();
        },50
    	);
    
}

function getCurrentShowTimeSeconds(){
	var curTime=new Date();//获取当前时间
	var ret=endTime.getTime()-curTime.getTime();//结束时间减去当前时间
    ret=Math.round(ret/1000);
    // return 3600;//由于不知道date怎么定义以及date的格式，就这样吧
     return ret>=0?ret:0;

}

function update(){
	var nextShowTimeSeconds=getCurrentShowTimeSeconds();
	var nexthours=parseInt(nextShowTimeSeconds/3600);
	var nextminutes=parseInt((nextShowTimeSeconds-nexthours*3600)/60);
	var nextseconds=nextShowTimeSeconds%60;

	var curhours=parseInt(curShowTimeSeconds/3600);
	var curminutes=parseInt((curShowTimeSeconds-curhours*3600)/60);
	var curseconds=curShowTimeSeconds%60;
    
    

	if(nextseconds!=curseconds){

        if(parseInt(curhours/10)!=parseInt(nexthours/10)){
        	addBalls(MARGIN_LEFT+0,MARGIN_TOP,parseInt(curhours/10));
        }
        if(parseInt(curhours%10)!=parseInt(nexthours%10)){
        	addBalls(MARGIN_LEFT+15*(RADIUS+1),MARGIN_TOP,parseInt(curhours%10));
        }
        if(parseInt(curminutes/10)!=parseInt(nextminutes/10)){
        	addBalls(MARGIN_LEFT+39*(RADIUS+1),MARGIN_TOP,parseInt(curminutes/10));
        }
        if(parseInt(curminutes%10)!=parseInt(nextminutes%10)){
        	addBalls(MARGIN_LEFT+54*(RADIUS+1),MARGIN_TOP,parseInt(curminutes%10));
        }
        if(parseInt(curseconds/10)!=parseInt(nextseconds/10)){
        	addBalls(MARGIN_LEFT+78*(RADIUS+1),MARGIN_TOP,parseInt(curseconds/10));
        }
        if(parseInt(curseconds%10)!=parseInt(nextseconds%10)){
        	addBalls(MARGIN_LEFT+93*(RADIUS+1),MARGIN_TOP,parseInt(curseconds%10));
        }



		curShowTimeSeconds=nextShowTimeSeconds;

	}

	 updateBalls();
	
}
function updateBalls(){
	for(var i=0;i<balls.length;i++){
		balls[i].x+=balls[i].vx;
		balls[i].y+=balls[i].vy;
		balls[i].vy+=balls[i].g;
		if(balls[i].y>=WINDOW_HEIGHT-RADIUS){
              balls[i].y=WINDOW_HEIGHT-RADIUS;
              balls[i].vy=-balls[i].vy*0.75;
		}
	}


	var cnt=0;
	for(var i=0;i<balls.length;i++)
	{
		if(balls[i].x+RADIUS>0&&balls[i].x-RADIUS<WINDOW_WIDTH)
			balls[cnt++]=balls[i];
	}
	while(balls.length>Math.min(300,cnt))
		balls.pop();
}
function addBalls(x,y,num){
	for(var i=0;i<digit[num].length;i++){
		 for(var j=0;j<digit[num][i].length;j++){
		 	if(digit[num][i][j]==1){
		 		var aBall={
		 			 x:x+j*2*(RADIUS+1)+(RADIUS+1),
		 			 y:j+i*2*(RADIUS+1)+(RADIUS+1),
		 			 g:1.5+Math.random(),
		 			 vx:Math.pow(-1,Math.ceil(Math.random()*1000))*4,
		 			 vy:-5,
		 			 color:colors[Math.floor(Math.random()*colors.length)]
		 		}
		 		var ballnum=balls.push(aBall);
		 		console.log(ballnum);
		 	}
		 }
	}
}

function render(context){
    
    context.clearRect(0,0,WINDOW_WIDTH,WINDOW_HEIGHT);
    //对一个矩形控件对的图像进行刷新操作

	var hours=parseInt(curShowTimeSeconds/3600);
	var minutes=parseInt((curShowTimeSeconds-hours*3600)/60);
	var seconds=curShowTimeSeconds%60;
	renderDigit(MARGIN_LEFT, MARGIN_TOP, parseInt(hours / 10), context);
	renderDigit(MARGIN_LEFT + 15 * (RADIUS + 1), MARGIN_TOP, parseInt(hours % 10), context);
	renderDigit(MARGIN_LEFT + 30 * (RADIUS + 1), MARGIN_TOP, 10, context);

	renderDigit(MARGIN_LEFT + 39 * (RADIUS + 1), MARGIN_TOP, parseInt(minutes / 10), context);
	renderDigit(MARGIN_LEFT + 54 * (RADIUS + 1), MARGIN_TOP, parseInt(minutes % 10), context);
	renderDigit(MARGIN_LEFT + 69 * (RADIUS + 1), MARGIN_TOP, 10, context);

	renderDigit(MARGIN_LEFT + 78 * (RADIUS + 1), MARGIN_TOP, parseInt(seconds / 10), context);
	renderDigit(MARGIN_LEFT + 93 * (RADIUS + 1), MARGIN_TOP, parseInt(seconds % 10), context);
    

	for (var i = 0; i < balls.length; i++) {
		context.fillStyle = balls[i].color;
		context.beginPath();
		context.arc(balls[i].x, balls[i].y, RADIUS, 0, 2 * Math.PI, true);
		context.closePath();
		context.fill();
	}
}

function renderDigit(x,y,num,cxt){
	cxt.fillStyle="rgb(0,102,153)"
	for(var i=0;i<digit[num].length;i++){
		for(var j=0;j<digit[num][i].length;j++){
			if(digit[num][i][j]==1){
				cxt.beginPath();
				cxt.arc(x+j*2*(RADIUS+1)+(RADIUS+1),
					    y+i*2*(RADIUS+1)+(RADIUS+1),
					    RADIUS,
					    0,
					    2*Math.PI);
				cxt.closePath();
				cxt.fill();
			}
		}
	}
}
