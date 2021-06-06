import * as express from "express";

const app = express();
const port = 9000; // default port to listen


// define a route handler for the default home page
app.get( "/", ( req, res ) => {
    // render the index template
    res.send( "index" );
} );

// start the express server
app.listen( port, () => {
    // tslint:disable-next-line:no-console
    console.log( `server started at http://localhost:${ port }` );
} );