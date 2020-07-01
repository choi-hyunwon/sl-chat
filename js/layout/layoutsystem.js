var config = {
    content: [{
        type: 'column',
        isClosable: false,
        content: [
        ]
    }]
};
var myLayout = new window.GoldenLayout(config, $('#container_system'));

myLayout.addMenuItem = function (title, id) {
    var newItemConfig = {
        title: title,
        type: 'component',
        componentName: id,
        componentState: {text: id}
    };
    myLayout.root.contentItems[0].addChild(newItemConfig);

};
// myLayout.on( 'stackCreated', function( stack ){
//     var container = stack.contentItems[0].element;
//     console.log(container.find('.lm_content'));
//     container.find('.lm_content').text('hello!');
// })

myLayout.grid = function() {
    var oldElement = myLayout.root.contentItems[ 0 ],
        newElement = myLayout.createContentItem({
            type: 'column',
            content: [{
                type:'row',
                content: []
            },{
                type:'row',
                content: []
            }]
        }),
        i;
    var stacks = oldElement.getItemsByType( 'stack' );
    var rows = newElement.getItemsByType( 'row' );
    myLayout.root.replaceChild( oldElement, newElement );

    rows[ 0 ].addChild( stacks[ 0 ] );
    rows[ 0 ].addChild( stacks[ 1 ] );
    rows[ 1 ].addChild( stacks[ 2 ] );
    rows[ 1 ].addChild( stacks[ 3 ] );
};

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