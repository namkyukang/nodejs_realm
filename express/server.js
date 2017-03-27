var http = require('http');
var express = require('express');
var client = require('mongodb').MongoClient;
//파일 내의 코드를 가져와서 코드를 실행시켜서 집어 넣는다.
var app = express(); //요래 되면 실행된 결과값이 더해진다.

//app.use를 하게 되면 주소랑 상관없이 모든걸 app.use에서 catch를 한다. 그래서 app.get을 인식 못함 
//get방식으로 들어온 bbs url 에 대해서 처리해준다.
//express를 이용한 get처리
app.get("/bbs",(requeest,response)=>{
	//response.send('안녕 bbs야 환영해');
	readAll(response,NaN, NaN);
});
//express를 이용한 REST Ful 처리 
app.get("/bbs/:skip/:offset",(requeest,response)=>{
	//response.send('안녕 bbs야 환영해');
	var skip = parseInt(requeest.params.skip);
	var offset = parseInt(requeest.params.offset);
	readAll(response,skip,offset);
});

http.createServer(app).listen(8080,()=>{
	console.log('Server running .....');
});

//express 모듈로 node 서버를 띄우는 과정. 생 노드로 하게되면 주소 줄에서 데이터를 가져와 쪼개주고 해야하는데
//api형태로 express가 제공한다.

function readAll(response,skip,offset){//skip 만큼 제외하고 offset만큼 가져온다.
	var data = '';
	client.connect('mongodb://localhost:27017/bbs', function(error, db){
	    if(error) {
	        console.log(error);
	    } else {
	        // 1. find( ) 함수에 아무런 입력값이 없으면 컬렉션의 전체 document 를 읽어온다.
	        // skip과 limit은 숫자가 아닌 값 undefined, NaN을 자동적으로 예외 처리해준다.
	        db.collection('qna').find().skip(skip).limit(offset).toArray(function(err,docs){
	        	data = '{"data":'+JSON.stringify(docs)+'}';
	        	console.log(data);
	        	send200(response, data, 'application/json');
	        });

	        db.close();
	    }
	});
}
function send200(response, data, mimeType){
	response.writeHead(200, {'Content-Type': mimeType});
	response.end(data);
}