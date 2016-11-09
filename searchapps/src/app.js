export class App {
    configureRouter(config, router) {
        this.router = router;
        config.title = 'Azure Search Demo';
        config.map([
            { route: ['', 'home'], name: 'home', moduleId: 'home/home', title: 'Home' },
            { route: 'simple', name: 'simple', moduleId: 'simple/simple', title: 'Simple', nav: true },
            { route: 'facets', name: 'facets', moduleId: 'facets/facets', title: 'Faceted Search', nav: true }
        ]);
    }
}