---
title: Weight Converter with JavaScript
date: 2019-03-09 12:36:48
tags:
  - practical
  - converter
categories:
  - javascript
---

![](https://i.postimg.cc/KzNQQDfD/converter.jpg)

##### Introduction The Concept

The Weight of an object is the force of gravity currently being exerted on that object. **Weight is different from mass** because, while the mass of an object is always the same regardless of the object’s location, the weight will be different depending on ow much gravity there is at that location.You can get details information from here:

- **[Pound Wikipedia](<https://en.wikipedia.org/wiki/Pound_(mass)>)**
- **[Mass Vs Weight](https://www.thoughtco.com/mass-and-weight-differences-606116)**

The pound mass is a fundamental unit within the Imperial system. It is equal to exactly 0.45359237 kilograms.In this section we build simple app for convert between kg and pound with other derivatives using vanilla.js(pure javascript) in very easy way.

##### Step for Build Converter

This is very good for beginner to train their logic using javascript.in this app i'm using Bootstrap css framework for design UI/UX.You can use your favorite css framework too.It's up to you.

First , Build form for input the value.Again use your creativity for design the UI/UX,but this is mine

    <form>
    	<div class="form-row">
    		<div class="col col-sm-8">
    			<input id="lbsInput" type="number" class="form-control form-control-lg mr-2 mb-2" placeholder="Input Value..." autocomplete="off">
    		</div>
    		<div class="col col-4">
    			<select id="selectOption" name="selectOption" class="form-control form-control-lg" onchange="formula(this)">
    				<option selected value="default">From...</option>
    				<option value="kg">Kg</option>
    				<option value="pound" >Pound</option>
    			</select>
    		</div>
    	</div>
    </form>

Second,Build Box for result of the convertion value,again this is mine

    <div id="output">

    	<div class="card mt-2 bg-info pl-2">
    		<div class="card-block">
    			<h4>Pound:</h4>
    			<div id="poundOutput"></div>
    		</div>
    	</div>

    	<div class="card mt-2 bg-success pl-2">
    		<div class="card-block">
    			<h4>Grams:</h4>
    			<div id="gramsOutput"></div>
    		</div>
    	</div>

    	<div class="card bg-warning mt-2">
    		<div class="card-block pl-2">
    			<h4>Ounces:</h4>
    			<div id="ozOutput"></div>
    		</div>
    	</div>

    	<div class="card mt-2 bg-danger pl-2">
    		<div class="card-block">
    			<h4>KiloGrams:</h4>
    			<div id="kgOutput"></div>
    		</div>
    	</div>

    </div>

Next,it's time for build functionality using javascript.I'm trying to make this as simple as i can,so i just make 2 function. The formula function for place formula and calculation and the reset function for reset all value back to default.

    //created by Faeshal Bin Sulaiman

    function formula() {
    	var select = document.getElementById('selectOption');
     	var selectOption = select.options[select.selectedIndex].value;

        if(selectOption === "pound") {
        		reset();
        		document.getElementById("output").style.visibility="visible";
    			document.getElementById('lbsInput').addEventListener('input',function(e){
    			let lbs=e.target.value;
    			document.getElementById('poundOutput').innerHTML=lbs * 1;
    			document.getElementById('kgOutput').innerHTML = (lbs * 0.453592).toFixed(2);
    			document.getElementById('gramsOutput').innerHTML = (lbs * 453.592).toFixed(2);
    			document.getElementById('ozOutput').innerHTML = (lbs * 16).toFixed(2);
    		})

        } else if(selectOption === "kg") {
        		reset();
        		document.getElementById("output").style.visibility="visible";
    			document.getElementById('lbsInput').addEventListener('input',function(e){
    			let lbs=e.target.value;
    			document.getElementById('kgOutput').innerHTML=lbs * 1;
    			document.getElementById('poundOutput').innerHTML = (lbs * 2.20462).toFixed(2);
    			document.getElementById('gramsOutput').innerHTML = (lbs * 1000).toFixed(2);
    			document.getElementById('ozOutput').innerHTML = (lbs * 35.274).toFixed(2);
    		})

        } else if(selectOption === "default"){
        	document.getElementById("output").style.visibility="hidden";
        	}
    }

And the last the reset function

    function reset(){
    	document.getElementById("lbsInput").value="";
    	document.getElementById("lbsInput") .focus();
    }

That's it,very simple, dont forget to call formula function below reset function.This is the Result:

##### Last Word

Hope you understand my code and You can recreate and modify that to build better UI and give more feature for the app.By the way you can download my source code , as always link down below:

- [**Javascript - Simple Weight Converter**](https://1drv.ms/u/s!AlZwoX1-EZKghwGfLv7y7NyFbuTz)
