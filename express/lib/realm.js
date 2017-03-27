var Realm = require('realm'); 
// let - final 
//Realm 테이블 설정 값 
let UserSchema = {
	name : 'User', 
	properties : { 
		name : 'string', //어떤 데이터 타입을 사용할지 realm에게 알려준다. 
		email : 'string', 
		tel : 'string', 
		date : 'date' 
	} 
}; 
//위에서 정의한 Realm테이블의 설정값을 사용해서 테이블을 생성한다.
var UserRealm = new Realm({ 
	path : 'user.realm', 
	schema : [UserSchema] 
});

module.exports = { 
	UserRealm : UserRealm 
};


//클래스 생성
// var clazz = {
// 	a : 1,
// 	b : "2",
// 	fun : function(){
// 		var sum = 33;
// 		sum = sum +24;
// 		return sum
// 	},
// };