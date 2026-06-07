import { Cat } from "./cat.model";
import { MatchType } from "./match-type.enum";

export interface FilteredCat {
    cat: Cat;
    matchType?: MatchType;
}