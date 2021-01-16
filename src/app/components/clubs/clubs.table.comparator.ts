import { ClrDatagridComparatorInterface } from "@clr/angular";
import { Club } from "src/app/models/club.model";

export class ClubComparator implements ClrDatagridComparatorInterface<Club> {
    compare(a: Club, b: Club) {
        return a.name.localeCompare(b.name);
    }
}
