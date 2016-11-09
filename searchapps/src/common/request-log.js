import { EventAggregator } from 'aurelia-event-aggregator';
import { RequestSent, ResponseReceived } from './messages';

export class RequestLog {
    static inject = [EventAggregator];

    constructor(ea) {
        this.ea = ea;
        this.request = '';
        this.response = '';

        ea.subscribe(RequestSent, msg => this.request = msg.request);
        ea.subscribe(ResponseReceived, msg => this.reponse = msg.response);
    }

}