function createContextMenu(menus) {
    let clazzCustomMenu = 'custom-menu-' + new Date().getTime();
    let html ='';
    html += '<ul class="custom-menu ' + clazzCustomMenu + '">';
    for (let idx = 0; idx < menus.length; idx++){
        html += '<li data-key="' + menus[idx].key + '"> ' + menus[idx].text + ' </li>';
    }
    html += '</ul>';
    $('body').append(html);
    return clazzCustomMenu;
};

function setContextMenu(objHandle, menus, cb) {
    let clazzCustomMenu = createContextMenu(menus);

    objHandle.bind('contextmenu', function (event) {
    
        // Avoid the real one
        event.preventDefault();
        
        // Show contextmenu
        $('.' + clazzCustomMenu).finish().toggle(10).
        
        // In the right position (the mouse)
        css({
            top: event.pageY + 'px',
            left: event.pageX + 'px'
        });
    });
    
    
    // If the document is clicked somewhere
    objHandle.bind('mousedown', function (e) {
        
        // If the clicked element is not the menu
        if (!$(e.target).parents('.' + clazzCustomMenu).length > 0) {
            
            // Hide it
            $('.' + clazzCustomMenu).hide(10);
        }
    });

    // If the menu element is clicked
    $('.' + clazzCustomMenu + ' li').click(function(){    
        // Hide it AFTER the action was triggered
        $('.' + clazzCustomMenu).hide(10);

        cb($(this).attr('data-key'));
    });
}
