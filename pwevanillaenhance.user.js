// ==UserScript==
// @name       PWE Vanilla Forums Enhancement
// @namespace  http://github.com/asterpw/pwevanillaenhance
// @downloadURL https://github.com/asterpw/pwevanillaenhance/raw/master/pwevanillaenhance.user.js
// @updateURL https://github.com/asterpw/pwevanillaenhance/raw/master/pwevanillaenhance.user.js
// @icon http://cd8ba0b44a15c10065fd-24461f391e20b7336331d5789078af53.r23.cf1.rackcdn.com/perfectworld.vanillaforums.com/favicon_2b888861142269ff.ico
// @version    0.3.1
// @description  Adds useful tools to the pwe vanilla forums
// @match      http://perfectworld.vanillaforums.com/*
// @copyright  2015, Asterelle - Sanctuary
// ==/UserScript==

(function() {	
var pweEnhanceSettings = {
	"defaultFontColor": "#FFFFFF",
	"pwiEmoteCategory": "tiger",
    "autoAddColor": "false",
	"version": "0.3.1"
};

var makePWPanel = function() {
	var container = $('<div class="emotes-dialog editor-insert-dialog Flyout MenuItems"></div>');
	var pw = 'http://asterpw.github.io/pwicons/emotes/';
	var emotetypes = ["normal", "tiger", "pig", "bear",  "monkey", "fish", "fox", "mouse"]; 
	var defaultCategory = pweEnhanceSettings['pwiEmoteCategory'];
	var categoryDiv = $('<div class="emote-category"></div>');

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
	};
    
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
};


var makeFontColorPicker = function() {
	var container = $('<div class="editor-insert-dialog Flyout MenuItems font-color-picker-dialog"><div class="color-picker"></div></div>');
	var button = $('<div class="editor-dropdown font-color-picker"><span class="editor-action icon" title="Font Color"><span class="icon icon-font-color">A</span><span class="icon icon-caret-down"></span></span></div>');
	container.append('<input type="checkbox" class="autocolor"></input><span class="label">Auto color when submitting</span>');
	container.find('.autocolor').click(function(){
		if($(this).is(":checked")) 
			pweEnhanceSettings["autoAddColor"] = 'true';
		else
			pweEnhanceSettings["autoAddColor"] = 'false';
		update();
	});
	if (pweEnhanceSettings["autoAddColor"] == 'true') 
		container.find('.autocolor').prop('checked', true);
	return button.append(container);
};

var setFontColor = function(picker, color) {
	picker.closest(".FormWrapper").find('.BodyBox').surroundSelectedText('[color="'+color+'"]', '[/color]', 'select');
	picker.closest(".FormWrapper").find(".icon-font-color").css("box-shadow", "0 -5px 0 0 "+color+" inset");
	pweEnhanceSettings["defaultFontColor"] = color;
		
	update();
};

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
};

var autoAddFontColor = function(textArea, color) {
	var startTag = '[color="'+color+'"]';
	var endTag = '[/color]';
	if (!textArea.val().startsWith(startTag)) {
		textArea.val(startTag + textArea.val() + endTag);
	}
};    

var initSubmitButton = function(container) {
	container.find("input.CommentButton").click(function(){
		if (pweEnhanceSettings["autoAddColor"] == 'true') {
			var form = $(this).closest(".FormWrapper");
			var color = form.find(".color-picker").colorpicker("val");
			autoAddFontColor(form.find(".BodyBox"), color);
		}
	});
};

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
};

 var setCookie = function(){
	var exdate=new Date();
	exdate.setDate(exdate.getDate() + 40); // 40 day expiration
	var cookieSuffix = ";expires=" + exdate.toUTCString() + ";path=/";
	for (var i in pweEnhanceSettings) {
		document.cookie = "pweEnhance."+i+"="+pweEnhanceSettings[i]+cookieSuffix;
	}
};

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
};

loadCSS("https://cdn.rawgit.com/Goodlookinguy/colorpicker/master/css/evol.colorpicker.css");
loadCSS("https://cdn.rawgit.com/asterpw/pwevanillaenhance/master/pwevanillaenhance.user.css");

$(document).ready(function() {
	getCookie();

	$(".editor-action-emoji").after(makeFontColorPicker());
	$(".editor-action-emoji").after(makePWPanel());
	
	$.getScript("https://cdn.rawgit.com/Goodlookinguy/colorpicker/2acd4b8/js/evol.colorpicker.js", function() {
		initColorPicker($('.font-color-picker'))
		initSubmitButton($('.FormWrapper'));
	});
	$(document).on( "EditCommentFormLoaded", function(event, container) {
		container.find(".editor-action-emoji").after(makeFontColorPicker()).after(makePWPanel());
		initColorPicker(container);
        initSubmitButton(container);
	});
});

})();
