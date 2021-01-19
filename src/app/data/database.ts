import { Database } from 'sqlite3';
import { DiscountsService } from '../services/discount.service';
import { schema } from './schema.db';

export class DiscountDatabase {

    public static db: Database;

    public static loadDb(dbPath: string): Promise<string> {
        return DiscountDatabase.getDb(dbPath)
            .then(() => DiscountDatabase.exec(schema))
            .then(() => {
                console.log('Database loaded');
                return dbPath;
            });
    }

    private static getDb(dbPath: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const db = new Database(dbPath, (err) => {
                if (err) {
                    reject(err);
                } else {
                    DiscountDatabase.db = db;
                    resolve();
                }
            });
        });
    }

    private static exec(sql: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            DiscountDatabase.db.exec(sql, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    public static selectAll(sql: string, values: {}): Promise<Array<{}>> {
        return new Promise<Array<{}>>((resolve, reject) => {
            DiscountDatabase.db.all(sql, values, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    public static selectOne(sql: string, values: {}): Promise<{}> {
        return new Promise<{}>((resolve, reject) => {
            DiscountDatabase.db.get(sql, values, (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    public static insert(sql: string, values: {}): Promise<number> {
        return DiscountDatabase.change(sql, values);
    }

    public static delete(sql: string, values: {}): Promise<number> {
        return DiscountDatabase.change(sql, values);
    }

    private static change(sql: string, values: {}): Promise<number> {
        return new Promise<any>((resolve, reject) => {
            DiscountDatabase.db.run(sql, values, function (err) {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            });
        });
    }

}
