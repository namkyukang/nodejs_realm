var http = require('http');
var express = require('express');
var client = require('mongodb').MongoClient;
//파일 내의 코드를 가져와서 코드를 실행시켜서 집어 넣는다.
var bodyParser = require('body-parser');
var app = express(); //요래 되면 실행된 결과값이 더해진다.
//일반적인 쿼리 스트링 형태를 처리하는 파서 모듈 사용
app.use(bodyParser.urlencoded({extended: false}))
//json을 처리하는 parser 모듈 사용
app.use(bodyParser.json())

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

app.post("/bbs",(request,response)=>{
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
	console.log("insert createData function");
	console.log(data);
	//data = JSON.parse(data);
	client.connect('mongodb://localhost:27017/bbs', (error, db) => {	//bbs노드가 없으면 생성해주고 있으면 리턴해준다.
	    if(error) {
	        console.log(error);
	        send500(response);
	    } else {
	        // 1. 입력할 document 생성
	        var post = {title : data.title ,content : data.content , name: data.name};
	        // 2. student 컬렉션의 insert( ) 함수에 입력
	        db.collection('qna').insert(post);
	        db.close();
	        data = "<html><head><title>결과</title></head><body>등록되었습니다.</body></html>"
	        send200(response,data,'text/html');
	    }
	});
}
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