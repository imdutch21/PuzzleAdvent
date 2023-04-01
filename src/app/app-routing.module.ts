import { NgModule } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RouterModule, RouterStateSnapshot, Routes } from '@angular/router';
import { SudokuComponent } from './components/sudoku/sudoku.component';
import { WordSearchComponent } from './components/word-search/word-search.component';

const canActivateDate: CanActivateFn =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
      let date = route.data['date'] as Date;
      return new Date() > date;
    };


const routes: Routes = [
  { path: "sudoku", component: SudokuComponent, canActivate: [canActivateDate], data : {date:new Date(2023, 2, 29)} },
  { path: "wordSearch", component: WordSearchComponent, canActivate: [canActivateDate], data : {date:new Date(2023, 2, 29)} },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
