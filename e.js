
//console.log(process.argv);

var arg1 = process.argv[2];
var arg2 = process.argv[3];
var arg3 = process.argv[4];
var arg4 = process.argv[5];

if( (arg1 === "-n") && (arg3 === "-r") ){//参数控制：生成题目
	
	arg2 = Math.floor(arg2);//取整
	if( arg2 > 0 && arg2 <= 10000 ){
		
		arg4 = Math.floor(arg4);//取整
		if( arg4 > 0 && arg4 <= 100 ){
			
			produce(arg2,arg4);
			
		}
		else{
			
			console.log("题目生成范围不正确！允许范围：1~100");
			
		}
		
	}
	else{
		
		console.log("题目数量不正确！允许范围：1~10000");
		return;
		
	}
	
}
else if( (arg1 === "-e") && (arg3 === "-a") ){//参数控制：检查题目
	
	arg2 = arg2 ? arg2 : "exercisefile.txt";
	arg4 = arg4 ? arg4 : "answerfile.txt";
	
	judge(arg2,arg4);
	
}
else{
	
	console.log("参数错误！");
	console.log("用例：");
	console.log("生成题目：node e.js -n 10 -r 10");
	console.log("检查题目：node e.js -e exercisefile.txt -a answerfile.txt");
	
}

function convert(str){//将任何数转成真分数（小数不换）
	
	//整数 2 = 2'1/1
	//真分数 3/8
	//假分数 5/3
	//带分数 1'1/2
	
	if( str.indexOf("/") >= 0 ){//真分数或带分数
		
		if( str.indexOf("'") >= 0 ){//带分数
			
			first = str.split("'")[0];
			second = str.split("'")[1];
			
			up = second.split("/")[0];
			down = second.split("/")[1];
			
			if( ( up === down ) || ( down === "1" ) ){
				return "ERROR";
			}
			
			str = ( (+first) * (+down) + (+up) ) + "/" + down;
			
		}
		else{//真分数
			;
		}
		
	}
	else{//整数
		
		str = str + "/1";
		
	}
	
	console.log(str);
}


function produce(n, range){
	
	//console.log(n,range);
	
	//随机生成符号（1,2,3） -> 随机生成运算数种类 -> 随机生成运算数 -> 随机生成括号
	
	var symbol = Math.random();
	var symbolNum;
	
	if( symbol <= 1/3 ){//生成一个符号
		symbolNum = 1;
	}
	else if( symbol <= 2/3 ){//生成两个符号
		symbolNum = 2;
	}
	else{//生成三个符号
		symbolNum = 3;
	}
	
	var symbolChoice = [];
	var tmp;
	for(var a = 0; a < symbolNum; a++){
		
		tmp = Math.random();
		if( tmp <= 1/4 ){
			symbolChoice.push("+");
		}
		else if( tmp <= 2/4 ){
			symbolChoice.push("-");
		}
		else if( tmp <= 3/4 ){
			symbolChoice.push("*");
		}
		else{
			symbolChoice.push("/");
		}
		
	}
	
	console.log(symbolChoice);
	
	var numType;
	var numChoice = [];
	var up, down;
	
	for( var b = 0; b < symbolNum + 1; b++ ){
		
		numType = Math.random();
		
		if( numType <= 7 / 10 ){//生成整数
			
			numChoice.push( Math.floor(Math.random()*range) + "" );
			
		}
		else{//生成分数或1（避免生成分子或分母为0）
			
			up = Math.ceil( Math.random() * range );
			down = Math.ceil( Math.random() * range );
			
			if( up === down ){//分子分母相同
				numChoice.push("1");
			}
			else{
				numChoice.push( up + "/" + down );
			}
			
		}
		
	}
	
	console.log(numChoice);
	
}


function judge(file1,file2){//读取文件并判断正误
	
	console.log(file1,file2)
	
	var fs = require("fs");
	
	fs.readFile(file1, function (err1, data1) {// 异步读取练习题
	
		if (err1) {
			return console.error(err1);
		}
		
		var lines1 = data1.toString().split("\r\n");
		
		fs.readFile(file2, function (err2, data2) {// 异步读取答案
	
			if (err2) {
				return console.error(err2);
			}
		
			var lines2 = data2.toString().split("\r\n");
		
			if(lines1.length !== lines2.length){
				
				console.log("题目数与答案数不匹配！题目数：" + lines1.length + "答案数" + lines2.length );
				return;
				
			}
			
			var correct = [];
			var wrong = [];
	
			var expression;
			var left,right;
	
	
			for( var a = 0; a < lines1.length; a++ ){//按行读取
		
				expression = lines1[a].split(". ")[1];
				left = eval(expression);
		
				answer = lines2[a].split(". ")[1];
				right = eval(answer);
		
				if( Math.abs(right - left) < 1e-10 || Math.abs(left - right) < 1e-10 ){//正确
			
					correct.push( (a + 1) + "" );
			
				}
				else{//错误
			
					wrong.push( (a + 1) + "" );
			
				}
		
		
			}
	
			var result = "";
			result += "Correct: " + correct.length + " (" + ("" + correct ) + ")\n";
			result += "Wrong: " + wrong.length + " (" + ("" + wrong ) + ")\n";
	
	
			fs.writeFile('Grade.txt', result,  function(err) {
				if (err) {
					return console.error(err);
				}
				console.log("数据写入成功！");
				console.log("--------我是分割线-------------");
			});
		
		});
		
	});
	
		
	
}

