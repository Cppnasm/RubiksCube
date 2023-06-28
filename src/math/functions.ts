export function createMatrixRawString(c: string, x: number, y: number, z: number):string{
    let str: string;
    str = `${c}:(${x};${y};${z}) `;
    return str;
}

export function rotateClockwise(arr: Array<any[]>, matrix_dimension: number){
    let n = matrix_dimension;
    for(let i = 0; i<n/2; i++){
        for(let j = i; j<n-i-1; j++){
            let buf = arr[i][j];
            arr[i][j] = arr[n-j-1][i];
            arr[n-j-1][i] = arr[n-i-1][n-j-1];
            arr[n-i-1][n-j-1] = arr[j][n-i-1];
            arr[j][n-i-1] = buf;
        }
    }
}

export function rotateCounterClockwise(arr: Array<any[]>, matrix_dimension: number){
    let n = matrix_dimension;
    for (let i = 0; i<n/2; i++) {
        for (let j = i; j<n-i-1; j++) {
            let buf = arr[i][j];
            arr[i][j] = arr[j][n-i-1];
            arr[j][n-i-1] = arr[n-i-1][n-j-1];
            arr[n-i-1][n-j-1] = arr[n-j-1][i];
            arr[n-j-1][i] = buf;
        }
    }
}