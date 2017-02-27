const os = require('os');
const shell = require('electron').shell;
const ipc = require('electron').ipcRenderer;
const remote = require('electron').remote;
Engine = null;

(function () {
    Engine = remote.getGlobal('Engine');
    // Initialize
    var LANGUAGE_VARS = remote.getGlobal('LANGUAGE_VARS');

    // Document elements
    var closeBtn = document.getElementsByClassName('close');
    var langvars = document.getElementsByClassName('lang-appname');

    for (var key in LANGUAGE_VARS) {
        var elements = document.querySelectorAll('.lang-' + key);

        Array.prototype.forEach.call(elements, function (element, index) {
            element.innerHTML = LANGUAGE_VARS[key];
        });
    }

    closeBtn[0].addEventListener('click', function () {
        ipc.send('windowCloseEvent', {});
    });

})();

var pluginSettings = {};

jQuery(function () {
    jQuery.fn.extend({
        animateCss: function (animationName, onCompleteClass, onCompleteCallback) {
            var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
            this.addClass('animated ' + animationName).one(animationEnd, function () {
                jQuery(this).removeClass('animated ' + animationName);

                if(onCompleteClass)
                    jQuery(this).addClass(onCompleteClass);

                if(onCompleteCallback)
                    onCompleteCallback();
            });

            return this;
        }
    });

    jQuery('.main-heading').animateCss('bounceInLeft show');

    var moveToNextSection = function() {
        // Write Settings
        Engine.FeedConfig('ResourcesPath', './res', 'PATHS');
        Engine.FeedConfig('MyBBPath', 'C:/wamp64/www/mybb18', 'PATHS');

        Engine.FeedConfig('PluginWebsite', jQuery('input[name="plugin-site"]').val(), 'PLUGINSETTINGS');
        Engine.FeedConfig('AuthorSite', jQuery('input[name="author-site"]').val(), 'PLUGINSETTINGS');
        Engine.FeedConfig('Author', jQuery('input[name="author"]').val(), 'PLUGINSETTINGS');
        //Engine.FeedConfig('Compatibility', jQuery('input[name="plugin-site"]').val(), 'PLUGINSETTINGS');
        Engine.WriteConfig();

        var curr = jQuery('section.current');
        var next = jQuery( '.' + jQuery('section.current').attr('data-next') );

        curr.animateCss('bounceOutLeft', 'hide', function(){
            next.removeClass('hide').addClass('show').animateCss('bounceInRight').addClass('current');
        }).removeClass('current');
    };

    // Write any already defined settings to the Screen
    if( ( pluginSettings = Engine.GetSettings('PLUGINSETTINGS') ) !== null ) {
        jQuery('input[name="plugin-site"]').val(pluginSettings.PluginWebsite);
        jQuery('input[name="author-site"]').val(pluginSettings.AuthorSite);
        jQuery('input[name="author"]').val(pluginSettings.Author);
    }

    (function () {
        // trim polyfill : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
        if (!String.prototype.trim) {
            (function () {
                // Make sure we trim BOM and NBSP
                var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
                String.prototype.trim = function () {
                    return this.replace(rtrim, '');
                };
            })();
        }

        [].slice.call(document.querySelectorAll('input.input__field')).forEach(function (inputEl) {
            // in case the input is already filled..
            if (inputEl.value.trim() !== '') {
                jQuery(inputEl.parentNode).addClass('input--filled');
            }

            // events:
            inputEl.addEventListener('focus', onInputFocus);
            inputEl.addEventListener('blur', onInputBlur);
        });

        function onInputFocus(ev) {
            jQuery(ev.target.parentNode).addClass('input--filled');
        }

        function onInputBlur(ev) {
            if (ev.target.value.trim() === '') {
                jQuery(ev.target.parentNode).removeClass('input--filled');
            }
        }
    })();

    window.validator = new FormValidator();

    jQuery('form')
        .on('blur keyup', 'input[required], input.optional, select.required', function(e){
            var keyCode = e.keyCode || e.which;
            var result = validator.checkField.call(validator, this);

            if( result.valid ) {
                jQuery(this).closest('.field').removeClass('control-invalid').addClass('control-valid');

                if(keyCode == 13) {
                    var nextField = jQuery(this).closest('.field').next('.field');
                    if( nextField.length ) {
                        nextField.find('input').focus();
                    } else {
                        moveToNextSection();
                    }
                }
            } else {
                jQuery(this).closest('.field').removeClass('control-valid').addClass('control-invalid');
            }
        })
        .on('change', 'select.required', function(){
            validator.checkField.call(validator, this);
        })
        .on('keypress', 'input[required][pattern]', function(){
            validator.checkField.call(validator, this);
        })
        .submit(function(e){
            var validatorResult = validator.checkAll(this);

            if( validatorResult ) {
                moveToNextSection();
            }

			return !!validatorResult.valid;
        })
        ;
    
    jQuery('.navigation .next').click(function(){
        moveToNextSection();   
    });
});