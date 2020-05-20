var config = {
    content: [{
        type: 'column',
        isClosable: false,
        content: [
        ]
    }]
};
var myLayout = new window.GoldenLayout(config, $('#layoutContainer'));

myLayout.registerComponent('sl-chat', function (container, state) {
    container.getElement().html('<h2>sl-chat</h2>');
});

myLayout.addMenuItem = function (title, text, htmlCode) {

    var newItemConfig = {
        title: title,
        type: 'component',
        componentName: text,
        componentState: {text: text}
    };

    myLayout.registerComponent(text, function (container, state) {
        container.getElement().html('<h2>' + htmlCode + '</h2>');
    });
    myLayout.root.contentItems[0].addChild(newItemConfig);
};


