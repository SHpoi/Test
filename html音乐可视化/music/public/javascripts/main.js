$(function(){
	//创建audioContext对象
	var ac=new (window.AudioContext||window.webkitAudioContext)(),
		gainNode=ac[ac.createGain?'createGain':'createGainNode'](),
		analyser=ac.createAnalyser(),
		list=$('.song_list ul li'),
		source=null,
		count=0,
		size=128,
		Dots=[],
		height,
		width;
	gainNode.connect(ac.destination);

	analyser.fftSize=size*2;
	analyser.connect(gainNode);
   
	$('.previousSong').click(function(){
		$('.selected').prev().trigger('click')
	})
	$('.nextSong').click(function(){
		$('.selected').next().trigger('click')
	})
    $('#volume').bind('change',function(){
    	chageVolume(this.value/this.max)
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
	list.bind('click',onceAddSongs);
    
	function onceAddSongs(){
        var n=++count;
		ajax('/media/'+this.title,AudioCreate,function(){
			console.log('发送失败')
		},n)
	}
  

    //播放歌曲
	function AudioCreate(data,n){
		if(n!==count)return;
		console.log('返回数据成功')
		ac.decodeAudioData(data,function(buffer){//由于相应过快，导致decodeAudioData不停地创建来解码，从而导致连续换多首歌会相应非常慢
			if(n!==count)return;//这句话就是为了防止点击过块而曲目不同调
			console.log('调用decodeAudioData')
    		//解码成功
    		var bufferSource=ac.createBufferSource();
    		bufferSource.buffer=buffer;
    		bufferSource.connect(analyser);
    		// bufferSource.connect(gainNode);
    		//检测是否有一首歌正在播放,有则将该首歌停止，但其实毫无意义，因为缓冲文件会有一定缓冲时间 从AudioCreate到decodeAudioData有延迟
			 source && source[source.stop?'stop':'noteOff']();
    		// bufferSource.connect(ac.destination);//一旦有gainNode控制音量大小，bufferSource就没必要再连接
    		bufferSource[bufferSource.start?'start':'noteOn'](0);
    		source=bufferSource;
    	},function(error){
    		//解码错误
    		console.log(error)
    	})
	}
	visualizer();//只调用一次并实时分析
	function visualizer(){
		var arr= new Uint8Array(analyser.frequencyBinCount);
		
		requestAnimationFrame = window.requestAnimationFrame||
								window.webkitRequestAnimationFrame||
								window.mozRequestAnimationFrame;
		requestAnimationFrame(v);
		function v(){
			analyser.getByteFrequencyData(arr);
			draw(arr)
			requestAnimationFrame(v)
		}
	}

	function chageVolume(percent){
		console.log(percent)
		gainNode.gain.value=percent*percent;
	}				
	//调用ajax	获得arraybuffer数据
	function ajax(url, fnSucc, fnFaild,n){
	    //1.创建对象
	    var oAjax = null;
	    if(window.XMLHttpRequest){
	        oAjax = new XMLHttpRequest();
	    }else{
	        oAjax = new ActiveXObject("Microsoft.XMLHTTP");
	    }
	    //中断上一次请求,麻痹太快了
	    oAjax.abort();
	    //2.连接服务器  
	    oAjax.open('GET', url, true);   //open(方法, url, 是否异步)
	    oAjax.responseType='arraybuffer';
	    //3.发送请求  
	    oAjax.send();
	      
	    //4.接收返回
	    oAjax.onreadystatechange = function(){  //OnReadyStateChange事件
	        if(oAjax.readyState == 4){  //4为完成
	            if(oAjax.status == 200){    //200为成功
	                fnSucc(oAjax.response,n) 
	            }else{
	                if(fnFaild){
	                    fnFaild();
	                }
	            }
	        }
	    };
	}

	//canvas
	var box=$('.panel');
	var canvas=document.createElement('canvas');
	var ctx=canvas.getContext('2d');
	box.append(canvas)
	//resize  canvas的大小同时
	var line;
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
		ctx.fillStyle=line;
		for(var i=0;i<size;i++){
			if(draw.type=='column'){
				var h=arr[i]/256*height;
				ctx.fillRect(w*i,height-h,w*0.6,h);
			}else if(draw.type=='dot'){
				ctx.beginPath();
				var o=Dots[i];
                var r=arr[i]/256*50;
                ctx.arc(o.x,o.y,r,0,Math.PI*2,true);
                var g=ctx.createRadialGradient(o.x,o.y,0,o.x,o.y,r);
                g.addColorStop(0,'#fff');
                g.addColorStop(1,o.color);
                ctx.fillStyle=g;
                ctx.fill();
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
			var color='rgb('+random(0,255)+','+random(0,255)+','+random(0,255)+')';
			Dots.push({
				x:x,
				y:y,
				color:color
			})
		}
	}
	
})
