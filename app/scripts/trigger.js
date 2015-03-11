'use strict';

define('trigger', ['jquery'], function($) {
    function trigger(obj, network, id) {
        return $(obj)
            .data('deckard_network', network)
            .data('deckard_id', id)
            .click(function() {
                chrome.runtime.sendMessage({ msg: 'interest', interested: true });
            })
            .mouseenter(function() {
                chrome.runtime.sendMessage({ msg: 'load', network: network, id: id });
            })
            .mouseleave(function() {
                chrome.runtime.sendMessage({ msg: 'interest', interested: null });
            });
    }

    return trigger;
});
