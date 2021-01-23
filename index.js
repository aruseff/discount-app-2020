'use strict';

const { app, BrowserWindow } = require('electron');
const path = require('path');

const devMode = /electron/.test(path.basename(app.getPath('exe'), '.exe'));

if (devMode) {
	// Set appname and userData to indicate development environment
	app.name = app.name + '-dev';
	app.setPath('userData', app.getPath('userData') + '-dev');

	// Temporary fix for Electron 'reload' issue
	app.allowRendererProcessReuse = false;

	// Setup reload
	require('electron-reload')(path.join(__dirname, 'dist'), {
		electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
	});
}

let mainWindow;

let createWindow = () => {
	mainWindow = new BrowserWindow({
		show: false,
		height: 768,
        width: 1024,
		icon: "src/logo.ico",
		webPreferences: {
			nodeIntegration: true,
			enableRemoteModule: true
		}
	});
	mainWindow.once('ready-to-show', () => {
		mainWindow.show()
	});

	mainWindow.setMaximizable(false);
	// mainWindow.setMenu(null);
	mainWindow.setResizable(false);

	// mainWindow.maximize();

	mainWindow.loadURL('file://' + __dirname + '/dist/index.html');

	// Open the DevTools.
	if (devMode && process.argv.indexOf('--noDevTools') === -1) {
		mainWindow.webContents.openDevTools();
	}

	mainWindow.on('closed', () => {
		mainWindow = null;
	});
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (mainWindow === null) createWindow();
});
