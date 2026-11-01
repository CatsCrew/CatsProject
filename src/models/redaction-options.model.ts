import { RedactionStyle } from "./redaction-style.enum";

export interface RedactOptions {
    style: RedactionStyle;
    length?: number;
}