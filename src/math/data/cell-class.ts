export class Cell {
    x: number;
    y: number;
    z: number;
    left: string;
    right: string;
    top: string;
    bot: string;
    front: string;
    back: string;

    rotateR(){
        let buf = this.top;
        this.top = this.front;
        this.front = this.bot;
        this.bot = this.back;
        this.back = buf;
    }
    rotateR_C(){
        let buf = this.top;
        this.top = this.back;
        this.back = this.bot;
        this.bot = this.front;
        this.front = buf;
    }
    rotateU(){
        let buf = this.front;
        this.front = this.right;
        this.right = this.back;
        this.back = this.left;
        this.left = buf;
    }
    rotateU_C(){
        let buf = this.front;
        this.front = this.left;
        this.left = this.back;
        this.back = this.right;
        this.right = buf;
    }
    rotateF(){
        let buf = this.top;
        this.top = this.left;
        this.left = this.bot;
        this.bot = this.right;
        this.right = buf;
    }
    rotateF_C(){
        let buf = this.top;
        this.top = this.right;
        this.right = this.bot;
        this.bot = this.left;
        this.left = buf;
    }
}
