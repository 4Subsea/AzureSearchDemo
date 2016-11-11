import { BindingEngine } from "aurelia-binding";

export class MultiCollectionSubscriber {
    static inject = [BindingEngine];

    constructor(bindingEngine) {
        this.bindingEngine = bindingEngine;
        this.observers = []
        this.subscriptions = [];
    }

    observe(collection) {
        collection.forEach(x => {
            let observer = this.bindingEngine.collectionObserver(x);
            this.observers.push(observer)
        });

        return this;
    }

    onChanged(execute) {
        this.observers
            .forEach(x => this.subscriptions.push(x.subscribe(change => execute(change))));
    }

    dispose() {
        this.subscriptions.forEach(x => x.dispose());
        this.observers = [];
    }
}