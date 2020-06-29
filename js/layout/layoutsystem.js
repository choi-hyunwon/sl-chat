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


