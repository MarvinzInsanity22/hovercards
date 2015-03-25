'use strict';

describe('youtube-video-button', function() {
    var sandbox = sinon.sandbox.create();
    var trigger;
    var button;
    var youtubeVideoButton;

    beforeEach(function(done) {
        require(['Squire'], function(Squire) {
            new Squire()
                .mock('trigger', trigger = sandbox.stub().returns($('<div></div>')))
                .require(['youtube-video-button'], function(_youtubeVideoButton) {
                    $('<div id="sandbox"></div>').appendTo('body');
                    $('<div id="video"></div>').appendTo('#sandbox');
                    sandbox.useFakeTimers();
                    sandbox.stub(chrome.runtime, 'sendMessage');
                    youtubeVideoButton = _youtubeVideoButton;
                    button = youtubeVideoButton('#video', 'VIDEO_ID').appendTo('#sandbox');
                    done();
                });
        });
    });

    afterEach(function() {
        $('#sandbox').remove();
        sandbox.restore();
    });

    it('should be transparent', function() {
        button.should.have.css('opacity', '0');
    });

    it('should have position absolute', function() {
        button.should.have.css('position', 'absolute');
    });

    it('should have inner content', function() {
        button.should.have.descendants('div');
    });

    it('should be a trigger', function() {
        trigger.should.have.been.calledOnce;
        trigger.should.have.been.calledWith(sinon.match.any, 'youtube-video', 'VIDEO_ID');
    });

    it('should strip weird query parameters', function() {
        youtubeVideoButton('#video', 'VIDEO_ID&fs=1').appendTo('#sandbox');
        trigger.should.have.been.calledTwice;
        trigger.should.not.have.been.calledWith(sinon.match.any, sinon.match.any, 'VIDEO_ID&fs=1');
    });

    describe('when click', function() {
        beforeEach(function() {
            button.click();
        });

        it('should send interested message', function() {
            chrome.runtime.sendMessage.should.have.been.calledWith({ msg: 'interested' });
        });
    });

    describe('when mouseenter', function() {
        beforeEach(function() {
            $('#video').offset({ top: 10, left: 11 });
            button.mouseenter();
        });

        it('should be opaque', function() {
            button.should.have.css('opacity', '1');
        });

        it('should be at the video\'s position', function() {
            button.offset().should.deep.equal($('#video').offset());
        });
    });

    describe('when mouseleave', function() {
        beforeEach(function() {
            button.mouseenter().mouseleave();
        });

        it('should be transparent', function() {
            button.should.have.css('opacity', '0');
        });
    });

    describe('when video mouseenter', function() {
        beforeEach(function() {
            $('#video').mouseenter();
        });

        it('should be opaque', function() {
            button.should.have.css('opacity', '1');
        });

        it('should fade out starting 2 seconds after', function() {
            sandbox.clock.tick(2000);
            button.should.have.css('opacity', '1');
            $('#sandbox > .hovertoast-youtube-video-button:animated').should.exist;
            // TODO Detect that the animation is the one we want
        });
    });

    describe('when video mouseleave', function() {
        beforeEach(function() {
            $('#video').mouseenter().mouseleave();
        });

        it('should be transparent', function() {
            button.should.have.css('opacity', '0');
        });
    });
});
