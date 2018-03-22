import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {timer} from 'rxjs/observable/timer';
import {of} from 'rxjs/observable/of';
import {map} from 'rxjs/operators/map';
import {Subscription} from 'rxjs/Subscription';
import {filter} from 'rxjs/operators/filter';
import {mapTo} from 'rxjs/operators';
import {Subject} from 'rxjs/Subject';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {forkJoin} from 'rxjs/observable/forkJoin';
import {AsyncSubject} from 'rxjs/AsyncSubject';

@Component({
  selector: 'app-observable-examples',
  templateUrl: './observable-examples.component.html',
  styleUrls: ['./observable-examples.component.css']
})
export class ObservableExamplesComponent {
    @ViewChild('scrollMe') private myScrollContainer: ElementRef;
    @ViewChild('scrollMeSubject') private myScrollContainerSubject: ElementRef;
    @ViewChild('waitForSubscribe') private waitForSubscribe: ElementRef;
    @ViewChild('subjectType') private subjectType: ElementRef;

    protected subject$;

    protected subscription$;
    protected subjectSubscription$;

    protected eventsCounter = 0;

    public output = '';
    public subscriberOutput = '';
    public subjectDescription = '';

    constructor() {
        this.subjectDescription = this.getDescription('subject');
    }

    simulateRequests(subject$: Subject<any>, output: string) {
        const duration = 2000;
        const event = `GET / : took ${duration} ms\n`;
        let timerSubscription$: Subscription;

        let count = 1;
        timerSubscription$ = timer(0, duration)
            .subscribe(x => {
                if (count <= 5) {
                    this[output] += count + ': ' + event;

                    subject$.next(count + ': ' + event);

                    count++;
                } else {
                    subject$.complete();
                    timerSubscription$.unsubscribe();
                }
            });
    }

    testSubject() {
        this.output = '';
        this.subscriberOutput = '';

        const subject = SubjectFactory.getInstance(this.subjectType.nativeElement.value);

        const time = this.waitForSubscribe.nativeElement.value || 3000;
        this.subscriberOutput += `Subscribing to events after: ${time}ms\n`;

        const timerSub = timer(time, time)
            .subscribe(x => {
                subject
                    .subscribe(x => {
                        this.subscriberOutput += 'Observed: ' + x;
                    });
                timerSub.unsubscribe();
                ;
            });

        this.simulateRequests(subject, 'output');
    }

    getDescription(what) {
        switch (what) {
            case 'async':
                return `An AsyncSubject emits the last value (and only the last value) emitted by the source
Observable, and only after that source Observable completes. (If the source Observable does
not emit any values, the AsyncSubject also completes without emitting any values.)
It will also emit this same final value to any subsequent observers. However,
if the source Observable terminates with an error, the AsyncSubject will not emit any items,
but will simply pass along the error notification from the source Observable.`;
            case 'behavior':
                return `When an observer subscribes to a BehaviorSubject, it begins by emitting the item
most recently emitted by the source Observable (or a seed/default value if none has yet been emitted)
and then continues to emit any other items emitted later by the source Observable(s).
However, if the source Observable terminates with an error, the BehaviorSubject will not emit any
items to subsequent observers, but will simply pass along the error notification from the source Observable.`;
            case 'replay':
                return `ReplaySubject emits to any observer all of the items that were emitted by the
source Observable(s), regardless of when the observer subscribes. There are also versions of ReplaySubject that
will throw away old items once the replay buffer threatens to grow beyond a certain size, or when a specified
timespan has passed since the items were originally emitted. If you use a ReplaySubject as an observer, take care
not to call its onNext method (or its other on methods) from multiple threads, as this could lead to coincident
(non-sequential) calls, which violates the Observable contract and creates an ambiguity in the resulting Subject
as to which item or notification should be replayed first.`;
            default:
            case 'subject':
                return `PublishSubject or Subject emits to an observer only those items that are emitted by the
source Observable(s) subsequent to the time of the subscription. Note that a PublishSubject may begin emitting
items immediately upon creation (unless you have taken steps to prevent this), and so there is a risk that one
or more items may be lost between the time the Subject is created and the observer subscribes to it. If you need
to guarantee delivery of all items from the source Observable, you’ll need either to form that Observable with
Create so that you can manually reintroduce “cold” Observable behavior (checking to see that all observers have
subscribed before beginning to emit items), or switch to using a ReplaySubject instead.`;
        }
    }

    public mappedEvent = '';
    public mappedOutput = '';

    showMap() {
        this.mappedOutput = '';
        this.mappedEvent = '';
        const subject$ = new ReplaySubject();
        of({id: 1})
            .subscribe(x => {
                this.mappedEvent += 'Event: ' + JSON.stringify(x);
                subject$.next(x);
            });

        subject$
            .pipe(map(x => 'Observed: ' + JSON.stringify(x) + '. Mapped x to x.id. Returned: ' + x.id + '.'))
            .subscribe(x => this.mappedOutput += x);
    }

    public filterEvent = '';
    public filterOutput = '';

    showFilter() {
        this.filterEvent = '';
        this.filterOutput = '';
        const subject$ = new ReplaySubject();

        of({id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5})
            .subscribe(x => {
                this.filterEvent += 'Event: ' + JSON.stringify(x) + '\n';
                subject$.next(x);
            });

        subject$
            .pipe(filter((x: any) => x.id % 2 !== 0))
            .pipe(map(x => 'Observed: ' + JSON.stringify(x) + '\n'))
            .subscribe(x => this.filterOutput += x);
    }

    public forkJoinEvent = '';
    public forkJoinOutput = '';

    showForkJoin() {
        this.forkJoinEvent = '';
        this.forkJoinOutput = '';


        const subject1$ = timer(1000).pipe(mapTo({id: 1, time: 1000}));
        const subject2$ = timer(2000).pipe(mapTo({id: 2, time: 2000}));
        const subject3$ = timer(3000).pipe(mapTo({id: 3, time: 3000}));

        forkJoin(subject1$, subject2$, subject3$)
            .subscribe(([subject1Data, subject2Data, subject3Data]) => {
                this.forkJoinOutput += 'Observed completed events\n';
                this.forkJoinOutput += 'Event' + JSON.stringify(subject1Data) + '\n';
                this.forkJoinOutput += 'Event' + JSON.stringify(subject2Data) + '\n';
                this.forkJoinOutput += 'Event' + JSON.stringify(subject3Data) + '\n';
            });

        subject1$
            .subscribe(x => {
                this.forkJoinEvent += 'Event ' + JSON.stringify(x) + '\n';
            });
        subject2$
            .subscribe(x => {
                this.forkJoinEvent += 'Event ' + JSON.stringify(x) + '\n';
            });
        subject3$
            .subscribe(x => {
                this.forkJoinEvent += 'Event ' + JSON.stringify(x) + '\n';
            });
    }
}

export class SubjectFactory {
    static getInstance(what: string): Subject<any> {
        switch (what) {
            case 'async':
                return new AsyncSubject();
            case 'behavior':
                return new BehaviorSubject('Default Value\n');
            case 'replay':
                return new ReplaySubject();
            default:
            case 'subject':
                return new Subject();
        }
    }
}
