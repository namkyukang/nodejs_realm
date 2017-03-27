var http = require('http');
var express = require('express');
var client = require('./lib/realm');
//파일 내의 코드를 가져와서 코드를 실행시켜서 집어 넣는다.
var bodyParser = require('body-parser');
var app = express(); //요래 되면 실행된 결과값이 더해진다.
//일반적인 쿼리 스트링 형태를 처리하는 파서 모듈 사용
app.use(bodyParser.urlencoded({extended: false}));
//json을 처리하는 parser 모듈 사용
app.use(bodyParser.json());

//app.use를 하게 되면 주소랑 상관없이 모든걸 app.use에서 catch를 한다. 그래서 app.get을 인식 못함 
//get방식으로 들어온 bbs url 에 대해서 처리해준다.
//express를 이용한 get처리
app.get("/user",(request,response)=>{
	//response.send('안녕 bbs야 환영해');
	readAll(response,NaN, NaN);
});
//express를 이용한 REST Ful 처리 
app.get("/user/:skip/:offset",(request,response)=>{
	//response.send('안녕 bbs야 환영해');
	var skip = parseInt(request.params.skip);
	var offset = parseInt(request.params.offset);
	readAll(response,skip,offset);
});

app.post("/user",(request,response)=>{
	var postdata = request.body;	//주소줄 외의 변수 , 데이터, 파일 등등등 
	createData(response, postdata);
});

http.createServer(app).listen(8080,()=>{
	console.log('Server running .....');
});

//express 모듈로 node 서버를 띄우는 과정. 생 노드로 하게되면 주소 줄에서 데이터를 가져와 쪼개주고 해야하는데
//api형태로 express가 제공한다.
function send500(response){
	response.writeHead(500, {'Content-Type':'text/html'});
	response.end('500 Server inter Error');
}

function createData(response, data){
	//data의 date 변수값만 서버시간으로 변경해준다.
	data.date = new Date();
	client.UserRealm.write( () => { 
		client.UserRealm.create('User', data);	// 
	});
	send200(response,"등록되었습니다. ",'text/html');
}

function readAll(response,skip,offset){//skip 만큼 제외하고 offset만큼 가져온다.
	var users = client.UserRealm.objects('User').sorted('date', true);
	response.send( {data:users} );
}

function send200(response, data, mimeType){
	response.writeHead(200, {'Content-Type': mimeType});
	response.end(data);
}