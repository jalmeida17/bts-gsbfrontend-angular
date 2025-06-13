export class UserModel {
    _id?: string;
    name: string;
    email: string;
    password: string;
    role: string;
    createdAt: Date;

    constructor(name: string, email: string, password: string, role: string, _id?: string) {
        this._id = _id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.createdAt = new Date();
    }
}