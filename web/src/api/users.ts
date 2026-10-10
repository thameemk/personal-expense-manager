import {apiRequest} from "./client";

export type CurrentUser = {
    id: string;
    display_name: string | null;
    email: string;
    is_active: boolean;
};

export function getCurrentUser() {
    return apiRequest<CurrentUser>("/users/me", {authenticated: true});
}
