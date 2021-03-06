// ==UserScript==
// @name       PWE Vanilla Forums Enhancement
// @namespace  http://github.com/asterpw/pwevanillaenhance
// @downloadURL https://github.com/asterpw/pwevanillaenhance/raw/master/pwevanillaenhance.user.js
// @updateURL  https://github.com/asterpw/pwevanillaenhance/raw/master/pwevanillaenhance.user.js
// @icon http://cd8ba0b44a15c10065fd-24461f391e20b7336331d5789078af53.r23.cf1.rackcdn.com/perfectworld.vanillaforums.com/favicon_2b888861142269ff.ico
// @version    1.4.0.3
// @run-at     document-start
// @description  Adds useful tools to the pwe vanilla forums
// @match      htt*://forum.arcgames.com/*
// @grant       none
// @copyright  2016, Asterelle 
// ==/UserScript==

(function() {	
var VERSION = "1.4.0.3";  //what we store when we should display what's new dialog
var getFullVersion = function() { // For version display on the screen;
	try {
		return GM_info.script.version;  //causes error if not supported
	} catch(err) {
		return VERSION;
	}
};
/*jshint multistr: true */

/*https://cdn.rawgit.com/asterpw/pwevanillaenhance/master/adblock.txt
<a href="abp:subscribe?location=https%3A%2F%2Fcdn.rawgit.com%2Fasterpw%2Fpwevanillaenhance%2Fmaster%2Fadblock.txt&amp;title=Block%20PWE%20Vanilla%20Forums%20Embed">Subscribe</a>
*/
var CHANGELOG = " \
	<div class='change-ver'>v1.4.0</div> - Fixed menus on PWE's new forum theme<br> - Added new 'hat' emotes to FW Emotes <br>\
	- Enhance Theme Makers Need to Update their Themes! \
	<!-- <div class='change-ver'>v1.4.0</div> - Added Discussion Filter / Navigation from <a href='http://forum.arcgames.com/arc/profile/eiledon'>@eiledon</a>! -->\
	<div class='change-ver'>v1.3.8</div> - Comment previews are now much more reliable and responsive\
	<div class='change-ver'>v1.3.7</div> - Titles now appear in a just-added comment\
	<div class='change-ver'>v1.3.6</div> - Restored manage drafts link under account options<br>- Removed hide category toggle<br>- Fixed comment previews on notifications\
	<div class='change-ver'>v1.3.5</div> - Comment previews have been resurrected!\
	<div class='change-ver'>v1.3.4</div> - Another fix for promoter titles, hubs are bad \
	<div class='change-ver'>v1.3.3</div> - Fixed new issue with promoter titles not showing\
	<div class='change-ver'>v1.3.2</div> - Updated game links (now maintained by <a href='http://forum.arcgames.com/arc/profile/eiledon'>@eiledon</a>) \
	<div class='change-ver'>v1.3.1</div> - Fixed broken editor when default format is not BBCode \
	<div class='change-ver'>v1.3.0</div> - Help Promoters update their sigs to the new URL.\
	<div class='change-ver'>v1.2.5</div> - Fix game specific links<br> - updated automatic URL redirects for browsing without arc frame\
	<div class='change-ver'>v1.2.4</div> - Enable extension on new forum hubs\
	<div class='change-ver'>v1.2.3</div> - Font Size Picker is back\
	<div class='change-ver'>v1.2.2</div> - Removed Font Size Picker (PWE disabled font size)<br> - Switch people stuck in Text mode to BBCode\
	<div class='change-ver'>v1.2.1</div> - Added option for not hiding promo links in signatures<br> - Enabled Promoter titles for Theme Authors\
	<div class='change-ver'>v1.2.0</div> - Added custom user titles for Enhance Promoters<br> - Added new links to Enhance Options Menu (cog) \
	<div class='change-ver'>v1.1.3</div> - Enabled fade animation in comment previews \
	<div class='change-ver'>v1.1.2</div> - Added admin posts link for STO and CO game links \
	<div class='change-ver'>v1.1.1</div> - Added random wallpapers and default wallpapers  \
	<div class='change-ver'>v1.1.0</div> - Added custom wallpaper support in Themes window \
	<div class='change-ver'>v1.0.1</div> - Added message previews to Notifications and popups <br> - better redirect prevention in Chrome \
	<div class='change-ver'>v1.0.0</div> - Theme Addons moved to Theme Manager \
	<div class='change-ver'>v0.9.9</div> - Added Twitch Emotes \
	<div class='change-ver'>v0.9.8</div> - Previews don't mark a thread as read (proxied api) \
	<div class='change-ver'>v0.9.7</div> - Added User Blocking<br>- Redirect embedded urls to native urls \
	<div class='change-ver'>v0.9.6</div> - Added dino emotes \
	<div class='change-ver'>v0.9.5</div> - Added star trek emotes courtesy <a href='http://irvinis.deviantart.com' style='color:black; text-decoration: bold'>IrvinIS</a>\
	<div class='change-ver'>v0.9.4</div> - Added fancier emote option picker\
	<div class='change-ver'>v0.9.3</div> - Added word wrapping of long comment previews for chrome+opera\
	<div class='change-ver'>v0.9.2</div> - Block the forced embedding arc redirect\
	<div class='change-ver'>v0.9.1</div> - Everyone gets the coveted Enhance User title\
	<div class='change-ver'>v0.9.0</div> - Used the API to add comment preview text from discussions view\
	<div class='change-ver'>v0.8.6</div> - added support for text color inversion for light themes\
	<div class='change-ver'>v0.8.5</div> - collapsible theme variants<br>(experimental need feedback)\
	<div class='change-ver'>v0.8.4</div> - show new/updated themes\
	<div class='change-ver'>v0.8.3</div> - new theme format from file\
	<div class='change-ver'>v0.8.2</div> - theme authors now receive a special title\
	<div class='change-ver'>v0.8.1</div> - turned theme button into small icon, fix green checkmark\
	<div class='change-ver'>v0.8.0</div> - added fancy theme manager\
	<div class='change-ver'>v0.7.4</div> - those emotes ARENT WHITE CATS AT ALL, it's an onion\
	<div class='change-ver'>v0.7.3</div> - added 'white cat' emotes\
	<div class='change-ver'>v0.7.2</div> - added MLP emotes\
	<div class='change-ver'>v0.7.1</div> - made all game links one option (@eiledon)\
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
	<div class='change-ver'>v0.5.0</div> - Added auto-loading of themes from @nrglg";

var pweEnhanceSettings = {
	editor: {
	},
	links: {
	},
	emotes: {
	},
	actions: {
	},
	themes: { //autoadded from remote
	},
	lastThemeUpdateTime: 0,
	games: { //from remote json
	},
	lastGamesUpdateTime: 0,
	options: {
		collapseThemes: true,
		showEnhanceTitle: true
	},
	blockedUsers: {
	},
	wallpapers: {
		selected: "",
		list: [],
		page: 0,
		pageSize: 8,
		random: false
	},

	version: "0"
};

var pageData = {
	discussions: {},
	categories: {}
};

var showDialog = function(classname, titleText, content, delay, closeHandler) {
	var dialog = $("<div class='enhance-dialog "+classname+"' style='display: none;'></div>");
	dialog.append($("<div class='title'>"+titleText+"<div class='close'>\u00D7</div></div>"));
	dialog.append($("<div class='content'>"+content+"</div>"));
	$(".close", dialog).click(function(){$('.'+classname).fadeOut();});
	if (closeHandler) $(".close", dialog).click(closeHandler);
	$(".MeBoxContainer").append(dialog);
	dialog.delay(delay).fadeIn();
};

var showWhatsNewDialog = function() {
	showDialog('whatsNewDialog', "What's new in PWE Vanilla Enhancement v"+getFullVersion(), CHANGELOG, 1000, function(){
		pweEnhanceSettings.version = VERSION;
		update();
	});
};

var buildCSSThemeURL = function(theme) {
    return theme.baseurl + (theme['branch-commit'].length > 0 ?
                            theme['branch-commit'] + "/" : '') + theme.file;
};

var preloadThemes = function() { //loads before jquery
	var keys = getSortedThemeNames();
	for (var i = 0; i < keys.length; i++) { 
		var name = keys[i];
		
		enabled = 'enabled' in pweEnhanceSettings.themes[name] ? pweEnhanceSettings.themes[name].enabled : false;
		enabled |= pweEnhanceSettings.themes[name].category == 'Default';
		if (enabled) {
			var theme = pweEnhanceSettings.themes[name];
			loadCSS(buildCSSThemeURL(theme));
		}
	}
};

var applyThemes = function() {
	var keys = getSortedThemeNames();
	for (var i = 0; i < keys.length; i++) { 
		var name = keys[i];
		enabled = 'enabled' in pweEnhanceSettings.themes[name] ? pweEnhanceSettings.themes[name].enabled : false; 
		enabled |= pweEnhanceSettings.themes[name].category == 'Default';
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
			makeThemeManager();
			makeEnhancePreferencesMenu();
		});
	} else {
		applyThemes();
	}
};

var handleGameInfoUpdate = function() {
	var currentTime = new Date().getTime();
	if (currentTime - pweEnhanceSettings.lastGamesUpdateTime > 24*3600*1000) {
		$.getJSON('https://rawgit.com/Eiledon/PWEVC/master/PWE_games.json', function(json){
			$.extend(true, pweEnhanceSettings, json);
			pweEnhanceSettings.lastGamesUpdateTime = new Date().getTime();
			update();
		});
	}
};

var invertTextColors = function(enabled) {	
	var doInvert = function() {
		$('.Message span[style^=color]').each(function(){
			var color = tinycolor($(this).css('color')).toHsl();
			color.l = 1 - color.l;
			$(this).css({'color': tinycolor(color).toRgbString()});
		});
	};
	if (typeof tinycolor == 'undefined') {
		$.getScript('https://rawgit.com/bgrins/TinyColor/master/tinycolor.js').done( function() {
			invertTextColors(enabled);
		});
		return;
	}
	/*var doInvert = function() {
		$('.Message span[style^=color]').each(function(){
			var color = $(this).css('color').split('(')[1].split(')')[0].split(', ');
			var r = Number(color[0]), g = Number(color[1]), b = Number(color[2]);
			var ave = 0.2126*r + 0.7152*g + 0.0722*b;
			if (ave == 0) {
				$(this).css({'color': '#FFFFFF'});
				return;
			}
			var ratio = (255 - ave) / ave;
			r = Math.round(Math.max(Math.min(ratio*r, 255), 0));
			g = Math.round(Math.max(Math.min(ratio*g, 255), 0));
			b = Math.round(Math.max(Math.min(ratio*b, 255), 0));
			$(this).css({'color': 'rgb('+r+', '+g+', '+b+')'});
		});
	};*/
	if (enabled) {
		if ($('body.inverted').length)
			return;
		doInvert();
		$('body').addClass('inverted');
	} else if ($('body.inverted').length) {
		doInvert(); // reverse it
		$('body').removeClass('inverted');
	}
};

