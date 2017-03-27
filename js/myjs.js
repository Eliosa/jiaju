var loading={
    prograssNode:$('.prograss-bar'),
    conNode:$('.prograss'),
    finish:function(){
        var that=this;
        that.prograssNode.animate({width:'100%'},200);
        window.setTimeout(function(){
            that.conNode.fadeOut();
        },600)
        
        
    },
    begin:function(){
        var that=this;
        that.prograssNode.animate({width:'70%'},500);
    },
    init:function(){
        var that=this;
        that.begin();
        window.onload=function(){
            that.finish();
        }
    }
};
loading.init();
var move={
    conNode:$('.container'),
    posX:0,//鼠标点击的初始位置
    posY:0,
    left:0,
    top:0,
    targetNode:null,
    bWidth:document.body.clientWidth,//最初的屏宽
    imgJson:[
        {
            name:'room',
            width:1600,
            height:1000,
            url:'img/room.jpg',
            left:0,
            top:0,
            layer:1
        },
        {
            name:'bed',
            width:618,
            height:408,
            url:'img/bed.png',
            left:900,
            top:450,
            layer:2
        },
        {
            name:'desk',
            width:400,
            height:249,
            url:'img/desk.png',
            left:400,
            top:700,
            layer:3
        },
        
    ],
    loadImgFun:function(){//进入页面加载图片
        var that=this;
        var sWidth=document.body.clientWidth;
        var width=0;
        var h;
        for(var i=0;i<that.imgJson.length;i++){
            h=sWidth*that.imgJson[0].height/that.imgJson[0].width;
            style=' style="width:'+sWidth+'px;height:'+h+'px;background:url('+that.imgJson[0].url+') no-repeat;background-size:'+sWidth+'px;filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(  src='+that.imgJson[0].url+',sizingMethod=\'scale\');"';
            if(i==0){//背景
                that.conNode.append('<div'+style+' class="container-ele"></div>')
            }else{//家具;家具缩放后的长宽
                var w=(that.imgJson[i].width)*sWidth/(that.imgJson[0].width);
                h=sWidth/that.imgJson[0].width*that.imgJson[i].height;
                var l=sWidth/that.imgJson[0].width*that.imgJson[i].left;
                var t=sWidth/that.imgJson[0].width*that.imgJson[i].top;
                //3.3
                 that.imgJson[i].layer=parseInt(that.imgJson[i].layer)+1000;
                zIndex.setMinMaxFun(parseInt(that.imgJson[i].layer));
                style=' style="z-index:'+ that.imgJson[i].layer+';left:'+l+'px;top:'+t+'px;width:'+w+'px;height:'+h+'px;background:url('+that.imgJson[i].url+')  no-repeat;background-size:'+w+'px; filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(  src='+that.imgJson[i].url+',sizingMethod=\'scale\');background:none\\9;"';
                that.conNode.append('<div id="'+that.imgJson[i].id +'" typeid="'+that.imgJson[i].typeid+'" jjid="'+ that.imgJson[i].jjid+'" jjgid="'+that.imgJson[i].jjgroupid+'" name="'+that.imgJson[i].name+'" '+style+' class="JS-move container-ele"><span class="JS-target-ele"></span><span class="JS-target-ele"></span><span class="JS-target-ele"></span><span class="JS-target-ele"></span><i class="circle-left JS-target-ele">左转</i><i class="circle-right JS-target-ele">右转</i></i>'+
                      '<a href="javascript:void(0)" class="JS-a JS-target-ele">替换家具</a><a href="javascript:void(0)" class="JS-b JS-target-ele types">样式</a><b class="JS-target-ele JS-TTop">置顶</b><b class="JS-target-ele JS-UUp">上一层</b><b class="JS-target-ele JS-DDown">下一层</b><b class="JS-target-ele JS-BBottom">置底</b></div>');
                // <a href="javascript:void(0)" class="JS-a">家具替换</a>
            }
        }
    },
    resizeFun:function(){//自适应屏幕大小
        var that=this;
        var sWidth=document.body.clientWidth;
        var divNode=$('.container-ele');
        for(var i=0;i<divNode.length;i++){
            if(i==0){
                h=sWidth*that.imgJson[0].height/that.imgJson[0].width;
                divNode.eq(i).css({width:sWidth+'px',height:h+'px',backgroundSize:sWidth+'px'});
            }else{
                var w=(that.imgJson[i].width)*sWidth/(that.imgJson[0].width);
                h=sWidth/that.imgJson[0].width*that.imgJson[i].height;
                var l=that.imgJson[i].left*sWidth/that.imgJson[0].width;
                var t=that.imgJson[i].top*sWidth/that.imgJson[0].width;
                //  console.log('结果:'+l,'swidth现屏宽:'+sWidth,'bwidth原屏宽:'+that.bWidth,'比例:'+sWidth/that.bWidth,'原left:'+parseFloat(divNode.eq(i).css('left')));
                divNode.eq(i).css({width:w+'px',height:h+'px',backgroundSize:w+'px',left:l+'px',top:t+'px'});
            }
        }
        //修改处
        var sHeight=sWidth/move.imgJson[0].width*move.imgJson[0].height;
        $('.JS-block').css({height:sHeight-120+'px'});
        $('.block-con').css({height:sHeight-40+'px'});
    },
    mousedownFun:function(e,flag){
        var that=this;
        var e=window.event||e;
        var target=event.srcElement || event.target;
        if($(target).hasClass('JS-move')==true){
            that.posX=e.clientX;
            that.posY=e.clientY;
            //3.1
            if(flag=='1'){
                that.posX=e.touches[0].clientX;
                that.posY=e.touches[0].clientY;
                // console.log('in ',e.touches[0].clientX);
            }
            //3.1
            that.left=parseInt($(target).css('left'));
            that.top=parseInt($(target).css('top'));
            that.targetNode=$(target);
        }
    },
    mousemoveFun:function(e,flag){
        var that=this;
        if(that.targetNode!=null){//sWidth,sHeight为当前背景的长宽； width,height为当前家具的长宽
            var e=window.event || e;
            var sWidth=document.body.clientWidth;
            var sHeight=sWidth/that.imgJson[0].width*that.imgJson[0].height;
            var mouseX=e.clientX;
            var mouseY=e.clientY;
            //3.1
            if(flag=='1'){
                mouseX=e.touches[0].clientX;
                mouseY=e.touches[0].clientY;
                console.log('in ',e.touches[0].clientX);
            }
            //3.1
            var Tleft=that.left+mouseX-that.posX;
            var Ttop=that.top+mouseY-that.posY;
            var width=parseFloat(that.targetNode.css('width'));
            var height=parseFloat(that.targetNode.css('height'));
            //3.2 可拖出2/3
            Tleft=Tleft<-width*2/3?-width*2/3:Tleft;
            Ttop=Ttop<-height*2/3?-height*2/3:Ttop;
            Tleft=Tleft+width<sWidth+width*2/3?Tleft:sWidth+width*2/3-width;
            Ttop=Ttop+height<sHeight+height*2/3?Ttop:sHeight+height*2/3-height;
            that.targetNode.css({left:Tleft+'px',top:Ttop+'px'});
            
        }
    },
    mouseupFun:function(){
        var that=this;
        if(that.targetNode!=null){
            var sWidth=document.body.clientWidth;
            var l=that.imgJson[0].width/sWidth*parseFloat(that.targetNode.css('left'));
            var t=that.imgJson[0].width/sWidth*parseFloat(that.targetNode.css('top'));
            that.imgJson[that.targetNode.index()].left=l;
            that.imgJson[that.targetNode.index()].top=t;
            that.targetNode=null;
        }
    },
    init:function(){
        var that=this;
        $(document).ready(function(){
            that.loadImgFun();
        });
        window.onresize=function(){
            that.resizeFun();
        }
        //以下三个事件：家具的移动
        //3.1以下 
        document.addEventListener("touchstart",function(e){
            that.mousedownFun(e,'1');
        });
        document.addEventListener('touchmove',function(e){
            that.mousemoveFun(e,'1');
        });
        document.addEventListener('touchend',function(e){
            that.mouseupFun(e,'1');
        })
        //3.1以上
        $(document).mousedown(function(e){
             //3.16
            var e=window.event||e;
            var target=e.target||e.srcElement;
            if($(target).hasClass('menu-threeLevel')){
                resourse.reMouseDownFun(e);
            }else{
                that.mousedownFun(e);
            }
        });
        $(document).mouseup(function(e){
            //3.16
             var e=window.event||e;
             var target=e.target||e.srcElement;
             if(resourse.clickFlag==1 ){
                    resourse.reMouseUpFun(e);
            }else{
                that.mouseupFun();
            }
                
        });
        $(document).mousemove(function(e){
                //3.16
                var e=window.event||e;
                var target=e.target||e.srcElement;
                if(resourse.clickFlag==1){
                    resourse.reMouseMoveFun(e);
                }else{
                    that.mousemoveFun(e);
                }
        });
        
    }
}                                                           
var zoom={
    ztargetNode:null,//moveTargetNode
    targetNode:null,
    zoomX:0,
    zoomY:0,
    w:0,
    h:0,
    t:0,
    l:0,
    nwNode:$('JS-move span:nth-child(1)'),
    neNode:$('JS-move span:nth-child(2)'),
    swNode:$('JS-move span:nth-child(3)'),
    seNode:$('JS-move span:nth-child(4)'),
    nwChange:function(e){//左上
        var that=this;
        var e=window.event||e;
        var target=e.target||e.srcElement;
        var mouseX=-(e.clientX-that.zoomX);
        var mouseY=-(e.clientY-that.zoomY);
        if(mouseX>mouseY){
            that.targetNode.css({left:that.l-mouseX+'px',top:-that.h*mouseX/that.w+that.t+'px',width:that.w+mouseX+'px',height:that.h*(that.w+mouseX)/that.w,backgroundSize:that.w+mouseX+'px'});                   
        }else{
            that.targetNode.css({left:that.l+that.w-that.w*(that.h+mouseY)/that.h+'px',top:-mouseY+that.t+'px',width:that.w*(that.h+mouseY)/that.h+'px',height:that.h+mouseY+'px',backgroundSize:that.w*(that.h+mouseY)/that.h+'px'})
        }
         //3.2 show下a 标签大小自适应
        var awidth=parseInt(that.targetNode.css('width'))/3;
        var aheight=awidth/4;
        that.targetNode.children('a').css({'width':awidth+'px','height':aheight+'px','line-height':aheight+'px','marginLeft':-awidth/2+'px','fontSize':aheight/2+'px'});
        that.targetNode.children('a').eq(1).css('marginTop',-aheight-10+'px');
        // 3.3  i标签大小自适应
        var iwidth=parseInt(that.targetNode.css('width'))/10;
        var iheight=iwidth;
        that.targetNode.children('i').css({'width':iwidth+'px','height':iheight+'px','backgroundSize':iwidth+'px'});
        //3.3
        var iwidth=parseInt(that.targetNode.css('width'))/10;
        var iheight=iwidth;
        that.targetNode.children('i').css({'width':iwidth+'px','height':iheight+'px','backgroundSize':iwidth+'px'});
        // 3.3
        var bwidth=iwidth*2;
        var bheight=iwidth/3*2
        that.targetNode.children('b').css({'bottom':iheight+'px','left':'4%','width':bwidth+'px','height':bheight+'px' ,'lineHeight':bheight+'px'});
        that.targetNode.children('b').eq(1).css({'left':'28%'});
        that.targetNode.children('b').eq(2).css({'left':'52%'});
        that.targetNode.children('b').eq(3).css({'left':'76%'});
    },
    neChange:function(e){//右上
        var that=this;
        var e=window.event||e;
        var target=e.target||e.srcElement;
        var mouseX=e.clientX-that.zoomX;
        var mouseY=-(e.clientY-that.zoomY);
        if(mouseX>mouseY){
            that.targetNode.css({top:-that.h*mouseX/that.w+that.t+'px',width:that.w+mouseX+'px',height:that.h*(that.w+mouseX)/that.w+'px',backgroundSize:that.w+mouseX+'px'});                   
        }else{
            that.targetNode.css({top:-mouseY+that.t+'px',width:that.w*(that.h+mouseY)/that.h+'px',height:that.h+mouseY+'px',backgroundSize:that.w*(that.h+mouseY)/that.h+'px'})
        }
         //3.2
        var awidth=parseInt(that.targetNode.css('width'))/3;
        var aheight=awidth/4;
        that.targetNode.children('a').css({'width':awidth+'px','height':aheight+'px','line-height':aheight+'px','marginLeft':-awidth/2+'px','fontSize':aheight/2+'px'});
        that.targetNode.children('a').eq(1).css('marginTop',-aheight-10+'px');
        //3.3
        var iwidth=parseInt(that.targetNode.css('width'))/10;
        var iheight=iwidth;
        that.targetNode.children('i').css({'width':iwidth+'px','height':iheight+'px','backgroundSize':iwidth+'px','lineHeight':bheight+'px'});
                    // 3.3
        var bwidth=iwidth*2;
        var bheight=iwidth/3*2
        that.targetNode.children('b').css({'bottom':iheight+'px','left':'4%','width':bwidth+'px','height':bheight+'px' ,'lineHeight':bheight+'px'});
        that.targetNode.children('b').eq(1).css({'left':'28%'});
        that.targetNode.children('b').eq(2).css({'left':'52%'});
        that.targetNode.children('b').eq(3).css({'left':'76%'});     
    },
    swChange:function(e){//左下
        var that=this;
        var e=window.event||e;
        var target=e.target||e.srcElement;
        var mouseX=-(e.clientX-that.zoomX);
        var mouseY=e.clientY-that.zoomY;
        if(mouseX>mouseY){
            that.targetNode.css({left:that.l-mouseX+'px',width:that.w+mouseX+'px',height:that.h*(that.w+mouseX)/that.w,backgroundSize:that.w+mouseX+'px'});                   
        }else{
            that.targetNode.css({left:that.l+that.w-that.w*(that.h+mouseY)/that.h+'px',width:that.w*(that.h+mouseY)/that.h+'px',height:that.h+mouseY+'px',backgroundSize:that.w*(that.h+mouseY)/that.h+'px'})
        }
    },
    seChange:function(e){//右下
        var that=this;
        var e=window.event||e;
        var target=e.target||e.srcElement;
        var mouseX=e.clientX-that.zoomX;
        var mouseY=e.clientY-that.zoomY;
        if(mouseX>mouseY){
            that.targetNode.css({width:that.w+mouseX+'px',height:that.h*(that.w+mouseX)/that.w,backgroundSize:that.w+mouseX+'px'});                   
        }else{
            that.targetNode.css({width:that.w*(that.h+mouseY)/that.h+'px',height:that.h+mouseY+'px',backgroundSize:that.w*(that.h+mouseY)/that.h+'px'})
        }
            
    },
    clickFun:function(e){
        var that=this;
        var e=window.event||e;
        var target=e.target||e.srcElement;
        //未被选中家具 取消其‘选中’效果
        if(that.targetNode!=null){
            if($(target).hasClass('JS-target')==false){
                if($(target).hasClass('JS-target-ele')==false){
                    that.targetNode.removeClass('show JS-target');
                    that.targetNode.children('span').css('display','none');
                    
                    //2.18
                    replace.closeFun();
                    that.targetNode.children('i').css('display','none');
                     that.targetNode.children('i').unbind('click');
                    that.targetNode=null;
                    
                }
            }
        }
        //选中家具添加类JS-target
        if($(target).hasClass('JS-move')||$(target).parent().hasClass('JS-move')){
            that.targetNode=$(target).hasClass('JS-move')?$(target):$(target).parent();
            that.targetNode.children('span').css({display: 'block',position: 'absolute',width: '20px',height: '20px'});                 
            that.targetNode.children('span:nth-child(1)').css({top: '-10px',left: '-10px'})
            that.targetNode.children('span:nth-child(2)').css({top: '-10px',right: '-10px'})
            that.targetNode.children('span:nth-child(3)').css({bottom: '-10px',left: '-10px'})
            that.targetNode.children('span:nth-child(4)').css({bottom: '-10px',right: '-10px'})
            that.targetNode.children('span:nth-child(1)').hover(function(){
                $(this).css({cursor: 'nw-resize'});
            });
            that.targetNode.children('span:nth-child(2)').hover(function(){
                $(this).css({cursor: 'ne-resize'});
            });
            that.targetNode.children('span:nth-child(3)').hover(function(){
                $(this).css({cursor: 'sw-resize'});
            });
            that.targetNode.children('span:nth-child(4)').hover(function(){
                $(this).css({cursor: 'se-resize'});
            });
            // that.targetNode.children('span').css('display','block');
            //3.2
            var awidth=parseInt(that.targetNode.css('width'))/3;
            var aheight=awidth/4;
            that.targetNode.children('a').css({'width':awidth+'px','height':aheight+'px','line-height':aheight+'px','marginLeft':-awidth/2+'px','fontSize':aheight/2+'px'});
            that.targetNode.children('a').eq(1).css('marginTop',-aheight-10+'px');
            //    3.2up
            //3.3
            var iwidth=parseInt(that.targetNode.css('width'))/10;
            var iheight=iwidth;
            that.targetNode.children('i').css({'width':iwidth+'px','height':iheight+'px','backgroundSize':iwidth+'px'});

            that.targetNode.addClass('show JS-target');
            replace.aNode=$('.JS-a');
            // 3.3
            var bwidth=iwidth*2;
            var bheight=iwidth/3*2
            that.targetNode.children('b').css({'bottom':iheight+'px','left':'4%','width':bwidth+'px','height':bheight+'px' ,'lineHeight':bheight+'px'});
            that.targetNode.children('b').eq(1).css({'left':'28%'});
            that.targetNode.children('b').eq(2).css({'left':'52%'});
            that.targetNode.children('b').eq(3).css({'left':'76%'});
            //2.18-2.20
            // replace.clickFun();//2.24
           $(target).children('i').css('display','block');
           $(target).children('i').eq(0).click(function(){circle.clickFun($(this))});
           $(target).children('i').eq(1).click(function(){circle.clickFun($(this))});
        }
        
    },
    init:function(){
        var that=this;
        $(document).click(function(e){
            //2.18
            that.clickFun(e);
            
        });
            //以下三个事件：家具的缩放
        $(document).mousedown(function(e){
            //  that.mousedownFun();
            var e=window.event||e;
            var target=e.target||e.srcElement;
            if($(target).parent().hasClass('JS-target')){
                that.ztargetNode=$(target);
                that.zoomX=e.clientX;
                that.zoomY=e.clientY;
                that.w=parseFloat(that.targetNode.css('width'));
                that.h=parseFloat(that.targetNode.css('height'));
                that.t=parseFloat(that.targetNode.css('top'));
                that.l=parseFloat(that.targetNode.css('left'));
            }
        });
        $(document).mouseup(function(){
            that.ztargetNode=null;
        
        });
        $(document).mousemove(function(e){
            //  var e=window.event||e;
            if(that.ztargetNode!=null){
                var index=that.ztargetNode.index();
                switch(index){
                    case 0:that.nwChange(e);break;
                    case 1:that.neChange(e);break;
                    case 2:that.swChange(e);break;
                    case 3:that.seChange(e);break;
                    default:break;
                }
            }
        });
    }
};
var operate={
    block3D:$('.block-3D'),
    _3D:document.getElementById('iframe'),
    singleDelFun:function(node){
        var bool=window.confirm('您确定要删除该‘家具’吗？');
        if(bool==true){
            node.css({display:'none'});
        }
    },
    classDelFun:function(){
        var bool=window.confirm('您确定要删除该‘家具类’吗？');
        if(bool==true){
            replace.closeFun();
            $('.JS-target').css({display:'none'});
        }
    },
    show3D:function(){
        var that=this;
        var url='http://www.baidu.com';
        that.block3D.css({display:'block'});
        that._3D.src=url;
    },
    close3D:function(){
        var that=this;
        that.block3D.css({display:'none'});
        that._3D.src='';
    },
    init:function(){
        var that=this;
        $(document).click(function(e){
            var e=window.event||e;
            var target=e.target||e.srcElement;
            if($(target).hasClass('block-3d-show')){
                that.show3D();
            };
            if($(target).hasClass('block-3D-close')){
                that.close3D()
            };
            if($(target).hasClass('block-furn-delete')){
                that.singleDelFun($(target).parent());
            };
            if($(target).hasClass('block-title-del')){
                that.classDelFun();
            };
        });
    }
};
var replace={
    blockNode:$('.JS-block'),
    conNode:$('.block-con'),
    aNode:$('.JS-a'),
    ulNode:$('.block-replace'),
    closeNode:$('.block-close'),
    liNode:$('.block-furniture'),
    //  targetNode:$('.JS-target'),
    imgJson:[
        {
            name:'bed',
            width:618,
            height:408,
            url:'img/bed.png',
            left:900,
            top:450,
            type:'中式'
        },
        {
            name:'desk',
            width:400,
            height:249,
            url:'img/desk.png',
            left:400,
            top:700,
            type:'欧式'
        }, 
            {
            name:'bed',
            width:618,
            height:408,
            url:'img/bed.png',
            left:900,
            top:450,
            type:'欧式'
        },
        {
            name:'desk',
            width:400,
            height:249,
            url:'img/desk.png',
            left:400,
            top:700,
            type:'欧式'
        }, 
            {
            name:'bed',
            width:618,
            height:408,
            url:'img/bed.png',
            left:900,
            top:450,
            type:'欧式'
        },
        {
            name:'desk',
            width:400,
            height:249,
            url:'img/desk.png',
            left:400,
            top:700,
            type:'中式'
        }, 
            {
            name:'bed',
            width:618,
            height:408,
            url:'img/bed.png',
            left:900,
            top:450,
            type:'欧式'
        },
        {
            name:'desk',
            width:400,
            height:249,
            url:'img/desk.png',
            left:400,
            top:700,
            type:'中式'
        }, 
            {
            name:'bed',
            width:618,
            height:408,
            url:'img/bed.png',
            left:900,
            top:450,
            type:'中式'
        },
        {
            name:'desk',
            width:400,
            height:249,
            url:'img/desk.png',
            left:400,
            top:700,
            type:'欧式'
        }   
    ],
    //替换家具125*75
    loadfurnitureFun:function(){
        var that=this;
        var w,h;
        that.ulNode.children('li').remove();
        for(var i=0;i<that.imgJson.length;i++){
            w=125;
            h=that.imgJson[i].height/that.imgJson[i].width*w;
            if(h>75){
                h=75;
                w=that.imgJson[i].width/that.imgJson[i].height*h;
            }
            that.ulNode.append('<li class="block-furniture JS-target-ele" style="background:url('+that.imgJson[i].url+') no-repeat;background-size:'+w+'px '+h+'px;background-position:center center;filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(  src='+that.imgJson[i].url+',sizingMethod=\'scale\');background:none\\9; "><span class="block-show-title">'+that.imgJson[i].name+'</span> <a href="javascript:void(0)" class="block-furn-delete JS-target-ele" title="删除该家具"></a> <a href="javascript:void(0)" class="block-3d-show JS-target-ele" title="3D展示"></a></li>');
        }
    },
    replacefurnitureFun:function(index){
        var that=this;
        $('.JS-target').css({backgroundImage:'url('+that.imgJson[index].url+')',filter: 'progid:DXImageTransform.Microsoft.AlphaImageLoader(  src='+that.imgJson[index].url+',sizingMethod=\'scale\')',background:'none\\9'});
    },
    clickFun:function(){
        //显示右侧栏
        // $('.block-close').trigger('click');
        var that=this;
        //3.16
        if($('.resourse').css('display')!='none'){
            $('.resourse').fadeOut();
        }
        var sWidth=document.body.clientWidth;
        var sHeight=sWidth/move.imgJson[0].width*move.imgJson[0].height; 
        if(parseInt(that.conNode.css('width'))==175){
            that.closeFun()
        }
        that.conNode.css({height:sHeight-40+'px',marginTop:'20px',borderRadius:'5px'});
        //修改处 2.7
        that.blockNode.css({height:sHeight-200+'px'});
        that.loadfurnitureFun();
        that.conNode.animate({width:175+'px',right:'10px'},500); 
    },
    closeFun:function(){
        this.conNode.animate({width:0+'px',right:'-190px'},500);
    },
    init:function(){
        var that=this;
        $(document).click(function(e){
            var e=window.event||e;
            var target=e.target||e.srcElement;
            //3.3
            if($(target).hasClass('JS-UUp')){
                console.log('parent',$(target),$(target))
                zIndex.zUp($(target).parent());
            }
            if($(target).hasClass('JS-DDown')){
                zIndex.zDown($(target).parent());
            }
            if($(target).hasClass('JS-BBottom')){
                zIndex.zBottom($(target).parent());
            }
            if($(target).hasClass('JS-TTop')){
                zIndex.zTop($(target).parent());
            }
            // 2.18//2.24
            if($(target).hasClass('JS-a')){
                that.clickFun();
            }
            if($(target).hasClass('JS-b')){
                  
                that.clickFun();
            }
            
            if($(target).hasClass('block-close')){
                that.closeFun();
            }
            if($(target).hasClass('block-furniture')){
                var index=$(target).index();
                that.replacefurnitureFun(index);
            }
            if($(target).hasClass('block-upload')){
                formSubmit.uploadNode.slideDown();
            }
            if($(target).hasClass('upload-btn')){
                //3.16
            //   formSubmit.uploadNode.slideDown();
                $('.pattern-con').fadeIn();
            }
            //3.16
            if($(target).hasClass('JS-pattern1')){
                    $('.pattern-con').fadeOut();
                    $('.resourse').fadeIn();
            }
                if($(target).hasClass('JS-pattern2')){
                $('.pattern-con').fadeOut();
                formSubmit.uploadNode.fadeIn();
            }
            if($(target).hasClass('pattern-close')){
                $('.pattern-con').fadeOut();
            }
            if($(target).hasClass('re-title-close')){
                $('.resourse').fadeOut();
            }
            //3.16 up
        });
    }
};
var formSubmit={
    //预览窗口--previewNode 
    uploadNode:$('.upload-con'),
    previewNode:$('.upload-preview'),
    inputfileNode:$('#file'),
    inputtextNode:$('.upload-content'),
    uploadbtnNode:$('.upload-content-btn'),
    closeNode:$('.upload-close'),
    typeliNode:$('.upload-type li'),
    // getPath:function(obj){    
    //     if(obj){    
    //         if (window.navigator.userAgent.indexOf("MSIE")>=1)    
    //         {    
    //             obj.select();    
    //             return document.selection.createRange().text;    
    //         }   
    //         else if(window.navigator.userAgent.indexOf("Firefox")>=1)    
    //         {    
    //         if(obj.files){   
    //             return obj.files.item(0).getAsDataURL();    
    //         }    
    //             return obj.value;    
    //             }    
    //             return obj.value;    
    //     }    
    // },
    sortNode:$('.upload-sort'),
    sort:[
        {
            "showname":"中式",
            "id":1
        },
        {
            "showname":"欧式",
            "id":2
        }
    ],
    getsort:function(){
        //模拟 sort是ajax获取得到的分类数据
        var that=this;
        for(var i=0;i<that.sort.length;i++){
            that.sortNode.append('<option smallgroupid="'+that.sort[i].id+'">'+that.sort[i].showname+'</option>');
        }
    },
    getNameFun:function(str){
         var pos2=str.lastIndexOf('.');
        var name=str.slice(pos1+1,pos2);
        alert(name);
    },
    init:function(){
        var that=this;
        that.getsort();
        $('.upload-preview-title').click(function(){
            $('#file').trigger('click');
        })
        that.inputfileNode.change(function(){
            if(that.inputfileNode.val()==''){
                that.inputtextNode.val('未选择任何文件');
            }else{
                that.inputtextNode.val(that.inputfileNode.val());
                that.getNameFun(that.inputfileNode.val())
            }
        });
        // that.uploadbtnNode.click(function(){
        //     console.log('come in');
        //     if(that.inputtextNode.val()=='未选择任何文件'){
        //          alert('文件不能为空！ 请选择文件');
        //          return false;
        //     }else{
        //         // console.log('abbaba',String(that.inputtextNode.val()),that.inputfileNode.val());
        //         str=that.getPath(document.getElementById('file'));
        //         str=str.replace(/\\/g,"/");
        //         console.log('filePath',document.getElementById("file").files[0].name)
        //         that.previewNode.css({background:'url('+str+') no-repeat',backgroundSize:'contain',backgroundPosition:'center center'});
        //     }
        //     return true;
        // });
        //修改处 下下
        that.inputfileNode.change(function(){
            var file=this;
            if (file.files && file.files[0])
            {
                var reader = new FileReader();
                reader.onload = function(evt){
                    that.previewNode.html('<img src="' + evt.target.result + '" />'); 
                }  
                reader.readAsDataURL(file.files[0]);
            }
            else{
                // that.previewNode.css({filter:'progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src=\'' + file.value + '\''});
                that.previewNode.html('<div class="img" style="filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src=\'' + file.value + '\'"></div>');
            }
            
        });
        //修改处  上上
        that.closeNode.click(function(){
            that.uploadNode.slideUp();
        });
        that.typeliNode.click(function(){
            var pos=$(this).index();
            pos=pos==1?0:1;
            $(this).addClass('choose');
            that.typeliNode.eq(pos).removeClass('choose');
        });
    }
};

