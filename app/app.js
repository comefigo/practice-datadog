const tracer = require("dd-trace").init();
const http = require("http");
const redis = require("redis");
const async = require("async");

const redisClient = redis.createClient({
  host: "db",
  port: 6379
});
redisClient.on("error", function(err) {
  console.log("error");
  console.log(err);
});

// サンプルデータの投入
redisClient.set("data1", "hello world 1");
redisClient.set("data2", "hello world 2");

const handleRequest = function(request, response) {
  let resp = "";
  async.parallel(
    [
      function(callback) {
        redisClient.get("data1", function(error, value) {
          callback(null, value);
        });
      },
      function(callback) {
        redisClient.get("data2", function(error, value) {
          callback(null, value);
        });
      }
    ],
    function(err, results) {
      for (let i = 0; i < results.length; i++) {
        resp += "<ul> " + results[i] + " </ul>";
      }
      response.writeHead(200);
      return response.end("<h1>redis value:</h1><br/>" + resp);
    }
  );
};

const www = http.createServer(handleRequest);
www.listen(3000);
