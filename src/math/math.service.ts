import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CUBE_SIZE, X_SIZE, Y_SIZE } from 'src/global-config';
import { Square } from './data/cube-class';

@Injectable()
export class MathService implements OnModuleInit {    
    private readonly logger = new Logger(MathService.name);
    private cube: Square[][][];
    constructor(){
        this.cube = [];
        for (let x = 0; x < CUBE_SIZE; x++){
            this.cube[x] = [];
            for (let y = 0; y < CUBE_SIZE; y++){
                this.cube[x][y] = [];
                for (let z = 0; z < CUBE_SIZE; z++){
                    this.cube[x][y][z] = {
                        x: x,
                        y: y,
                        z: z,
                        c_left: "",
                        c_right: "",
                        c_top: "",
                        c_bottom: "",
                        c_front: "",
                        c_back: "",
                    }
                }
            }
        }
    }

    onModuleInit():void{
        //initialize cube
        this.initCube();
        this.logger.verbose("\nCube initialized successfully\n");
        this.rotateB("");
        this.rotateF("");
        this.rotateS(""); 
        this.drawCube(this.cube, false); 
        this.drawCube(this.cube, true);
               

    }

    initCube():void{                
        for(let x = 0; x < CUBE_SIZE; x++){ 
            for(let y = 0; y < CUBE_SIZE; y++){
                for(let z = 0; z < CUBE_SIZE; z++){
                    this.cube[x][y][z].c_left = "G";
                    this.cube[x][y][z].c_right = "B";
                    this.cube[x][y][z].c_top = "R";
                    this.cube[x][y][z].c_bottom = "O";
                    this.cube[x][y][z].c_front = "Y";
                    this.cube[x][y][z].c_back = "W";
                }
            }
        }        
    }

    drawCube(cube: Square[][][], addPosition: boolean):void{ 
        let result: string[] = [];     
        let filler = "";
        for (let i = 0; i < CUBE_SIZE; i++){
            filler+=(addPosition ? "          " : " ");            
        }
        //BACK        
        for (let y = 0; y<CUBE_SIZE; y++){
            let output = filler;
            for (let x = 0; x<CUBE_SIZE; x++){
                output = addPosition
                ? output.concat(this.createCubeRawString(cube[x][y][0].c_back,cube[x][y][0].x,cube[x][y][0].y,cube[x][y][0].z))
                : output.concat(cube[x][y][0].c_back);
            }   
            output = output.concat(filler); 
            result.push(output);
        }
        //TOP
        for (let z = 0; z<CUBE_SIZE; z++){
            let output = filler;
            for (let y = 0; y<CUBE_SIZE; y++){
                output = addPosition
                ? output.concat(this.createCubeRawString(cube[0][y][z].c_top,cube[0][y][z].x,cube[0][y][z].y,cube[0][y][z].z))
                : output.concat(cube[0][y][z].c_top);
            }
            output = output.concat(filler);  
            result.push(output);
        }
        //LEFT        
        for (let y = 0; y<CUBE_SIZE; y++){
            let output = "";
            for (let z = 0; z<CUBE_SIZE; z++){
                output = addPosition
                ? output.concat(this.createCubeRawString(cube[0][y][z].c_left,cube[0][y][z].x,cube[0][y][z].y,cube[0][y][z].z))
                : output.concat(cube[0][y][z].c_left);
            }
            result.push(output);
        }
        //FRONT
        for (let x = 0; x<CUBE_SIZE; x++){
            let output = "";
            let z = CUBE_SIZE-1;
            for (let y = 0; y<CUBE_SIZE; y++){
                output = addPosition
                ? output.concat(this.createCubeRawString(cube[x][y][z].c_front,cube[x][y][z].x,cube[x][y][z].y,cube[x][y][z].z))
                : output.concat(cube[x][y][CUBE_SIZE-1].c_front);                
            }
            result[(Y_SIZE/2)+x] = result[(Y_SIZE/2)+x].concat(output);
        }
        //RIGHT       
        for (let y = CUBE_SIZE-1; y>=0; y--){
            let output = "";
            for (let z = CUBE_SIZE-1; z>=0; z--){
                output = addPosition
                ? output.concat(this.createCubeRawString(cube[0][y][z].c_right,cube[0][y][z].x,cube[0][y][z].y,cube[0][y][z].z))
                : output.concat(cube[0][y][z].c_right);
            }
            result[(Y_SIZE/2)+y] = result[(Y_SIZE/2)+y].concat(output);
        }
        //BOTTOM
        for (let z = CUBE_SIZE-1; z>=0; z--){
            let output = filler;
            for (let y = 0; y<CUBE_SIZE; y++){
                output = addPosition
                ? output.concat(this.createCubeRawString(cube[0][y][z].c_bottom,cube[0][y][z].x,cube[0][y][z].y,cube[0][y][z].z))
                : output.concat(cube[0][y][z].c_bottom);
            }
            output = output.concat(filler);  
            result.push(output);
        }
        result.forEach(el => {
            this.logger.verbose(el); 
        });        
        console.log("");        
    }

