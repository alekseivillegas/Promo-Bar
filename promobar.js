var profiler = {

	settings : {
		cookieN : 'f_o',
		cookieV : true,
		cookieE : 1,
		cookieM : '?25off',
		div_copy : {
			'twentyFiveOff' : 'Save $25 Off Your First Order Of $75+ <strong>Use Code : NEW</strong> at Checkout',
			'default' : 'Save 20% On All Orders Through Thanksgiving! <strong>Use Code : 20OFF</strong'
		},
		default_code : '20OFF',
    	urls_to_exclude : ['/checkout/thank_you','/pages/passport','/pages/huledet'],
    	css : '#promo_code_bar{line-height:200%;position:fixed;height:104px!important;width:100%;background-color:#6dc01d;z-index:-1000000000;display:table;}#text_bar{color:white;display:table-cell;vertical-align:middle;text-align:center;font-size:2em;}@media only screen and (max-width: 900px) {#promo_code_bar{line-height:200%;position:fixed;height:0px;width:100%;background-color:#6dc01d;z-index:-1000000;display:table;}#promo_code_bar{bottom:0!important;font-size:80%;padding:5px 5px 5px 5px;height:130px!important;}#text_bar{line-height:125%;}#sidebar, #content{margin-top:0px!important;}#footer{padding-bottom:200px!important;}}@media only screen and (min-width: 901px) {#sidebar, #content{margin-top:104px!important;padding-bottom:104px!important;}}',
		head : document.head || document.getElementsByTagName('head')[0],
    	style : document.createElement('style')

	},

	//URL Functions
	urlSearch : function(){
		//console.log('url search = ' + window.location.search);
		return window.location.search;
	},

	urlPath : function(){
		//console.log('url path = ' + window.location.pathname);
		return window.location.pathname;
	},

	//Cookie Functions
	readCookie : function(cname){
		var name = cname + "=";
    	var ca = document.cookie.split(';');
    	for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length,c.length);
        }
    	}
    	return false;
	},

	setCookie : function(cookieN,cookieV,cookieE){
   		var d = new Date();
    	d.setTime(d.getTime() + (cookieE*24*60*60*1000));
    	var expires = "expires="+ d.toUTCString();
    	document.cookie = cookieN + "=" + cookieV + ";" + expires + ";path=/";
    	//console.log('setting cookie now');
	},

	urlTcookie : function(){
		
		var cookie = this.readCookie(this.settings.cookieN);
		if (cookie === true){
			//console.log('cookie is already set');
			return;
		}

		var url = this.urlSearch();
			//console.log('index = ' + url.indexOf(this.settings.cookieM) );
			if ( url.indexOf(this.settings.cookieM) > -1 ) {
				//console.log('url contains 25off');
				this.setCookie(this.settings.cookieN, this.settings.cookieV, this.settings.cookieE);
				this.setCookie('discount','NEW',this.settings.cookieE);
			}
	},

	//Decision Enginge
	urlCheck : function(){
		var url = this.urlPath();
		var toExclude = this.settings.urls_to_exclude;		

		for (var i = 0; i < toExclude.length; i++){
				var toSearch = toExclude[i];
				//console.log('testing url : ' + url);
				//console.log(toSearch);
			if ( url.indexOf(toSearch) > -1 ) {
				//console.log('exluded URL');
				return false;
			}
		}
		console.log('good URL');
		return true;

	},

	cookieCheck : function(){

		var cookie = this.readCookie(this.settings.cookieN);
		//console.log('cookie is ' + cookie);
		return cookie;

	},

	eligible : function(){
		console.log('activated');
		this.urlTcookie();

		var urlCheck = this.urlCheck();
		var cookie = this.cookieCheck();
		//console.log('url = ' + urlCheck + ' : cookie = ' + cookie);

		if ( urlCheck && cookie ) {
			console.log('div copy = ' + profiler.settings.div_copy.twentyFiveOff);
			this.showBar(profiler.settings.div_copy.twentyFiveOff);
		} else if ( urlCheck ) {
			console.log('div copy = ' + profiler.settings.div_copy.default);
			this.showBar(profiler.settings.div_copy.default);
		}
	},

	//Promo Bar Activation
	css : function(){
		var _this = this.settings;
		_this.style.type = 'text/css';
			if (_this.style.styleSheet){
  				_this.style.styleSheet.cssText = _this.css;
			} else {
  				_this.style.appendChild(document.createTextNode(_this.css));
		}

		_this.head.appendChild(_this.style);
	},

	getDiv : function(copy){
			var toSend ='<div id="promo_code_bar"><div id="text_bar">' + copy + '</div></div>';
			console.log('1 =' + toSend);
			return toSend;
		},

	showBar : function(bar){
		this.css();
		var toShow = this.getDiv(bar);
		console.log('2 =' + toShow);

		jQuery('body').prepend(toShow);
    	jQuery('#promo_code_bar').animate({height: '+=75px'}, 100, function(){
        	jQuery('#sidebar').animate({marginTop:'50px'});
        	jQuery('#content').animate({marginTop:'50px'});
    		});
    	jQuery('#promo_code_bar').css('z-index',5000);
	},

	//Coupon Auto Apply
	addCoupon : function($coupon_code_parem){
    	jQuery('#cart-form').prepend('<div id="coupon_code" style="text-align:center;margin-top:10px;"><h1>Discount Code</h1><input type="text" name="discount" style="background-color:#6dc01d!important;color:white!important;width:225px;font-size:2em;;text-align:center;border-color:gray;"/><p>Discount codes will be applied at check out.</p></div>');
    	jQuery('#coupon_code input').val($coupon_code_parem);
  	},

  	couponEligible : function(){
  		var url = this.urlPath();
  		var coupon = this.readCookie('discount') || this.settings.default_code;

  		if (url.indexOf('/cart') > -1 && typeof coupon ==='string'){
  			this.addCoupon(coupon);
  		}
  	},

};

profiler.eligible();
profiler.couponEligible();