import { UserModel } from "./user.model";

export class BillModel {
    _id: string;
    date: Date;
    amount: number;
    proof: string
    description: string;
    status: string;
    type: string;
    createdAt: Date;
    user: UserModel;
    constructor(_id:string, date: Date, amount: number, proof: string, description: string, status: string, type: string, user: UserModel) {
        this._id = _id;
        this.date = date;
        this.amount = amount;
        this.proof = proof;
        this.description = description;
        this.status = status;
        this.type = type;
        this.createdAt = new Date();
        this.user = new UserModel(user.name, user.email, user.password, user.role);
    }
}