    createCubeRawString(c: string, x: number, y: number, z: number):string{
        let str: string;
        str = `${c}:(${x};${y};${z}) `;
        return str;
    }

    rotateZconst(direction: string, rotate: string, z: number){
        for (let x = 0; x < CUBE_SIZE; x++) {
            for (let y = 0; y<CUBE_SIZE; y++){                
                this.cube[x][y][z] = direction === rotate 
                ? this.rotateColorsFrontClockwise(this.cube[x][y][z])
                : this.rotateColorsFrontCounterClockwise(this.cube[x][y][z]);
            }
        }
    }

    rotateF(direction: string){  
        this.rotateZconst(direction,"",CUBE_SIZE-1); //Front     
    }
    rotateB(direction: string){
        this.rotateZconst(direction,"_",0); //Back        
    }
    rotateS(direction: string){        
        let z = CUBE_SIZE-2;
        for (let i = 0; i < z; i++){
            this.rotateZconst(direction,"",z);//Standing
        }                
    }

    rotateColorsFrontClockwise(cell: Square):Square{
        let buf = cell.c_top;
        cell.c_top = cell.c_left;
        cell.c_left = cell.c_bottom;
        cell.c_bottom = cell.c_right;
        cell.c_right = buf;
        return cell;
    }
    rotateColorsFrontCounterClockwise(cell: Square):Square{
        let buf = cell.c_top;
        cell.c_top = cell.c_right;
        cell.c_right = cell.c_bottom;
        cell.c_bottom = cell.c_left;
        cell.c_left = buf;
        return cell;
    }
    rotateColorsRightClockwise(cell: Square):Square{
        let buf = cell.c_top;
        cell.c_top = cell.c_front;
        cell.c_front = cell.c_bottom;
        cell.c_bottom = cell.c_back;
        cell.c_back = buf;
        return cell;
    }
    rotateColorsRightCounterClockwise(cell: Square):Square{
        let buf = cell.c_top;
        cell.c_top = cell.c_back;
        cell.c_back = cell.c_bottom;
        cell.c_bottom = cell.c_front;
        cell.c_front = buf;
        return cell;
    }
    rotateColorsTopClockwise(cell: Square):Square{
        let buf = cell.c_front;
        cell.c_front = cell.c_right;
        cell.c_right = cell.c_back;
        cell.c_back = cell.c_left;
        cell.c_left = buf;
        return cell;
    }
    rotateColorsTopCounterClockwise(cell: Square):Square{
        let buf = cell.c_front;
        cell.c_front = cell.c_left;
        cell.c_left = cell.c_back;
        cell.c_back = cell.c_right;
        cell.c_right = buf;
        return cell;
    }

     
    rotateL(){
        //Left
    }
    rotateL_(){
        //Left'
    }    
    rotateR(){
        //Right
    }
    rotateR_(){
        //Right'
    }    
    rotateU(){
        //Up
    }
    rotateU_(){
        //Up'
    }    
    rotateD(){
        //Down
    }
    rotateD_(){
        //Down'
    }    
    rotateM(){
        //Middle
    }
    rotateM_(){
        //Middle'
    }   
    rotateE(){
        //Equatorial
    }
    rotateE_(){
        //Equatorial'
    }  
    rotateFw(){
        //Front+center
        //this.rotateF("");
        //this.rotateS();
    }
    rotateBw(){
        //Back+center
        //this.rotateB();
        //this.rotateS_();
    }    
    rotateLw(){
        //Left+center
        this.rotateL();
        this.rotateM();
    }
    rotateRw(){
        //Right+center
        this.rotateR();
        this.rotateM_();
    } 
    rotateUw(){
        //Top+center
        this.rotateU();
        this.rotateE_();
    }
    rotateDw(){
        //Down+center
        this.rotateD();
        this.rotateE();
    } 
    rotateX(){
        //rotate X (up)
        this.rotateL_();
        this.rotateM_();
        this.rotateR();
    }
    rotateX_(){
        //rotate X (down)
        this.rotateL();
        this.rotateM();
        this.rotateR_();
    } 
    rotateY(){
        //rotate Y (left)
        this.rotateU();
        this.rotateE_();
        this.rotateD_();
    }
    rotateY_(){
        //rotate Y (right)
        this.rotateU_();
        this.rotateE();
        this.rotateD();
    } 
    rotateZ(){
        //rotate Z (clockwise)
        //this.rotateF("");
        //this.rotateS();
        //this.rotateB_();
    }
    rotateZ_(){
        //rotate Y (counterclockwise)
        //this.rotateF("'");
        //this.rotateS_();
        //this.rotateB();
    }      

}

