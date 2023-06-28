import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CUBE_SIZE, Y_SIZE } from 'src/global-config';
import { Cell } from './data/cell-class';
import { createMatrixRawString, rotateClockwise, rotateCounterClockwise } from './functions';

@Injectable()
export class MathService implements OnModuleInit {    
    private readonly logger = new Logger(MathService.name);
    private cube: Cell[][][] = new Array();
    private side: Cell[][] = new Array();

    constructor(){
        this.cube = [];        
        for (let x=0; x<CUBE_SIZE; x++) {
            this.cube[x]=[];
            this.side = [];
            for (let y=0; y<CUBE_SIZE; y++) {
                this.cube[x][y]=[];
                this.side[y] = [];
                for (let z=0; z<CUBE_SIZE; z++) {
                    this.cube[x][y][z] = new Cell();  
                    this.side[y][z] = new Cell();                  
                }
            }
        }
    }

    onModuleInit():void{
        this.initCube();
        this.logger.verbose("\nCube initialized successfully\n");
        this.drawSweep(this.cube, false);
        //this.rotateL("L");
        //this.drawSweep(this.cube, false);
        this.rotateU("U");
        this.drawSweep(this.cube, false);
        this.rotateL("L");
        this.drawSweep(this.cube, false);
        this.rotateR("RC");
        this.drawSweep(this.cube, false);
     }

    initCube():void{                
        for(let x = 0; x < CUBE_SIZE; x++){ 
            for(let y = 0; y < CUBE_SIZE; y++){
                for(let z = 0; z < CUBE_SIZE; z++){
                    this.cube[x][y][z].initialize(x,y,z);
                 }
            }
        }        
    }

