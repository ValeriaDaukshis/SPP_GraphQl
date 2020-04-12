import { User } from "app/login-manager/models/user";

export class Task{
    constructor(
        public _id: object,
        public name: string,
        public deadline: string,
        public details: string,
        public isMade: boolean,
        public isExpired : boolean,
        public user_id: Object,
    ){}
}