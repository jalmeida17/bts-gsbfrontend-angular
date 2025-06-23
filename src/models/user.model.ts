export class UserModel {
    _id?: string;
    name: string;
    email: string;
    password: string;
    role: string;
    subRole: string;
    createdAt: Date;

    constructor(name: string, email: string, password: string, role: string, _id?: string, subRole: string = 'user') {
        this._id = _id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.subRole = subRole;
        this.createdAt = new Date();
    }
}