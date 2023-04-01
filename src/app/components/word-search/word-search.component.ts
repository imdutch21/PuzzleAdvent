import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-word-search',
  templateUrl: './word-search.component.html',
  styleUrls: ['./word-search.component.scss']
})
export class WordSearchComponent {
  @Input()
  wordSearch: string[][] = [
    ['N', 'G', 'K', 'M', 'E', 'R', 'S', 'T', 'P', 'S'],
    ['L', 'E', 'E', 'M', 'E', 'A', 'N', 'O', 'A', 'E'],
    ['S', 'O', 'V', 'R', 'O', 'L', 'P', 'H', 'K', 'M'],
    ['E', 'L', 'O', 'L', 'G', 'P', 'K', 'L', 'K', 'A'],
    ['J', 'J', 'B', 'P', 'E', 'D', 'J', 'R', 'E', 'G'],
    ['K', 'I', 'K', 'N', 'B', 'O', 'L', 'E', 'T', 'O'],
    ['E', 'O', 'B', 'D', 'C', 'A', 'A', 'K', 'J', 'E'],
    ['O', 'X', 'H', 'Q', 'R', 'P', 'N', 'Q', 'E', 'D'],
    ['K', 'G', 'A', 'O', 'A', 'T', 'H', 'D', 'S', 'I'],
    ['S', 'T', 'E', 'E', 'N', 'K', 'O', 'O', 'L', 'V']
  ];
  @Input()
  words: string[] = ["pakketjes", "elven", "loopband", "poppen", "videogames", "greg", "steenkool", "koekjes", "melk"];
  @Input()
  awnser: string = "";

  foundWords: string[] = [];
  foundPoints: { x: number, y: number }[] = [];

  selectedRow: number | undefined = undefined;
  selectedCol: number | undefined = undefined;
  hoverRow: number | undefined = undefined;
  hoverCol: number | undefined = undefined;

  isFound(row: number, col: number) : boolean {
    for (let i = 0; i < this.foundPoints.length; i++) {
      const element = this.foundPoints[i];
      if(element.x == row && element.y == col)
      return true;
    }
    return false;
  }

  isInLine(row: number, col: number): boolean {

    if (this.selectedRow === undefined || this.selectedCol === undefined || this.hoverRow === undefined || this.hoverCol === undefined) return false;
    if (this.selectedCol === col && this.selectedRow === row) return true;
    if (this.hoverCol === col && this.hoverRow === row) return true;

    if (this.selectedCol === this.hoverCol && this.selectedCol === col) return row > Math.min(this.selectedRow, this.hoverRow) && row < Math.max(this.selectedRow, this.hoverRow);
    if (this.selectedRow === this.hoverRow && this.selectedRow === row) return col > Math.min(this.selectedCol, this.hoverCol) && col < Math.max(this.selectedCol, this.hoverCol);
    if (Math.abs(this.selectedCol - this.hoverCol) === Math.abs(this.selectedRow - this.hoverRow)) {
      if (Math.abs(this.selectedCol - col) === Math.abs(this.selectedRow - row) &&
        Math.abs(this.hoverCol - col) === Math.abs(this.hoverRow - row)) {
        return col > Math.min(this.selectedCol, this.hoverCol) && row > Math.min(this.selectedRow, this.hoverRow)
          && col < Math.max(this.selectedCol, this.hoverCol) && row < Math.max(this.selectedRow, this.hoverRow)
      }
    }
    return false;
  }


  findWord(row: number, col: number) {
    if (this.selectedCol === col && this.selectedRow === row) {
      this.selectedRow = undefined;
      this.selectedCol = undefined;
    } else if (this.selectedCol !== undefined && this.selectedRow !== undefined && this.isInLine(row, col)) {

      const y1 = this.selectedCol;
      const y2 = col
      const x1 = this.selectedRow;
      const x2 = row;
      const dx = Math.abs(x2 - x1);
      const dy = Math.abs(y2 - y1);

      const sx = (x1 < x2) ? 1 : -1;
      const sy = (y1 < y2) ? 1 : -1;
      let err = dx - dy;
      let x = x1;
      let y = y1;

      let result = "";
      let points: { x: number, y: number }[] = [];

      while (true) {
        result += this.wordSearch[x][y];
        points.push({x, y})

        if (x === x2 && y === y2) {
          break;
        }

        const e2 = 2 * err;

        if (e2 > -dy) {
          err -= dy;
          x += sx;
        }

        if (e2 < dx) {
          err += dx;
          y += sy;
        }
      }

      if (this.words.includes(result.toLowerCase())) {
        this.foundWords.push(result.toLowerCase())
        this.foundPoints.push(...points);
      } else if (this.words.includes(result.toLowerCase().split("").reverse().join(""))) {
        this.foundWords.push(result.toLowerCase().split("").reverse().join(""))
        this.foundPoints.push(...points);
      }
      console.log(result)

      this.selectedRow = undefined;
      this.selectedCol = undefined;
    } else {
      this.selectedRow = row;
      this.selectedCol = col;
    }
  }
  mouseEnter(row: number, col: number) {
    this.hoverRow = row;
    this.hoverCol = col;
  }
}
