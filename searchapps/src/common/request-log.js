import { EventAggregator } from 'aurelia-event-aggregator';
import { RequestSent, ResponseReceived } from './messages';

export class RequestLog {
    static inject = [EventAggregator];

    constructor(ea) {
        this.ea = ea;
        this.request = '';
        this.response = '';

        ea.subscribe(RequestSent, msg => this.request = JSON.stringify(msg.request, null, 4));
        ea.subscribe(ResponseReceived, msg => this.response = JSON.stringify(msg.response, null, 4));
    }

    get hasValues() {
        return this.request || this.response;
    }

}