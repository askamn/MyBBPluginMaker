const { ipcMain, app, BrowserWindow } = require('electron');
const path = require('path')
const url = require('url')
const Engine = require('./system/engine')

global.LANGUAGE_VARS = {
    appName: "MyBB Plugin Maker",
    PluginName: "Plugin Name",
    PluginDescription: "Plugin Description",
    PluginAuthor: "Plugin Author",
    PluginWebsite: "Plugin Website",
    PluginAuthorSite: "Plugin Author's Website",
    PluginFriendlyName: "Plugin Friendly Name"
};

global.Engine = Engine;

const windowParams = {
    width: 1280,
    height: 720,
    frame: false,
    show: false,
    fullscreen: false,
};

let mainWindow;

ipcMain.on('windowCloseEvent', function(event, data) {
    if (mainWindow) {
        mainWindow.destroy();
    }
});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.

var createWindow = () => {
    // Initilise our core
    Engine.Init();

    // Create the browser window.
    mainWindow = new BrowserWindow(windowParams);

    // and load the index.html of the app.
    mainWindow.loadURL(`file://${__dirname}/index.html`);

    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
