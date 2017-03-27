var http = require('http');
var express = require('express');

//파일 내의 코드를 가져와서 코드를 실행시켜서 집어 넣는다.
var app = express(); //요래 되면 실행된 결과값이 더해진다.

app.use(function(request, response){
	response.writeHead(200,{'Content-Type':'text/html'});	//결과를 text/html 형식으로 던져 줄것이라고 알림
	response.end('<h1>Hello Express HAHAHAHAHAHA</h1>');

});

http.createServer(app).listen(8080,()=>{
	console.log('Server running .....');
});

//express 모듈로 node 서버를 띄우는 과정. 생 노드로 하게되면 주소 줄에서 데이터를 가져와 쪼개주고 해야하는데
//api형태로 express가 제공한다.