let http = require("http");
let server = http.createServer();
/*
http://apir.viamichelin.com/apir/2/findPOI.{format}/{type}/{lg}?center=<center>&authKey=<authKey>&[dist=<dist>]&[distRange=<distRange>]&[nb=<nb>]&[nbRange=<nbRange>]&[sidx=<sidx>]&[filter=<filter>]&[field=<field>]&[source=<source>]&[orderby=<orderby>]&[charset=<charset>]
*/
var options = {
  host: 'restaurant.michelin.fr',
  path: '/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin'
};

http.get(options, (resp) => {
  let data = '';
 
  // A chunk of data has been recieved.
  resp.on('data', (chunk) => {
    data += chunk;
  });
 
  // The whole response has been received. Print out the result.
  resp.on('end', () => {
    console.log(data);
  });
 
}).on("error", (err) => {
  console.log("Error: " + err.message);
});

/*server.on("request", (request, response) => {
	response.writeHead(200);
	var content = "";

	http.request(options, function (res){
		console.log("sending http request");

		var body = "";

		res
		.on("data", function(chunk){
			console.log("chunk received");
			body += chunk;
		})
		.on("end", function(){
			console.log(body);
			/*content = JSON.parse(body);
			response.end(content);
		})
		.on("error", function(err){
			content = err;
		});
	})
	.on("error", function(err){
		content = err;
	}).end();
});*/

server.listen(9001);



