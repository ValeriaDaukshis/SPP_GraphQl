import { User } from "app/login-manager/models/user";

export class TaskInput{
    constructor(
        public _id: Object,
        public name: String,
        public deadline: string,
        public details: String,
        public isMade: boolean,
        public isExpired : boolean,
        public user_id: Object,
    ){}
}