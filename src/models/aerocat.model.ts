import { Cat } from "./cat.model";

export interface Aerocat extends Cat {
    copilot?: string;
}