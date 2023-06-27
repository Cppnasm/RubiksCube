import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CUBE_SIZE, X_SIZE, Y_SIZE } from 'src/global-config';
import { Square } from './data/cube-class';
import { CellService } from './cell.service';

@Injectable()
export class MathService implements OnModuleInit {    
    private readonly logger = new Logger(MathService.name);
    private readonly cell = new CellService;
    private cube: Square[][][];
    private side: Square[][];
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
        this.side = [];
        for (let x = 0; x < CUBE_SIZE; x++){
            this.side[x] = [];            
            for (let y = 0; y < CUBE_SIZE; y++){
                this.side[x][y] = {
                    x: 0,
                    y: 0,
                    z: 0,
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

    onModuleInit():void{
        //initialize cube
        this.initCube();
        this.logger.verbose("\nCube initialized successfully\n");
        this.rotate90(7);
        //this.rotateL("");
        //this.rotateR("");
        //this.rotateF("");
        //this.rotateB("");        
        //this.rotateS("_");
        //this.drawCube(this.cube, false); 
        //this.rotateL("");
        ///this.drawCube(this.cube, false); 
        //this.drawCube(this.cube, true);
    }

    rotate90(n: number){
        let arr: string[][];
        arr = [];
        for (let x = 0; x < n; x++){
            arr[x]=[];
            for(let y = 0; y < n; y++){
                arr[x][y] = `(${x},${y})`;
            }
        }

        let output = "";        
        for (let y = 0; y < n; y++){ 
            let tempstr = "";           
            for(let x = 0; x < n; x++){
                tempstr = tempstr.concat(arr[x][y]);
            }
            output = tempstr + '\n' + output;
        }
        console.log(output);


        for(let i = 0; i<n/2; i++){
            for(let j = i; j<n-i-1; j++){
                var buf = arr[i][j];
                arr[i][j] = arr[n - 1 - j][i];
                arr[n - 1 - j][i] = arr[n - 1 - i][n - 1 - j];
                arr[n - 1 - i][n - 1 - j] = arr[j][n - 1 - i];
                arr[j][n - 1 - i] = buf;
            }
        }

        output = ""; 
        for (let y = 0; y < n; y++){ 
            let tempstr = "";           
            for(let x = 0; x < n; x++){
                tempstr = tempstr.concat(arr[x][y]);
            }
            output = tempstr + '\n' + output;
        }
        console.log(output);
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
        for (let x = 0; x<CUBE_SIZE; x++){
            let output = filler;
            for (let y = 0; y<CUBE_SIZE; y++){
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
            let y = CUBE_SIZE-1;
            for (let x = 0; x<CUBE_SIZE; x++){
                output = addPosition
                ? output.concat(this.createCubeRawString(cube[x][y][z].c_top,cube[x][y][z].x,cube[x][y][z].y,cube[x][y][z].z))
                : output.concat(cube[x][y][z].c_top);
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
                ? output.concat(this.createCubeRawString(cube[x][y][z].c_left,cube[x][y][z].x,cube[x][y][z].y,cube[x][y][z].z))
                : output.concat(cube[x][y][z].c_left);
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
        for (let z = CUBE_SIZE-1; z>=0; z--){
            let output = "";
            let x = 0;
            for (let y = CUBE_SIZE-1; y>=0; y--){
                output = addPosition
                ? output.concat(this.createCubeRawString(cube[x][y][z].c_right,cube[x][y][z].x,cube[x][y][z].y,cube[x][y][z].z))
                : output.concat(cube[x][y][z].c_right);
            }
            result[(Y_SIZE/2)+z] = result[(Y_SIZE/2)+z].concat(output);
        }
        //BOTTOM
        for (let z = CUBE_SIZE-1; z>=0; z--){
            let output = filler;
            let y = 0;
            for (let x = 0; x<CUBE_SIZE; x++){
                output = addPosition
                ? output.concat(this.createCubeRawString(cube[x][y][z].c_bottom,cube[x][y][z].x,cube[x][y][z].y,cube[x][y][z].z))
                : output.concat(cube[x][y][z].c_bottom);
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

    rotate90Clockwise(cubeSide:Square[][]):Square[][]{
        let N = CUBE_SIZE-1;
        for(let i = 0; i<N/2; i++){
            for(let j = i; j<N-i-1; j++){
                var buf = cubeSide[i][j];
                cubeSide[i][j] = cubeSide[N - 1 - j][i];
                cubeSide[N - 1 - j][i] = cubeSide[N - 1 - i][N - 1 - j];
                cubeSide[N - 1 - i][N - 1 - j] = cubeSide[j][N - 1 - i];
                cubeSide[j][N - 1 - i] = buf;
            }
        }
        return cubeSide;
    }

    rotateConst(direction: string, rotate: string, axisConst: string, axisValue: number):void{
        if (axisConst === "X" || axisConst === "x") {
            let x = axisValue;
            for (let y = 0; y < CUBE_SIZE; y++) {
                for (let z = 0; z < CUBE_SIZE; z++){                
                    this.cube[x][y][z] = (
                    direction === rotate 
                    ? this.rotateColorsRightClockwise(this.cube[x][y][z])
                    : this.rotateColorsRightCounterClockwise(this.cube[x][y][z])
                    );
                }
            }
            return;
        }   
        if (axisConst === "Y" || axisConst === "y") {
            let y = axisValue;
            for (let x = 0; x < CUBE_SIZE; x++) {
                for (let z = 0; z < CUBE_SIZE; z++){                
                    this.cube[x][y][z] = (
                    direction === rotate 
                    ? this.rotateColorsTopClockwise(this.cube[x][y][z])
                    : this.rotateColorsTopCounterClockwise(this.cube[x][y][z])
                    );
                }
            }
            return;
        }  
        if (axisConst === "Z" || axisConst === "z") {
            let z = axisValue;
            for (let x = 0; x < CUBE_SIZE; x++) {
                for (let y = 0; y < CUBE_SIZE; y++){                
                    this.cube[x][y][z] = (
                    direction === rotate 
                    ? this.rotateColorsFrontClockwise(this.cube[x][y][z])
                    : this.rotateColorsFrontCounterClockwise(this.cube[x][y][z])
                    );
                }
            }
            return;
        }
    }

    rotateF(direction: string){  
        this.rotateConst(direction,"","Z",CUBE_SIZE-1); //Front   
        direction === "" ? console.log(`F`) : console.log(`F'`);  
    }
    rotateB(direction: string){
        this.rotateConst(direction,"_","Z",0); //Back
        direction === "" ? console.log(`B`) : console.log(`B'`);          
    }
    rotateS(direction: string){        
        let z = CUBE_SIZE-2;
        for (let i = 0; i < z; i++){
            this.rotateConst(direction,"","Z",i+1);//Standing
            direction === "" ? console.log(`S: axis = ${i+1}`) : console.log(`S' axis = ${i+1}`);  
        }                
    }
    rotateL(direction: string){
        this.rotateConst(direction,"_","X",0); //Left
        for (let y = 0; y<CUBE_SIZE-1;y++){
            for(let z = 0; z<CUBE_SIZE-1;z++) {
                this.side[y][z] = this.cube[0][y][z];      
            }
        }  
        this.rotate90Clockwise(this.side);
        for (let y = 0; y<CUBE_SIZE-1;y++){
            for(let z = 0; z<CUBE_SIZE-1;z++) {
                this.cube[0][y][z] = this.side[y][z];      
            }
        }        
        direction === "" ? console.log(`L`) : console.log(`L'`); 
    }
    rotateR(direction: string){
        this.rotateConst(direction,"","X",CUBE_SIZE-1); //Right
        direction === "" ? console.log(`R`) : console.log(`R'`); 
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

