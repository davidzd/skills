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
            console.log('Import')
        });

        $('#jsonexport').on('mousedown',function(e){
            e.stopPropagation();
            console.log('Export')
        });

        $('#creanode').on('mousedown',function(e){
            e.stopPropagation();
            console.log('New');
        });

        $('#delnode').on('mousedown',function(e){
            e.stopPropagation();
            console.log('Del');
        });

        dragMe.spritePanel = $('#sprite_selector').hide();
        dragMe.spritePanel.area = dragMe.spritePanel.find('.area')[0];
        dragMe.spritePanel.selector = $(dragMe.spritePanel.area).find('.selector');
        dragMe.spritePanel.appl = dragMe.spritePanel.find('a')[0];
        dragMe.spritePanel.appl.onmousedown = function(){
            dragMe.spritePanel.hide();
        };

        dragMe.spritePanel.area.onmousedown = function(event){
            event.stopPropagation();

            var coords = $(this).offset();

            var x = Math.floor((event.clientX-coords.left)/$(this).width()*10);
            var y = Math.floor((event.clientY-coords.top)/$(this).height()*10);
            dragMe.spritePanel.selector.css({left:(x*10)+'%',top:(y*10)+'%'});
            $(dragMe.spritePanel.appl).html('Ok ('+x+'x'+y+')');

        }

        dragMe.panel = $('#propanel');

        dragMe.panel.e_title = $('#title');
        dragMe.panel.e_id = $('#elid');
        dragMe.panel.e_useabbr = $('#useabbr');
        dragMe.panel.e_abbr = $('#abbr');
        dragMe.panel.e_hints = $('#hints');

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

        var elementData = skilltree.buildJSONOfElement(element);

        dragMe.panel.e_title.val(element.attr('name'));
        dragMe.panel.e_id.val(element.attr('id'));
        dragMe.panel.e_abbr.val(element.attr('abbr'));

        dragMe.panel.e_hints.html('');
        if(elementData.hint) {
            dragMe.panel.e_hints.html('<label>Hints</label>');
            elementData.hint.forEach(function (e) {
                dragMe.panel.e_hints.append('<input type="text" value="' + e.text + '">');
            });
        }

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