import {Component, ElementRef, ViewChild} from '@angular/core';
import {Subject} from 'rxjs/Subject';

import {timer} from 'rxjs/observable/timer';
import {of} from 'rxjs/observable/of';

import {map} from 'rxjs/operators/map';
import {mapTo} from 'rxjs/operators';
import {filter} from 'rxjs/operators/filter';
import {forkJoin} from 'rxjs/observable/forkJoin';

import {ReplaySubject} from 'rxjs/ReplaySubject';
import {AsyncSubject} from 'rxjs/AsyncSubject';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
}
