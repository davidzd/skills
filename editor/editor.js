var dragMe={

    draggables:[],
    currentDrag:null,
    selectedElement:null,
    startPoint:{x:0,y:0},
    panel:null,
    init:function(){
        this.draggables = $('[draggable]').each(function(elem){
            $(this).on('mousedown',dragMe.start);
        });

        $(window)
            .on('mousedown',dragMe.unselect)
            .on('mouseup',dragMe.end)
            .on('mousemove',dragMe.move);



        dragMe.panel = $('#propanel');
        dragMe.panel.e_title = $('#title');
        dragMe.panel.on('mousedown',function(event){
            event.stopPropagation();
        });
        dragMe.panel.hide();
        $('#grid').toggle($('#showgrid')[0].checked);
        $('#showgrid').change(function(){$('#grid').toggle(this.checked)});

    },
    start:function(event){

        event.stopPropagation();
        event.preventDefault();

        if(dragMe.currentDrag!=null){
            dragMe.end();
            return;
        }

        dragMe.unselect();
        dragMe.select($(this));

        dragMe.currentDrag = $(this).css({'z-index':100000,'position':'absolute'});
        dragMe.startPoint = {
            x:event.clientX - this.offsetLeft,
            y:event.clientY - this.offsetTop
        };
    },
    select:function(element){
        dragMe.selectedElement = element;
        dragMe.selectedElement.addClass('selected');

        dragMe.panel.show();
        dragMe.panel.e_title.val(element.html());
    },
    unselect:function(event){
        if(dragMe.selectedElement) {
            dragMe.selectedElement.removeClass('selected');
            dragMe.selectedElement = null;
        }
        dragMe.panel.hide();
    },
    move:function(event){
        if(dragMe.currentDrag==null)return;
        dragMe.currentDrag.css({
            left: dragMe.okr(event.clientX - dragMe.startPoint.x, 10) + 'px',
            top:dragMe.okr(event.clientY-dragMe.startPoint.y,10)+'px'
        });
    },
    okr:function(num,to){
        return Math.round(num/to)*to;
    },
    end:function(){
        if(dragMe.currentDrag==null)return;
        dragMe.currentDrag.css('z-index','');
        dragMe.currentDrag=null;
    }
};



$(function(){
    dragMe.init();
});