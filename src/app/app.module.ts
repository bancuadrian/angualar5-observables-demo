import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {Routes} from '@angular/router';
import {RouterModule} from '@angular/router';
import { ObservableExamplesComponent } from './observable-examples/observable-examples.component';
import { AccordionComponent } from './accordion/accordion.component';
import { ItemComponent } from './item/item.component';
import {ItemService} from './item/item.service';

const routes: Routes = [
    {path: '', component: ObservableExamplesComponent, pathMatch: 'full'},
    {path: 'accordion', component: AccordionComponent},
    {redirectTo: '', path: '**'}
];

@NgModule({
  declarations: [
    AppComponent,
    ObservableExamplesComponent,
    AccordionComponent,
    ItemComponent
  ],
  imports: [
      BrowserModule,
      RouterModule.forRoot(routes)
  ],
  providers: [ItemService],
  bootstrap: [AppComponent]
})
export class AppModule { }
