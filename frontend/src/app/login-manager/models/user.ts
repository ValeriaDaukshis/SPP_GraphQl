export class User {
    constructor(
        public _id: object,
        public username: string,
        public password: string,
        public token?: string,
    ){}
}