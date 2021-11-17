import {
  green,
  rollup,
  // svelte,
  VERSION,
} from "./deps.js";

console.log(green(VERSION));

const rollupInputOptions = {
  input: "src/index.js",
  // external: ["three"],
  // plugins: [
  //   svelte({
  //     include: "src/components/**/*.svelte",
  //   }),
  // ],
};
const rollupOutputOptions = {
  // dir: "build",
  file: "build/bundle.js",
  format: "es",
};


const bundle = await rollup(rollupInputOptions)

await bundle.generate(rollupOutputOptions)
await bundle.write(rollupOutputOptions)
await bundle.close()


// Start listening on port 8080 of localhost.
// const server = Deno.listen({ port: 8080 });
// console.log(`http://localhost:8080/`);

// // Connections to the server will be yielded up as an async iterable.
// for await (const conn of server) {
//   // In order to not be blocking, we need to handle each connection individually
//   // without awaiting the function
//   serveHttp(conn);
// }

// async function serveHttp(conn) {
//   // This "upgrades" a network connection into an HTTP connection.
//   const httpConn = Deno.serveHttp(conn);
//   // Each request sent over the HTTP connection will be yielded as an async
//   // iterator from the HTTP connection.
//   for await (const requestEvent of httpConn) {
//     // The native HTTP server uses the web standard `Request` and `Response`
//     // objects.
//     const body = "Hello world";
//     // The requestEvent's `.respondWith()` method is how we send the response
//     // back to the client.
//     requestEvent.respondWith(
//       new Response(body, {
//         status: 200,
//       }),
//     );
//   }
// }
