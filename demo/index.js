var toc = $('.toc').Catalog({
    container: '#example',
    // listen: '.aaa',
    active: 'current',
    data: [
        {
            item: 'li',
            title: '.title'
        },
        {
            item: '.item',
            title: 'span'
        }
    ],
    callBack: function () {
        console.log(1);
    }
});

toc.Catalog().on('click', function () {
    console.log(1);
});

