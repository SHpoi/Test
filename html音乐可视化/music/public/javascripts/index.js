$(function(){
	//创建audioContext对象
	var list=$('.song_list ul li'),
		Dots=[],
		height,
		width,
    	line,
    	size=128,
		box=$('.panel'),
		canvas=document.createElement('canvas'),
		ctx=canvas.getContext('2d');
	box.append(canvas)
	var mv = new MusicVisualizer({
		size:size,
		visualizer:draw
	})


	$('.previousSong').click(function(){
		$('.selected').prev().trigger('click')
	})
	$('.nextSong').click(function(){
		$('.selected').next().trigger('click')
	})
    $('#volume').bind('change',function(){
    	mv.changeVolume(this.value/this.max)
    })
    $('#volume').trigger('change');
    $('#colunmn').click(function(){
    	draw.type='column';
    });
    $('#circle').click(function(){
    	draw.type='dot';
    });

	list.click(function(){
		$(this).addClass('selected').siblings().removeClass('selected');	
	});
	list.bind('click',function(){
		mv.play('/media/'+this.title)
	});
	// $('#local-music-button').click(function(){
	// 	$('#chose-input').click();
	// })
	// $('#chose-input').change(function(){
	// 	var file = this.files[0];

	// 	var fr = new FileReader();
	// 	fr.readAsArrayBuffer(file);
	// 	fr.onload=function(e){
	// 		console.log(111)
	// 		mv.play(e.target.result);
	// 	}


	// })

	
	
	
	function resize(){
		height=box.height();
		width=box.width();
		canvas.height=height;
		canvas.width=width;
		line=ctx.createLinearGradient(0,0,0,height);
		line.addColorStop(0,'red');
		line.addColorStop(0.5,'yellow');
		line.addColorStop(1,'green');
		getDots();
	}
	resize();
	$(window).resize(function(){
  		resize()
	});

    draw.type='column';
	function draw(arr){
		ctx.clearRect(0,0,width,height);
		var w=width/size;
		var cw=w*0.6;
		var capH=cw > 10 ? 10 : cw;
		ctx.fillStyle=line;
		for(var i=0;i<size;i++){
			var o=Dots[i];
			if(draw.type=='column'){//柱状图
				var h=arr[i]/256*height;
				ctx.fillRect(w*i,height-h,cw,h);
				//小帽
				ctx.fillRect(w*i,height-(o.cap+capH),cw,capH);
				o.cap--;
				if(o.cap<0){
					o.cap=0;
				}
				if( h>0 && o.cap < h+40){
					o.cap = h+40> height - capH ? height - capH : h+40;
				}
			}else if(draw.type=='dot'){//点状图
				ctx.beginPath();
                var r=10+arr[i]/256*(height>width?width:height)/10;
                ctx.arc(o.x,o.y,r,0,Math.PI*2,true);
                var g=ctx.createRadialGradient(o.x,o.y,0,o.x,o.y,r);
                g.addColorStop(0,'#fff');
                g.addColorStop(1,o.color);
                ctx.fillStyle=g;
                ctx.fill();
                o.y -= o.dy;
                o.y = o.y < 0 ? height : o.y;
                ctx.closePath();
			}		
		}
	}
	
    function random(m,n){
    	return Math.round(Math.random()*(n-m)+m);
    }
	function getDots(){
		Dots=[];//防止无限加
		for(var i=0;i<size;i++){
			var x=random(0,width);
			var y=random(0,height);
			var color='rgba('+random(0,255)+','+random(0,255)+','+random(0,255)+',0.5)';
			Dots.push({
				x:x,
				y:y,
				dy:random(1,3),
				color:color,
				cap:0
			})
		}
	}
	
})