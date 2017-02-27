const ini = require('../../node_modules/ini/ini');
const fileSystem = require('fs');
const appSettings = require('./config');

const settingsPath = __dirname + '/settings.ini';

settings = {};

var Init = function() {
    // Config object
    var config = null;

    // If the settings file does not exist, create it
    if(!fileSystem.existsSync(settingsPath)) {
        config = { DEFAULT: { Version: appSettings.version, } };

        fileSystem.writeFileSync(settingsPath, ini.stringify(config));

        console.log('Settings file created.');
    } else {
        // Read the settings, if any
        settings = ini.parse(fileSystem.readFileSync(settingsPath, 'utf-8'));
    }
};

var FeedConfig = function(key, value, section) {
    if( settings[section] ) {
        settings[section][key] = value;
    } else {
        settings[section] = {};
        settings[section][key] = value;
    }
};

var WriteConfig = function() {
    fileSystem.writeFileSync(settingsPath, ini.stringify(settings));
};

var getSettings = function(section) {
    if( settings[section] ) {
        return settings[section];
    }

    return null;
};


exports.Init = Init;
exports.FeedConfig = FeedConfig;
exports.WriteConfig = WriteConfig;
exports.GetSettings = getSettings;