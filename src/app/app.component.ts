import { Component } from '@angular/core';
import { DiscountDatabase } from './data/database';

var remote = window.require('electron').remote;
var electronFs = remote.require('fs');
var app = remote.app;
var process = window.require('process');

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
  })
  export class AppComponent {
  
    dbName: string = "dc-database.db";
    dbPath: string = "";
    dbExist: boolean = false;
  
    constructor() {
  
      if (process.env.PORTABLE_EXECUTABLE_DIR) {
        this.dbPath = process.env.PORTABLE_EXECUTABLE_DIR;
      } else {
        this.dbPath = app.getAppPath();
      }
      this.dbPath += '\\' + this.dbName;
  
  
      if (electronFs.existsSync(this.dbPath)) {
        this.dbExist = true;
        this.loadDb(this.dbPath);
      } else {
        this.dbExist = false;
        this.loadDb(this.dbPath);
      }
    }
  
    public loadDb(dbPath: string) {
      DiscountDatabase.loadDb(dbPath)
        .then(() => {
          console.log("DB loaded successfully");
        })
        .catch((error) => {
          console.log('Error occurred while opening database: ', error);
        });
    }
  
  }