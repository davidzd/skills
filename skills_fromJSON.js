skilltree.fromJSON = function (jsonObject, parentElement) {
    for (var id in jsonObject) {

        var elem = jsonObject[id];
        var node = skill(id);
        if (typeof elem.hint != 'undefined') {
            for (var idx in elem.hint) {
                var temp = elem.hint[idx];
                if (temp.type == 'raw')node.hintBody(temp.text);
                else node.hint(temp.text, temp.level);

            }
        }

        if (typeof elem.name != 'undefined')node.name(elem.name);
        if (typeof elem.max != 'undefined')node.max(elem.max);
        if (typeof elem.sprite != 'undefined')node.sprite(elem.sprite[0], elem.sprite[1]);
        if (typeof elem.sprites != 'undefined')node.sprites(elem.sprites);
        if (typeof elem.pos != 'undefined')node.pos(elem.pos[0], elem.pos[1]);
        if (typeof elem.current != 'undefined')node.current(elem.current);
        if (typeof elem.mustHave != 'undefined')node.mustHave(elem.mustHave);
        if (typeof elem.dependency != 'undefined')node.dependency(elem.dependency);
        if (typeof elem.className != 'undefined')for (var idx in elem.className)node.className(elem.className[idx]);
        if (typeof elem.param != 'undefined')for (var idx in elem.param)node.param(idx, elem.param[idx]);

        node.$(parentElement);
    }
    return this;
}


skilltree.buildFromJSON = function(url,parentElement){

    $.getJSON(url)
        .done(function( jsonObject ) {
            skilltree.fromJSON(jsonObject, parentElement).init(parentElement);
        })
        .fail(function( jqxhr, textStatus, error ) {
            console.error( "JSON request Failed: " + textStatus + ", " + error );
        }
    );

}