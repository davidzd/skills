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

        $('#jsonimport').on('mousedown',function(e){
            e.stopPropagation();
            console.log('Import');
        });

        $('#jsonexport').on('mousedown',function(e){
            e.stopPropagation();
            $('#copypaste').show().find('#values').html(JSON.stringify(skilltree.buildJSON()));
        });

        $('#copypaste').on('mousedown',function(e){e.stopPropagation();});

        $('#creanode').on('mousedown',function(e){
            e.stopPropagation();
            console.log('New');
        });


        $('#delnode').on('mousedown',function(e){
            e.stopPropagation();
            if(confirm('Delete the '+dragMe.selectedElement.attr('id')+' node?')){
                dragMe.del();
            }
        });

        dragMe.spritePanel = $('#sprite_selector').hide();
        dragMe.spritePanel.area = dragMe.spritePanel.find('.area')[0];
        dragMe.spritePanel.selector = $(dragMe.spritePanel.area).find('.selector');
        dragMe.spritePanel.appl = dragMe.spritePanel.find('a')[0];
        dragMe.spritePanel.appl.onmousedown = function(){
            console.log(dragMe.spritePanel.x,dragMe.spritePanel.y);
            dragMe.spritePanel.hide();
        };

        dragMe.spritePanel.area.onmousedown = function(event){
            event.stopPropagation();

            var coords = $(this).offset();

            var x = Math.floor((event.clientX-coords.left)/$(this).width()*10);
            var y = Math.floor((event.clientY-coords.top)/$(this).height()*10);
            dragMe.spritePanel.x=x;dragMe.spritePanel.y=y;
            dragMe.spritePanel.selector.css({left:(x*10)+'%',top:(y*10)+'%'});
            $(dragMe.spritePanel.appl).html('Ok ('+x+'x'+y+')');

        }

        dragMe.panel = $('#propanel');

        dragMe.panel.e_title = $('#title');
        dragMe.panel.e_id = $('#elid');
        dragMe.panel.e_useabbr = $('#useabbr');
        dragMe.panel.e_abbr = $('#abbr');
        dragMe.panel.e_hints = $('#hints');
        dragMe.panel.e_sprite = $('#sprite_image');

        dragMe.panel.on('mousedown',function(event){
            event.stopPropagation();
        });

        dragMe.panel.e_sprite.on('mousedown',function(event){
            dragMe.spritePanel.show();
        });

        dragMe.unselect();

        $('#grid').toggle($('#showgrid')[0].checked);
        $('#showgrid').change(function(){$('#grid').toggle(this.checked)});

    },
    del:function(){
        dragMe.selectedElement.remove();
        dragMe.unselect();
        skilltree.renderAll();
    },

    dragLocked:true,

    start:function(event){

        event.stopPropagation();
        event.preventDefault();

        if(dragMe.currentDrag!=null){
            dragMe.end();
            return;
        }

        // Preventing node movement on selection

        dragMe.dragLocked = true;
        setTimeout(function(){dragMe.dragLocked=false;},200);

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

        var elementData = skilltree.buildJSONOfElement(element);

        dragMe.panel.e_title.val(element.attr('name'));
        dragMe.panel.e_id.val(element.attr('id'));
        dragMe.panel.e_abbr.val(element.attr('abbr'));

        console.log(elementData);

        dragMe.panel.e_hints.html('');
        if(elementData.hint) {
            dragMe.panel.e_hints.html('<label>Hints <a onclick="dragMe.newHint();">Add New</a> </label>');
            elementData.hint.forEach(function (e) {
                var lvl = e.level;
                if(lvl==undefined)lvl='';
                dragMe.panel.e_hints.append('<div class="hint_body"><input type="text" value="' + lvl + '"><textarea>'+e.text+'</textarea></div>');
            });
        }

        $('#delnode').show();


    },
    newHint:function(){
        console.log('Hey');
    },
    unselect:function(event){
        if(dragMe.selectedElement) {
            dragMe.selectedElement.removeClass('selected');
            dragMe.selectedElement = null;
        }
        dragMe.spritePanel.hide();
        $('#copypaste').hide();
        $('#delnode').hide();
        dragMe.panel.hide();
    },
    move:function(event){
        if(dragMe.currentDrag==null || dragMe.dragLocked)return;
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