declare module "named-router" {
    import express = require('express');

    interface RouterMatcher {
        (path: String, name: string, ...handler: express.RequestHandler[]): void;
        (path: RegExp, name: string, ...handler: express.RequestHandler[]): void;
    }

    interface NamedRouter extends express.RequestHandler{
        all: RouterMatcher;
        get: RouterMatcher;
        post: RouterMatcher;
        put: RouterMatcher;
        delete: RouterMatcher;
        patch: RouterMatcher;
        options: RouterMatcher;
        use(...handler: express.RequestHandler[]);
        build(name: string, params: Object): String
    }

    function createRouter(): NamedRouter;

    export = createRouter;
}
