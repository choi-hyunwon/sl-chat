var config = {
    content: [{
        type: 'column',
        isClosable: false,
        content: [
        ]
    }]
};
var myLayout = new window.GoldenLayout(config, $('#container_system'));


myLayout.on( 'stateChanged', function(a){
    if (!a) { return false };
    var p = a.origin.contentItems[0].parent;
    // console.log(p)
    for (i=0; i<p.contentItems.length; i++){
        var h = p.contentItems[i].element.height();
        // console.log(i)
        console.log(h)
        p.contentItems[i].element.find('iframe').height(h-20);
    }
});

myLayout.addMenuItem = function (title, id) {
    var aPanel = myLayout.root.contentItems[0].contentItems;
    var nSize = aPanel.length;
    var newItemConfig = {
        title: title,
        type: 'component',
        componentName: id,
        componentState: {text: id}
    };
    if( nSize < 3) {
        for (i = 0; i < nSize; i++ ) {
            if (myLayout.root.contentItems[0].contentItems[i].isMaximised) {
                myLayout.root.contentItems[0].contentItems[i].toggleMaximise();}
        }
        myLayout.root.contentItems[0].addChild(newItemConfig);
    } else if (nSize === 3) {
        myLayout.root.contentItems[0].contentItems[0].addChild(newItemConfig);
    }
};
// myLayout.on( 'stackCreated', function( stack ){
//     var container = stack.contentItems[0].element;
//     console.log(container.find('.lm_content'));
//     container.find('.lm_content').text('hello!');
// })

myLayout.toggleRowCol = function() {

    var oldElement = myLayout.root.contentItems[ 0 ],
        newElement = myLayout.createContentItem({
            type: oldElement.isRow ? 'column' : 'row',
            content: []
        }),
        i;
    newElement.isInitialised = true;
    for( i = 0; i < oldElement.contentItems.length; i++ ) {
        newElement.addChild( oldElement.contentItems[ i ] );
    }
    myLayout.root.replaceChild( oldElement, newElement );
};

$('.btn_row,.btn_col').on('click', function () {
    if (!$(this).hasClass('active') ){
        myLayout.toggleRowCol();
        $(this).addClass('active')
            .siblings().removeClass('active');
    }
});
$('.btn_grid').on('click', function () {
    if (!$(this).hasClass('active') ){
        myLayout.grid();
        $(this).addClass('active')
            .siblings().removeClass('active');
    }
});