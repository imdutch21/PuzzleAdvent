import { Component, HostListener, Input, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs';
import { CelInfo } from 'src/app/models/cel.model';

@Component({
  selector: 'app-sudoku',
  templateUrl: './sudoku.component.html',
  styleUrls: ['./sudoku.component.scss']
})
export class SudokuComponent implements OnInit {

  @Input()
  inputGrid: (number | undefined)[][] | undefined = [
    [4, 3, 5, 2, 6, 9, 7, 8, 1],
    [6, 8, 2, 5, 7, 1, 4, 9, 3],
    [1, 9, 7, 8, 3, 4, 5, 6, 2],
    [8, 2, 6, 1, 9, 5, 3, 4, 7],
    [3, 7, 4, 6, 8, 2, 9, 1, 5],
    [9, 5, 1, 7, 4, 3, 6, 2, 8],
    [5, 1, 9, 3, 2, 6, 8, 7, 4],
    [2, 4, 8, 9, 5, 7, 1, 3, 6],
    [7, 6, 3, 4, 1, 8, 2, 5, undefined]
  ];

  isCompleted: boolean = false;
  grid: CelInfo[][] = []

  currentRow: number | undefined;
  currentCol: number | undefined;

  mode: string = "number";

  ngOnInit(): void {


    for (let i = 0; i < 9; i++) {
      this.grid.push([]);
      for (let j = 0; j < 9; j++) {
        if (this.inputGrid !== undefined && this.inputGrid.length == 9 && this.inputGrid[i].length == 9 && this.inputGrid[i][j] != undefined)
          this.grid[i].push(new CelInfo(this.inputGrid[i][j], false, undefined));
        else
          this.grid[i].push(new CelInfo(undefined, true, undefined));
      }
    }
  }

  selectCel(row: number, col: number) {
    this.currentCol = col;
    this.currentRow = row;
  }



  onNumberPress(val: number) {
    if (this.currentCol === undefined || this.currentRow === undefined)
      return;

    let current = this.grid[this.currentRow][this.currentCol];
    if (!current.canChangeValue)
      return;

    if (this.mode === "number") {
      if (current.value != val)
        current.value = val;
      else
        current.value = undefined;
      if (current.tinyNumbers !== undefined)
        current.tinyNumbers = undefined;

      if (this.checkIfGridComplete())
        this.isCompleted = true;
    } else if (this.mode === "tiny-number" && current.value === undefined) {
      if (current.tinyNumbers === undefined)
        current.tinyNumbers = [];
      if (current.tinyNumbers.includes(val))
        current.tinyNumbers.splice(current.tinyNumbers.indexOf(val), 1)
      else
        current.tinyNumbers.push(val)

      if (current.tinyNumbers.length == 0)
        current.tinyNumbers = undefined;
      else
        current.tinyNumbers = current.tinyNumbers.sort();
    }
  }


  checkIfGridComplete(): boolean {
    for (let i = 0; i < 9; i++) {
      let row: (number | undefined)[] = [];
      this.grid[i].forEach(x => row.push(x.value));
      console.log(row)
      let col: (number | undefined)[] = [];
      for (let j = 0; j < 9; j++) {
        col.push(this.grid[j][i].value);
      }
      console.log(col)

      let square: (number | undefined)[] = [];
      for (let j = 0; j < 3; j++) {
        for (let k = 0; k < 3; k++) {
          square.push(this.grid[j + (i % 3) * 3][k + Math.floor((i) / 3) * 3].value)
        }
      }
      console.log(square)

      if (!this.includesAllNumers(row) || !this.includesAllNumers(col) || !this.includesAllNumers(square))
        return false;
    }


    return true;
  }

  includesAllNumers(nums: (number | undefined)[]): boolean {
    for (let i = 1; i < 10; i++) {
      if (!nums.includes(i))
        return false;
    }
    return true;
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if ("123456789".includes(event.key)) {
      let val = Number.parseInt(event.key);
      this.onNumberPress(val);
    }
  }
}
