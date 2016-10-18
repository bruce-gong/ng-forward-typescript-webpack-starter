import {Component, bootstrap} from 'ng-forward';

@Component({
    selector: 'app',
    template: `
        <h1>App</h1>
    `
})
class AppCtrl{
    constructor(){
    }

}

bootstrap(AppCtrl);