var setThemeEnabled = function(name, enabled) {
	var theme = pweEnhanceSettings.themes[name];
	theme.enabled = enabled;
	url = buildCSSThemeURL(theme);
	//if (theme.invertTextColors)
	//	invertTextColors(enabled);
	if (enabled) {		
		if ($("head link[href='"+url+"']").length === 0)
			loadCSS(url);
		else { // do i really need to do this?
			loadCSS(url);
			$("head link[href='"+url+"']")[0].remove();
		}
		if (theme.category == "Theme") { //only one theme allowed with category == Theme
			$('.themeManager .theme-preview[title="'+name+'"]').closest(".theme").addClass("selected");
			for (var i in pweEnhanceSettings.themes) {
				if (pweEnhanceSettings.themes[i].category == "Theme"  && i != name) { 
					setThemeEnabled(i, false);
				}
			}
		}
	} else {
		$('.themeManager .theme-preview[title="'+name+'"]').closest(".theme").removeClass("selected");
		$('.themeManager input[title="'+name+'"]').prop("checked", false);
		$("head link[href='"+url+"']").remove();
	}
};

var getSortedThemeNames = function() {
	var keys = Object.keys(pweEnhanceSettings.themes);
	
	try {
		keys.sort(function(a,b){
			if (typeof a == 'function') return Number.MAX_VALUE;
			if (typeof b == 'function') return -Number.MAX_VALUE; //this is BS
			return pweEnhanceSettings.themes[a].order - pweEnhanceSettings.themes[b].order;
		});
	} catch(err) {
	}
	return keys;
};

var clearWallpaper = function() {
	pweEnhanceSettings.wallpapers.selected = '';
	setWallpaper();
	if (pweEnhanceSettings.wallpapers.random) 
		$('.wallpaperMenu .feature.random input').click();
};

var randomWallpaper = function() { 
	if (pweEnhanceSettings.wallpapers.random && pweEnhanceSettings.wallpapers.selected != '') {
		var randIndex = Math.floor(Math.random() * 	pweEnhanceSettings.wallpapers.list.length);
		pweEnhanceSettings.wallpapers.selected = pweEnhanceSettings.wallpapers.list[randIndex];
	}
};

var setWallpaper = function() {
	var head = document.getElementsByTagName('head')[0];
	var html = document.getElementsByTagName('html')[0];
	var wallpaperCss = document.getElementById('wallpaperCss');
	if (wallpaperCss) {
		head.removeChild(wallpaperCss);
	}
	
	if (pweEnhanceSettings.wallpapers.selected) {
		var style = document.createElement('style');
		style.innerHTML = 'html body {\
				background-size: cover !important;\
				background-position: center !important;\
				background-repeat: no-repeat !important;\
				background-color: black;\
				background-attachment: fixed !important;\
				background-image: url("'+pweEnhanceSettings.wallpapers.selected+'") !important;\
			}';
		style.id = 'wallpaperCss';
		head.appendChild(style);
		
		if (html && html.className.indexOf('customWallpaper') == -1)
			html.className = html.className + " customWallpaper";
	} else {
		if (html && html.className.indexOf('customWallpaper') != -1)
			html.className = html.className.replace(' customWallpaper', '');
	}
};

var makeWallpaperPicker = function(index) {
	var container = $("<div class='wallpaper picker'></div>");
	var url = pweEnhanceSettings.wallpapers.list[index];
	var imgId = url.substring(url.lastIndexOf('/')).split('.')[0];
	var thumbnail = 'http://i.imgur.com/'+imgId+'b.jpg';
	var removeControl = $("<div class='remove icon icon-remove-sign' title='Remove'></div>");
	removeControl.click(function(e){
		var index = pweEnhanceSettings.wallpapers.list.indexOf(url);
		if (index != -1) {
			pweEnhanceSettings.wallpapers.list.splice(index, 1);
		}
		if (pweEnhanceSettings.wallpapers.selected == url) {
			clearWallpaper();
		}
		populateWallpapers();
		update();
		e.stopPropagation();
	});
	container.append(removeControl);
	if (url == pweEnhanceSettings.wallpapers.selected)
		container.addClass('selected');
	container.append($('<div class="image" style="background-image: url(\''+thumbnail+'\')"></div>'));
	container.click(function(){
		$(this).toggleClass('selected').siblings('.wallpaper').removeClass('selected');
		if ($(this).is('.selected')) {
			pweEnhanceSettings.wallpapers.selected = url;
		} else {
			clearWallpaper();
		}
		setWallpaper();
		update();
	});
	return container;
}; 

var populateWallpapers = function() {
	var getPageText = function() {
		if (pweEnhanceSettings.wallpapers.list.length == 0) 
			return "0 / 1";
		return (pweEnhanceSettings.wallpapers.page+1) + " / " + Math.ceil(pweEnhanceSettings.wallpapers.list.length/pweEnhanceSettings.wallpapers.pageSize);
	};
	
	$('.wallpaper-content').empty();
	var start = pweEnhanceSettings.wallpapers.page * pweEnhanceSettings.wallpapers.pageSize;
	if (start >= pweEnhanceSettings.wallpapers.list.length) {
		start = 0;
		pweEnhanceSettings.wallpapers.page = 0;
	}

	$('.pagelabel').text(getPageText());
	for (var i = start; i < start + pweEnhanceSettings.wallpapers.pageSize && i < pweEnhanceSettings.wallpapers.list.length; i++) {
		$('.wallpaper-content').append(makeWallpaperPicker(i));
	}
	
	if (pweEnhanceSettings.wallpapers.list.length > 0) {
		$('.wallpaperMenu .Default').hide();
		$('.wallpaperMenu .RemoveAll').show();
		$('.wallpaperMenu .feature.random input').prop("disabled", false);
	} else {
		$('.wallpaperMenu .Default').show();
		$('.wallpaperMenu .RemoveAll').hide();
		$('.wallpaper-content').text('No wallpapers added.');
		clearWallpaper();
		$('.wallpaperMenu .feature.random input').prop("disabled", true);
	}
};

var addGallery = function(galleryId) {
	var albumAPI = "https://api.imgur.com/3/album/" + galleryId + "/images"; //Can be any get url you want

	$.ajax({
		url: albumAPI,
		headers:{   
			//get your own god damn client ID its free:  api.imgur.com
			'Authorization':'Client-ID 450875526712d7d'
		},
		type: 'GET',
		dataType: 'json',
		success: function(data) {
			var recievedImages = data.data;
			for (var i = 0; i < recievedImages.length; i++) {
				var imgUrl = recievedImages[i].link;
				pweEnhanceSettings.wallpapers.list.push(imgUrl);
			}
			populateWallpapers();
			update();
		},
	  error: function() { /* I dun know? */ }
	});
};

var handleWallpaperLoad = function() {
	var urlText = $('#WallpaperUrl').val().trim();
	var imgMatch = new RegExp("(?:https?://)?(?:i\\.)?imgur\\.com/([^./]+)\\..+").exec(urlText);
	var galleryMatch = new RegExp("(?:https?://)?imgur\\.com/(?:a|gallery)/([^?#/]+)").exec(urlText);
	if (imgMatch) {
		pweEnhanceSettings.wallpapers.list.push('http://i.imgur.com/' + imgMatch[1] + '.jpg');
		pweEnhanceSettings.wallpapers.page = Math.ceil(pweEnhanceSettings.wallpapers.list.length / pweEnhanceSettings.wallpapers.pageSize) - 1;
		populateWallpapers();
	} else if (galleryMatch) {
		addGallery(galleryMatch[1]);
	}
	$('#WallpaperUrl').val('');
};

var makeWallpaperMenu = function() {
	var menu = $("<div class='wallpaperMenu enhance-dropdown'></div>");
	var title = $("<h1><span class='icon icon-chevron-sign-right' style='margin: 0px 5px 0px 10px;'></span>Wallpapers</h1>");
	var content = $("<div class='content' style='display:none'>");
	title.click(function(){
		populateWallpapers();
		content.slideToggle();
		$('.icon', this).toggleClass("icon-chevron-sign-right");
		$('.icon', this).toggleClass("icon-chevron-sign-down");
		});
	var inputField = $('<input id="WallpaperUrl" name="Name" value="" maxlength="100" class="InputBox" type="text" placeholder="gallery or image url to load from imgur.com" ></input>').change(handleWallpaperLoad);	
	var loadButton = $('<a class="NavButton LoadWallpaper">Load</a>').click(handleWallpaperLoad);
	var pageLeftButton = $('<a class="NavButton PageLeft">&nbsp;&laquo;&nbsp;</a>').click(function(){
		pweEnhanceSettings.wallpapers.page = Math.max(0, pweEnhanceSettings.wallpapers.page - 1);
		populateWallpapers();
		update();
	});
	var pageLabel = $('<span class="pagelabel">1/1</span>');
	var pageRightButton = $('<a class="NavButton PageRight">&nbsp;&raquo;&nbsp;</a>').click(function(){
		pweEnhanceSettings.wallpapers.page = Math.min(Math.ceil(pweEnhanceSettings.wallpapers.list.length/pweEnhanceSettings.wallpapers.pageSize) - 1, pweEnhanceSettings.wallpapers.page + 1);
		populateWallpapers();		
		update();
	});
	var removeButton = $('<a class="NavButton RemoveAll">Remove All</a>').click(function(){
		pweEnhanceSettings.wallpapers.page = 0;
		pweEnhanceSettings.wallpapers.list = [];
		populateWallpapers();
		update();
	});
	var defaultButton = $('<a class="NavButton Default">Load Default Wallpapers</a>').click(function(){
		addGallery('IKwve'); // load defaults
	});
	
	var useRandomControl = makeFeatureOption("wallpapers", "random", 'Use Random Wallpaper', function(enabled){
		if (enabled) {
			if (pweEnhanceSettings.wallpapers.list.length > 0)
				pweEnhanceSettings.wallpapers.selected = pweEnhanceSettings.wallpapers.list[0];
			randomWallpaper();
			populateWallpapers();
			setWallpaper();
			update();
		}
	});
	
	var itemContent = $("<div class='wallpaper-content'>No wallpapers added.<div>");
	var panel = $("<div class='panel'></div>");
	panel.append(inputField).append(loadButton).append('<a href="http://imgur.com">Go to Imgur to upload wallpapers</a>');
	var pagination = $("<div class='panel'></div>");
	pagination.append(useRandomControl).append(pageLeftButton).append(pageLabel).append(pageRightButton).append(removeButton).append(defaultButton);
	content.append(panel).append(pagination).append(itemContent);
	return menu.append(title).append(content);
};

