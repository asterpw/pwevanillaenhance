// ==UserScript==
// @name       PWE Vanilla Forums Enhancement
// @namespace  http://github.com/asterpw/pwevanillaenhance
// @downloadURL https://github.com/asterpw/pwevanillaenhance/raw/master/pwevanillaenhance.user.js
// @updateURL  https://github.com/asterpw/pwevanillaenhance/raw/master/pwevanillaenhance.user.js
// @icon http://cd8ba0b44a15c10065fd-24461f391e20b7336331d5789078af53.r23.cf1.rackcdn.com/perfectworld.vanillaforums.com/favicon_2b888861142269ff.ico
// @version    0.7.0
// @run-at     document-start
// @description  Adds useful tools to the pwe vanilla forums
// @match      http://perfectworld.vanillaforums.com/*
// @grant       none
// @copyright  2015, Asterelle - Sanctuary
// ==/UserScript==

(function() {	
var VERSION = "0.7.0";  //what we store when we should display what's new dialog
var getFullVersion = function() { // For version display on the screen;
	try {
		return GM_info.script.version;  //causes error if not supported
	} catch(err) {
		return VERSION;
	}
};
/*jshint multistr: true */
var CHANGELOG = "<div class='content'> \
	<div class='change-ver'>v0.7.0</div> - added links to the site menu<br> - better preferences organization \
	<div class='change-ver'>v0.6.2</div> - added more text faces<br>- fixed ViolentMonkey support on Opera \
	<div class='change-ver'>v0.6.1</div> - \u0ca0_\u0ca0 picker \
	<div class='change-ver'>v0.6.0</div> - Important organization changes (needs data reset) \
	<div class='change-ver'>v0.5.6</div> - Added font picker \
	<div class='change-ver'>v0.5.5</div> - Added font size picker \
	<div class='change-ver'>v0.5.4</div> - Fixed Firefox and other preload bugfixes \
	<div class='change-ver'>v0.5.3</div> - Some theme preload bugfixes \
	<div class='change-ver'>v0.5.2</div> - Themes load faster now (before page render)<br> - Allow remote themes to be renamed or deleted \
	<div class='change-ver'>v0.5.1</div> - Added Forsaken World Emotes<br> - Added What's New Dialog \
	<div class='change-ver'>v0.5</div> - Added auto-loading of themes from @nrglg</div>";

var pweEnhanceSettings = {
	editor: {
	},
	links: {
	},
	emotes: {
	},
	themes: { //autoadded from remote
	},
	lastThemeUpdateTime: 0,
	version: "0"
};

var showWhatsNewDialog = function() {
	var whatsNew = $("<div class='whatsNewDialog' style='display: none;'></div>");
	whatsNew.append($("<div class='title'>What's new in PWE Vanilla Enhancement v"+getFullVersion()+"<div class='close'>X</div></div>"));
	whatsNew.append($(CHANGELOG));
	$(".close", whatsNew).click(function(){
		$(".whatsNewDialog").fadeOut();  
		pweEnhanceSettings.version = VERSION;
		update();
	});
	$(".MeBoxContainer").append(whatsNew);
	whatsNew.delay(1000).fadeIn();
};

var buildCSSThemeURL = function(theme)
{
    return theme.baseurl + (theme['branch-commit'].length > 0 ?
                            theme['branch-commit'] + "/" : '') + theme.file;
};

var preloadThemes = function() { //loads before jquery
	keys = Object.keys(pweEnhanceSettings.themes);
	if (keys.length === 0) 
		return;
	try {
		keys.sort(function(a,b){
				return pweEnhanceSettings.themes[a].order - pweEnhanceSettings.themes[b].order;
		});
	} catch(err) { /*i don't get why this fails sometimes*/}
	for (var i = 0; i < keys.length; i++) { 
		var name = keys[i];
		enabled = 'enabled' in pweEnhanceSettings.themes[name] ? pweEnhanceSettings.themes[name].enabled : false;
		if (enabled) {
			var theme = pweEnhanceSettings.themes[name];
			loadCSS(buildCSSThemeURL(theme));
		}
	}
};

var applyThemes = function() {
	keys = Object.keys(pweEnhanceSettings.themes);
	keys.sort(function(a,b){return pweEnhanceSettings.themes[a].order - pweEnhanceSettings.themes[b].order;});
	for (var i = 0; i < keys.length; i++) { 
		var name = keys[i];
		enabled = 'enabled' in pweEnhanceSettings.themes[name] ? pweEnhanceSettings.themes[name].enabled : false; 
		setThemeEnabled(name, enabled);
	}
};

var handleThemes = function() {
	var currentTime = new Date().getTime();
	if (currentTime - pweEnhanceSettings.lastThemeUpdateTime > 4*3600*1000) {
		$.getJSON("https://rawgit.com/Goodlookinguy/pwvnrg/master/files.json", function(json){
			$.extend(true, pweEnhanceSettings, json);
			for (var i in pweEnhanceSettings.themes) {
				if (!(i in json.themes))
					delete pweEnhanceSettings.themes[i];
			}
			
			applyThemes();
			pweEnhanceSettings.lastThemeUpdateTime = new Date().getTime();
			update();
			makeEnhancePreferencesMenu();
		});
	} else {
		applyThemes();
	}
};

var setThemeEnabled = function(name, enabled) {
	var theme = pweEnhanceSettings.themes[name];
	theme.enabled = enabled;
	url = buildCSSThemeURL(theme);
	if (enabled) {
		if ($("head link[href='"+url+"']").length === 0)
			loadCSS(url);
		else { // do i really need to do this?
			loadCSS(url);
			$("head link[href='"+url+"']")[0].remove();
		}
			
	} else {
		$("head link[href='"+url+"']").remove();
	}
};


var makeThemeMenu = function() {
	var menu = $("<div><h1>Themes</h1></div>");
	keys = Object.keys(pweEnhanceSettings.themes);
	keys.sort(function(a,b){return pweEnhanceSettings.themes[a].order - pweEnhanceSettings.themes[b].order;});	
	for (var i = 0; i < keys.length; i++) { 
		var name = keys[i];
		var themeContainer = $("<div class='theme'></div>");
		var checked = pweEnhanceSettings.themes[name].enabled ? 'checked' : '';
		themeContainer.append('<input type="checkbox" class="option" '+checked+'></input><span class="label">' +
			'<span class="name">' + name + '</span>: ' +
			pweEnhanceSettings.themes[name].description+'</span>');
		$('.option', themeContainer).click( (function(name) {
				return function(){
					setThemeEnabled(name, $(this).is(":checked"));
					update();
				};
			})(name)
		);
		menu.append(themeContainer);
	}
	return menu;
};

var mergeData = function(to, from) {
	if (from == null) {
		return;
	}
	var keys = Object.keys(from);
	for (var i in keys) {
		if (typeof from[keys[i]] == 'object' && keys[i] in to) 
			mergeData(to[keys[i]], from[keys[i]]);
		else
			to[keys[i]] = from[keys[i]];
	}
};

var makeFeatureMenu = function() {
	var menu = $("<div></div>");
	var currentFeatureType = null;
	for (var i = 0; i < features.length; i++) { 
		if (!(features[i].type == currentFeatureType)) {
			menu.append($("<h1>"+features[i].header+"</h1>"));
			currentFeatureType = features[i].type;
		}
		var featureContainer = $("<div class='feature'></div>");
		var checked = features[i].isEnabled() ? 'checked' : '';
		featureContainer.append('<input type="checkbox" class="option" '+checked+'></input><span class="label">'+features[i].description+'</span>');
		$('.option', featureContainer).click( (function(feature) {
				return function(){
					feature.setEnabled($(this).is(":checked"));
					update();
				};
			})(features[i])
		);
		menu.append(featureContainer);
	}
	return menu;
};

var makeEnhancePreferencesMenu = function() {
	$('.enhance-options').remove();
	var preferencesControl = $("<span class='ToggleFlyout enhance-options'></span>");
	var preferencesButton = $('<a href="#" class="MeButton FlyoutButton" title="Enhance Options"><span class="Sprite Sprite16 SpOptions"></span><span class="label">Enhance Options</span></a>');
	preferencesControl.append(preferencesButton).append($('<span class="Arrow SpFlyoutHandle"></span>'));
	
	var preferencesMenu = $('<div class="Flyout MenuItems" ></div>');
	preferencesMenu.append($('<div class="title">PWE Vanilla Enhancement v'+getFullVersion()+'</div>'));
	var content = $('<div class="menu-content" ></div>');
	content.append(makeFeatureMenu());
	content.append(makeThemeMenu());
	preferencesMenu.append(content);
	preferencesMenu.click(function(e){e.stopPropagation();}); // stop menu from autoclose on click
	preferencesControl.append(preferencesMenu);
	
	$('.MeMenu').append(preferencesControl);
};

var makeEmotePanel = function(className, path, categories, emotes, imgWidth, imgHeight) {
	var container = $('<div class="emotes-dialog editor-insert-dialog Flyout MenuItems"></div>');
	var defaultCategory = pweEnhanceSettings.emotes[className].category;
	if (categories.length > 1) {
		var categoryDiv = $('<div class="emote-category"></div>');
		for (var type=0; type < categories.length; type++) {
			var typeImg = $('<img width="'+imgWidth+'" height="'+imgHeight+'"/>');
			typeImg.attr('src', path + categories[type] + "-1.gif");
			typeImg.attr('title', categories[type]);
			if (categories[type] == defaultCategory) 
				typeImg.addClass('selected');
			typeImg.click(
				function(){
					pweEnhanceSettings.emotes[className].category = this.title;
					$("."+className + " .emote-category .selected").removeClass("selected");
					$(this).addClass("selected");
					$("."+className + " .icon-emote").css('background-image', "url('"+path+this.title+"-1.gif')");
					$("."+className + " .emotes-div").hide();
					$("."+className + " ."+this.title+"-emotes").show();
					$("."+className + " ."+this.title+"-emotes img").each(function(){$(this).attr('src', $(this).data('url'));});
					update();
					return false;
				}
			);
			categoryDiv.append(typeImg);
		}
		container.append(categoryDiv);
	}
	
	var emoteClick = function () {
		var position = $(this).closest(".FormWrapper").find('.BodyBox').insertAtCaret("[img]"+$(this).attr('src')+"[/img]");
		return false;
	};
	for (var k = 0; k < categories.length; k++) {
		emotesdiv = $('<div class="emotes-div"></div>').addClass(categories[k]+"-emotes");
		if (categories[k] != defaultCategory)
			emotesdiv.hide();
		var emoteCount = 0;
		var currentEmotes = emotes[categories[k]];
		for (var i = 0; i < currentEmotes.length; i++) {
			for (var j = 0; j < currentEmotes[i].length; j++) {
				emoteCount++;
				var img = $('<img width="'+imgWidth+'" height="'+imgHeight+'" class="'+categories[k]+(emoteCount)+'"/>');
				//img.attr('src', path + currentEmotes[i][j]);  don't bother loading images until div is shown
				img.data('url', path + currentEmotes[i][j]);
				img.attr('title', categories[k]+(emoteCount));
				img.click(emoteClick);
				img.appendTo(emotesdiv);
			}
			emotesdiv.append($("<br>"));
		}
		container.append(emotesdiv);
	}
	var button = $('<div class="editor-dropdown '+className+'"><span class="editor-action icon" title="Emotes"><span class="icon icon-emote"></span><span class="icon icon-caret-down"></span></span></div>');
	button.find('.editor-action .icon-emote').click(function(){
		$(this).parent().parent().toggleClass("editor-dropdown-open").siblings().removeClass("editor-dropdown-open");
	});
	button.find('.editor-action').click(function(){
		$("."+className+" ."+pweEnhanceSettings.emotes[className].category+"-emotes img").each(function(){$(this).attr('src', $(this).data('url'));});
	});
	button.find('.icon-emote').css('background-image', "url('"+path+emotes[defaultCategory][0][0]+"')");
	return button.append(container);
};



var makeHeroEmotes = function() {
	var emotes = {'herocat': [["hfnxG66.gif", "xetj2As.gif", "BIQ2kH9.gif", "zBIeJi5.gif", "vMVtCOc.gif", "pyYfVdt.gif"],
		["xMHLXms.gif", "JXvlt0E.gif", "gvbnePB.gif", "VTiX7E9.gif", "0AJ5u1j.gif", "dWwreGR.gif"],
		["JwYeLqg.gif", "LRXv5XJ.gif", "TF1Q54p.gif", "Ws4CzXK.gif", "AMSEJhZ.gif", "oBHuX7U.gif"],
		["RtcjLDn.gif", "lLgP7Ld.gif", "taePNbZ.gif", "2WCf0cq.gif", "HLK29cV.gif", "lRQebLq.gif"]]};
	return makeEmotePanel('herocatEmotes', 
		'http://i.imgur.com/',
		['herocat'],
		emotes,
		50, 
		50);
};

var makePWIEmotes = function() {
	var categories = ["normal", "tiger", "pig", "bear",  "monkey", "fish", "fox", "mouse", "egg"]; 
	var emotes = {};
	for (var i = 0; i < categories.length; i++) {
		emotes[categories[i]] = generateEmoteArray(categories[i], 10, 50, 1);
	}
	return makeEmotePanel('pwiEmotes', 
		'http://asterpw.github.io/pwicons/emotes/',
//		'http://cdn.rawgit.com/asterpw/pwicons/gh-pages/emotes/',
		categories,
		emotes,
		32, 
		32);
};

var makeFWEmotes = function() {
	var categories = ["samurai", "jellyfish", "raven", "greenmonkey", "baby", "monkey2", "tiger2"]; 
	var emotes = {};
	for (var i = 0; i < categories.length; i++) {
		emotes[categories[i]] = generateEmoteArray(categories[i], 10, 50, 1);
	}
	return makeEmotePanel('fwEmotes', 
		'http://asterpw.github.io/pwicons/emotes/',
//		'http://cdn.rawgit.com/asterpw/pwicons/gh-pages/emotes/',
		categories,
		emotes,
		32, 
		32);
};

var generateEmoteArray = function(name, cols, max, start) {
	var emotes = new Array(Math.ceil(max/cols));
	for (var i = 0; i < emotes.length; i++) {
		emotes[i] = new Array(Math.min(cols, max - i*cols - start + 1));
		for (var j = 0; j < cols; j++) {
			if ((i*cols + j + start) <= max)
				emotes[i][j] = name+'-'+(i*cols+j+start)+'.gif';
		}
	}
	return emotes;
};

var makeFontSizePicker = function() {
	var container = $('<div class="editor-insert-dialog Flyout MenuItems fontSizePicker-dialog"></div>');
	var button = $('<div class="editor-dropdown fontSizePicker"><span class="editor-action icon" title="Font Size"><span class="icon icon-font-size icon-font-button">A<span class="small-size">A</span></span><span class="icon icon-caret-down"></span></span></div>');
	for (var i = 1; i <= 7; i++) {
		container.append($("<a title='"+i+"' class='size-select' style='font-size: "+(i*3+6)+"px; line-height: 130% !important'>"+i+"</a>"));
	}
	$('.size-select', container).click(function(){
		$('.BodyBox', $(this).closest('.FormWrapper')).surroundSelectedText('[size="'+this.title+'"]', '[/size]', 'select');
		$(this).closest(".FormWrapper").find(".editor-dropdown-open").removeClass("editor-dropdown-open");
	});
	
	$('.icon-font-button', button).click(function(){
		$(this).parent().parent().toggleClass("editor-dropdown-open").siblings().removeClass("editor-dropdown-open");
	});
	return button.append(container);
};

var makeFontFacePicker = function() {
	var dialog = $('<div class="editor-insert-dialog Flyout MenuItems enhance-dropdown fontFacePicker-dialog"></div>');
	var container = $('<div class="container">');
	dialog.append(container);
	var button = $('<div class="editor-dropdown fontFacePicker"><span class="editor-action icon" title="Font Face"><span class="icon icon-font-face icon-font-button" style="width: 25px !important">Font</span><span class="icon icon-caret-down"></span></span></div>');
	var fonts = ["Arial", "Arial Black", "Arial Narrow", "Book Antiqua", "Century Gothic", "Comic Sans MS", "Courier New", "Fixedsys", "Franklin Gothic Medium", "Garamond", "Georgia", "Impact", "Lucida Console", "Lucida Sans Unicode", "Microsoft Sans Serif", "Palatino Linotype", "System", "Tahoma", "Times New Roman", "Trebuchet MS", "Verdana"];
	for (var i = 0; i < fonts.length; i++) {
		container.append($("<a title='"+fonts[i]+"' class='face-select' style='font-family: "+fonts[i]+"; font-size: 16px; line-height: 130% !important'>"+fonts[i]+"</a>"));
	}
	$('.face-select', container).click(function(){
		$('.BodyBox', $(this).closest('.FormWrapper')).surroundSelectedText('[font="'+this.title+'"]', '[/font]', 'select');
		$(this).closest(".FormWrapper").find(".editor-dropdown-open").removeClass("editor-dropdown-open");
	});
	$('.icon-font-button', button).click(function(){
		$(this).parent().parent().toggleClass("editor-dropdown-open").siblings().removeClass("editor-dropdown-open");
	});
	return button.append(dialog);
};

var makeTextFaceEmotes = function() {
	var dialog = $('<div class="editor-insert-dialog Flyout MenuItems enhance-dropdown text-face-dialog"></div>');
	var container = $('<div class="container">');
	dialog.append(container);
	var button = $('<div class="editor-dropdown textFaceEmotes"><span class="editor-action icon" title="Text Faces"><span class="icon icon-text-face icon-font-button" style="position: relative;left: -5px;">\u0ca0_\u0ca0</span><span class="icon icon-caret-down"></span></span></div>');
	var textfaces = [
		"Donger:\u30FD\u0F3C\u0E88\u0644\u035C\u0E88\u0F3D\uFF89",
		"Lenny:( \u0361\u00b0 \u035c\u0296 \u0361\u00b0)", 
		"Ohh Well:\u00af\\_(\u30c4)_/\u00af",
		"Gun:\u2584\ufe3b\u0337\u033f\u253b\u033f\u2550\u2501\u4e00",
		"Stare:\u0ca0_\u0ca0",
		"Fancy Stare:\u0ca0_\u0ca0\u0cca",
		"Cry:\u0ca5_\u0ca5",
		"Need More:\u0f3c \u3064 \u25d5_\u25d5 \u0f3d\u3064",
		"Heeeey:(\u261e\uff9f\u30ee\uff9f)\u261e",
		"Cute:(\u25d5\u203f\u25d5\u273f)",
		"Table Flip:(\u256f\u00b0\u25a1\u00b0\uff09\u256f\ufe35 \u253b\u2501\u253b",
		"Double Table:\u253b\u2501\u253b \ufe35\u30fd(`\u0414\u00b4)\uff89\ufe35 \u253b\u2501\u253b",
		"Shades:(\u2022_\u2022) ( \u2022_\u2022)>\u2310\u25A0-\u25A0 (\u2310\u25A0_\u25A0)",
		"Strong:\u1566(\u00F2_\u00F3\u02C7)\u1564"
	];
	button.find('.editor-action .icon').click(function(){
		$(this).parent().parent().toggleClass("editor-dropdown-open").siblings().removeClass("editor-dropdown-open");
	});
		
	for (var i = 0; i < textfaces.length; i++) {
		var textface = textfaces[i].split(":");
		container.append($("<a title='"+textface[0]+"' class='text-face-select' style='font-size: 16px; line-height: 130% !important'>"+textface[1]+"</a>"));
	}
	$('.text-face-select', container).click(function(){
		$('.BodyBox', $(this).closest('.FormWrapper')).insertAtCaret($(this).text());
		$(this).closest(".FormWrapper").find(".editor-dropdown-open").removeClass("editor-dropdown-open");
	});
	/*
	$('.icon-font-button', button).click(function(){
		$(this).closest(".editor-dropdown").toggleClass("editor-dropdown-open").siblings().removeClass("editor-dropdown-open");
	});*/
	return button.append(dialog);
};

var makeFontColorPicker = function() {
	var container = $('<div class="editor-insert-dialog Flyout MenuItems fontColorPicker-dialog"><input type="text" class="color-picker"></input></div>');
	var button = $('<div class="editor-dropdown fontColorPicker"><span class="editor-action icon" title="Font Color"><span class="icon icon-font-color">A</span><span class="icon icon-caret-down"></span></span></div>');
	container.append('<input type="checkbox" class="autoAddColor"></input><span class="label">Auto color when submitting</span>');
	container.find('.autoAddColor').click(function(){
		pweEnhanceSettings.editor.fontColorPicker.autoAddColor = $(this).is(":checked");
		update();
	});
	container.find(".icon-font-color").css("box-shadow", "0 -5px 0 0 "+pweEnhanceSettings.editor.fontColorPicker.selectedColor+" inset");
	if (pweEnhanceSettings.editor.fontColorPicker.autoAddColor) 
		container.find('.autoAddColor').prop('checked', true);
	return button.append(container);
};

var setFontColor = function(picker, color) {
	picker.closest(".FormWrapper").find('.BodyBox').surroundSelectedText('[color="'+color+'"]', '[/color]', 'select');
	picker.closest(".FormWrapper").find(".icon-font-color").css("box-shadow", "0 -5px 0 0 "+color+" inset");
	pweEnhanceSettings.editor.fontColorPicker.selectedColor = color;
	picker.closest(".fontColorPicker").removeClass("editor-dropdown-open");
	update();
};

var initColorPicker = function(container) {
	picker = container.find('.color-picker');	
	picker.spectrum({
		color: pweEnhanceSettings.editor.fontColorPicker.selectedColor,
		showInput: true,
		className: "full-spectrum",
		showInitial: true,
		showSelectionPalette: true,
		maxSelectionSize: 8,
		showPaletteOnly: true,
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
	container.find(".icon-font-color").css("box-shadow", "0 -5px 0 0 "+pweEnhanceSettings.editor.fontColorPicker.selectedColor+" inset");
	container.find('.icon-font-color').click( function(event) {
		setFontColor($(event.target), '#'+($(event.target).closest('.fontColorPicker').find('.color-picker').spectrum("get").toHex()));
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
		$(this).closest(".FormWrapper").find(".editor-dropdown-open").removeClass("editor-dropdown-open");
		
		if (pweEnhanceSettings.editor.fontColorPicker.autoAddColor) {
			var form = $(this).closest(".FormWrapper");
			var color = form.find(".color-picker").spectrum("get");
			autoAddFontColor(form.find(".BodyBox"), color);
		}
	});
};

var makeShowHideAllCategories = function(container) {
	this.target = ".SiteMenu li:first-child";  //override positioning
	this.positionMethod = "after";
	return $('<li class="'+this.id+'"><a href="http://perfectworld.vanillaforums.com/categories/?ShowAllCategories=false">My Categories</a></li>' +
		'<li class="'+this.id+'"><a href="http://perfectworld.vanillaforums.com/categories/?ShowAllCategories=true">All Categories</a></li>');
};

var makeSTOLinks = function(container) {
	return $('<li class="'+this.id+'"><a href="http://perfectworld.vanillaforums.com/categories/startrekonline">STO</a></li>' +
		'<li class="'+this.id+'"><a href="http://sto.gamepedia.com/Lore">Lore</a></li>' +
		'<li class="'+this.id+'"><a href="http://sto.gamepedia.com/Commodities">Commodities</a></li>' 
		);
};

var makePWILinks = function(container) {
	return $('<li class="'+this.id+'"><a href="http://perfectworld.vanillaforums.com/categories/pwi">PWI</a></li>' +
		'<li class="'+this.id+'"><a href="http://pwdatabse.com">PWDatabase</a></li>' +
		'<li class="'+this.id+'"><a href="http://mypers.pw/1.8/">PW Calc</a></li>' +
		'<li class="'+this.id+'"><a href="http://aster.ohmydays.net/pw">Aster</a></li>'
		);
};

var Feature = function() {};
Feature.prototype.init = function(defaults) {
	this.selector = "."+this.id;
	if (!(this.id in pweEnhanceSettings[this.type]))
		pweEnhanceSettings[this.type][this.id] = {};
	pweEnhanceSettings[this.type][this.id].enabled = true;
	mergeData(pweEnhanceSettings[this.type][this.id], defaults);
};

Feature.prototype.install = function(context) {
	var panel = this.maker();
	var destination = $(this.target, context);
	destination[this.positionMethod](panel);
	if (!pweEnhanceSettings[this.type][this.id].enabled) {
		panel.hide();
	}
};

Feature.prototype.setEnabled = function(enabled) {
	pweEnhanceSettings[this.type][this.id].enabled = enabled;
	if (!enabled) {
		$(this.selector).hide();
	} else {
		$(this.selector).show();
	}
};

Feature.prototype.isEnabled = function() {
	return pweEnhanceSettings[this.type][this.id].enabled;
};

var EditorFeature = function(name, id, description, maker, defaults, screenshot) {
	this.name = name;
	this.id = id;
	this.description = description;
	this.maker = maker;
	this.screenshot = screenshot;
	this.init(defaults);
};
EditorFeature.prototype = new Feature;
EditorFeature.prototype.header = 'Features';
EditorFeature.prototype.type = 'editor';
EditorFeature.prototype.target = '.editor-action-headers';
EditorFeature.prototype.positionMethod = 'before';

var EmoteFeature = function(name, id, description, maker, defaults, screenshot) {
	this.name = name;
	this.id = id;
	this.description = description;
	this.maker = maker;
	this.screenshot = screenshot;
	this.init(defaults);
};
EmoteFeature.prototype = new Feature;
EmoteFeature.prototype.header = 'Emotes';
EmoteFeature.prototype.type = 'emotes';
EmoteFeature.prototype.target = '.editor-action-emoji';
EmoteFeature.prototype.positionMethod = 'after';

var LinkFeature = function(name, id, description, maker, defaults, screenshot) {
	this.name = name;
	this.id = id;
	this.description = description;
	this.maker = maker;
	this.screenshot = screenshot;
	this.init(defaults);
};
LinkFeature.prototype = new Feature;
LinkFeature.prototype.type = 'links';
LinkFeature.prototype.header = 'Links';
LinkFeature.prototype.target = '.SiteMenu';
LinkFeature.prototype.positionMethod = 'append';

var features = [
	new EditorFeature("Font Picker", "fontFacePicker", "Show font picker in editor", makeFontFacePicker),
	new EditorFeature("Font Size Picker", "fontSizePicker", "Show font size picker in editor", makeFontSizePicker),
	new EditorFeature("Font Color Picker", "fontColorPicker", "Show font color picker in editor", makeFontColorPicker, {selectedColor: "#FFFFFF", autoAddColor: false}),
	new EmoteFeature("PWI Emotes", "pwiEmotes", "Show PWI emotes in editor", makePWIEmotes, {category: "tiger"}),
	new EmoteFeature("Forsaken World Emotes", "fwEmotes", "Show Forsaken World emotes in editor", makeFWEmotes, {category: "jellyfish"}),
	new EmoteFeature("Herocat (Champions Online) Emotes", "herocatEmotes", "Show Herocat (Champions Online) emotes in editor", makeHeroEmotes, {category: "herocat", enabled: false}),
	new EmoteFeature("Text Face Emotes", "textFaceEmotes", "Show Text Face Emotes in editor", makeTextFaceEmotes),
	new LinkFeature("Show/Hide All Categories", "showHideAllCategories", "Add show/hide all categories links", makeShowHideAllCategories, {enabled: false}),
	new LinkFeature("Show/Hide STO Links", "stoLinks", "Add STO links", makeSTOLinks, {enabled: false}),
	new LinkFeature("Show/Hide PWI Links", "pwiLinks", "Add PWI links", makePWILinks, {enabled: false}),
];

var installFeatures = function(container) {
	for (var i = 0; i < features.length; i++) {
		if (container.find(features[i].target)) {
			features[i].install(container);	
		}
	}
	initSubmitButton(container);
	if($.spectrum) 
		initColorPicker(container);
};

/* loadCSS = function(href) {
     var cssLink = $("<link rel='stylesheet' type='text/css' href='"+href+"'>");
     $("head").append(cssLink); 
 };*/
loadCSS = function(href) {
	var head  = document.getElementsByTagName('head')[0];
	var link  = document.createElement('link');
	link.rel  = 'stylesheet';
	link.type = 'text/css';
	link.href = href;
	link.media = 'all';
	head.appendChild(link);
};
 

 loadJS = function(src) {
     var jsLink = $("<script type='text/javascript' src='"+src+"'>");
     $("head").append(jsLink); 
 }; 
 
 var update = function() {
	saveSettings();
};

var saveSettings = function(){
	localStorage["pweEnhancementSettings"] =  JSON.stringify(pweEnhanceSettings);
};

var getSettings = function() {
	var savedSettingsJSON = localStorage["pweEnhancementSettings"];
	if (savedSettingsJSON) {
		var savedSettings = JSON.parse(savedSettingsJSON);
		if(savedSettings.version && savedSettings.version >= "0.6") {
			mergeData(pweEnhanceSettings, savedSettings);
			if (pweEnhanceSettings.version > VERSION) // shouldnt happen
				pweEnhanceSettings.version = VERSION;
				
		}
	}
};

loadCSS("https://cdn.rawgit.com/asterpw/spectrum/master/spectrum.css");
loadCSS("https://rawgit.com/asterpw/pwevanillaenhance/03d398374b0b995fde0c956e1f452a731140f8e3/pwevanillaenhance.user.css");
getSettings();
preloadThemes();

var jQueryLoaded = function() {
//$(document).ready(function() {
	if (pweEnhanceSettings.version < VERSION) {
		showWhatsNewDialog();
	}
	handleThemes();
	installFeatures($('.FormWrapper'));
	installFeatures($('.Head'));
	makeEnhancePreferencesMenu();
	$.getScript("https://cdn.rawgit.com/asterpw/spectrum/master/spectrum.js").done(function() {
		initColorPicker($('.fontColorPicker'));
	});
	$(document).on( "EditCommentFormLoaded", function(event, container) {
		installFeatures(container);
	});
};

document.addEventListener("DOMContentLoaded", function(event) {
	jQueryLoaded();
});


})();
