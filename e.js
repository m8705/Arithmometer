
/****************************/
/*                          */
/*       运算相关函数       */
/*                          */
/****************************/

function gcd(a,b){//求最大公约数
     if(b==0){
            return a;
      }
     return gcd(b,a%b)
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
			
			if( ( up === down ) || ( down === "1" ) ){//带分数情况下，不可能存在分子分母相同或分母为1的情况
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
	
	return str
	//console.log(str);
}

function calculate(num1,num2,operator){//根据数字和符号进行分数运算
	
	var n1 = [];
	var n2 = [];
	
	var result;
	
	n1 = convert(num1).split( "/" ); // [ 0分子，1分母 ]
	n2 = convert(num2).split( "/" ); // [ 0分子，1分母 ]
	
	switch(operator){
		case "+":
			result = (n1[0]*n2[1]+n2[0]*n1[1]) + "/" + (n1[1]*n2[1]);
			break;
		case "-":
			result = (n1[0]*n2[1]-n2[0]*n1[1]) + "/" + (n1[1]*n2[1]);
			break;
		case "*":
			result = (n1[0]*n2[0]) + "/" + (n1[1]*n2[1]);
			break;
		case "/":
			result = (n1[0]*n2[1]) + "/" + (n1[1]*n2[0]);
			break;
	}
	
	//console.log(result);
	return result;
	
}

/****************************/
/*                          */
/*       生成部分函数       */
/*                          */
/****************************/

function produceSymbol(){//产生符号

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
	for(var a = 0; a < symbolNum; a++){//用概率决定符号
		
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
	
	return symbolChoice;
	
}

function produceNumber(symbolNum, range){//产生数字
	
	var symbolChoice = produceSymbol();
	
	var numType;
	var numChoice = [];
	var up, down;
	
	for( var b = 0; b < symbolNum + 1; b++ ){//用概率决定数字
		
		numType = Math.random();
		
		if( numType <= 7 / 10 ){//生成整数
			
			numChoice.push( Math.floor(Math.random()*range) + "" );
			
		}
		else{//生成分数或1（避免生成分子或分母为0）
			
			up = Math.ceil( Math.random() * range );//向上取整
			down = Math.ceil( Math.random() * range );//向上取整
			
			if( up === down ){//分子分母相同
				numChoice.push("1");
				continue;
			}
			
			var tmp = Math.random();//是否产生带分数
			if( tmp <= 1/2 ){//产生带分数
				
				while(up <= down || (up%down === 0) ){//重新产生带分数
					
					up = Math.ceil( Math.random() * range );//向上取整
					down = Math.ceil( Math.random() * range );//向上取整
					
				}
				
				numChoice.push( 
					(up - up%down)/down + 
					"'" + 
					(up%down / gcd(up%down,down)) + 
					"/" + 
					down / gcd(up%down,down)
				);
				
			}
			else{//产生分数
			
				numChoice.push( up + "/" + down );
				
			}
			
			
			
		}
		
	}
	return numChoice;
}

function produceRightArray(n, range){//产生n组符合规定的数字和符号
	
	var rightArray = [];
	var flag;
	
	for(var a = 0; a < n; a++){//循环n次
		
		flag = "";
		
		symbolChoice = produceSymbol();
		numChoice = produceNumber(symbolChoice.length,range);
		
		for(var b = 0; b < symbolChoice.length; b++ ){//遍历检查每个符号
			
			if( symbolChoice[b] === "*" ||  symbolChoice[b] === "/"  ){
				
				if(numChoice[b] === "0" || numChoice[b+1] === "0"){
					
					flag = "err";
					a--;
					break;
					
				}
				
			}
			
		}
		
		//console.log(a + flag);
		
		if(flag !== "err"){
			rightArray.push([
				symbolChoice,numChoice
			]);
		}
		
		
	}
	
	//console.log(rightArray);
	return rightArray;
	
}

function produceExpression(n, range){//产生n个表达式字符串
	
	var expression = [];	
	var tmp = "";
	var rightArray = produceRightArray(n,range);
	
	for(var a  = 0; a < n; a++ ){
		
		tmp = "";
		tmp += rightArray[a][1][0];
		
		for(var b  = 0; b < rightArray[a][0].length; b++ ){//符号+数字	
			tmp += rightArray[a][0][b] + rightArray[a][1][b+1];			
		}
		
		expression.push(tmp);
		
	}
	
	//console.log(expression);
	return expression;
}

function produceAnswer(n,range){
	
	var expression = [];	
	var tmp = "";
	var rightArray = produceRightArray(n,range);
	
	for(var a  = 0; a < n; a++ ){//遍历每个产生的结果数组，分别验算结果是否非负
		
		tmp = "";
		tmp += "(" + convert(rightArray[a][1][0]) + ")" ;
		
		for(var b  = 0; b < rightArray[a][0].length; b++ ){//符号+数字	
			tmp += rightArray[a][0][b] + "(" + convert(rightArray[a][1][b+1]) + ")";		
		}
		//console.log(tmp);
		//expression.push(tmp);
		
		while( eval(tmp) < 0 ){//不允许产生算式最终值小于0的情况
			
			rightArray[a] = produceRightArray(1,range)[0];
			
			
			tmp = "";
			tmp += convert(rightArray[a][1][0]);
		
			for(var c = 0; c < rightArray[a][0].length; c++ ){//符号+数字	
				tmp += rightArray[a][0][c] +  "(" +  convert(rightArray[a][1][c+1]) + ")";			
			}
			
			
		}
		
	}
	
	console.log(rightArray);
	
	
	
	
	
}

function produce(n, range){//产生结果
	
	var expression = produceExpression(n, range);
	produceAnswer(n, range);
}

/****************************/
/*                          */
/*       检验相关函数       */
/*                          */
/****************************/

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

function main(){
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
}
main();



//node e.js -n 10 -r 10
//node e.js -e exercisefile.txt -a answerfile.txt