var makeAddonMenu = function() {
	var menu = $("<div class='addonMenu enhance-dropdown'></div>");
	var title = $("<h1><span class='icon icon-chevron-sign-right' style='margin: 0px 5px 0px 10px;'></span>Add-ons</h1>");
	var content = $("<div class='content' style='display:none'>");
	title.click(function(){content.slideToggle();
		$('.icon', this).toggleClass("icon-chevron-sign-right");
		$('.icon', this).toggleClass("icon-chevron-sign-down");});
	
	var keys = getSortedThemeNames();
	for (var i = 0; i < keys.length; i++) { 
		var name = keys[i];
		if (pweEnhanceSettings.themes[name].category == "Theme" ||
			pweEnhanceSettings.themes[name].category == "Default")
			continue;
		
		var themeContainer = $("<div class='addon'></div>");
		var checked = pweEnhanceSettings.themes[name].enabled ? 'checked' : '';
		themeContainer.append('<input type="checkbox" class="option" '+checked+' title="'+name+'"></input><span class="label">' +
			'<span class="name">' + name + '</span><span class="description">' +
			pweEnhanceSettings.themes[name].description+'</span></span>');
		$('.option', themeContainer).click( (function(name) {
				return function(){
					setThemeEnabled(name, $(this).is(":checked"));
					if (pweEnhanceSettings.themes[name].variant && pweEnhanceSettings.themes[name].enabled) {
						for (var theme in pweEnhanceSettings.themes) {
							if (theme != name && 
								pweEnhanceSettings.themes[theme].enabled && 
								pweEnhanceSettings.themes[theme].variant == pweEnhanceSettings.themes[name].variant)
								setThemeEnabled(theme, false);
						}
					}
					update();
				};
			})(name)
		);
		content.append(themeContainer);
	}
	
	return menu.append(title).append(content);
};

var getNameForVariantGroup = function (variantName) { 
	return variantName.replace(/\s/g, '');
};

var makeThemePicker = function(name) {
	var theme = pweEnhanceSettings.themes[name];
	var container = $("<div class='theme picker'></div>");
	if (theme.enabled) {
		container.addClass('selected');
	}
	var now = new Date().getTime();
	var day = 24*3600*1000;
	if (((now - Date.parse(theme.created))/day) < 5) 
		container.append($('<span class="new">New!</span>'));
	else if (((now - Date.parse(theme.updated))/day) < 5) 
		container.append($('<span class="updated">Updated!</span>'));
	var screenshotUrl = ""; // needs some default;
	if (theme["thumbnail"]) {
		screenshotUrl = theme["thumbnail"];
	} else if (theme["screenshot-480"] && theme["screenshot-480"].length) {
		screenshotUrl = theme["screenshot-480"][0];
	} else {
		screenshotUrl = "https://cdn.rawgit.com/Goodlookinguy/pwvnrg/master/thumbnails/missing-thumbnail.png";
	}
	if (screenshotUrl.indexOf("http") != 0) {
		screenshotUrl = theme.baseurl + (theme['branch-commit'].length > 0 ? theme['branch-commit'] + "/" : '') + screenshotUrl;
	}
	
	var authorName =  theme["author-alias"] ? theme["author-alias"] : theme.author;
	container.append($('<div class="theme-preview" title="'+name+'" style="background-image: url(\''+screenshotUrl+'\')">'));
	container.append($('<div class="theme-created '+(theme.updated != theme.created?'Hidden':'')+'">'+theme.created+'</div>'));
	container.append($('<div class="theme-updated '+(theme.updated == theme.created?'Hidden':'')+'">'+theme.updated+'</div>'));
	
	container.append($('<div class="theme-name" title="'+name+'">'+name+'</div>'));
	container.append($('<div class="theme-author"><a href="http://perfectworld.vanillaforums.com/profile/'+theme.author+'">'+authorName+'</a></div>'));
	container.append($('<div class="theme-description">'+theme.description+'</div>'));

	
	
	$(".theme-preview", container).click(function(){
		if ($(this).closest(".collapsed").length) {
			var delayedUncollapse = function(themename) { 
				var variantName = pweEnhanceSettings.themes[themename].variant;
				var className = getNameForVariantGroup(variantName);
				setTimeout(function(){$('.'+className).removeClass('collapsed');}, 500);
			};
			if ($(this).closest(".collapsible").siblings('.collapsible:not(.collapsed)').length) {
				$(this).closest(".collapsible").siblings('.collapsible').addClass('collapsed');
				delayedUncollapse(this.title);
				if (pweEnhanceSettings.options.collapseThemes) {
					return;
				}
			}
			$(this).closest(".collapsible").removeClass('collapsed');
			if (pweEnhanceSettings.options.collapseThemes) 
				return;
		} else if ($(this).closest(".collapsible").length) {
			pweEnhanceSettings.themes[pweEnhanceSettings.themes[this.title].variant].defaultVariant = this.title;
			$(this).closest(".theme").addClass("defaultVariant").siblings(".defaultVariant").removeClass("defaultVariant");
		} else {
			$(this).closest(".themeManager").find('.collapsible').addClass('collapsed');
		}
		setThemeEnabled(this.title, !(pweEnhanceSettings.themes[this.title].enabled));
		clearWallpaper();
		$('.wallpaperMenu .selected').removeClass('selected');
		update();
	});
	if (theme.discussion)
		container.append($('<div class="theme-discussion"><a href="'+theme.discussion+'">Discussion</div>'));
	return container;
};

var makeThemeManager = function() {
	$(".themeManager, .enhance-themes").remove();
	var collapseEnabled = pweEnhanceSettings.options.collapseThemes ? 'collapseEnabled' : '';
	var dialog = $("<div class='themeManager enhanceDialog "+collapseEnabled+"' style='margin: 0px auto; display: none;'></div>");
	dialog.append($("<div class='title'><h1>Themes<h1></div>"));
	var content = $("<div class='content'></div>");
	var encounteredVariantGroup = {};
	
	for (var themeName in pweEnhanceSettings.themes) {
		if (pweEnhanceSettings.themes[themeName].category == 'Theme') {
			if (pweEnhanceSettings.themes[themeName].variant) {
				var variant = pweEnhanceSettings.themes[themeName].variant;
				if (!(variant in encounteredVariantGroup)) {
					content.append($('<span class="collapsible '+getNameForVariantGroup(variant)+' collapsed"></span>'));
					encounteredVariantGroup[variant] = true;
				} 
				var picker = makeThemePicker(themeName);
				if (pweEnhanceSettings.themes[variant].defaultVariant == undefined) {
					pweEnhanceSettings.themes[variant].defaultVariant = variant;
				}
				if (pweEnhanceSettings.themes[variant].defaultVariant == themeName) {
						picker.addClass("defaultVariant");
				}
				$("."+getNameForVariantGroup(variant), content).append(picker);
			} else {
				content.append(makeThemePicker(themeName));
			}
		}
	}
	$(".title", dialog).prepend(makeFeatureOption("options", "collapseThemes", 'Grouped View', collapseThemesHandler));
	dialog.append(content);
	dialog.append(makeWallpaperMenu());
	dialog.append(makeAddonMenu());

	$(".SiteMenu").after(dialog);
	
	var button = $('<a href="#" class="MeButton FlyoutButton" title="Themes and Wallpapers"><span class="icon icon-picture"></span></a>');

	var themeControl = $("<span class='ToggleFlyout enhance-themes enhance-icon'></span>");
	button.click(function(){$('.themeManager').slideToggle();
		$('.themeManager').siblings('.enhanceDialog:visible').detach().insertAfter($('.themeManager')).slideToggle();});
	$(".MeMenu").append(themeControl.append(button));
};


var makeEmoteManager = function() {
	$(".emoteManager, .enhance-emotes").remove();
	var dialog = $("<div class='emoteManager enhanceDialog' style='margin: 0px auto; display: none;'></div>");
	dialog.append($("<div class='title'><h1>Emotes<h1></div>"));
	var content = $("<div class='content'></div>");	
	for (var i = 0; i < features.length; i++) { 
		if (features[i].type != 'emotes')
			continue;
		content.append(features[i].optionPicker());
	}
	dialog.append(content);
	$(".SiteMenu").after(dialog);
	
	var button = $('<a href="#" class="MeButton FlyoutButton" title="Emotes"><span class="icon icon-agree"></span></a>');

	var control = $("<span class='ToggleFlyout enhance-emotes enhance-icon'></span>");
	button.click(function(){$('.emoteManager').slideToggle();
		$('.emoteManager').siblings('.enhanceDialog:visible').detach().insertAfter($('.emoteManager')).slideToggle();});
	$(".MeMenu").append(control.append(button));
};

var makePlaceholder = function() {
	if ($('.enhance-discussion').length == 0) {
		var button = $('<a href="#" class="MeButton FlyoutButton"><span class="icon icon-filter"></span></a>');
		var control = $("<span class='ToggleFlyout enhance-discussion enhance-icon'></span>");
		$(".MeMenu").append(control.append(button));
	}
};

