import { SocialMediaType } from "./social-media-type.enum";

export interface Creator {
    name?: string;
    socials?: Record<SocialMediaType, string>;
    profileUrl?: string;
}