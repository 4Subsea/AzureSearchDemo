let searchResults = [{
        name: 'Nissefar',
        brewery: 'Nøgne Ø',
        type: 'Porter'
    },
    {
        name: 'Bestefar',
        brewery: 'Nøgne Ø',
        type: 'Porter'
    },
    {
        name: 'Tiger Trippel',
        brewery: 'Nøgne Ø',
        type: 'Tripel Ale'
    }
];

let suggestions = ['Nissefar', 'Bestefar', 'Oldefar'];

export class SearchApi {
    search(query) {
        return new Promise(resolve => {
            resolve(searchResults)
        });
    }

    suggest(query) {
        return new Promise(resolve => {
            resolve(suggestions)
        })
    }
}