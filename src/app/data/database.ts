import { Database } from 'sqlite3';

export class DiscountDatabase {

    public static db: Database;

    public static loadDb(dbPath: string) {
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

}
