// ==UserScript==
// @name       PWE Vanilla Forums Enhancement
// @namespace  http://github.com/asterpw/pwevanillaenhance
// @downloadURL https://github.com/asterpw/pwevanillaenhance/raw/master/pwevanillaenhance.user.js
// @updateURL https://github.com/asterpw/pwevanillaenhance/raw/master/pwevanillaenhance.user.js
// @icon http://cd8ba0b44a15c10065fd-24461f391e20b7336331d5789078af53.r23.cf1.rackcdn.com/perfectworld.vanillaforums.com/favicon_2b888861142269ff.ico
// @version    0.4.3
// @description  Adds useful tools to the pwe vanilla forums
// @match      http://perfectworld.vanillaforums.com/*
// @copyright  2015, Asterelle - Sanctuary
// ==/UserScript==

(function() {	
var pweEnhanceSettings = {
	fontColorPicker:  {
		enabled: true,
		selectedColor: "#FFFFFF",
		autoAddColor: false
	},
	pwiEmotes: {
		enabled: true,
		category: "tiger"
	},
	herocatEmotes: {
		enabled: true,
		category: "herocat"
	},
	themes: {
		"Global Fixes": {
			enabled: false
		},
		"Grayscale": {
			enabled: false
		},
		"Colorful Addon": {
			enabled: false
		},
		"Fluid Width": {
			enabled: false
		},
		"Compact": {
			enabled: false
		}
	},
	version: "0.4.3"
};

var Theme = function(name, url, description, screenshot) {
	this.name = name;
	this.url = url;
	this.description = description;
	this.screenshot = screenshot;
}

var themes = [
	new Theme("Global Fixes",
		"https://rawgit.com/Goodlookinguy/pwvnrg/master/global.fixes.css",
		"General fixes and usability"),
	new Theme("Grayscale",
		"https://rawgit.com/Goodlookinguy/pwvnrg/master/grayscale.css",
		"Makes the forum look nicer"),
	new Theme("Colorful Addon",
		"https://rawgit.com/Goodlookinguy/pwvnrg/master/addon.colorful.css",
		"Adds a dash of color to navigation"),
	new Theme("Fluid Width",
		"https://rawgit.com/Goodlookinguy/pwvnrg/master/addon.fluid-width.css",
		"Makes better use of the screen"),
	new Theme("Compact",
		"https://rawgit.com/Goodlookinguy/pwvnrg/master/addon.compact.css",
		"For those that like minimalism")
];

var applyThemes = function() {
	for (var i = 0; i < themes.length; i++) { 
		themes[i].setEnabled(pweEnhanceSettings.themes[themes[i].name].enabled);
	}
}

Theme.prototype.setEnabled = function(enabled) {
	pweEnhanceSettings.themes[this.name].enabled = enabled;
	if (enabled) {
		if ($("head link[href='"+this.url+"']").length == 0)
			loadCSS(this.url)
	} else {
		$("head link[href='"+this.url+"']").remove();
	}
}

var makeThemeMenu = function() {
	var menu = $("<div><h1>Themes</h1></div>");
	
	for (var i = 0; i < themes.length; i++) { 
		var themeContainer = $("<div class='theme'></div>");
		var checked = pweEnhanceSettings.themes[themes[i].name].enabled ? 'checked' : '';
		themeContainer.append('<input type="checkbox" class="option" '+checked+'></input><span class="label">'
			+ '<span class="name">' + themes[i].name + '</span>: '
			+ themes[i].description+'</span>');
		$('.option', themeContainer).click( (function(theme) {
				return function(){
					theme.setEnabled($(this).is(":checked"));
					update();
				}
			})(themes[i])
		);
		menu.append(themeContainer);
	}
	return menu;
};

var Feature = function(name, selector, description, screenshot) {
	this.name = name;
	this.selector = selector;
	this.description = description;
	this.screenshot = screenshot;
};

var features = [
	new Feature("pwiEmotes", ".pwi-emotes", "Show PWI emotes in editor"),
	new Feature("herocatEmotes", ".herocatEmotes", "Show Herocat (Champions Online) emotes in editor"),
	new Feature("fontColorPicker", ".font-color-picker", "Show font color picker in editor")
];

Feature.prototype.setEnabled = function(enabled) {
	pweEnhanceSettings[this.name].enabled = enabled;
	if (!enabled) {
		$(this.selector).hide();
	} else {
		$(this.selector).show();
	}
};

var makeFeatureMenu = function() {
	var menu = $("<div><h1>Features</h1></div>");
	
	for (var i = 0; i < features.length; i++) { 
		var featureContainer = $("<div class='feature'></div>");
		var checked = pweEnhanceSettings[features[i].name].enabled ? 'checked' : '';
		featureContainer.append('<input type="checkbox" class="option" '+checked+'></input><span class="label">'+features[i].description+'</span>');
		$('.option', featureContainer).click( (function(feature) {
				return function(){
					feature.setEnabled($(this).is(":checked"));
					update();
				}
			})(features[i])
		);
		menu.append(featureContainer);
	}
	return menu;
};

var makeEnhancePreferencesMenu = function() {
	var preferencesControl = $("<span class='ToggleFlyout enhance-options'></span>");
	var preferencesButton = $('<a href="#" class="MeButton FlyoutButton" title="Enhance Options"><span class="Sprite Sprite16 SpOptions"></span><span class="label">Enhance Options</span></a>');
	preferencesControl.append(preferencesButton).append($('<span class="Arrow SpFlyoutHandle"></span>'));
	
	var preferencesMenu = $('<div class="Flyout MenuItems" >');
	preferencesMenu.append(makeFeatureMenu());
	preferencesMenu.append(makeThemeMenu());
	preferencesMenu.click(function(e){e.stopPropagation();}); // stop menu from autoclose on click
	preferencesControl.append(preferencesMenu);
	
	$('.MeMenu').append(preferencesControl);
};

var makeEmotePanel = function(className, path, categories, emotes, imgWidth, imgHeight) {
	var container = $('<div class="emotes-dialog editor-insert-dialog Flyout MenuItems"></div>');
	var defaultCategory = pweEnhanceSettings[className].category;
	if (categories.length > 1) {
		var categoryDiv = $('<div class="emote-category"></div>');
		for (var type=0; type < categories.length; type++) {
			var typeImg = $('<img width="'+imgWidth+'" height="'+imgHeight+'"/>');
			typeImg.attr('src', path + categories[type] + "-1.gif");
			typeImg.attr('title', categories[type]);
			if (categories[type] == defaultCategory) typeImg.addClass('selected');
			typeImg.click(function(){
				$(".emote-category .selected").removeClass("selected");
				$(this).addClass("selected");
				$('.icon-emote').css('background-image', "url('"+path+this.title+"-1.gif')");
				pweEnhanceSettings[className].category = this.title;
				for (var i = 1; i <= 50; i++) {
					var img = $("."+className+i);
					img.attr('src', path + this.title + "-" + i + ".gif");
					img.attr('title', this.title + "-" + i);
				}
				update();
				return false;
			});
			categoryDiv.append(typeImg);
		}
		container.append(categoryDiv);
	}
	
	emotesdiv = $('<div class="emotes-div"></div>');
	var emoteCount = 0;

	var emoteClick = function () {
		var position = $(this).closest(".FormWrapper").find('.BodyBox').insertAtCaret("[img]"+$(this).attr('src')+"[/img]");
		return false;
	};
    
	for (var i = 0; i < emotes.length; i++) {

		for (var j = 0; j < emotes[i].length; j++) {
			emoteCount++;
			var img = $('<img width="'+imgWidth+'" height="'+imgHeight+'" class="'+defaultCategory+(emoteCount)+'"/>');
			img.attr('src', path + emotes[i][j]);
			img.attr('title', defaultCategory+(emoteCount));
			img.click(emoteClick);
			img.appendTo(emotesdiv);
		}
		emotesdiv.append($("<br>"));
	}
	container.append(emotesdiv);
	var button = $('<div class="editor-dropdown '+className+'"><span class="editor-action icon" title="Emotes"><span class="icon icon-emote"></span><span class="icon icon-caret-down"></span></span></div>');
	button.find('.editor-action .icon-emote').click(function(){
		//$(".editor-dropdown").removeClass("editor-dropdown-open");
		$(this).parent().parent().toggleClass("editor-dropdown-open").siblings().removeClass("editor-dropdown-open");
	});
	button.find('.icon-emote').css('background-image', "url('"+path+emotes[0][0]+"')");
	if (!pweEnhanceSettings[className].enabled)
		button.hide();
	return button.append(container);
};



var makeHeroEmotes = function() {
	var emotes = new Array(4);
	for (var i = 0; i < 4; i++) {
		emotes[i] = new Array(6);
		for (var j = 0; j < 6; j++) {
			emotes[i][j] = 'herocat-'+(i*6+j+1)+'.gif';
		}
	}

	var emotes = [["hfnxG66.gif", "xetj2As.gif", "BIQ2kH9.gif", "zBIeJi5.gif", "vMVtCOc.gif", "pyYfVdt.gif"],
		["xMHLXms.gif", "JXvlt0E.gif", "gvbnePB.gif", "VTiX7E9.gif", "0AJ5u1j.gif", "dWwreGR.gif"],
		["JwYeLqg.gif", "LRXv5XJ.gif", "TF1Q54p.gif", "Ws4CzXK.gif", "AMSEJhZ.gif", "oBHuX7U.gif"],
		["RtcjLDn.gif", "lLgP7Ld.gif", "taePNbZ.gif", "2WCf0cq.gif", "HLK29cV.gif", "lRQebLq.gif"]];
	return makeEmotePanel('herocatEmotes', 
		'http://i.imgur.com/',
		['herocat'],
		emotes,
		50, 
		50);
}

var makePWPanel = function() {
	var container = $('<div class="emotes-dialog editor-insert-dialog Flyout MenuItems"></div>');
	var pw = 'http://asterpw.github.io/pwicons/emotes/';
	var emotetypes = ["normal", "tiger", "pig", "bear",  "monkey", "fish", "fox", "mouse", "egg"]; 
	var defaultCategory = pweEnhanceSettings.pwiEmotes.category;
	var categoryDiv = $('<div class="emote-category"></div>');

	for (var type=0; type < emotetypes.length; type++) {
		var typeImg = $('<img width="32" height="32"/>');
		typeImg.attr('src', pw + emotetypes[type] + "-1.gif");
		typeImg.attr('title', emotetypes[type]);
		if (emotetypes[type] == defaultCategory) typeImg.addClass('selected');
		typeImg.click(function(){
			$(".emote-category .selected").removeClass("selected");
			$(this).addClass("selected");
			$('.pwi-emotes .icon-emote').css('background-image', "url('"+pw+this.title+"-1.gif')");
			pweEnhanceSettings.pwiEmotes.category = this.title;
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
		img.attr('title', defaultCategory +"-" + i);
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
	if (!pweEnhanceSettings.pwiEmotes.enabled)
		button.hide();
	return button.append(container);
};


var makeFontColorPicker = function() {
	var container = $('<div class="editor-insert-dialog Flyout MenuItems font-color-picker-dialog"><input type="text" class="color-picker"></input></div>');
	var button = $('<div class="editor-dropdown font-color-picker"><span class="editor-action icon" title="Font Color"><span class="icon icon-font-color">A</span><span class="icon icon-caret-down"></span></span></div>');
	container.append('<input type="checkbox" class="autoAddColor"></input><span class="label">Auto color when submitting</span>');
	container.find('.autoAddColor').click(function(){
		pweEnhanceSettings.fontColorPicker.autoAddColor = $(this).is(":checked");
		update();
	});
	if (pweEnhanceSettings.fontColorPicker.autoAddColor) 
		container.find('.autoAddColor').prop('checked', true);
	if (!pweEnhanceSettings.fontColorPicker.enabled)
		button.hide();
	return button.append(container);
};

var setFontColor = function(picker, color) {
	picker.closest(".FormWrapper").find('.BodyBox').surroundSelectedText('[color="'+color+'"]', '[/color]', 'select');
	picker.closest(".FormWrapper").find(".icon-font-color").css("box-shadow", "0 -5px 0 0 "+color+" inset");
	pweEnhanceSettings.fontColorPicker.selectedColor = color;
	picker.closest(".font-color-picker").removeClass("editor-dropdown-open");
	update();
};

var initColorPicker = function(container) {
	picker = container.find('.color-picker');
	picker.spectrum({
		color: pweEnhanceSettings.fontColorPicker.selectedColor,
		showInput: true,
		className: "full-spectrum",
		showInitial: true,
		showPalette: true,
		showSelectionPalette: true,
		maxSelectionSize: 8,
		togglePaletteOnly: true,
		togglePaletteMoreText: 'more',
		togglePaletteLessText: 'less',
		clickoutFiresChange: false,
		preferredFormat: "hex",
		localStorageKey: "spectrum.demo",
		flat: true,
		change: function(color) {
			setFontColor($(this), "#"+color.toHex());
		},
		palette: [
			["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)", "rgb(153, 153, 153)",
			"rgb(185, 185, 185)", "rgb(217, 217, 217)","rgb(255, 255, 255)"],
			["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)",
			"rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"], 
			["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)", 
			"rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)", 
			"rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)", 
			"rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)", 
			"rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)", 
			"rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)",
			"rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)",
			"rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)",
			"rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)", 
			"rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]
		]
	});

	container.find(".icon-font-color").css("box-shadow", "0 -5px 0 0 "+pweEnhanceSettings.fontColorPicker.selectedColor+" inset");
	container.find('.icon-font-color').click( function(event) {
		setFontColor($(event.target), '#'+($(event.target).closest('.font-color-picker').find('.color-picker').spectrum("get").toHex()));
	});
};

var autoAddFontColor = function(textArea, color) {
	var startTag = '[color="'+color+'"]';
	var endTag = '[/color]';
	var startpos = 0;
	var lastCloseQuotePos = textArea.val().toLowerCase().lastIndexOf("[/quote]");
	if (lastCloseQuotePos != -1) {
		startpos = lastCloseQuotePos + "[/quote]".length;
	}
	
	var text = textArea.val();
	if (!text.substring(startpos).startsWith(startTag)) {
		textArea.val(text.substring(0, startpos) + startTag + text.substring(startpos) + endTag);
		
	}
};    

var initSubmitButton = function(container) {
	container.find("input.CommentButton").click(function(){
		if (pweEnhanceSettings.fontColorPicker.autoAddColor) {
			var form = $(this).closest(".FormWrapper");
			var color = form.find(".color-picker").spectrum("get");
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
	document.cookie = "pweEnhancementSettings=" + JSON.stringify(pweEnhanceSettings) + cookieSuffix;
};

var getCookie = function() {
	if (document.cookie) {
		var cookieData = document.cookie.split(";");
		for (var i = 0; i < cookieData.length; i++) {
			var cookieItem = cookieData[i].trim().split("=");
			if (cookieItem[0] == "pweEnhancementSettings") {
				cookieSettings = JSON.parse(cookieItem[1]);
				//merge the cookie data into the settings
				$.extend(true, pweEnhanceSettings, cookieSettings);
			}
		}
	}
};

loadCSS("https://rawgit.com/asterpw/spectrum/master/spectrum.css");
loadCSS("https://rawgit.com/asterpw/pwevanillaenhance/92d35896081db3a9aecfaeb194c4a76089de04f2/pwevanillaenhance.user.css");
getCookie();
applyThemes();


$(document).ready(function() {

	$(".editor-action-emoji").after(makeFontColorPicker());
	$(".editor-action-emoji").after(makePWPanel());
	$(".editor-action-emoji").after(makeHeroEmotes());
	makeEnhancePreferencesMenu();
	$.getScript("https://rawgit.com/asterpw/spectrum/master/spectrum.js", function() {
	//$.getScript("http://bgrins.github.com/spectrum/spectrum.js", function() {
		initColorPicker($('.font-color-picker'))
		initSubmitButton($('.FormWrapper'));
	});
	$(document).on( "EditCommentFormLoaded", function(event, container) {
		container.find(".editor-action-emoji").after(makeFontColorPicker()).after(makePWPanel()).after(makeHeroEmotes());
		initColorPicker(container);
        initSubmitButton(container);
	});
});

})();
