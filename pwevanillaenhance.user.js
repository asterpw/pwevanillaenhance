// ==UserScript==
// @name       PWE Vanilla Forums Enhancement
// @namespace  http://github.com/asterpw/pwevanillaenhance
// @downloadURL https://github.com/asterpw/pwevanillaenhance/raw/master/pwevanillaenhance.user.js
// @updateURL https://github.com/asterpw/pwevanillaenhance/raw/master/pwevanillaenhance.user.js
// @icon http://cd8ba0b44a15c10065fd-24461f391e20b7336331d5789078af53.r23.cf1.rackcdn.com/perfectworld.vanillaforums.com/favicon_2b888861142269ff.ico
// @version    0.2
// @description  Adds useful tools to the pwe vanilla forums
// @match      http://perfectworld.vanillaforums.com/*
// @copyright  2015, Asterelle - Sanctuary
// ==/UserScript==

(function() {	
var pweEnhanceSettings = {
	"defaultFontColor": "#FFFFFF",
	"pwiEmoteCategory": "tiger",
	"version": "0.2"
};

var makePWPanel = function() {
	var container = $('<div class="emotes-dialog editor-insert-dialog Flyout MenuItems"></div>');
	var pw = 'http://asterpw.github.io/pwicons/emotes/';
	var emotetypes = ["normal", "tiger", "pig", "bear",  "monkey", "fish", "fox", "mouse"]; 
	var defaultCategory = pweEnhanceSettings['pwiEmoteCategory'];
	var categoryDiv = $('<div class="emote-category"></div>');
	//console.log($('.icon-emote').css('background-image'));

	for (var type=0; type < emotetypes.length; type++) {
		var typeImg = $('<img width="32" height="32"/>');
		typeImg.attr('src', pw + emotetypes[type] + "-1.gif");
		typeImg.attr('title', emotetypes[type]);
		if (emotetypes[type] == defaultCategory) typeImg.addClass('selected');
		typeImg.click(function(){
			$(".emote-category .selected").removeClass("selected");
			$(this).addClass("selected");
			$('.icon-emote').css('background-image', "url('"+pw+this.title+"-1.gif')");
			pweEnhanceSettings['pwiEmoteCategory'] = this.title;
			for (var i = 1; i <= 50; i++) {
				var img = $(".pwemote"+i);
				img.attr('src', pw + this.title + "-" + i + ".gif");
				img.attr('title', this.title + "-" + i);
			}
			update();
			return false;
		});
		categoryDiv.append(typeImg);
	}
	container.append(categoryDiv);
	
	emotesdiv = $('<div class="emotes-div"></div>');
	var emoteCount = 0;

	var pwEmoteClick = function () {
		var position = $(this).closest(".FormWrapper").find('.BodyBox').insertAtCaret("[img]"+$(this).attr('src')+"[/img]");
		return false;
	}
	for (var i = 1; i <= 50; i++) {
		var img = $('<img width="32" height="32" class="pwemote'+i+'"/>');
		img.attr('src', pw + defaultCategory + "-" + i + ".gif");
		img.attr('title', defaultCategory +" -" + i);
		img.click(pwEmoteClick);
		img.appendTo(emotesdiv);
		emoteCount++;
		if ((emoteCount % 10) == 0)  emotesdiv.append($("<br>"));
	}
	container.append(emotesdiv);
	var button = $('<div class="editor-dropdown pwi-emotes"><span class="editor-action icon" title="Emotes"><span class="icon icon-emote"></span><span class="icon icon-caret-down"></span></span></div>');
	button.find('.editor-action .icon-emote').click(function(){
		//$(".editor-dropdown").removeClass("editor-dropdown-open");
		$(this).parent().parent().toggleClass("editor-dropdown-open").siblings().removeClass("editor-dropdown-open");
	});
	button.find('.icon-emote').css('background-image', "url('"+pw+defaultCategory+"-1.gif')");
	return button.append(container);
}

var makeFontColorPicker = function() {
	var container = $('<div class="color-picker editor-insert-dialog Flyout MenuItems"></div>');
	var button = $('<div class="editor-dropdown font-color-picker"><span class="editor-action icon" title="Font Color"><span class="icon icon-font-color">A</span><span class="icon icon-caret-down"></span></span></div>');
	return button.append(container);
};

var setFontColor = function(picker, color) {
		picker.closest(".FormWrapper").find('.BodyBox').surroundSelectedText('[color="'+color+'"]', '[/color]', 'select');
		picker.closest(".FormWrapper").find(".icon-font-color").css("box-shadow", "0 -5px 0 0 "+color+" inset");
		pweEnhanceSettings["defaultFontColor"] = color;
		
		update();
}

var initColorPicker = function(container) {
	picker = container.find('.color-picker');
	picker.colorpicker({"color": pweEnhanceSettings["defaultFontColor"]});
	container.find(".icon-font-color").css("box-shadow", "0 -5px 0 0 "+pweEnhanceSettings["defaultFontColor"]+" inset");
	picker.on("change.color", function(event, color){
		setFontColor($(this), color);
	});
	container.find('.icon-font-color').click( function(event) {
		setFontColor($(event.target).closest('.font-color-picker').find('.color-picker'), $(event.target).closest('.font-color-picker').find('.color-picker').colorpicker("val"));
	});
}

 loadCSS = function(href) {
     var cssLink = $("<link rel='stylesheet' type='text/css' href='"+href+"'>");
     $("head").append(cssLink); 
 };
 loadJS = function(src) {
     var jsLink = $("<script type='text/javascript' src='"+src+"'>");
     $("head").append(jsLink); 
 }; 
 
 var update = function() {
	setCookie();
}
 
 var setCookie = function(){
	var exdate=new Date();
	exdate.setDate(exdate.getDate() + 40); // 40 day expiration
	var cookieSuffix = ";expires=" + exdate.toUTCString() + ";path=/";
	for (var i in pweEnhanceSettings) {
		document.cookie = "pweEnhance."+i+"="+pweEnhanceSettings[i]+cookieSuffix;
	}
}

var getCookie = function() {
	if (document.cookie) {
		var cookieData = document.cookie.split(";");
		for (var i = 0; i < cookieData.length; i++) {
			var cookieItem = cookieData[i].trim().split("=");
			if (cookieItem[0].indexOf("pweEnhance.") == 0) {
				pweEnhanceSettings[cookieItem[0].split(".")[1]] = cookieItem[1];
			}
		}
	}
}


$(document).ready(function() {
	getCookie();
	loadCSS("http://evoluteur.github.com/colorpicker/css/evol.colorpicker.css");
	loadCSS("https://asterpw.github.com/pwevanillaenhance/pwevanillaenhance.user.css");
	$(".editor-action-emoji").after(makeFontColorPicker());
	$(".editor-action-emoji").after(makePWPanel());
	
	$.getScript("https://cdn.rawgit.com/Goodlookinguy/colorpicker/2acd4b8/js/evol.colorpicker.js", function() {
		initColorPicker($('.font-color-picker'))
	});
	$(document).on( "EditCommentFormLoaded", function(event, container) {
		//console.log(container);
		container.find(".editor-action-emoji").after(makeFontColorPicker()).after(makePWPanel());
		initColorPicker(container);
	});
});

})();