var ENHANCE_IDENTIFIER = '\u200B\u200B'; //It's invisible... spooky
var applyTitles = function(page) {
	var titles = { 
		'asterelle': {'developer': 'Enhance Developer'},
		'nrglg': {'developer': 'Enhance Contributor'},
		'eiledon': {'developer': 'Enhance Contributor'}
	};
	for (var themeName in pweEnhanceSettings.themes) {
		var author = pweEnhanceSettings.themes[themeName].author;
		titles[author] = titles[author] || {};
		titles[author].themeauthor = 'Theme Author';
	}
	
	var promoLink = $('.Signature a[href^="http://perfectworld.vanillaforums.com/discussion/1195098"], .Signature a[href^="http://www.arcgames.com/en/forums/arc/#/discussion/1195098"]');
	promoLink.filter(function(){return $(this).text() == "Get the Forums Enhancement Extension!";}).each(function(){
		var name = $(this).closest('.Item-BodyWrap').siblings('.Item-Header').find('.PhotoWrap').attr('title');
		var customTitle = $(this).prev('a[href^="title-"], a[href^="http://title-"]').attr('href');
		if (typeof customTitle == 'undefined') {
			customTitle = $(this).prev('span[style^="font-family"]').attr('style');
			if (customTitle) 
				customTitle = /font-family:[ '"]+([^;]*)['";]+$/.exec(customTitle)[1];
		}
		if (typeof customTitle != 'undefined')
			customTitle = customTitle.substring(customTitle.indexOf("title-") + "title-".length);
		else 			
			customTitle = '';		
			
		var sanitize = escapeHTML(customTitle.substring(0,20));
		if (sanitize.length) {
			if ( sanitize.toLowerCase().indexOf('admin') != -1 
				|| sanitize.toLowerCase().indexOf('developer') != -1
				|| sanitize.toLowerCase().indexOf('employee') != -1
				|| sanitize.indexOf('GM') != -1) 
				sanitize = 'Forbidden Title';
			
			titles[name] = titles[name] || {};
			titles[name].promoter = '<span title="Enhance Promoter">'+sanitize+'</span>';
		}
		var visible = pweEnhanceSettings.links.promoLink.enabled;
		$(this).addClass('promoLink').toggle(visible);
		$(this).prev('a[href^="title-"], a[href^="http://title-"]').addClass('promoLink').toggle(visible);
		$(this).prev('a[href^="title-"], a[href^="http://title-"]').prev('br').addClass('promoLink').toggle(visible);
	});
	
	/*if ($('.ItemComment.Mine .Signature a[href^="http://perfectworld.vanillaforums.com/discussion/1195098"]').length > 0) {
		showUpdatePromoterLinkNotification();
	}
	if ($('.ItemComment.Mine .Signature a[href^="http://www.arcgames.com/en/forums/arc/#/discussion/1195098"]:contains(Get the Forums Enhancement Extension!)').length > 0 &&
		$('.ItemComment.Mine .Signature a[href^="http://www.arcgames.com/en/forums/arc/#/discussion/1195098"]:contains(Get the Forums Enhancement Extension!)').prev('span[style^="font-family"]').length == 0) {
		showUpdatePromoterLinkNotification();
	}*/
	
	
	$(".Message", page).filter(function () { var text = $(this).text().trim();
			return text.lastIndexOf(ENHANCE_IDENTIFIER) == (text.length - ENHANCE_IDENTIFIER.length);
		}).closest(".Item-BodyWrap").siblings(".Item-Header").find('.PhotoWrap').each(function(){
			var name = $(this).attr('title');
			if (!(name in titles)) {
				titles[name] = {'user': 'Enhance User'};
			}
		});
	
	for (var name in titles) {
		var container = $('.Username[href$="'+name+'"]', page).closest(".AuthorWrap").find(".AuthorInfo");
		for (var title in titles[name]) {
			container.append($('<span class="Rank MItem enhance-title '+title+'">'+titles[name][title]+'</span>'));
			$('span[title="Arc User"]', container).remove();
		}
	}
};

var showUpdatePromoterLinkNotification = function() {
	var sigUrl = $('.MeButton[href$="profile/edit"]').attr('href').replace('edit', 'signature');
	var message = "Due to PWE's new forum layout, the Promoter Link in your signature needs to be updated.<br><br> \
		<a href='"+sigUrl+"'>Click here to update your signature.</a>";
	showDialog('updatePromoterLink', "Your Promoter Link Needs Updating!", message, 500, null);
};

var insertPromotion = function(desiredTitle) {
	var inSource = $('.editor.editor-format-wysiwyg').hasClass('wysihtml5-commands-disabled');
	if (!inSource)
		$('.editor-toggle-source').click(); 
	$('.editor-toggle-source').remove(); 
	var text = $('#Form_Body').val();
	
	var htmlPromoBase = '<font face="title-'+desiredTitle+'"></font><a href="http://www.arcgames.com/en/forums/arc/#/discussion/1195098" target="_blank" rel="nofollow"><font color="#69CAFE">Get the Forums Enhancement Extension!</font></a>';
	var promo = '\n' + htmlPromoBase;
	text = text.replace(/\s?(?:<br>)?<font face=\"title-[^\"]*\"[^>]*><\/font><a href=\"http:\/\/www\.arcgames\.com\/en\/forums\/arc\/\#\/discussion\/1195098\".*Get the Forums Enhancement.*<\/a>/mgi, ''); //remove existing promo
	text = text.trim();
	
	if ($("#Form_Format").attr('value').toLowerCase() === 'bbcode') {
		promo = '\n[font="title-'+desiredTitle+'"][/font][url="http://www.arcgames.com/en/forums/arc/#/discussion/1195098"][color="#69CAFE"]Get the Forums Enhancement Extension![/color][/url]';
		text = text.replace(/\s?\[font=\"title-[^"]*\"\]\[\/font\]\[url=\"http:\/\/www\.arcgames\.com\/en\/forums\/arc\/\#\/discussion\/1195098\"\]\[color=\"#69CAFE\"\]Get the Forums Enhancement Extension\!\[\/color\]\[\/url\]/mgi, '');
	} else if ($("#Form_Format").attr('value').toLowerCase() === 'wysiwyg') {
		promo = '\n<br>'+htmlPromoBase;
	}
	
	var endTag = '';
	var endJustify = ['[/right]', '[/left]', '[/center]', '</div>'];
	for (var i = 0; i < endJustify.length; i++) {
		if (text.substring( text.length - endJustify[i].length, text.length ) === endJustify[i]) {
			endTag = endJustify[i];
			break;
		}
	}
	text = text.substring(0, text.length - endTag.length) + promo + endTag;

	$('#Form_Body').val(text); 
};

var makePromotionControls = function() {
	if ($('form[action$="profile/signature?"] h1.H').length == 0) 
		return;
	var container = $('<div></div>');
	container.append("<h2 class='H'>Custom Enhance Title</h2><div>Custom User Titles are available for Enhance Promoters!<br>All you have to do is add a link promoting the Enhance Extension using the button below.<br>Promo links are only visible to non-Enhanced users so don't worry about it cluttering up your signature.<br>If you want to be able to see what the link looks like you can unhide the links from the Enhance Settings menu.<br><b>Note:</b> If you edit your signature you may have to link again with this button for it to work.</div>");
	container.append("Desired Title: <input class='promoTitle' type='text' placeholder='up to 20 characters' maxlength='20'></input>");
	var button = $("<div class='NavButton' style='margin-left: 10px'>Add Promo Link</div>");
	var success = $("<span style='display: none; margin-left: 20px'>Promo link added!</span>");
	button.click(function(){
		var title = $('input.promoTitle').val().trim();
		title = escapeHTML(title);
		if (title.length == 0) 
			return;
		insertPromotion(title);
		success.show();
	});
	container.append(button);
	container.append(success);
	$('form[action$="profile/signature?"] h1.H').after(container);
	
	var curText = $('#Form_Body').val();
	curText = curText.replace("http://perfectworld.vanillaforums.com/discussion/1195098", "http://www.arcgames.com/en/forums/arc/#/discussion/1195098");
	curText = curText.replace('="http://title-', '="title-');
	curText = curText.replace(/\[url=\"title-([^"]*)\"\]\[\/url\]/i, '[font="title-$1"][/font]')
	curText = curText.replace(/<a href=\"title-([^\"]*)\"[^>]*><\/a>/i, '<font face="title-$1"></font>')
	
	if (curText != $('#Form_Body').val()) {
		$('#Form_Body').val(curText);
		showDialog("success", "Updated", "The Promoter Link has been updated!<br>Hit Save below when ready.", 300);
	}
};

var redirectUrls = function(container) {
	$('a[href^="http://www.arcgames.com/en/forums"]', container).each(function(){	
		var url = $(this).attr('href');
		var match = /http:\/\/www.arcgames.com\/en\/forums\/([^\/]+)\/#(.*)/.exec(url);
		if (match)
			$(this).attr('href', "http:\/\/forum.arcgames.com\/" + match[1] + match[2]);
	});
};

var stripBlockTags = function(tag, text) {
	var re = new RegExp("\\["+tag+"((?!\\["+tag+")[\\S\\s])*?\\[/"+tag+"\\]", "i");
	match = re.exec(text);
	while (match != null) {
		text = text.replace(match[0], "");
		match = re.exec(text);
	}
	return text.trim();
};

var stripTags = function(text) {
	var re = new RegExp("\\[.+?\\]", "i");
	for (var match = re.exec(text); match != null; match = re.exec(text)) {
		text = text.replace(match[0], "");
	}
	return text;
};

var escapeHTML = function(text) {
	return $("<div>").text(text).html();
};

var bbcodeToText = function(bbcode) {
	var text = stripBlockTags('quote', bbcode);
	text = stripBlockTags('code', text);
	text = stripBlockTags('img', text);
	text = text.replace(new RegExp(ENHANCE_IDENTIFIER, 'g'), '');
	text = stripTags(text).trim();
	text = escapeHTML(text);
	return text;
	//return insertWrapping(text);
};

var insertWrapping = function(text) {
	var regex = /^.{80}.*[\S]+.*$/m;
	for (var longLineMatch = regex.exec(text); longLineMatch != null; longLineMatch = regex.exec(text)) {
		var lastSpaceIndex = longLineMatch[0].substring(0,80).lastIndexOf(" ");
		if (lastSpaceIndex <= 0) lastSpaceIndex = 80;
		text = text.substring(0, longLineMatch.index + lastSpaceIndex) + " \r\n" + text.substring(longLineMatch.index + lastSpaceIndex + 1);
	}
	return text;
};

var getPageData = function() {
	var apiBaseUrl = $('.HomeCrumb a').attr('href');
	var currentPageUrl = $(".NumberedPager a.Highlight").attr('href');
	if (typeof currentPageUrl == 'undefined')
		return;
	var match = /categories\/([^\/]+)\/?p?([0-9]+)?/.exec(currentPageUrl);
	var findLastCommentIDs = function(json) {	
			var lists = ['Discussions', 'Announcements', 'AnnounceData'];
			for (var j = 0; j < lists.length; j++) {
				if (json && json[lists[j]]) {
					for (var i = 0; i < json[lists[j]].length; i++) {
						pageData.discussions[json[lists[j]][i].DiscussionID] = json[lists[j]][i].LastCommentID;
					}
				}
			}
		};
	
	if (match) {
		var category = match[1];
		var page = match[2] ? "&page=p" + match[2] : "";
		var apiUrl = apiBaseUrl+ "api/v1/discussions/category.json?CategoryIdentifier=" + category + page;
		$.getJSON(apiUrl, findLastCommentIDs);
		return;
	} 
	match = /discussions\/?p?([0-9]+)?/.exec(currentPageUrl);
	if (match) {
		var page = match[1] ? match[1] : "1";
		var apiUrl = apiBaseUrl+ "api/v1/discussions.json?page=p" + page;
		$.getJSON(apiUrl, findLastCommentIDs);
		return;
	}
};

var addPreviews = function() {
	var apiBaseUrl = $('.HomeCrumb a').attr('href');
	var apiBaseUrlDiscussion = apiBaseUrl + 'discussion/getquote/Discussion_';
	var apiBaseUrlComment = apiBaseUrl + 'discussion/getquote/Comment_'; 
	
	var truncate = function(text, limit) {
		var regexp = new RegExp("([\\s\\S]{"+limit+"}[^\\s]*?)\\s");
		var match = regexp.exec(text);
		if (match)
			text = match[1] + " ...";
		return text;
	};
	
	var issueAjax = function(link, type) {
		if (!(link.data('call-issued'))) {
			link.data('call-issued', true);
			var url = link.attr('href');
			var match;
			var apiCall = '';
			if (type == 'comment') {
				match = /discussion\/comment\/([0-9]+)/.exec(url);
				apiCall = apiBaseUrlComment + match[1];
			} else {
				match = /discussion\/([0-9]+)\/[^\/]*(?:\/p([0-9]+))?/.exec(url);
				if (type == 'lastcomment' && match[1] in pageData.discussions) {
					apiCall = apiBaseUrlComment + pageData.discussions[match[1]];
				} else {
					apiCall = apiBaseUrlDiscussion + match[1];
				}
			}
			
			$.getJSON(apiCall + "?format=Html", function(data) {	
				try {
					var json = data;
					var text = json.Quote.body;
					text = text.substring(text.indexOf(">")+1, text.lastIndexOf("<"));
					//var html = bbcodeToText(text).replace(/\n/g, "<p><p>");
					var elem = $('<span>'+text+'</span>');
					$('blockquote', elem).remove();
					var html = elem.text().replace(/\n/g, "<p><p>");
						
					link.attr('title', ' ');
					link.tooltip({
						content: html,
						tooltipClass: "tooltip-comment",
						options: {
							autoShow: false, //some bug if i init tooltip during mouse over
							autoHide: true
						},
						position: {
							my: 'left top',
							at: 'bottom',
							collision: 'flipfit flipfit'
						},
						// The animations are really buggy :(
						show: { effect: "fade", duration: 200, delay: 200 },
						hide: { effect: "fade", duration: 200, delay: 0 }
					});
					
					if (link.is(":hover")) 
						link.tooltip( "open" );
					link.tooltip({options: {autoShow: true}});
				
				} catch(err) {
					link.data('call-issued', false);
				}
			});
		}
	};
	
	var lastCommentPreview = function() {issueAjax($(this), 'lastcomment');};
	var commentPreview = function() {issueAjax($(this), 'comment');};
	var discussionPreview = function() {issueAjax($(this), 'discussion');};
	$("#Body").on('mouseover', 
		".LastUser .CommentDate",  //.LatestPost .CommentDate
		lastCommentPreview);
	$("#Body").on('mouseover', 
		".LastUser .CommentDate time",  // we're better off if we remove the native time title
		function(){$(this).attr('title', '');});
	$("#Body").on('mouseover', 
		".DiscussionName .Title, .LatestPost .LatestPostTitle",
		discussionPreview);
	$('.MeMenu, .Notifications').on('mouseover', 
		'.ItemContent.Activity a[href^="'+apiBaseUrl+'discussion/comment/"]',
		commentPreview);
	$('body').on('mouseover', 
		'.InformMessages a[href^="'+apiBaseUrl+'discussion/comment/"]',
		commentPreview);	

};

var mergeData = function(to, from, allowAddKeys) {
	if (from == null) {
		return;
	}
	for (var key in from) {
		if (typeof from[key] == 'object' && key in to && !Array.isArray(from[key])) 
			mergeData(to[key], from[key]);
		else if (key in to || allowAddKeys) 
			to[key] = from[key];
	}
};

var makeFeatureOption = function(type, option, description, handler) {
	var closureOption = option;
	var checked = pweEnhanceSettings[type][option] ? 'checked' : '';
	var optioninput = $('<div class="feature '+option+'"><input type="checkbox" '+checked+'></input><span class="label">'+description+'</span></div>');
	$('input', optioninput).click(function(){ 
		pweEnhanceSettings[type][closureOption] = $(this).is(":checked");
		update();
		if (handler)
			handler(pweEnhanceSettings[type][closureOption]);
	});
	return optioninput;
};

var collapseThemesHandler = function(enabled) {
	if (enabled) {
		$(".themeManager").addClass("collapseEnabled");
	} else {
		$(".themeManager").removeClass("collapseEnabled");
	}
};
var makeFeatureMenu = function() {
	var menu = $("<div></div>");
	var currentFeatureType = null;
	for (var i = 0; i < features.length; i++) { 
		if (features[i].type == "emotes")
			continue;
		if (features[i].type != currentFeatureType) {
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
	//menu.append($("<h1>Options</h1>"));
	//menu.append(makeFeatureOption("showEnhanceTitle", "Use 'Enhance User' title"));
	return menu;
};

var makeEnhancePreferencesMenu = function() {
	$('.enhance-options').remove();
	var preferencesControl = $("<span class='ToggleFlyout enhance-options enhance-icon' style='float: right;'></span>");
	var preferencesButton = $('<a href="#" class="MeButton FlyoutButton" title="Enhance Settings"><span class="icon icon-cog"></span><!-- span class="label">Enhance Options</span --></a>');
	preferencesControl.append(preferencesButton).append($('<span class="Arrow SpFlyoutHandle"></span>'));
	
	var preferencesMenu = $('<div class="Flyout MenuItems" ></div>');
	preferencesMenu.append($('<div class="title">PWE Vanilla Enhancement v'+getFullVersion()+'</div>'));
	var content = $('<div class="menu-content" ></div>');

	content.append(makeFeatureMenu());
	//content.append(makeThemeMenu());
	content.append($('<a href="#">Recent Changes</a>').click(function(){showWhatsNewDialog();}));
	var profileUrl = $('.MeButton[href$="profile/edit"]').attr('href');
	if (profileUrl)
		content.append($('<a href="'+profileUrl.replace('edit', 'signature')+'">Set Custom Promoter Title</a>'));
	content.append($('<a href="http://www.arcgames.com/en/forums/arc/#/discussion/1195098" target="_top">Discussion and Requests</a>'));
	preferencesMenu.append(content);
	preferencesMenu.click(function(e){e.stopPropagation();}); // stop menu from autoclose on click
	preferencesControl.append(preferencesMenu);

	$('.MeMenu').append(preferencesControl);
};

var makeEmotePanel = function(className, path, emotes, imgWidth, imgHeight) {
	var lazyLoad = function() {
		var categories = Object.keys(emotes);
		var container = $('<div class="emotes-dialog editor-insert-dialog Flyout MenuItems"></div>');
		var defaultCategory = pweEnhanceSettings.emotes[className].category;
		if (!(defaultCategory in emotes)) 
			defaultCategory = Object.keys(emotes)[0];
		
		if (categories.length > 1) {
			var categoryDiv = $('<div class="emote-category"></div>');
			for (var type=0; type < categories.length; type++) {
				var typeImg = $('<img width="'+imgWidth+'" height="'+imgHeight+'"/>');
				typeImg.attr('src', path + emotes[categories[type]][0][0]);
				typeImg.attr('title', categories[type]);
				if (categories[type] == defaultCategory) 
					typeImg.addClass('selected');
				typeImg.click(
					function(){
						pweEnhanceSettings.emotes[className].category = this.title;
						$("."+className + " .emote-category .selected").removeClass("selected");
						$(this).addClass("selected");
						$("."+className + " .icon-emote").css('background-image', "url('"+path+ emotes[this.title][0][0]+"')");
						$("."+className + " .emotes-div").hide();
						$("."+className + " ."+this.title+"-emotes").show();
						$("."+className + " ."+this.title+"-emotes .image").each(function(){$(this).css({'background-image': 'url('+$(this).data('url')+')'});});
						update();
						return false;
					}
				);
				categoryDiv.append(typeImg);
			}
			container.append(categoryDiv);
		}
		
		var emoteClick = function () {
			var position = $(this).closest(".FormWrapper").find('.BodyBox').insertAtCaret("[img]"+$(this).data('url')+"[/img]");
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
					var img = $('<div class="image" style="width:'+imgWidth+'px; height:'+imgHeight+'px" class="'+categories[k]+(emoteCount)+'"/>');
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
		return container;
	};
	var button = $('<div class="editor-dropdown '+className+'"><span class="editor-action icon" title="Emotes"><span class="icon icon-emote"></span><span class="icon icon-caret-down"></span></span></div>');
	button.find('.editor-action .icon-emote').click(function(){
		$(this).parent().parent().toggleClass("editor-dropdown-open").siblings().removeClass("editor-dropdown-open");
	});
	button.find('.editor-action').click(function(){
		if ($(this).closest('.editor-dropdown').find('.emotes-dialog').length == 0)
			$(this).closest('.editor-dropdown').append(lazyLoad());
		$("."+className+" ."+pweEnhanceSettings.emotes[className].category+"-emotes .image").each(function(){$(this).css({'background-image': 'url('+$(this).data('url')+')'});});
	});
	button.find('.icon-emote').css('background-image', "url('"+path+emotes[pweEnhanceSettings.emotes[className].category][0][0]+"')");
	return button;//.append(container);
};

var makeMLPEmotes = function() {
	var emotes = {
		'twilight': [
			["RM8GEJh.png", "TiQ3RTF.png", "HQ08h1o.png", "WwqQeBH.png", "ieHqlgE.png", "WS1AuNl.png"], 
			["FTUDM2g.png", "X3luj3O.png", "h6TFMW2.png", "pEpQG2r.png", "8aFaN0c.png", "HGcY6tS.png"], 
			["3EKgEFh.png", "Ff7bvIg.png"]], 
		'rarity': [
			["ID4EPOk.png", "1JjpusR.png", "sFVs4DG.png", "3IpX4V5.png", "kR2zrN6.png", "HdPovB8.png"], 
			["qBCZn9p.png", "X2EewjE.png", "uG0Tq2w.png", "wcRbE7V.png", "eZzRb8y.png", "buoSa9h.png"], 
			["JPKjCSv.png", "xCHqidx.png", "oOZoSTg.png"]],
		'pinkie': [
			["UlwDXDq.png", "t6uaVly.png", "PwNm4vG.png", "aXQHSfb.png", "UcS7ppJ.png", "zt45dGW.png"], 
			["dB5gQjK.png", "4BTu862.png", "dfT7aYa.png", "dz7ydAq.png", "lh8RcEI.png", "DvIv1nz.png"], 
			["VM93JbG.png", "XBZgjAB.png", "ihINN8p.png"]], 
		'fluttershy': [
			["UtI9lLg.png", "lVhDhh6.png", "U1RfDlT.png", "XbRluz2.png", "Ykb9TDM.png", "cGv0tWU.png"], 
			["eKHbWy9.png", "ehGhIDY.png", "MunyKha.png", "1YyWNzt.png", "tQ3kIbT.png", "0eMcrii.png"], 
			["Huxm9lx.png"]], 
		'applejack': [
			["6ayf7WB.png", "xMUrWrX.png", "AObCO9a.png", "mDKCBAe.png", "QxQ5eQP.png", "HOznTBg.png"], 
			["3qc8sqd.png", "WvGls3t.png", "tu7EXuz.png", "27CH51u.png", "Umm7DTw.png", "xTp7yVN.png"], 
			["y2tQJVv.png"]], 
		'rainbow': [
			["nIYoW7R.png", "iAzJCkE.png", "3bOrpxK.png", "xcDzVlW.png", "akUKXJ6.png", "C1a74ai.png"], 
			["3wSNr0n.png", "aCAOrCy.png", "bzaTMKG.png", "6O3F5I1.png", "5TtBoTs.png", "547FYQF.png"], 
			["CwH9LCk.png", "o9znelO.png"]], 
		'cmc': [
			["wY3iRiq.png", "cfEFtfy.png", "27fmOZ5.png", "PTl1dS3.png", "1Z1idAY.png", "c6J6pMr.png"], 
			["TMz4ASY.png", "HAG401X.png", "VdPM41r.png", "xUS1qyV.png", "9qMqwnd.png", "cdPMiGq.png"], 
			["3aaE4vW.png", "v7nIzYy.png", "mBtQ3DW.png", "I8eLPHH.png", "3gkBTdx.png", "JkNWEQ0.png"]], 
		'background': [
			["rTsxIIe.png", "O4r27zq.png", "xUWgsxx.png", "nuvHhlw.png", "DvylyuQ.png", "5P4BNi8.png"], 
			["BXQjVIv.png", "cpRltvX.png", "kSPK16E.png", "97R4u5U.png", "SNg79cF.png", "gbXTXf4.png"], 
			["1K4POxV.png", "goANuWj.png", "Dg2qj9I.png"]], 
		'baddies': [
			["Z20uT1X.png", "2J6Do89.png", "MuyinNw.png", "WdxBNVE.png", "iM0UZQt.png", "1gJHIZR.png"], 
			["nvpFYsE.png", "JYk41mv.png", "Z8aZH5M.png", "9uZu48b.png", "RKETeiI.png", "xWaOBp0.png"], 
			["fKkNDeP.png", "3wNKqgM.png", "asiIerX.png", "d6M3dHX.png", "XqG6yVD.png", "XtVz2f3.png"]],
		'minor': [
			["UJHUcXG.png", "Mx4Vj8T.png", "pabmgEK.png", "z5k9RpS.png", "WlLxgSX.png", "R1hkWBQ.png"], 
			["cesjVyM.png", "Z2UDYJ5.png", "SD99D97.png", "4OgrlC8.png", "osPeE1d.png", "XlfLi8w.png"], 
			["6sxlmrV.png", "BhRJrIa.png", "KVSpMgc.png", "j3EBrsK.png", "eSs6ZsO.png", "Esj84Mr.png"]], 
		'royal': [
			["8Rfc0LZ.png", "p8jrAlB.png", "0blHKsD.png", "SkX9ogN.png", "x6QLxYT.png", "APFdblA.png"], 
			["CgUjaF6.png", "k7dtGWg.png", "klpRjcz.png", "dTO9w5a.png", "uGi4JH4.png", "JtYqbyF.png"], 
			["ztdoFuy.png", "tgLDlFM.png"]]
	};
	return makeEmotePanel(this.id,
		'http://i.imgur.com/',
		emotes,
		70, 
		70);		
};

var makeOnionEmotes = function() {
	return makeEmotePanel(this.id, 
		'http://cdn.rawgit.com/asterpw/e/m/on/',
//		'http://cdn.rawgit.com/asterpw/pwicons/gh-pages/emotes/',
		{'onion': generateEmoteArray('onion', 10, 70, 1, '.gif')},
		35, 35);
};

var makeHeroEmotes = function() {
	var emotes = {'herocat': [["hfnxG66.gif", "xetj2As.gif", "BIQ2kH9.gif", "zBIeJi5.gif", "vMVtCOc.gif", "pyYfVdt.gif"],
		["xMHLXms.gif", "JXvlt0E.gif", "gvbnePB.gif", "VTiX7E9.gif", "0AJ5u1j.gif", "dWwreGR.gif"],
		["JwYeLqg.gif", "LRXv5XJ.gif", "TF1Q54p.gif", "Ws4CzXK.gif", "AMSEJhZ.gif", "oBHuX7U.gif"],
		["RtcjLDn.gif", "lLgP7Ld.gif", "taePNbZ.gif", "2WCf0cq.gif", "HLK29cV.gif", "lRQebLq.gif"]]};
	return makeEmotePanel('herocatEmotes', 
		'http://i.imgur.com/',
		emotes, 50, 50);
};

var makeStarTrekEmotes = function() {
	var emotes = {'trek': [["vQTD03D.png", "LiJf02C.png", "R0qtiA5.png", "6sEcCRP.png", "ZPEvG0r.png", "OPKfOKi.png"], 
		["hzG3baX.png", "7H0tNfX.png", "CqARubD.png", "X1lhMI3.png", "Eut8V8e.png", "DE7lsR2.png"], 
		["IvaWOgM.png", "TvNf8Vs.png", "Wi8hgCx.png", "hG7UctY.png", "m8ufiyH.png", "eRTce0J.png"]]};
	return makeEmotePanel(this.id, 
		'http://i.imgur.com/',
		emotes, 50, 50);
};

var makeDinoEmotes = function() {
	var categories = ["dino1", "dino2", "dino3", "dino4", "dino5"]; 
	var emotes = {};
	for (var i = 0; i < categories.length; i++) {
		emotes[categories[i]] = generateEmoteArray(categories[i], 8, 24, 1, '.gif');
	}
	return makeEmotePanel(this.id, 
		'http://cdn.rawgit.com/asterpw/e/m/dino/',
		emotes, 50, 50);
};

var makePWIEmotes = function() {
	var categories = ["normal", "tiger", "pig", "bear",  "monkey", "fish", "fox", "mouse", "egg"]; 
	var emotes = {};
	for (var i = 0; i < categories.length; i++) {
		emotes[categories[i]] = generateEmoteArray(categories[i], 10, 50, 1, '.gif');
	}
	return makeEmotePanel('pwiEmotes', 
		'http://asterpw.github.io/pwicons/emotes/',
		emotes, 32, 32);
};

var makeFWEmotes = function() {
	var categories = ["samurai", "jellyfish", "raven", "greenmonkey", "baby", "monkey2", "tiger2", "hat"]; 
	var emotes = {};
	for (var i = 0; i < categories.length; i++) {
		emotes[categories[i]] = generateEmoteArray(categories[i], 10, 50, 1, '.gif');
	}
	return makeEmotePanel('fwEmotes', 
		'http://asterpw.github.io/pwicons/emotes/',
//		'http://cdn.rawgit.com/asterpw/pwicons/gh-pages/emotes/',
		emotes,
		32, 
		32);
};
var TWITCH_EMOTES = ["4Head", "ANELE", "ArgieB8", "ArsonNoSexy", "AsianGlow", "AtGL", "AthenaPMS", "AtIvy", "AtWW", 
		"BabyRage", "BatChest", "BCWarrior", "BibleThump", "BigBrother", "BionicBunion", "BlargNaut", "BloodTrail", "BORT", 
		"BrainSlug", "BrokeBack", "BuddhaBar", "CorgiDerp", "CougarHunt", "DAESuppy", "DansGame", "DatHass", "DatSheffy", 
		"DBstyle", "deExcite", "deIlluminati", "DogFace", "DOOMGuy", "EagleEye", "EleGiggle", "EvilFetus", "FailFish", 
		"FPSMarksman", "FrankerZ", "FreakinStinkin", "FUNgineer", "FunRun", "FuzzyOtterOO", "GasJoker", "GingerPower", 
		"GrammarKing", "HassanChop", "HeyGuys", "HeyyyLulu", "HotPokket", "HumbleLife", "ItsBoshyTime", "Jebaited", "JKanStyle", 
		"JonCarnage", "KAPOW", "Kappa", "KappaPride", "Keepo", "KevinTurtle", "Kippa", "Kreygasm", "KZskull", "Mau5", "mcaT", 
		"MechaSupes", "MrDestructoid", "MVGame", "NightBat", "NinjaTroll", "NoNoSpot", "NotAtk", "OMGScoots", "OneHand", "OpieOP", 
		"OptimizePrime", "OSbeaver", "OSbury", "OSdeo", "OSfrog", "OSkomodo", "OSrob", "OSsloth", "panicBasket", "PanicVis", 
		"PazPazowitz", "PeoplesChamp", "PermaSmug", "PicoMause", "PipeHype", "PJHarley", "PJSalt", "PMSTwin", "PogChamp",
		"Poooound", "PraiseIt", "PRChase", "PunchTrees", "RaccAttack", "RalpherZ", "RedCoat", "ResidentSleeper", "RitzMitz", 
		"RuleFive", "Shazam", "shazamicon", "ShazBotstix", "ShibeZ", "SMOrc", "SMSkull", "SoBayed", "SoonerLater", "SriHead", 
		"SSSsss", "StoneLightning", "StrawBeary", "SuperVinlin", "SwiftRage", "tbBaconBiscuit", "tbChickenBiscuit", "tbQuesarito", 
		"tbSausageBiscuit", "tbSpicy", "tbSriracha", "TF2John", "TheKing", "TheRinger", "TheTarFu", "TheThing", "ThunBeast", 
		"TinyFace", "TooSpicy", "TriHard", "TTours", "UleetBackup", "UncleNox", "UnSane", "VaultBoy", "Volcania", "WholeWheat", 
		"WinWaker", "WTRuck", "WutFace", "YouWHY"];
		
var makeTwitchEmotes = function() {
	var emotes = {'twitch': []};
	var cols = 10;
	var rows = Math.ceil(TWITCH_EMOTES.length/cols);
	for (var i = 0; i < rows; i++) {
		emotes.twitch[i] = new Array(Math.min(cols, TWITCH_EMOTES.length - i*cols));
		for (var j = 0; j < cols; j++) {
			if (cols*i+j < TWITCH_EMOTES.length) {
				emotes.twitch[i][j] = TWITCH_EMOTES[cols*i + j] + '.png';
			}
		}
	}
	var panel = makeEmotePanel('twitchEmotes', 
		'http://cdn.rawgit.com/asterpw/e/m/twitch/',
		emotes, 28, 28);
	var count = 0;
	panel.click(function(){$('.image', $(this)).each(function(){
			$(this).attr('title', TWITCH_EMOTES[count++]);
		});
	});
	return panel;
};

var generateEmoteArray = function(name, cols, max, start, ext) {
	var emotes = new Array(Math.ceil(max/cols));
	for (var i = 0; i < emotes.length; i++) {
		emotes[i] = new Array(Math.min(cols, max - i*cols - start + 1));
		for (var j = 0; j < cols; j++) {
			if ((i*cols + j + start) <= max)
				emotes[i][j] = name+'-'+(i*cols+j+start)+ext;
		}
	}
	return emotes;
};

var makeFontSizePicker = function() {
	var container = $('<div class="editor-insert-dialog Flyout MenuItems fontSizePicker-dialog"></div>');
	var button = $('<div class="editor-dropdown fontSizePicker"><span class="editor-action icon icon-font-size" title="Font Size"><span class="icon icon-caret-down"></span></span></div>');
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
	var button = $('<div class="editor-dropdown fontFacePicker"><span class="editor-action icon icon-font-face" title="Font Face"><span class="icon icon-caret-down"></span></span></div>');
	var fonts = ["Arial", "Arial Black", "Arial Narrow", "Book Antiqua", "Century Gothic", "Comic Sans MS", "Courier New", "Fixedsys", "Franklin Gothic Medium", "Garamond", "Georgia", "Impact", "Lucida Console", "Lucida Sans Unicode", "Microsoft Sans Serif", "Palatino Linotype", "System", "Tahoma", "Times New Roman", "Trebuchet MS", "Verdana"];
	for (var i = 0; i < fonts.length; i++) {
		container.append($("<a title='"+fonts[i]+"' class='face-select' style='font-family: "+fonts[i]+"'>"+fonts[i]+"</a>"));
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
	var button = $('<div class="editor-dropdown textFaceEmotes"><span class="editor-action icon icon-text-face" title="Text Faces"><span class="icon icon-caret-down"></span></span></div>');
	var textfaces = [
		"Donger:\u30FD\u0F3C\u0E88\u0644\u035C\u0E88\u0F3D\uFF89",
		"Lenny:( \u0361\u00b0 \u035c\u0296 \u0361\u00b0)", 
		"Ohh Well:\u00af\\_(\u30c4)_/\u00af",
		"Gun:\u2584\ufe3b\u0337\u033f\u253b\u033f\u2550\u2501\u4e00",
		"Disapproval:\u0ca0_\u0ca0",
		"Fancy Stare:\u0ca0_\u0ca0\u0cca",
		"Cry:\u0ca5_\u0ca5",
		"Need More:\u0f3c \u3064 \u25d5_\u25d5 \u0f3d\u3064",
		"Heeeey:(\u261e\uff9f\u30ee\uff9f)\u261e",
		"Cute:(\u25d5\u203f\u25d5\u273f)",
		"Table Flip:(\u256f\u00b0\u25a1\u00b0\uff09\u256f\ufe35 \u253b\u2501\u253b",
		"Double Table:\u253b\u2501\u253b \ufe35\u30fd(`\u0414\u00b4)\uff89\ufe35 \u253b\u2501\u253b",
		"Shades:(\u2022_\u2022) ( \u2022_\u2022)>\u2310\u25A0-\u25A0 (\u2310\u25A0_\u25A0)",
		"Strong:\u1566(\u00F2_\u00F3\u02C7)\u1564",
		"Bring It:\u10da(\u0ca0_\u0ca0\u10da)"
	];
	button.find('.editor-action .icon').click(function(){
		$(this).parent().parent().toggleClass("editor-dropdown-open").siblings().removeClass("editor-dropdown-open");
	});
		
	for (var i = 0; i < textfaces.length; i++) {
		var textface = textfaces[i].split(":");
		container.append($("<a title='"+textface[0]+"' class='text-face-select'>"+textface[1]+"</a>"));
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
	var button = $('<div class="editor-dropdown fontColorPicker"><span class="editor-action icon icon-font-color" title="Font Color"><span class="icon-font-color-button"></span><span class="icon icon-caret-down"></span></span></div>');
	container.append('<input type="checkbox" class="autoAddColor"></input><span class="label">Auto color when submitting</span>');
	container.find('.autoAddColor').click(function(){
		pweEnhanceSettings.editor.fontColorPicker.autoAddColor = $(this).is(":checked");
		update();
	});
	container.find(".icon-font-color-button").css("box-shadow", "0 -4px 0 0 "+pweEnhanceSettings.editor.fontColorPicker.selectedColor+" inset");
	if (pweEnhanceSettings.editor.fontColorPicker.autoAddColor) 
		container.find('.autoAddColor').prop('checked', true);
	return button.append(container);
};

var setFontColor = function(picker, color) {
	picker.closest(".FormWrapper").find('.BodyBox').surroundSelectedText('[color="'+color+'"]', '[/color]', 'select');
	picker.closest(".FormWrapper").find(".icon-font-color-button").css("box-shadow", "0 -4px 0 0 "+color+" inset");
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
	container.find(".icon-font-color-button").css("box-shadow", "0 -4px 0 0 "+pweEnhanceSettings.editor.fontColorPicker.selectedColor+" inset");
	container.find('.icon-font-color-button').click( function(event) {
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
	if (text.substring(startpos).indexOf(startTag) != 0) {
		textArea.val(text.substring(0, startpos) + startTag + text.substring(startpos) + endTag);	
	}
};

var initSubmitButton = function(container) {
	var removeIdentifier = function(textArea) { 
		var text = textArea.val();
		textArea.val(text.replace(new RegExp(ENHANCE_IDENTIFIER, 'g'), ''));
	};
	var addIdentifier = function(textArea) { 
		var text = textArea.val();
		if (text.indexOf(ENHANCE_IDENTIFIER) != 0)
			textArea.val(text.trim() + ENHANCE_IDENTIFIER);
	};	
	var addTwitchEmotes = function(textArea) {
		var text = textArea.val();
		for (var i = 0; i < TWITCH_EMOTES.length; i++) {
			text = text.replace(new RegExp(TWITCH_EMOTES[i] + "(?!\\.png)", "g"), 
				"[img]http://cdn.rawgit.com/asterpw/e/m/twitch/"+TWITCH_EMOTES[i]+".png[/img]");
		}
		textArea.val(text);
	};

	container.find("input.CommentButton, input.DiscussionButton, #Form_SendMessage, #Form_Share, #Form_AddComment, #Form_PostDiscussion, #Form_StartConversation").click(function(){
		$(this).closest(".FormWrapper").find(".editor-dropdown-open").removeClass("editor-dropdown-open");
		
		var form = $(this).closest(".FormWrapper");
		removeIdentifier(form.find(".BodyBox"));
		if (pweEnhanceSettings.editor.fontColorPicker.autoAddColor) {
			var color = form.find(".color-picker").spectrum("get");
			autoAddFontColor(form.find(".BodyBox"), color);
		}
		if (pweEnhanceSettings.options.showEnhanceTitle)
			addIdentifier(form.find(".BodyBox"));
			
		if (pweEnhanceSettings.emotes.twitchEmotes.enabled) {
			addTwitchEmotes(form.find(".BodyBox"));
		}
	});
};

/*var makeShowHideAllCategories = function(container) {
	this.target = ".MeMenu .link-preferences";  //override positioning
	this.positionMethod = "after";
	return $('<li class="'+this.id+'"><a href="http://perfectworld.vanillaforums.com/categories/?ShowAllCategories=false">My Categories</a></li>' +
		'<li class="'+this.id+'"><a href="http://perfectworld.vanillaforums.com/categories/?ShowAllCategories=true">All Categories</a></li>');
};*/

var makeDraftsLink = function(container) {
	this.target = ".MeMenu .MarkAllViewed";  //override positioning
	this.positionMethod = "before";
	return $('<li class="'+this.id+'"><a href="'+$('.HomeCrumb a').attr('href')+'drafts">Manage Drafts</a></li>');
};

var makeGameLinks = function() {
	var links = "";
	for (var i=0; i < pweEnhanceSettings.games.length; i++) {
		if( pweEnhanceSettings.games[i].usefullinks  
			&& ( 
				$(".CrumbLabel.Category-"+pweEnhanceSettings.games[i].catname).length > 0 
				|| (new RegExp("arcgames\\.com\\/(en\\/forums\\/)?"+pweEnhanceSettings.games[i].catname)).exec(window.location.href) != null
			))
			for (var j = 0; j < pweEnhanceSettings.games[i].usefullinks.length; j++) {
				links += '<li class="'+this.id+'"><a href="'+pweEnhanceSettings.games[i].usefullinks[j].link+'">' 
					+ pweEnhanceSettings.games[i].usefullinks[j].linktext +'</a></li>';
			}
	}
	return $(links);
};

var hideBlockedUsers = function(page) {
	$(".Comment, .Discussion, td .Block.Wrap", page).show();
	$(".unhideComment", page).remove();
	$(".unblockUser", page).hide();
	if (pweEnhanceSettings.links.blockUser.enabled)
		$(".blockUser", page).show();
	$(".Mine .blockUser", page).hide();
	$(".EditDiscussion", page).closest(".PageTitle").siblings(".ItemDiscussion").find(".blockUser").hide();
	for (var user in pweEnhanceSettings.blockedUsers) {
		var unhideControl = $("<div class='unhideComment'>Show blocked comment</div>").click(function(){
			$(this).siblings(".Comment, .Discussion").show();
			$(this).siblings(".Comment, .Discussion").find(".unblockUser").show();
			$(this).siblings(".Comment, .Discussion").find(".blockUser").hide();
			$(this).remove();
		});
		$('.PhotoWrap[title="'+user+'"]').closest(".Block.Wrap").hide();
		var blocked = $('.PhotoWrap[title="'+user+'"]', page).closest(".Comment, .Discussion").hide();
		$(".unblockUser", blocked).show();
		$(".blockUser", blocked).hide();
		blocked.before(unhideControl);
	}
};

var makeBlockUser = function(container) {
	this.positionMethod = 'before';
	this.target = 'a.Quote';
	var buttons = $('<span><a class="ReactButton blockUser" title="Block User" style="display: none; cursor: pointer"><span class="ReactSprite ReactReject"></span>Block</a>' + 
		'<a class="ReactButton unblockUser" title="Unblock User" style="display: none; cursor: pointer"><span class="ReactSprite ReactReject"></span>Unblock</a></span>');	
	buttons.find('.blockUser').click(function() {
		var username = $(this).closest(".Item-BodyWrap").siblings(".Item-Header").find(".PhotoWrap").attr('title');
		pweEnhanceSettings.blockedUsers[username] = true;
		update();
		hideBlockedUsers();
	});
	buttons.find('.unblockUser').click(function() {
		var username = $(this).closest(".Item-BodyWrap").siblings(".Item-Header").find(".PhotoWrap").attr('title');
		if (username in pweEnhanceSettings.blockedUsers) {
			delete pweEnhanceSettings.blockedUsers[username];
		} 
		update();
		hideBlockedUsers();
	});
	return buttons.children();
};

var Feature = function() {};
Feature.prototype.init = function(defaults) {
	this.selector = "."+this.id;
	if (!(this.id in pweEnhanceSettings[this.type]))
		pweEnhanceSettings[this.type][this.id] = {};
	pweEnhanceSettings[this.type][this.id].enabled = true;
	mergeData(pweEnhanceSettings[this.type][this.id], defaults, true);
};

Feature.prototype.install = function(context) {
	if (this.maker == null)
		return;
	var panel = this.maker();
	var destination = $(this.target, context);
	destination[this.positionMethod](panel);
	if (!pweEnhanceSettings[this.type][this.id].enabled) {
		panel.hide();
	}
};

Feature.prototype.setEnabled = function(enabled) {
	pweEnhanceSettings[this.type][this.id].enabled = enabled;
	$(this.selector).toggle(enabled);
};

Feature.prototype.isEnabled = function() {
	return pweEnhanceSettings[this.type][this.id].enabled;
};

var EditorFeature = function(name, id, description, maker, defaults, thumbnail) {
	this.name = name;
	this.id = id;
	this.description = description;
	this.maker = maker;
	this.thumbnail = thumbnail;
	this.init(defaults);
};
EditorFeature.prototype = new Feature;
EditorFeature.prototype.header = 'Features';
EditorFeature.prototype.type = 'editor';
EditorFeature.prototype.target = '.editor-action-headers';
EditorFeature.prototype.positionMethod = 'before';

var EmoteFeature = function(name, id, description, maker, defaults, thumbnail) {
	this.name = name;
	this.id = id;
	this.description = description;
	this.maker = maker;
	this.thumbnail = thumbnail;
	this.init(defaults);
};
EmoteFeature.prototype = new Feature;
EmoteFeature.prototype.header = 'Emotes';
EmoteFeature.prototype.type = 'emotes';
EmoteFeature.prototype.target = '.editor-action-emoji';
EmoteFeature.prototype.positionMethod = 'after';

var LinkFeature = function(name, id, description, maker, defaults, thumbnail) {
	this.name = name;
	this.id = id;
	this.description = description;
	this.maker = maker;
	this.thumbnail = thumbnail;
	this.init(defaults);
};
LinkFeature.prototype = new Feature;
LinkFeature.prototype.type = 'links';
LinkFeature.prototype.header = 'Links';
LinkFeature.prototype.target = '.SiteMenu';
LinkFeature.prototype.positionMethod = 'append';

var ActionFeature = function(name, id, description, maker, defaults, thumbnail) {
	this.name = name;
	this.id = id;
	this.description = description;
	this.maker = maker;
	this.thumbnail = thumbnail;
	this.init(defaults);
};
ActionFeature.prototype = new Feature;
ActionFeature.prototype.type = 'actions';
ActionFeature.prototype.header = 'Actions';
ActionFeature.prototype.target = '.Reactions';
ActionFeature.prototype.positionMethod = 'append';

EmoteFeature.prototype.optionPicker = function() {
	var container = $('<div class="picker"></div>');
	container.append($('<div class="image" style="background-image: url(\''+this.thumbnail+'\')">'));
	container.append($('<span class="title">'+this.name+'</span>'));
	container.append($('<span class="description">'+this.description+'</span>'));
	if (pweEnhanceSettings[this.type][this.id].enabled) {
		container.addClass("selected");
	}
	container.attr('title', 'Show '+this.name+' in the editor');
	var closure = this;
	container.click(function(){
		closure.setEnabled(!(pweEnhanceSettings[closure.type][closure.id].enabled));
		if (pweEnhanceSettings[closure.type][closure.id].enabled)
			$(this).addClass("selected");
		else
			$(this).removeClass("selected");
		update();
	});
	return container;
};

var features = [
	new EditorFeature("Font Picker", "fontFacePicker", "Show font picker in editor", makeFontFacePicker),
	new EditorFeature("Font Size Picker", "fontSizePicker", "Show font size picker in editor", makeFontSizePicker),
	new EditorFeature("Font Color Picker", "fontColorPicker", "Show font color picker in editor", makeFontColorPicker, {selectedColor: "#FFFFFF", autoAddColor: false}),
	new EmoteFeature("PWI Emotes", "pwiEmotes", "Straight from Pan Gu!", makePWIEmotes, {category: "tiger"}, "http://asterpw.github.io/pwicons/emotes/tiger-3.gif"),
	new EmoteFeature("Forsaken Emotes", "fwEmotes", "Who remembers these?", makeFWEmotes, {category: "jellyfish", enabled: false}, "http://asterpw.github.io/pwicons/emotes/samurai-4.gif"),
	new EmoteFeature("Text Face Emotes", "textFaceEmotes", "\u0f3c \u3064 \u25d5_\u25d5 \u0f3d\u3064 more emotes", makeTextFaceEmotes, {}, "http://i.imgur.com/Zsjx9TM.png"),
	new EmoteFeature("Herocat Emotes", "herocatEmotes", "Be a champion.", makeHeroEmotes, {category: "herocat", enabled: false}, "http://i.imgur.com/xMHLXms.gif"),
	new EmoteFeature("Onion Emotes", "onionEmotes", "Or is this is a white cat?", makeOnionEmotes, {category: "onion", enabled: false}, "http://cdn.rawgit.com/asterpw/e/m/on/onion-7.gif"),
	new EmoteFeature("MLP Emotes", "mlpEmotes", "Friendship is Magic", makeMLPEmotes, {category: "twilight", enabled: false}, "http://i.imgur.com/RM8GEJh.png"),
	new EmoteFeature("Star Trek Emotes", "trekEmotes", "\u00A9 irvinis.deviantart.com", makeStarTrekEmotes, {category: "trek"}, "http://i.imgur.com/vQTD03D.png"),
	new EmoteFeature("Dino Emotes", "dinoEmotes", "Qoobee Agapi!", makeDinoEmotes, {category: "dino1", enabled: false}, "http://cdn.rawgit.com/asterpw/e/m/dino/dino1-1.gif"),
	new EmoteFeature("Twitch Emotes", "twitchEmotes", "Kappa Kreygasm \u00A9 Twitch", makeTwitchEmotes, {category: "twitch", enabled: false}, "http://cdn.rawgit.com/asterpw/e/m/twitch/Kappa.png"),
	//new LinkFeature("Show/Hide All Categories", "showHideAllCategories", "Add show/hide all categories links to Account Options Menu", makeShowHideAllCategories),
	new LinkFeature("Show Draft Link", "draftLink", "Add manage drafts link to Account Options Menu", makeDraftsLink),
	new LinkFeature("Show/Hide Game Links", "gameLinks", "Add Game-specific links", makeGameLinks, {enabled: false}),
	new LinkFeature("Block User action", "blockUser", "Show block user action", makeBlockUser),
	new LinkFeature("Promo Links", "promoLink", "Show promo links in signatures", null, {enabled: false})
];

var installFeatures = function(container) {
	for (var i = 0; i < features.length; i++) {
		if (container.find(features[i].target).length > 0) {
			features[i].install(container);	
		}
	}
	initSubmitButton(container);
	if($.spectrum) 
		initColorPicker(container);
};

var preventEmbed = function() {
	if (document.getElementsByTagName('html')[0].className.indexOf('is-embedded') == -1)
		document.getElementsByTagName('html')[0].className += 'is-embedded';
	if (typeof gdn != "undefined") 
		gdn.meta.ForceEmbedForum = "0";
	// being stupidly redundant since Chrome can't make up its mind on when to execute script...
	scripts = document.getElementsByTagName('script');
	for (var i = 0; i < scripts.length; i++) {
		if (scripts[i].src.length == 0 && scripts[i].innerHTML.indexOf('gdn') == 0) {
			scripts[i].innerHTML += ' gdn.meta.ForceEmbedForum = "0";';
			var inject = document.createElement('script');
			inject.type = "text/javascript";
			inject.innerHTML = 'if(typeof gdn != "undefined"){gdn.meta.ForceEmbedForum = "0";}';
			scripts[i].parentNode.insertBefore(inject, scripts[i].nextSibling);
		} else if (scripts[i].src.indexOf('embed_local.js') != -1) {
			scripts[i].defer = true;
		}
	}
	//window.onbeforeunload = function(){ return "The page is attempting to redirect to arc despite my best efforts to stop it, are you ok with that?";};
};

var forceBBCode = function() {
	$('#Form_Format').val('BBCode');
	$('.editor-desktop').addClass('editor-format-bbcode');
	$('#Form_Body').attr('format', 'BBCode');
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
	var head  = document.getElementsByTagName('head')[0];
	var link  = document.createElement('script');
	link.type = 'text/javascript';
	link.src = src;
	head.appendChild(link);
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
		if (savedSettings.version && savedSettings.version >= "1.0.0") {
			mergeData(pweEnhanceSettings, savedSettings, false); // dont merge in discarded features
			mergeData(pweEnhanceSettings.blockedUsers, savedSettings.blockedUsers, true);
			mergeData(pweEnhanceSettings.themes, savedSettings.themes, true);
			
			if (pweEnhanceSettings.version > VERSION) {// shouldnt happen
				pweEnhanceSettings.version = VERSION;
			}
		}
	}
};
preventEmbed();
//loadJS("https://github.com/Eiledon/PWEVC/raw/master/PWE_Discussion_Manager.user.js");
loadCSS("https://cdn.rawgit.com/asterpw/spectrum/master/spectrum.css");
loadCSS("https://rawgit.com/asterpw/pwevanillaenhance/a7c2fe8fdf2db33058970479d24f05a531edc99d/pwevanillaenhance.user.css");
getSettings();
preloadThemes();
randomWallpaper();
setWallpaper();

var jQueryLoaded = function() {
//$(document).ready(function() {
	preventEmbed();
	window.onbeforeunload = null;
	if (pweEnhanceSettings.version < VERSION) {
		showWhatsNewDialog();
	}
	handleThemes();
	handleGameInfoUpdate();
	getPageData();
	installFeatures($('.FormWrapper'));
	installFeatures($('.Head'));
	installFeatures($('.Item-BodyWrap'));
	applyTitles($("#Body"));
	redirectUrls($("#Body"));
	makeThemeManager();
	makeEmoteManager();
	makeEnhancePreferencesMenu();
	//makePlaceholder();
	makePromotionControls();
	forceBBCode();
	hideBlockedUsers($("#Body"));
	addPreviews();
	$.getScript("https://cdn.rawgit.com/asterpw/spectrum/master/spectrum.js").done(function() {
		initColorPicker($('.fontColorPicker'));
	});
	$(document).on( "EditCommentFormLoaded", function(event, container) {
		installFeatures(container);
	});
	$(document).on( "CommentAdded PageLoaded", function(event, container) {
		if (typeof container  == 'undefined') {
			container = $('.Mine:not(:has(.enhance-title))');
		}
		installFeatures(container);
		applyTitles(container);
		redirectUrls(container);
		hideBlockedUsers(container);
	});
};

document.addEventListener("DOMContentLoaded", function(event) {
	jQueryLoaded();
});


})();
