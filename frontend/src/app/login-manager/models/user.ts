export class User {
    constructor(
        public _id: Object,
        public userName: String,
        public password: String,
        public token?: String,
    ){}
}