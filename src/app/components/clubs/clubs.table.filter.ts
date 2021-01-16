import { ClrDatagridStringFilterInterface } from "@clr/angular";
import { Club } from "src/app/models/club.model";

export class ClubFilter implements ClrDatagridStringFilterInterface<Club> {
    accepts(field: Club, search: string): boolean {
        console.log(search);
        return "" + field.name == search
            || field.name.toLowerCase().indexOf(search) >= 0;
    }
}