export class User {
    constructor(
        public _id: object,
        public userName: string,
        public password: string,
        public token?: string,
    ){}
}