import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { PanComponent } from './pan/pan.component'

const routes: Routes = [
  { path: '', redirectTo: '/pan', pathMatch: 'full' },
  { path: 'pan', component: PanComponent }
]

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