var sort={
    sortNode:$('#JS-sort'),
    opNode:$('#JS-sort').children(),
    submitNode:$('.addsort-submit'),
    cancelNode:$('.addsort-cancel'),
    addFun:function(type){
        var that=this;
        var length=that.sortNode.children().length-1;
        var length2=that.sortNode.children().length;
        $('#JS-sort option:last').remove();
        that.sortNode.append('<option value="'+length+'" type="'+type+'">'+type+'</option> <option value="'+length2+'" >----添加分类----</option>');
        // that.sortNode.append('<option>12</option>')
        that.sortNode=$('#JS-sort');
        that.sortNode.val('0');
    },
    selectFun:function(index){
        var that=this;
        var type=that.sortNode.children().eq(index).attr('type');
        that.reloadfurnitureFun(type);
    },
    reloadfurnitureFun:function(type){
        var that=replace;
        var w,h;
        that.ulNode.children('li').remove();
        for(var i=0;i<that.imgJson.length;i++){
            if(that.imgJson[i].type==type){
                w=125;
                h=that.imgJson[i].height/that.imgJson[i].width*w;
                if(h>75){
                    h=75;
                    w=that.imgJson[i].width/that.imgJson[i].height*h;
                }
                    that.ulNode.append('<li class="block-furniture JS-target-ele" style="background:url('+that.imgJson[i].url+') no-repeat;background-size:'+w+'px '+h+'px;background-position:center center;filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(  src='+that.imgJson[i].url+',sizingMethod=\'scale\');background:none\\9; "><a href="javascript:void(0)" class="block-furn-delete JS-target-ele" title="删除该家具"></a> <a href="javascript:void(0)" class="block-3d-show JS-target-ele" title="3D展示"></a> </li>')
                }
        }
    },
    init:function(){
        var that=this; 
        that.cancelNode.click(function(){
                $('.addsort-con').css('display','none');
                that.sortNode.val('0');
        });
        that.submitNode.click(function(){
            var bool=window.confirm('确定添加？');
            if(bool==true){
                var type=$('#addType').val();
                that.addFun(type);
                $('.addsort-con').css('display','none');
            }
        });
        that.sortNode.change(function(){
            // alert('aaaaa'+$('#JS-sort:selected')+this.selectedIndex+$('#JS-sort').val());
            if(this.selectedIndex==that.sortNode.children().length-1){
                //当点击‘添加类’时
                    $('.addsort-con').css('display','block');
            }
            if(this.selectedIndex>0&&this.selectedIndex<that.opNode.length-1){
                //当选择分类时
                that.selectFun(this.selectedIndex);
            }
            if(this.selectedIndex==0){
                //当选择全部时
                replace.loadfurnitureFun();
            }
        });
    },
}
var search={
    searchNode:$('.block-search-btn'),
    searchFun:function(context){
        var that=replace;
        var w,h;
        that.ulNode.children('li').remove();
        for(var i=0;i<that.imgJson.length;i++){
            if(that.imgJson[i].name==context){
            w=125;
            h=that.imgJson[i].height/that.imgJson[i].width*w;
            if(h>75){
                h=75;
                w=that.imgJson[i].width/that.imgJson[i].height*h;
            }
            that.ulNode.append('<li class="block-furniture JS-target-ele" style="background:url('+that.imgJson[i].url+') no-repeat;background-size:'+w+'px '+h+'px;background-position:center center;filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(  src='+that.imgJson[i].url+',sizingMethod=\'scale\');background:none\\9; "><a href="javascript:void(0)" class="block-furn-delete JS-target-ele" title="删除该家具"></a> <span class="block-show-title">'+that.imgJson[i].name+'</span><a href="javascript:void(0)" class="block-3d-show JS-target-ele" title="3D展示"></a> </li>')
            }
    }
    },
    init:function(){
        var that=this;
        that.searchNode.click(function(){
            var context=$('#search').val();
            that.searchFun(context);
        });
    }
}
var circle={
    initCount:0,
    data:[
        {
            url:'img/bed.png',
            width:"618",
            height:"408"
        },
        {
            url:'img/bed3.png',
            width:"618",
            height:"408"
        },
        {
            url:'img/bed4.png',
            width:"618",
            height:"408"
        },
        {
            width:400,
            height:249,
            url:'img/desk.png',
        }
    ],
    clickFun:function(node){
        var that=this;
        var calculate,bacConut;
        var sWidth=document.body.clientWidth;
        var w,h;
        if(node.hasClass('circle-left')){
            calculate=1;
        }else{
            calculate=-1;
        }
        that.initCount=that.initCount+calculate;
        if(that.initCount==-1){
            that.initCount=that.data.length-1;
        }
        else if(that.initCount==that.data.length){
            that.initCount=0;
        }
        w=(that.data[that.initCount].width)*sWidth/(move.imgJson[0].width);
        h=sWidth/move.imgJson[0].width*that.data[that.initCount].height;
        $('.JS-target').css({'background-image':'url('+that.data[that.initCount].url+')','width':w+'px','height':h+'px','backgroundSize':w+'px','filter': 'progid:DXImageTransform.Microsoft.AlphaImageLoader(  src='+that.data[that.initCount].url+',sizingMethod=\'scale\')'});
    }
}
var zIndex={
    max:1000,
    min:1001,
    zTop:function(node){
        node.css({"z-index":this.max+1});
        this.max=this.max+1;
    },
    zBottom:function(node){
        var that=this;
        node.css({"zIndex":this.min-1});
        this.min=that.min-1;
    },
    zUp:function(node){
        var z= parseInt(node.css("zIndex"))+1;
        node.css({"zIndex":z});
    },
    zDown:function(node){
         var z= parseInt(node.css("zIndex"))-1;
        node.css({"zIndex":z});
    },
    setMinMaxFun:function(index){
        var that=this;
        if(index<that.min){
            that.min=index;
        }
        if(index>that.max){
            that.max=index;
        }
    }
}
var resourse={
        startX:null,
        startY:null,
        targetNode:null,
        clickFlag:0,
        createFlag:0,
        reArr:null,
        reData:[
            {
                name1:["椅子","田园风"],
                name2:["床","欧式风"],
                name3:["桌子","日式风"],
                name4:["沙发","简约风","欧式风"]
            },
            {
                FurType:"椅子",
                FurId:"",
                FurName:"田园风椅子",
                FurStyle:"田园风",
                FurWidth:"400",
                FurHeight:"249",
                FurUrl:"img/desk.png"
            },
            {
                FurType:"床",
                FurId:"",
                FurName:"欧式床",
                FurStyle:"欧式风",
                FurWidth:"618",
                FurHeight:"408",
                FurUrl:"img/bed.png"
            },
            {
                FurType:"床",
                FurId:"",
                FurName:"欧式木床",
                FurStyle:"欧式风",
                FurWidth:"618",
                FurHeight:"408",
                FurUrl:"img/bed.png"
            },
            {
                FurType:"桌子",
                FurId:"",
                FurName:"日式风木桌",
                FurStyle:"日式风",
                FurWidth:"400",
                FurHeight:"249",
                FurUrl:"img/desk.png"
            },
            {
                FurType:"沙发",
                FurId:"",
                FurName:"欧式风真皮沙发",
                FurStyle:"欧式风",
                FurWidth:"544",
                FurHeight:"395",
                FurUrl:"img/sofa.png"
            },
            {
                FurType:"沙发",
                FurId:"",
                FurName:"简约风真皮沙发",
                FurStyle:"简约风",
                FurWidth:"544",
                FurHeight:"395",
                FurUrl:"img/sofa.png"
            }
        ],
        loadFurn2Fun:function(){
          var that=this;
          if(that.reData!=null){
                //对reData进行转化 JSON.parse
                //对现有家具类 分析操作 方便插入
                var reType=that.reData[0];
                var arr=new Array();
                var k=0;
                for( i in reType){
                    arr[k]=new Array();
                    for(var j=0;j<reType[i].length;j++){
                        arr[k][j]=reType[i][j];
                    }
                    k++;
                }
                that.reArr=arr;
                //插入框架
                var str='';
                for(var i=0;i<arr.length;i++){
                    str+='<li class="menu-oneLevel">'+
                    '<a class="menu-title  JS-menuBtn" href="javascript:void(0)"><i class="status-up " >状态.图标（是否展开）</i>'+arr[i][0]+'</a>'+
                    '<ul class="menu-twoLevel-con">'
                    for(var j=1;j<arr[i].length;j++){
                        str+='<li class="menu-twoLevel">'+
                            '<a class="menu-title JS-menuBtn" href="javascript:void(0)"><i class="status-up ">状态图标（是否展开）</i>'+arr[i][j]+'</a>'+
                            '<ul class="menu-threeLevel-con"></ul>'
                    }
                    str+='</ul></li>';
                }
                $('.re-menu').append(str);
                //在框架中插入家具
                var pos1,pos2;
                for(var i=1;i<that.reData.length;i++){
                    for(var j=0;j<arr.length;j++){
                        if(arr[j][0]==that.reData[i].FurType){
                            pos1=j;
                            break;
                        }
                    }
                    pos2=arr[pos1].indexOf(that.reData[i].FurStyle)-1;
                    $('.re-menu').children('.menu-oneLevel').eq(pos1).children('ul').children('li').eq(pos2).children('.menu-threeLevel-con').append('<li reDataId="'+i+'" class="menu-threeLevel" style="background-image:url('+that.reData[i].FurUrl+')"><i>'+that.reData[i].FurName+'</i></li>');
                }
            }
        },
        loadFurFun:function(){
            var that=this;
            if(that.reData==null){
                //3.16ajax
                $.ajax({
                    url:'{$Think.config.__SITEURL__}?&a=groupjson&cjid={$ProjectInfo.id}',
                    type:'post',
                    success:function(data){
                        that.reData=JSON.parse(data);
                        that.loadFurn2Fun();
                    },
                    error:function(xmlhttp,status,error){
                        console.log('ajax fail');
                        console.log(xmlhttp,status,error)
                    }
                });
            }else{
                that.loadFurn2Fun();
            }
            
            
        },
        statusFun:function(node){
            //判断 展开 还是收回
            var that=this;
            if(node.hasClass('JS-menuShow')==true){
                //已经展开,需要收回
                node.removeClass('JS-menuShow');
                node.children('i').removeClass('status-expand');
            }else{
                //未展开，需要展开
                node.addClass('JS-menuShow');
                node.children('i').addClass('status-expand');
            }
        },
        searchFun:function(){
            var that=this;
            var keyword=$('.re-search-text').val();
            $('.resourse').addClass('JS-reStatus2');
            var node=$('.search-menu');
            node.children().remove();
            if(that.reData!=null){
                for(var i=1;i<that.reData.length;i++){
                    if(that.reData[i].FurName.match(keyword)!=null){
                        node.append('<li class="menu-threeLevel" style="background-image:url('+that.reData[i].FurUrl+')"><i title="'+that.reData[i].FurName+'">'+that.reData[i].FurName+'</i></li>');
                    }
                }
            }
        },
        addFurFun:function(x,y){
            var that=this;
            var sWidth=document.body.clientWidth;
            var width=0;
            var h;
            var reIndex=that.targetNode.attr('reDataId');
            var w=that.reData[reIndex].FurWidth*sWidth/(move.imgJson[0].width);
            h=sWidth/move.imgJson[0].width*parseInt(that.reData[reIndex].FurHeight);
            var l=x-w/2;
            var t=y-h/2;
            //3.3
            move.imgJson[move.imgJson.length-1].left=l;
            move.imgJson[move.imgJson.length-1].top=t;
            style=' style="z-index:'+zIndex.max+';left:'+l+'px;top:'+t+'px;width:'+w+'px;height:'+h+'px;background:url('+that.reData[reIndex].FurUrl+')  no-repeat;background-size:'+w+'px; filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(  src='+that.reData[reIndex].FurUrl+',sizingMethod=\'scale\');background:none\\9;"';
            $('.container').append('<div id="'+that.reData[reIndex].FurId +'" typeid="'+that.reData[reIndex].Furtypeid+'" jjid="'+ that.reData[reIndex].Furjjid+'" jjgid="'+that.reData[reIndex].Furjjgroupid+'" name="'+that.reData[reIndex].FurName+'" '+style+' class="JS-move container-ele"><span class="JS-target-ele"></span><span class="JS-target-ele"></span><span class="JS-target-ele"></span><span class="JS-target-ele"></span><i class="circle-left JS-target-ele">左转</i><i class="circle-right JS-target-ele">右转</i></i>'+
                '<a href="javascript:void(0)" class="JS-a JS-target-ele">替换家具</a><a href="javascript:void(0)" class="JS-b JS-target-ele types">样式</a><b class="JS-target-ele JS-TTop">置顶</b><b class="JS-target-ele JS-UUp">上一层</b><b class="JS-target-ele JS-DDown">下一层</b><b class="JS-target-ele JS-BBottom">置底</b></div>');
        },
        reMouseDownFun:function(e){
            var that=this;
            var e=window.event||e;
            var target=e.target||e.srcElement;
            that.startX=e.clientX;
            that.startY=e.clientY;
            // console.log('at the beginning',that.startX,that.startY)
            that.clickFlag=1;
            that.targetNode=$(target);
        },
        reMouseMoveFun:function(e){
            var that=this
            var e=window.event||e;
            var target=e.target||e.srcElement;
            // console.log('is a test',that.startX-e.clientX,e.clientY-that.startY)
            var distance=Math.sqrt(Math.pow(that.startX-e.clientX,2)+Math.pow(e.clientY-that.startY,2));
            if(distance>170){
                //满足该条件时 创建  
                if(that.createFlag==0){
                    that.createFlag=1;
                    var reIndex=that.targetNode.attr('reDataId');
                    var dd={
                        height:that.reData[reIndex].FurHeight,
                        id:that.reData[reIndex].FurId,
                        layer:'',
                        left:'',
                        name:that.reData[reIndex].FurName,
                        top:'',
                        url:that.reData[reIndex].FurUrl,
                        width:that.reData[reIndex].FurWidth
                    }
                    move.imgJson[move.imgJson.length]=dd;
                    that.addFurFun(e.clientX,e.clientY);
                    
                }else{
                    var w=parseInt($('.container div:last').css('width'));
                    var h=parseInt($('.container div:last').css('height'));
                    $('.container div:last').css({left:e.clientX-w/2+'px',top:e.clientY-h/2+'px'});
                }
            }
        },
        reMouseUpFun:function(e){
            var that=this;
            var event=window.event||e;
            var target=event.target||event.srcElement;
            that.clickFlag=0;
            that.targetNode=null;
            that.createFlag=0;
        },
        init:function(){
            var that=this;
            that.loadFurFun();
            $(document).click(function(e){
                var e=window.event||e;
                var target=e.target||e.srcElement;
                if($(target).hasClass('JS-menuBtn')){
                    that.statusFun($(target));
                }
                if($(target).parent().hasClass('JS-menuBtn')){
                    that.statusFun($(target).parent());
                }
                if($(target).hasClass('re-search-btn')){
                    that.searchFun();
                }
                if($(target).hasClass('re-search-return')){
                    $('.resourse').removeClass('JS-reStatus2');
                }
                if($(target).hasClass('menu-threeLevel')){
                    that.reMouseMoveFun(e);
                }
            });
        }
    }   

resourse.init();
replace.init();
move.init();
search.init();
formSubmit.init();
sort.init();

zoom.init();
operate.init();

zoom.init();
