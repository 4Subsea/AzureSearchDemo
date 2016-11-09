import { EventAggregator } from "aurelia-event-aggregator";
import { RequestSent, ResponseReceived } from "./messages";

export class RequestInterceptor {
    static inject = [EventAggregator]

    constructor(ea) {
        this.ea = ea;
    }

    request(message) {
        console.log(message);
        this.ea.publish(new RequestSent(message));
        return message;
    }

    requestError(error) {
        console.log(error);
        throw error;
    }

    response(message) {
        console.log(message);
        this.ea.publish(new ResponseReceived(JSON.parse(message.response)));
        return message;
    }

    responseError(error) {
        console.log(error);
        throw error;
    }
}