    drawSweep(cube: Cell[][][], addPosition: boolean):void{ 
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
                ? output.concat(createMatrixRawString(cube[x][y][0].back,cube[x][y][0].x,cube[x][y][0].y,cube[x][y][0].z))
                : output.concat(cube[x][y][0].back);
            }   
            output = output.concat(filler); 
            result.push(output);
        }
        //UP
        for (let z = 0; z<CUBE_SIZE; z++){
            let output = filler;
            let y = CUBE_SIZE-1;
            for (let x = 0; x<CUBE_SIZE; x++){
                output = addPosition
                ? output.concat(createMatrixRawString(cube[x][y][z].up,cube[x][y][z].x,cube[x][y][z].y,cube[x][y][z].z))
                : output.concat(cube[x][y][z].up);
            }
            output = output.concat(filler);  
            result.push(output);
        }
        //LEFT        
        for (let z = 0; z<CUBE_SIZE; z++){
            let output = "";
            let x = 0;
            for (let y = 0; y<CUBE_SIZE; y++){
                output = addPosition
                ? output.concat(createMatrixRawString(cube[x][y][z].left,cube[x][y][z].x,cube[x][y][z].y,cube[x][y][z].z))
                : output.concat(cube[x][y][z].left);
            }
            result.push(output);
        }
        //FRONT
        for (let y = 0; y<CUBE_SIZE; y++){
            let output = "";
            let z = CUBE_SIZE-1;
            for (let x = 0; x<CUBE_SIZE; x++){
                output = addPosition
                ? output.concat(createMatrixRawString(cube[x][y][z].front,cube[x][y][z].x,cube[x][y][z].y,cube[x][y][z].z))
                : output.concat(cube[x][y][CUBE_SIZE-1].front);                
            }
            result[(Y_SIZE/2)+CUBE_SIZE-y-1] = result[(Y_SIZE/2)+CUBE_SIZE-y-1].concat(output);
        }
        //RIGHT       
        for (let z = CUBE_SIZE-1; z>=0; z--){
            let output = "";
            let x = 0;
            for (let y = CUBE_SIZE-1; y>=0; y--){
                output = addPosition
                ? output.concat(createMatrixRawString(cube[x][y][z].right,cube[x][y][z].x,cube[x][y][z].y,cube[x][y][z].z))
                : output.concat(cube[x][y][z].right);
            }
            result[(Y_SIZE/2)+z] = result[(Y_SIZE/2)+z].concat(output);
        }
        //DOWN
        for (let z = CUBE_SIZE-1; z>=0; z--){
            let output = filler;
            let y = 0;
            for (let x = 0; x<CUBE_SIZE; x++){
                output = addPosition
                ? output.concat(createMatrixRawString(cube[x][y][z].down,cube[x][y][z].x,cube[x][y][z].y,cube[x][y][z].z))
                : output.concat(cube[x][y][z].down);
            }
            output = output.concat(filler);  
            result.push(output);
        }
        result.forEach(el => {
            this.logger.verbose(el); 
        });        
        console.log("");        
    }

    copyCubeToSide(constAxis: string, constAxisValue: number, cubeToSide: boolean){
        //if cubeToSide = true, then copy cube to side, else - side to cube
        let xStart: number = 0, yStart: number = 0, zStart: number = 0;
        let xEnd: number = CUBE_SIZE, yEnd: number = CUBE_SIZE, zEnd: number = CUBE_SIZE;
   
        if (constAxis === "X" || constAxis === "x"){            
            xStart = constAxisValue;
            xEnd = constAxisValue+1;
        } else if (constAxis === "Y" || constAxis === "y"){
            yStart = constAxisValue;
            yEnd = constAxisValue+1;
        } else if (constAxis === "Z" || constAxis === "z"){
            zStart = constAxisValue;
            zEnd = constAxisValue+1;
        } else {
            this.logger.warn(`Wrong input in copySide function: Axis: ${constAxis} with value ${constAxisValue}`);
            return;
        }        
        for (let x = xStart; x<xEnd; x++){
            for(let y = yStart; y<yEnd; y++) {
                for(let z = zStart; z<zEnd; z++) {
                    if (constAxis === "X" || constAxis === "x"){
                        if(cubeToSide)
                        this.side[y][z] = this.cube[x][y][z];
                        else
                        this.cube[x][y][z] = this.side[y][z];
                    } else if (constAxis === "Y" || constAxis === "y"){
                        if(cubeToSide)
                        this.side[x][z] = this.cube[x][y][z];
                        else
                        this.cube[x][y][z] = this.side[x][z];
                    } else {
                        if(cubeToSide)
                        this.side[x][y] = this.cube[x][y][z];
                        else
                        this.cube[x][y][z] = this.side[x][y];
                    }                      
                }  
            }   
        }         
    }


    rotateSideBy90Degrees(arr: Cell[][], cube_size: number, clockwise: boolean, direction: string){ 

        if (clockwise) 
            rotateClockwise(arr,cube_size);
        else 
            rotateCounterClockwise(arr,cube_size);

        for (let x = 0; x<cube_size; x++){
            for (let y = 0; y<cube_size;y++){
                switch(direction){
                    case "R":
                    case "LC":
                        this.side[x][y].rotateR();
                        break;
                    case "RC":
                    case "L":
                        this.side[x][y].rotateR_C();
                        break;
                    case "U":
                    case "D":
                        this.side[x][y].rotateU();
                        break;
                    case "UC":
                    case "DC":
                        this.side[x][y].rotateU_C();
                        break;
                    case "F":
                    case "B":
                        this.side[x][y].rotateF();
                        break;
                    case "FC":
                    case "BC":
                        this.side[x][y].rotateF_C();
                        break;                        
                    default:
                        this.logger.warn(`Wrong value in fuction rotateSideBy90Degrees. Direction: ${direction}`);
                        break;        
                }                   
                
            }
        }
    }

    rotateR(rotation: string){
        this.copyCubeToSide("X", CUBE_SIZE-1, true);
        this.rotateSideBy90Degrees(this.side,CUBE_SIZE,rotation === "R",rotation);
        this.copyCubeToSide("X", CUBE_SIZE-1, false);
    }
    rotateL(rotation: string){
        this.copyCubeToSide("X", 0, true);
        this.rotateSideBy90Degrees(this.side,CUBE_SIZE,rotation === "L",rotation);
        this.copyCubeToSide("X", 0, false);
    }
    rotateU(rotation: string){
        this.copyCubeToSide("Y", CUBE_SIZE-1, true);
        this.rotateSideBy90Degrees(this.side,CUBE_SIZE,rotation === "U",rotation);
        this.copyCubeToSide("Y", CUBE_SIZE-1, false);
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
        //this.rotateL();
        this.rotateM();
    }
    rotateRw(){
        //Right+center
        //this.rotateR();
        this.rotateM_();
    } 
    rotateUw(){
        //Top+center
        //this.rotateU();
        this.rotateE_();
    }
    rotateDw(){
        //Down+center
        this.rotateD();
        this.rotateE();
    } 
    rotateX(){
        //rotate X (up)
        //this.rotateL_();
        this.rotateM_();
        //this.rotateR();
    }
    rotateX_(){
        //rotate X (down)
        //this.rotateL();
        //this.rotateM();
        //this.rotateR_();
    } 
    rotateY(){
        //rotate Y (left)
        //this.rotateU();
        this.rotateE_();
        this.rotateD_();
    }
    rotateY_(){
        //rotate Y (right)
        //this.rotateU_();
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

