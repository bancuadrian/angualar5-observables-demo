import {Component, Input, OnInit} from '@angular/core';
import {ItemService} from './item.service';

@Component({
    selector: 'app-item',
    templateUrl: './item.component.html',
    styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {
    @Input('title') title: string;
    protected isVisible: boolean;

    constructor(protected _itemService: ItemService) {
    }

    ngOnInit() {
        this
            ._itemService
            .subject$
            .subscribe(x => {
                this.isVisible = x === this.title;
            });
    }

    expand() {
        this
            ._itemService
            .subject$
            .next(this.title);
    }
}
