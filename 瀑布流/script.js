window.onload=function(){
      waterfall('main','box');
      
      
      var dataInt={'data':[{'src':'1.jpg'},{'src':'2.jpg'},{'src':'3.jpg'},{'src':'4.jpg'},{'src':'5.jpg'},{'src':'6.jpg'},{'src':'7.jpg'}]};
       window.onscroll=function(){
        if(checkScrollSlide()){
            var oParent = document.getElementById('main');// 父级对象
            for(var i=0;i<dataInt.data.length;i++){
                var oPin=document.createElement('div'); //添加 元素节点
                oPin.className='box';                   //添加 类名 name属性
                oParent.appendChild(oPin);              //添加 子节点
                var oBox=document.createElement('div');
                oBox.className='pic';
                oPin.appendChild(oBox);
                var oImg=document.createElement('img');
                oImg.src='images/'+dataInt.data[i].src;
                oBox.appendChild(oImg);
            }
            waterfall('main','box');
        };
    }
}
function waterfall(parent,box){
	//将main下所有class为box的元素取出来
	var oParent=document.getElementById(parent);
	var oBoxs=getByClass(oParent,box);
	
	//计算整个页面显示的列数（页面宽/box的宽（offsetWidth能求得宽））
	var oBoxW=oBoxs[0].offsetWidth;

	var cols=Math.floor(document.documentElement.clientWidth/oBoxW);
	//document.documentElement.clientWidth网页可见区域宽
	
	//设置main的宽度
	oParent.style.cssText='width:'+oBoxW*cols+'px; margin:0 auto';

	var hArr=[];//存放每一列高度的数组
	for (var i = 0; i < oBoxs.length; i++) {
		if(i<cols){
			hArr.push(oBoxs[i].offsetHeight);
		}else{
			var minH=Math.min.apply(null,hArr);//应用某一对象的一个方法，用另一个对象替换当前对象。 apply([thisObj[,argArray]])  利用Apply的参数数组化来提高
			var index=getMinhIndex(hArr,minH);
			oBoxs[i].style.position='absolute';
			oBoxs[i].style.top=minH+'px';
			oBoxs[i].style.left=oBoxW*index+'px';
			hArr[index]+=oBoxs[i].offsetHeight;
		}
	}
	

}

//根据class获取元素
function getByClass(parent,clsname){
     var boxArray=new Array(),//用来存储获取到的所有id为box的元素
         oElements=parent.getElementsByTagName('*');
     for(var i=0;i<oElements.length;i++){
     	if(oElements[i].className==clsname){
     		boxArray.push(oElements[i]);
     	}
     }
     return boxArray;
}

function getMinhIndex(arr,val){
	for(var i in arr){
		if(arr[i]==val){
			return i;
		}
	}
}
//检测是否具备了加载数据块的条件
function checkScrollSlide(){
	var oParent=document.getElementById('main');
	var oBoxs=getByClass(oParent,'box');
	var lastbox=oBoxs[oBoxs.length-1].offsetTop+Math.floor(oBoxs[oBoxs.length-1].offsetHeight/2);
    var scrollTop=document.body.scrollTop||document.documentElement.scrollTop;
    var height=document.body.clientHeight||document.documentElement.clientHeight;
    console.log('lastbox:'+lastbox+",scrollTop:"+scrollTop+",height:"+height);
    return (lastbox<scrollTop+height)?true:false;
}