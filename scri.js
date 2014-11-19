
window.onload = Valid;

Node.prototype.insertAfter = function(newNode) {
    if (this.nextSibling) { 
        return this.parentNode.insertBefore(newNode, this.nextSibling); 
    } else {
        return this.parentNode.appendChild(newNode); 
    }
}


Node.prototype.createError = function(msg) {
    var c = 'errorspan';
    if (this.nextSibling && (this.nextSibling.nodeName.toLowerCase() == 'span' && this.nextSibling.className.indexOf(c) != -1))
        return false;
    var spanError = document.createElement('span');
    spanError.appendChild(document.createTextNode(msg));
    spanError.className = c;
    this.insertAfter(spanError);
}


Node.prototype.removeError = function() {
    var c = 'errorspan';
    if (this.nextSibling && (this.nextSibling.nodeName.toLowerCase() == 'span' && this.nextSibling.className.indexOf(c) != -1)) {
        this.parentNode.removeChild(this.nextSibling);
    }
}


function style(pole, status, msg) {
    if (status) {
        pole.removeError();
        pole.className = "ok";
    } else {
        pole.createError(msg);
        pole.className = "error";
    }
}

function passStyle(pole,msg)
{
	pole.removeError();
	pole.className = "ok";
	pole.createError(msg);
}



function checkDate(mydate) {

    var reg = new RegExp(/^\d\d\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/);

    if (!reg.test(mydate.value)) { 
        style(mydate, false, 'Incorrect date!');
        return false;
    } else { 
        var value = new Date(mydate.value);
        var min = new Date(mydate.min);
        var max = new Date(mydate.max);
        if (value < min || value > max) { 
            style(mydate, false, 'Date between: ' + min.toDateString() + '  -  ' + max.toDateString());
            return false;
        } else { 
            style(mydate, true);
            return true;
        }
    }
}


function isNotEmpty(pole) {
    if (pole.value == "") {
        style(pole, false, 'Empty!');
        return false;
    } else {
        style(pole, true);
        return true;
    }
}


function isName(pole) {
    var wzor = /^[a-zA-ZąćęłńóśźżĄĘŁŃÓŚŹŻ]{2,}$/; 
    if (wzor.test(pole.value)) {
        style(pole, true);
        return true;
    } else { 
        style(pole, false, 'Incorrect data');
        return false;
    }
}


function TruePesel(pole) {
    var pesel = document.getElementById('pesel');
    var sum = (parseInt(pesel.value[0]) + parseInt(3 * pesel.value[1]) + parseInt(7 * pesel.value[2]) + parseInt(9 * pesel.value[3])
            + parseInt(pesel.value[4]) + parseInt(3 * pesel.value[5]) + parseInt(7 * pesel.value[6]) + parseInt(9 * pesel.value[7]) + parseInt(pesel.value[8]) + parseInt(3 * pesel.value[9]));
   
    var rest = sum % 10;

    if (rest == 0 && pesel.value[10] == 0) {
        style(pole, true);
        return true;
    } else {
        var control = 10 - rest; 
        if (control == pesel.value[10]) { 
            style(pole, true);
            return true;
        } else {
            style(pole, false, "Incorrect PESEL!");
            return false;
        }
    }
}


function checkButton() {
    var pesel = document.getElementById("pesel");
    if (pesel.value[8] == (0 || 2 || 4 || 6 || 8)) {
        var kobieta = document.getElementById("female");
        kobieta.checked = true;
    } else {
        var mezczyzna = document.getElementById("men");
        mezczyzna.checked = true;
    }
}


