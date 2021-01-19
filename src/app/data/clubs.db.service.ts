import { Injectable } from "@angular/core";
import { Club } from "../models/club.model";
import { DiscountDatabase } from "./database";
import { sqlQueries } from "./sql.queries";

@Injectable({
    providedIn: 'root'
})
export class ClubsDbService {

    findAllClubs(): Promise<Club[]> {
        const values = {};
        return DiscountDatabase.selectAll(sqlQueries.select_all_clubs, values)
            .then((rows) => {
                const clubs: Club[] = [];
                for (const row of rows) {
                    clubs.push(this.fromRow(row));
                }
                return clubs;
            });
    }

    public addClub(club: Club): Promise<number> {
        const values = {
            $name: club.name,
            $chairman: club.chairman
        };
        return DiscountDatabase.insert(sqlQueries.insert_club, values);
    }

    public deleteClub(clubId: number): Promise<number> {
        const values = { $id: clubId };
        return DiscountDatabase.delete(sqlQueries.delete_club, values);
    }

    fromRow(row: object): Club {
        return {
            id: row['id'],
            name: row['name'],
            chairman: row['chairman']
        }
    }
}
