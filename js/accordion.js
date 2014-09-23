window.onload = function() {
    'use strict';

    var accordionContainer = document.querySelector('.accordion');

    /**
     * Hides all content panes in current accordion container.
     * @params {array} contentPanes - The panes to hide.
     */
    function hidePanes(contentPanes) {
        var panesLength = contentPanes.length;

        for (var i = 0; i < panesLength; i++) {
            var classArray = contentPanes[i].getAttribute('class').split(/\s/);
            var index = classArray.indexOf('show');

            if (index > -1) {
                classArray.splice(index, 1);
                // we are collapsing so, update aria-expanded
                contentPanes[i].setAttribute('aria-hidden', 'true');
                // @see https://developer.mozilla.org/en-US/docs/Web/API/NonDocumentTypeChildNode.previousElementSibling
                contentPanes[i].previousElementSibling.setAttribute('aria-expanded', 'false');
            }
            contentPanes[i].setAttribute('class', classArray.join(' '));
        }
    }

    /**
     * Shows the triggered content pane.
     * @params {object} pane - The pane to show.
     */
    function showPane(pane) {
        var classes = pane.getAttribute('class');
        pane.setAttribute('class', classes + ' show');
        // as this pane is now expanded, update aria-hidden.
        pane.setAttribute('aria-hidden', 'false');
        pane.focus();
    }

    /**
     * Handles all events triggered within the accordion container.
     * @params {object} event - The event that was fired.
     */
    function handleEvent(event) {
        var anchor = event.target;
        var parent = event.target.parentNode;
        var parentRole = parent.getAttribute('role');

        // only handle event if the parent has a role of tab.
        if (parentRole === 'tab') {
            var contentPanelId = anchor.getAttribute('href');

            // set the newly selected tab as expanded and selected.
            parent.setAttribute('aria-expanded', 'true');
            parent.setAttribute('aria-selected', 'true');

            // hide all the panes
            hidePanes(accordionContainer.querySelectorAll('.content-pane'));

            // show the selected pane
            showPane(document.querySelector(contentPanelId));
        }
    }

    /**
     * Handles events delegated to the accordion.
     * @param {object} event - The event to handle
     */
    function handleKeyboardEvent(event) {
        // Chrome does not support event.key so, we fallback to keyCode
        var key = event.key ? event.key : event.keyCode;

        // handle enter and spacebar keys.
        if ((key === 13 || key === 32) ||
            (key === 'Enter' || key === 'Spacebar')) {
            handleEvent(event);
        }
    }

    /**
     * Delegates keyboard events either back to the browser or, stops propogation
     * and calls handleKeyboardEvent to handle the key event.
     * @params {object} event - The event to delegate
     */
    function delegateKeyEvents(event) {
        var key = event.key ? event.key : event.keyCode;

        switch(key) {
            case 13:
            case 32:
            case 'Enter':
            case 'Spacebar':
                event.stopPropagation();
                handleKeyboardEvent(event);
                return false;
        }
        return true;
    }

    accordionContainer.addEventListener('click', function(event) {
        event.preventDefault();
        handleEvent(event);
    }, false);

    accordionContainer.addEventListener('keyup', function(event) {
        delegateKeyEvents(event);
    });

    accordionContainer.addEventListener('keydown', function(event) {
        delegateKeyEvents(event);
    });
};