function checkPassword() {
    var haslo1 = document.getElementById('password');
    var haslo2 = document.getElementById('rpassword');
    var dlugoschasla = document.getElementById('rpassword').value.length;

    if (haslo1.value != '' && haslo2.value != '') { 
        if (haslo1.value == haslo2.value) { 
            if (dlugoschasla > 4) { 
                style(haslo1, true);
                style(haslo2, true);
                return true;
            } else { 
                style(haslo1, false, 'Write min. 5 characters!');
                style(haslo2, false, 'Write min. 5 characters!');
                return false;
            }
        } else { 
            style(haslo1, false, "Passwords don't equal");
            style(haslo2, false, "Passwords don't equal");
            return false;
        }
    } else { 
        style(haslo1, false, 'Write min. 5 characters!');
        style(haslo2, false, 'Write min. 5 characters!');
        return false;
    }

}


Node.prototype.createPower = function() {

    var haslo = document.getElementById('rpassword').value;
    var score = 1;
    var bits = passchk_fast.passEntropy(haslo);
    if (bits < 15)
        score = 1;
    if(bits < 30 && bits >= 15)
        score = 2;
    if(bits < 60 && bits >= 30)
        score = 3;
    if(bits < 95 && bits >=60)
        score = 4;
    if(bits >= 95)
        score = 5;   
    var cl = 'strength' + score;
    var pole = document.getElementById('pwdstr');
    pole.className = cl;
 
	switch(score)
	{
		case 1: 
			passStyle(pole,'very weak')
			break;
		case 2: 
			passStyle(pole,'weak')
			break;
		case 3: 
			passStyle(pole,'medium')
			break;
		case 4: 
			passStyle(pole,'strong')
			break;
		case 5: 
			passStyle(pole,'very strong')
			break;
		default: 
			passStyle(pole,'Error')
	}

}


function password(pole) {
    if (checkPassword()) {
        
	pole.createPower();
	
	
    }
}


function sendForm() {
    var tab = document.getElementsByClassName('ok');
    var submit = document.getElementById("submit");
    if (tab.length == 8) {
        submit.removeAttribute("disabled");
    } else {
        submit.setAttribute("disabled", "disabled");
    }
}


function checkLogin(pole) {
    var req = createReq();
    var login = pole.value;
    var url = "http://len.iem.pw.edu.pl/staff/~chaberb/apps/register/check/" + login;

    if (isNotEmpty(pole)) {
        req.onreadystatechange = function() {
            if (req.readyState == 4 && req.status == 200) {
                var log = JSON.parse(req.response);
                if (!log[login]) {
                    style(pole, true);
                    return true;
                } else {
                    style(pole, false, 'Login unavaiable!');
                    return false;
                }
            }
        };
        req.open("GET", url, true); // asynchronicznie true bez len od staff
        req.send(null);

    }
}


function createReq() {
    var req = null;
    if (window.XMLHttpRequest) { 
        req = new XMLHttpRequest();
    } else {
        req = new ActiveXObject("Microsoft.XMLHTTP");
    }
    return req;
}

function Valid() {

   
    var submit = document.getElementById("submit");
    submit.setAttribute("disabled", "disabled");
    window.setInterval(function() {
        sendForm();
    }, 1000);

    var canSendRequest = false;
    var odstep = 200; 

    function throttle(odstep) {
        if (canSendRequest) {
            return;
        }
        canSendRequest = true;

        window.setTimeout(function() {
            canSendRequest = false;
        }, odstep);

        var login = document.getElementById("login");
        login.onkeypress = function() {
            window.setTimeout(function(){checkLogin(this)},200);
        }
    }

    


    var imie = document.getElementById("firstname");
    imie.onkeyup = function() {
        isName(this);
    }

    var nazwisko = document.getElementById("lastname");
    nazwisko.onkeyup = function() {
        isName(this);
    }

    var haslo = document.getElementById("rpassword");
    haslo.onkeyup = function() {
        password(this);
    }

    var data = document.getElementById("birthdate");
    data.onblur = function() {
        checkDate(this);
    }

    var pesel = document.getElementById("pesel");
    pesel.onkeyup = function() {
        TruePesel(this);
        checkButton();
    }

    throttle(odstep);

    var photo = document.getElementById("foto");
    photo.onblur = function() {
        window.setInterval(function() {
            isNotEmpty(photo);
        }, 1000);
    }


}


