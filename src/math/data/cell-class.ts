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
    up: string;
    down: string;
    front: string;
    back: string;

    constructor(){
        this.initialize(0,0,0);
    };

    initialize(x: number, y: number, z:number):void{
        this.x = x;
        this.y = y;
        this.z = z;
        this.up = "R";
        this.front = "Y";
        this.right = "B";
        this.left = "G";
        this.back = "W";
        this.down = "O";
    }
    rotateR():void{
        let buf = this.up;
        this.up = this.front;
        this.front = this.down;
        this.down = this.back;
        this.back = buf;
    }
    rotateR_C():void{
        let buf = this.up;
        this.up = this.back;
        this.back = this.down;
        this.down = this.front;
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
        let buf = this.up;
        this.up = this.left;
        this.left = this.down;
        this.down = this.right;
        this.right = buf;
    }
    rotateF_C():void{
        let buf = this.up;
        this.up = this.right;
        this.right = this.down;
        this.down = this.left;
        this.left = buf;
    }
}
