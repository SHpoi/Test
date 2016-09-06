 window.onload=function () {
             var con=[[2,0,0,0],
                 [0,0,0,0],
                 [0,0,0,0],
                 [0,0,0,0]];
             var box=document.getElementsByClassName('box');
             var cou=document.getElementById('count');
             var message=document.getElementById('message');
             var score=0;
             var ismove=false;
             var winfirst=false;//判断是否赢得前置条件
             fresh();//初始化刷新
             function fresh() {
                 for(var i=0;i<4;i++){
                     for(var j=0;j<4;j++){
                         var num=i*4+j;
                         box[num].innerHTML=con[i][j];
                         switch (con[i][j]){
                             case 0:box[num].innerHTML='';box[num].style.background=null;break;
                             case 2:box[num].style.background='#3DCE6E';break;
                             case 4:box[num].style.background='rgb(255,128,0)';break;
                             case 8:box[num].style.background='rgb(255,126,64)';break;
                             case 16:box[num].style.background='orange';break;
                             case 32:box[num].style.background='rgb(230,68,64)';break;
                             case 64:box[num].style.background='rgb(128,128,254)';break;
                             case 128:box[num].style.background='rgb(163,250,133)';break;
                             case 256:box[num].style.background='rgb(130,250,173)';break;
                             case 512:box[num].style.background='rgb(78,100,233)';break;
                             case 1024:box[num].style.background='rgb(50,141,41)';break;
                             case 2048:box[num].style.backgroundColor='red';break;
                         }
                     }
                 }
                 //刷新分数
                 cou.innerHTML='Score:'+score;
             }
             //增添新二，并且刷新
             function addNew() {
                 //添加新2必须加在fresh之前，在按键之后
                 var sm=[],k=0;
                 for(var i=0;i<4;i++){
                     for(var j=0;j<4;j++){
                         if(con[i][j]==0){
                             sm[k++]=[i,j];
                         }
                     }
                 }
                 if(sm.length>0&& ismove==true){
                     var index=Math.floor(Math.random()*(sm.length));
                     con[ sm[index][0] ][ sm[index][1] ]=2;
                     //console.log('x:'+sm[index][0]+'y:'+sm[index][1]);
                 }else{
                     winfirst=true;
                 }
                 //console.log('winfirst:'+winfirst+'    ismove:'+ismove);

             }


             window.onkeydown=function(event) {
                 event=event||window.event;
                 if(event.key=='ArrowDown'){
                     moveDown();
                     addNew();
                     fresh();
                 }else if(event.key=='ArrowUp'){
                     moveUp();
                     addNew();
                     fresh();
                 }else if(event.key=='ArrowLeft'){
                     moveLeft();
                     addNew();
                     fresh();
                 }else if(event.key=='ArrowRight'){
                     moveRight();
                     addNew();
                     fresh();
                 }
                 isEnd();

             }

             function isEnd() {
                 var isWin=true;
                 if(winfirst){
                     for(var i=0;i<4;i++){
                         for(var j=0;j<4;j++){
                             if((j-1)>=0&&con[i][j]==con[i][j-1]){
                                 isWin=false;
                             }
                             if((j+1)<=3&&con[i][j]==con[i][j+1]){
                                 isWin=false;
                             }
                             if((i+1)<=3&&con[i][j]==con[i+1][j]){
                                 isWin=false;
                             }
                             if((i-1)>=0&&con[i][j]==con[i-1][j]){
                                 isWin=false;
                             }
                         }
                     }
                     //console.log('isWin:'+isWin);
                     if(isWin){
                         message.innerHTML="game has over  <button onclick='window.location.reload();'>restart</button>";
                     }
                 }

             }
             function moveUp() {
                 removeUpBlank();
                 for (var j = 0; j < 4; j++) {
                     for (var i = 0; i < 3; i++) {
                         if (con[i][j] == con[i + 1][j]) {
                             con[i][j] *= 2;
                             score+=con[i][j];
                             con[i + 1][j] = 0;
                             removeUpBlank();
                         }
                     }

                 }
             }
             function removeUpBlank() {
                 for(var j=0;j<4;j++){
                     for(var i=1;i<=3;i++){
                         var k=i;
                         while(k<=3&&con[k-1][j]==0){
                             con[k-1][j]=con[k][j];
                             con[k][j]=0;
                             ismove=true;
                             k++;
                         }
                     }
                 }
             }
             function moveDown() {
                 removeDownBlank();
                 for(var j=0;j<4;j++){
                     for(var i=3;i>=1;i--){
                         if(con[i][j]==con[i-1][j]){
                             con[i][j]*=2;
                             score+=con[i][j];
                             con[i-1][j]=0;
                             removeDownBlank();
                         }
                     }

                 }
             }
             function removeDownBlank() {
                 for(var j=0;j<4;j++){
                     for(var i=2;i>=0;i--){
                         var k=i;
                         while(k+1<=3&&con[k+1][j]==0){
                             con[k+1][j]=con[k][j];
                             con[k][j]=0;
                             ismove=true;
                             k++;
                         }
                     }
                 }
             }
             function moveLeft(){
                 removeLeftBlank();
                 for(var i=0;i<4;i++){
                     for(var j=0;j<=2;j++){
                         if(con[i][j]==con[i][j+1]){
                             con[i][j]*=2;
                             score+=con[i][j];
                             con[i][j+1]=0;
                             removeLeftBlank();
                         }
                     }
                 }
             }
             function removeLeftBlank(){
                 for(var i=0;i<4;i++){
                     for(var j=1;j<=3;j++){
                         var k=j;
                         while(k<=3&&con[i][k-1]==0){
                             con[i][k-1]=con[i][k];
                             con[i][k]=0;
                             ismove=true;
                             k++;
                         }
                     }
                 }
             }
             function moveRight(){
                 removeRightBlank();
                 for(var i=0;i<4;i++){
                     for(var j=2;j>=0;j--){
                         if(con[i][j]==con[i][j+1]){
                             con[i][j+1]*=2;
                             score+=con[i][j];
                             con[i][j]=0;
                             removeRightBlank();
                         }
                     }
                 }
             }
             function removeRightBlank(){
                 for(var i=0;i<4;i++){
                     for(var j=2;j>=0;j--){
                         var k=j;
                         while(k+1<=3&&con[i][k+1]==0){
                             con[i][k+1]=con[i][k];
                             con[i][k]=0;
                             ismove=true;
                             k++;
                         }
                     }
                 }
             }
         }
