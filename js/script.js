 cidade ="";
	  estado ="";
	  isCelsius = true;
	  consulta=null;
	  const openweatherID = "2c25e8de0e3d326ed4b873adb691f09a";
	  
	  function converterTemp(t){
	     if(!isCelsius){
		    t = (t*9/5)+32;
		 }
		 return Math.round(t)
	  }
	  
	  function GetParametro(){
	     link = window.location.href;
	     i = link.indexOf('?');
		 if(i>=0){
		    link = link.substring(i,link.length)
	        //Pegar parametro na url
			params = (new URL(document.location)).searchParams;
			
			if(params.get("cidade") != null){
			  cidade = params.get("cidade").toUpperCase();
			  document.getElementById("txtCidade").value = cidade;
			  consultarClima();
			}
		 }
		 else{
			 cidade = "São José do Rio Preto";
			 consultarClima();
		 }
	  }
	 function buscarCidade(){
	    cidade = document.getElementById("txtCidade").value;
		if(cidade!=""){
		    link = window.location.href;
	        i = link.indexOf('?');
		    link = link.substring(0,i);
			//Remover acentos
		    cidade = cidade.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
			cidade = cidade.toLowerCase();
	        window.location.replace(link +"?cidade="+cidade);
		}
		else{
		    alert("Digite o nome da cidade!");
		}
	 }
	 function consultarClimaCompleto(c){
		cidade = c.name;
	    urlConsulta = "https://api.openweathermap.org/data/2.5/onecall?lat="+c.coord.lat+"&lon="+c.coord.lon+"&callback=pegarDados&appid="+openweatherID+"&units=metric&lang=pt_br";
		//Cria elemento javascript
	    var script = document.createElement("script");
	   
	    //Sincroniza callback
	    script.src = urlConsulta;
	   
	   
	    document.body.appendChild(script);
		
		document.getElementById('title').innerHTML="Clima de "+c.name;
		
	    
	 }
	 function consultarClima(){
		
		urlConsulta = "https://api.openweathermap.org/data/2.5/weather?q="+cidade+",br&callback=consultarClimaCompleto&appid="+openweatherID+"&units=metric&lang=pt_br";
		//Cria elemento javascript
	   	var script = document.createElement("script");
	   
	    //Sincroniza callback
	    script.src = urlConsulta;
	   
	    document.body.appendChild(script);
	   
	 }
	 
	 
	 function pegarDados(objJson){
	     consulta = objJson;
		 AtualizarTela();
	 }
	 function selectImage(icon){
		return "images/"+icon+".svg";
	 }
	 
	 function AtualizarTela(){
	   if(consulta!=null){
	  
	    document.getElementById("imgAtual").src = selectImage(consulta.current.weather[0].icon);
		document.getElementById("tempAtual").innerHTML = converterTemp(consulta.current.temp);
		document.getElementById("txtDados").innerHTML =  consulta.current.weather[0].description+"<br>Umidade: "+consulta.current.humidity +"%<br>Vento: "+consulta.current.wind_speed;
		document.getElementById("cidade").innerHTML = cidade;
		
		//Proximos dias
		criarTabela();
		
		document.getElementById("divResultado").style.display = "block";
	   }
	   else{
	     document.getElementById("divResultado").style.display = "none";
	   }
	 }
	 function criarTabela(){ 
	    var months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
		if(consulta.daily.length>1){
			  //Criar html da tabala com o resultado
			  txtHTML="<table class='table'>";
			  txtHTML+="<thead>";
			  txtHTML+="<tr>";
			  txtHTML+="<th scope='col'>DATA</th>";
			  txtHTML+="<th scope='col'>PREVISÃO</th>";
			  txtHTML+="<th scope='col'>DESCRIÇÃO</th>";
			  txtHTML+="<th scope='col'>MIN</th>";
			  txtHTML+="<th scope='col'>MAX</th>";
			  txtHTML+="</tr>";
			  txtHTML+="</thead>";
			  txtHTML+="<tbody>";
			 
			for(i=1; i< consulta.daily.length; i++){
			    img = selectImage(consulta.daily[i].weather[0].icon);
				var date = new Date(consulta.daily[i].dt * 1000);
				
			    txtHTML += "<tr>";
				
				txtHTML += "<td>"+date.getDate()+" "+months[date.getMonth()]+"</td>";
				txtHTML += "<td> <img  src="+img+" width='32'/></td>";
				txtHTML += "<td>"+consulta.daily[i].weather[0].description.toUpperCase()+"</td>";
				txtHTML += "<td><img  src='images/min.svg' />"+converterTemp(consulta.daily[i].temp.min)+"º</td>";
				txtHTML += "<td><img  src='images/max.svg' />"+converterTemp(consulta.daily[i].temp.max)+"º</td>";
				
			
				txtHTML += "</tr>";
				 
			}
			txtHTML+="</tbody>";
		    txtHTML+="</table>";
		}
		document.getElementById('divTabela').innerHTML = txtHTML;
	 }
	 
	 function trocarCelsius(){
	     if(!isCelsius){
		  isCelsius = true;
		  document.getElementById("celsius").style.color = "black";
		  document.getElementById("fahrenheit").style.color = "gray";
		  AtualizarTela();
		}
	 }
	 function trocarFahrenheit(){
	    if(isCelsius){
		  isCelsius = false;
		  document.getElementById("fahrenheit").style.color = "black";
		  document.getElementById("celsius").style.color = "gray";
		  AtualizarTela();
		}
	  }