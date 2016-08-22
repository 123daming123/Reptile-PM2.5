
var express=require('express');

var superagent= require('superagent');

var cheerio=require('cheerio');

var app=express();

app.get('/',function(req,res,next){
	superagent.get('http://www.pm25.in/chengdu')
	.end(function(err,sres){
		if(err){
			return next(err);
		}
		var $=cheerio.load(sres.text);
		var newarrayjsonr;
		var newArrayjsonstring;
		var arrjson;
		var array=[];
		var json="[";
         //获取table的标题值
		$('#detail-data thead tr').each(function(i,n){
           var tr=$(n);//标题行
           var tr_var=tr.text();
           var jsonTr=JSON.stringify(tr_var);
           //正则表达式将所有空格符去掉
            var re=/\s/g;
           //console.log(re.test(jsonTr));
           //去掉换行符
           var rep = /\\n/g;
           jsonTr=jsonTr.replace(re,"");
            //console.log(jsonTr);
           // console.log("AAAAAAAAAAAAAAAA");
           var jsonr=jsonTr.replace(rep,"\n");
           var reggp = /\./g;
             jsonr = jsonr.replace(reggp,"");
           //console.log(jsonr); 
           //console.log("BBBBBBBBBBBBBBBBB");
           var arrayjsonr = jsonr.split("\n");
          // console.log(arrayjsonr);
           //console.log("NNNNNNNNNNNNNNNNN");
           newarrayjsonr = arrayjsonr.slice(1,arrayjsonr.length-1);
           console.log(arrayjsonr); 
		});
		//获取table的value值
		$('#detail-data tbody tr').each(function(j,n){
			var tr=$(n);//行
			var tr_value=tr.text();
			  var jsonstring=JSON.stringify(tr_value);
			// console.log(jsonstring);
			//正则表达式将所有空格符去掉
            var re=/\s/g;
            //var rep = /\\n/g;
            jsonstring = jsonstring.replace(re,"");
            
            //匹配两个及以上'\n'字符串
           var regExpRepeat = /(\\n){2,}/g;
           jsonstring = jsonstring.replace(regExpRepeat,"\\n");
            //匹配\n，再replace方法去掉
			var regExp1 = /\\n/g;
			jsonstring = jsonstring.replace(regExp1,"\n");
			
			newArrayjsonstring = jsonstring.split('\n');
			newArrayjsonstring = newArrayjsonstring.slice(1,newArrayjsonstring.length-1);
			array.push(newArrayjsonstring);
 
		});
           var arr_link= [];
		 for(var i=0;i<array.length;i++){
            //遍历二维数组	
            	 arr_link =array[i];
            	 json+="{";
            	 for(var k=0;k<newarrayjsonr.length;k++){
            	 	     //将两个数组的数据进行匹配，生成json数据
                      	 json+="\"";
                      	 json+=newarrayjsonr[k];
            		     json+="\"";
            		     json+=":";
                         json+="\"";
            		     json+=arr_link[k];
            		     json+="\""; 
            		     json+="\,";
            		     

                   }
                    json=json.substring(0,json.length-1); 
                   json+="}";
            	 json+=",";  
            	          
            }
                json=json.substring(0,json.length-1);
            	json+="]";
           //发送请求
           //res.send(json);

		userDao.add(res,json,'pc');
		/*var date= new Date();
		var curtime=date.getTime();*/
		
	});
});
app.listen(3000, function () {
  console.log('app is listening at port 3000');
});