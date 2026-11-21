export interface IUser {
    _id: string;
    email: string;
    name: string;
    role: 'admin' | 'user';
    active: boolean;
    isAdmin: boolean;
    passwordHash: string;
}
