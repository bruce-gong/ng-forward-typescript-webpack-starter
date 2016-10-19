import {Component, Injectable, Inject, EventEmitter, Input, Output, bootstrap} from 'ng-forward';
import 'angular-ui-router';
import 'angular-ui-bootstrap';
import 'angular-block-ui';

@Injectable()
@Inject('$q', '$timeout')
class TestService{
  constructor(private $q, private $timeout){}

  getValue(){
    return this.$q(resolve => {
      this.$timeout(() => resolve('Async FTW!'), 3000);
    });
  }
}

@Component({ selector: 'nested', template: '<h3>Nested</h3>' })

class Nested1{ }

@Component({
    selector: 'inner-app',
    directives: [Nested1],
    template: `
        <h2>Inner app</h2>
        <p>ES7 async resolved value: {{ ctrl.num || 'resolving...' }}</p>
        <nested></nested>

        <h4>Event</h4>
        <button (click)="ctrl.triggerEventViaEventEmitter()">
            Trigger Emitted Event
        </button>
        <button (click)="ctrl.triggerEventViaDOM()">
            Trigger DOM Event
        </button>

        <h4>One Way String from Parent (read-only)</h4>
        <p>{{ctrl.msg3}}</p>

        <h4>One Way Binding from Parent (read-only)</h4>
        <input ng-model="ctrl.message1"/>

        <h4>Two Way Binding to/from Parent (read/write)</h4>
        <input ng-model="ctrl.message2"/>
    `
})
@Inject(TestService, '$element')
class InnerApp{
    @Input() message1;
    @Input() message2;
    @Input('message3') msg3;

    @Output() event2 = new EventEmitter();
    @Output() event1 = new Event('event1', {bubbles: true});
    
    num = 0;

    constructor(public TestService, public $element){
        this.resolveValue();
    }

    resolveValue(){
        this.TestService.getValue().then(val => this.num = val);
    }

    triggerEventViaEventEmitter() {
        // Will be emit() very soon. next() is being deprecated.
        this.event2.next();
    }

    triggerEventViaDOM() {
        this.$element.nativeElement.dispatchEvent(this.event1);
    }
}

@Component({
    selector: 'app',
    providers: [TestService, 'ui.bootstrap', 'ui.router', 'blockUI'],
    directives: [InnerApp, Nested1],
    template: `
        <h1>Hello Railinc!</h1>
        <nested></nested>
        <p>Trigger count: {{ ctrl.triggers }}</p>

        <h4>One Way Binding to Child:</h4>
        <input ng-model="ctrl.message1"/>

        <h4>Two Way Binding to/from Child:</h4>
        <input ng-model="ctrl.message2"/>

        <hr/>
        <inner-app (event1)="ctrl.onIncrement()" (event2)="ctrl.onIncrement()"
                   [message1]="ctrl.message1" [(message2)]="ctrl.message2" message3="Hey, inner app... nothin'">
        </inner-app>
        
        <hr/>
        <div uib-alert style="background-color:#fa39c3;color:white">A happy alert!</div>
        
    `
})
@Inject('blockUI', '$timeout')
class AppCtrl{
    triggers;
    message1;
    message2;
    
    constructor(private blockUI, private $timeout){
        this.triggers = 0;
        this.message1 = 'Hey, inner app, you can not change this';
        this.message2 = 'Hey, inner app, change me';
    }

    ngOnInit() {
        console.log("ngOnInit");
        // Block the user interface
        this.blockUI.start();
        this.$timeout(() => this.blockUI.message('Still loading ...'), 5000);
        this.$timeout(() => this.blockUI.stop(), 15000);
    }
    onIncrement(){
        this.triggers++;
    }
    

}

bootstrap(AppCtrl);
