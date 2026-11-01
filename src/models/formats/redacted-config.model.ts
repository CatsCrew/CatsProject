import { RedactionStyle } from "../redaction-style.enum";

export interface RedactedConfig {
    fields: string[];
    style: RedactionStyle;
}