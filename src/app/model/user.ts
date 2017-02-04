export class user{
    constructor(
        public email: string
        ){}   
}


export class list{
    constructor(
        public isFinished:boolean,
        public title?:string,
        public description?:string,
        public language?:string,
        public name?:string,
        public email?:string,
        public users?:Array<string>

    ){

    }
}