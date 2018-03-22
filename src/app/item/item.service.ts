import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class ItemService {
    public subject$ = new Subject();

    constructor() {
    }

}
