interface ICell{
    initialize(x: number, y:number, z:number):void;
    rotateR():void;
    rotateR_C():void;
    rotateU():void;
    rotateU_C():void;
    rotateF():void;
    rotateF_C():void;
}

export class Cell implements ICell {
    x: number;
    y: number;
    z: number;
    left: string;
    right: string;
    top: string;
    bot: string;
    front: string;
    back: string;

    constructor(){
        this.initialize(0,0,0);
    };

    initialize(x: number, y: number, z:number):void{
        this.x = x;
        this.y = y;
        this.z = z;
        this.top = "R";
        this.front = "Y";
        this.right = "B";
        this.left = "G";
        this.back = "W";
        this.bot = "O";
    }
    rotateR():void{
        let buf = this.top;
        this.top = this.front;
        this.front = this.bot;
        this.bot = this.back;
        this.back = buf;
    }
    rotateR_C():void{
        let buf = this.top;
        this.top = this.back;
        this.back = this.bot;
        this.bot = this.front;
        this.front = buf;
    }
    rotateU():void{
        let buf = this.front;
        this.front = this.right;
        this.right = this.back;
        this.back = this.left;
        this.left = buf;
    }
    rotateU_C():void{
        let buf = this.front;
        this.front = this.left;
        this.left = this.back;
        this.back = this.right;
        this.right = buf;
    }
    rotateF():void{
        let buf = this.top;
        this.top = this.left;
        this.left = this.bot;
        this.bot = this.right;
        this.right = buf;
    }
    rotateF_C():void{
        let buf = this.top;
        this.top = this.right;
        this.right = this.bot;
        this.bot = this.left;
        this.left = buf;
    }
}
