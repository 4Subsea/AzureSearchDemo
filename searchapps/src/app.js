export class App {
    configureRouter(config, router) {
        this.router = router;
        config.title = 'Azure Search Demo';
        config.map([
            { route: ['', 'home'], name: 'home', moduleId: 'home/index' },
            { route: 'simple', name: 'simple', moduleId: 'simple/index', nav: true }
        ]);
    }
}