import { BindingEngine } from "aurelia-binding";

export class MultiCollectionSubscriber {
    static inject = [BindingEngine];

    constructor(bindingEngine) {
        this.bindingEngine = bindingEngine;
        this.listsToSubscribe = [];
        this.subscriptions = [];
    }

    observe(lists) {
        lists.forEach(list => this.listsToSubscribe.push(list));

        return this;
    }

    onChanged(execute) {
        this.listsToSubscribe.forEach(list => {
            let subscription = this.bindingEngine
                .collectionObserver(list)
                .subscribe(changes => execute(changes));
            this.subscriptions.push(subscription);
        });

        return this;
    }

    dispose() {
        this.subscriptions.forEach(x => x.dispose());
    }
}