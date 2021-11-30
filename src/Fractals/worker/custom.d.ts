declare module 'comlink-loader!*' {
    class WebpackWorker extends Worker {
        constructor();

        // Add any custom functions to this class.
        // Make note that the return type needs to be wrapped in a promise.
        // processData(data: string): Promise<string>;
        init(WIDTH: number, HEIGHT: number, REAL_SET: any, IMAGINARY_SET: any, juliaC: any): void;
        draw(col: number | undefined): any;
        drawJulia(col: number | undefined): any;
    }

    export = WebpackWorker;
}
