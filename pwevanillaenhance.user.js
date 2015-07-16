// ==UserScript==
// @name       PWE Vanilla Forums Enhancement
// @namespace  http://github.com/asterpw/pwevanillaenhance
// @downloadURL https://github.com/asterpw/pwevanillaenhance/raw/master/pwevanillaenhance.user.js
// @updateURL  https://github.com/asterpw/pwevanillaenhance/raw/master/pwevanillaenhance.user.js
// @icon http://cd8ba0b44a15c10065fd-24461f391e20b7336331d5789078af53.r23.cf1.rackcdn.com/perfectworld.vanillaforums.com/favicon_2b888861142269ff.ico
// @version    1.0.1
// @run-at     document-start
// @description  Adds useful tools to the pwe vanilla forums
// @match      http://perfectworld.vanillaforums.com/*
// @grant       none
// @copyright  2015, Asterelle - Sanctuary
// ==/UserScript==

(function() {	
var VERSION = "1.0.1";  //what we store when we should display what's new dialog
var getFullVersion = function() { // For version display on the screen;
	try {
		return GM_info.script.version;  //causes error if not supported
	} catch(err) {
		return VERSION;
	}
};
/*jshint multistr: true */
var CHANGELOG = "<div class='content'> \
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
	<div class='change-ver'>v0.5.0</div> - Added auto-loading of themes from @nrglg</div>";

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
	options: {
		collapseThemes: true,
		showEnhanceTitle: true
	},
	blockedUsers: {
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
			$('.themeManager img[title="'+name+'"]').closest(".theme").addClass("selected");
			for (var i in pweEnhanceSettings.themes) {
				if (pweEnhanceSettings.themes[i].category == "Theme"  && i != name) { 
					setThemeEnabled(i, false);
				}
			}
		}
	} else {
		$('.themeManager img[title="'+name+'"]').closest(".theme").removeClass("selected");
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
	if (((now - Date.parse(theme.created))/day) < 2) 
		container.append($('<span class="new">New!</span>'));
	else if (((now - Date.parse(theme.updated))/day) < 2) 
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
	container.append($('<img class="theme-preview" title="'+name+'" src="'+screenshotUrl+'">'));
	container.append($('<div class="theme-created '+(theme.updated != theme.created?'Hidden':'')+'">'+theme.created+'</div>'));
	container.append($('<div class="theme-updated '+(theme.updated == theme.created?'Hidden':'')+'">'+theme.updated+'</div>'));
	
	container.append($('<div class="theme-name" title="'+name+'">'+name+'</div>'));
	container.append($('<div class="theme-author"><a href="http://perfectworld.vanillaforums.com/profile/'+theme.author+'">'+authorName+'</a></div>'));
	container.append($('<div class="theme-description">'+theme.description+'</div>'));

	
	
	$("img", container).click(function(){
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
	$(".title", dialog).prepend(makeFeatureOption("collapseThemes", 'Grouped View', collapseThemesHandler));
	dialog.append(content);
	dialog.append(makeAddonMenu());

	$(".SiteMenu").append(dialog);
	
	var button = $('<a href="#" class="MeButton FlyoutButton" title="Themes"><span class="Sprite Sprite16 SpOptions"></span></a>');

	var themeControl = $("<span class='ToggleFlyout enhance-themes'></span>");
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
	$(".SiteMenu").append(dialog);
	
	var button = $('<a href="#" class="MeButton FlyoutButton" title="Emotes"><span class="Sprite Sprite16 SpOptions"></span></a>');

	var control = $("<span class='ToggleFlyout enhance-emotes'></span>");
	button.click(function(){$('.emoteManager').slideToggle();
		$('.emoteManager').siblings('.enhanceDialog:visible').detach().insertAfter($('.emoteManager')).slideToggle();});
	$(".MeMenu").append(control.append(button));
};

var ENHANCE_IDENTIFIER = '\u200B\u200B'; //It's invisible... spooky
var applyTitles = function() {
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
	
	$(".Message").filter(function () { var text = $(this).text().trim();
			return text.lastIndexOf(ENHANCE_IDENTIFIER) == (text.length - ENHANCE_IDENTIFIER.length);
		}).closest(".Item-BodyWrap").siblings(".Item-Header").find('.PhotoWrap').each(function(){
			var name = $(this).attr('title');
			if (!(name in titles)) {
				titles[name] = {'user': 'Enhance User'};
			}
		});
	
	for (var name in titles) {
		var container = $('.Username[href$="'+name+'"]').closest(".AuthorWrap").find(".AuthorInfo");
		for (var title in titles[name]) {
			container.append($('<span class="Rank MItem enhance-title '+title+'">'+titles[name][title]+'</span>'));
			$('span[title="Arc User"]', container).remove();
		}
	}
	
};

var redirectUrls = function() {
	$('a[href^="http://www.arcgames.com/en/forums#"]').each(function(){
		$(this).attr('href', $(this).attr('href').replace("www.arcgames.com/en/forums#", "perfectworld.vanillaforums.com"));
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

var bbcodeToText = function(bbcode) {
	var text = stripBlockTags('quote', bbcode);
	text = stripBlockTags('code', text);
	text = stripBlockTags('img', text);
	text = text.replace(new RegExp(ENHANCE_IDENTIFIER, 'g'), '');
	text = stripTags(text).trim();
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

var addPreviews = function() {
	var yql = 'https://query.yahooapis.com/v1/public/yql?format=json&q=';
	var base = 'select * from json where url="';
	var apiBaseUrlDiscussion = 'http://perfectworld.vanillaforums.com/api/v1/discussion.json?DiscussionId=';
	var apiBaseUrlComment = 'http://perfectworld.vanillaforums.com/api/v1/discussion/comment.json?CommentId=';
		
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
				apiCall = apiBaseUrlDiscussion + match[1];
				if (typeof match[2] != 'undefined') {
					apiCall += "&Page=p" + match[2];
				}
			}
			
			$.getJSON(yql+encodeURIComponent(base+apiCall+'"'), function(data) {	
				try {
					var json = data.query.results.json;
					var text = json.Discussion.Body;
					var format = json.Discussion.Format;
					if (type == 'lastcomment' && json.Comments && json.Comments.length) {
						text = json.Comments[json.Comments.length - 1].Body;
						format = json.Comments[json.Comments.length - 1].Format;
					} else if (type == 'comment' && json.Comments) {
						if (typeof json.Comments.Body != 'undefined') { 
							// uhh... if the page has only 1 comment there is no array
							// wtf.. there should be an array of length 1.  Stupid.
							text = json.Comments.Body;
							format = json.Comments.Format;
						} else {
							for (var i = 0; i < json.Comments.length; i++) {
								if (json.Comments[i].CommentID == match[1]) {
									text = json.Comments[i].Body;
									format = json.Comments[i].Format;
									break;
								}
							}
						}
					}
					if (format == 'BBCode') {
						var html = bbcodeToText(text).replace(/\n/g, "<p><p>");
						link.attr('title', 'Some bug makes me do this?');
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
							show: false, //{ effect: "fade", duration: 300 }
							hide: false //{ effect: "fade", duration: 300 }
						});
						
						if (link.is(":hover")) 
							link.tooltip( "open" );
						link.tooltip({options: {autoShow: true}});
					}
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
		".LastUser .CommentDate, .LatestPost .CommentDate",
		lastCommentPreview);
	$("#Body").on('mouseover', 
		".DiscussionName .Title, .LatestPost .LatestPostTitle",
		discussionPreview);
	$('.MeMenu, .Notifications').on('mouseover', 
		'.ItemContent.Activity a[href^="http://perfectworld.vanillaforums.com/discussion/comment/"]',
		commentPreview);
	$('body').on('mouseover', 
		'.InformMessages a[href^="http://perfectworld.vanillaforums.com/discussion/comment/"]',
		commentPreview);	

};

var mergeData = function(to, from, allowAddKeys) {
	if (from == null) {
		return;
	}
	for (var key in from) {
		if (typeof from[key] == 'object' && key in to) 
			mergeData(to[key], from[key]);
		else if (key in to || allowAddKeys) 
			to[key] = from[key];
	}
};

var makeFeatureOption = function(option, description, handler) {
	var closureOption = option;
	var checked = pweEnhanceSettings.options[option] ? 'checked' : '';
	var optioninput = $('<div class="feature"><input type="checkbox" '+checked+'></input><span class="label">'+description+'</span></div>');
	$('input', optioninput).click(function(){ 
		pweEnhanceSettings.options[closureOption] = $(this).is(":checked");
		update();
		if (handler)
			handler(pweEnhanceSettings.options[closureOption]);
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
	//menu.append(makeFeatureOption("collapseThemes", 'Group together versions of the same theme', collapseThemesHandler));
	//menu.append(makeFeatureOption("showEnhanceTitle", "Use 'Enhance User' title"));
	return menu;
};

var makeEnhancePreferencesMenu = function() {
	$('.enhance-options').remove();
	var preferencesControl = $("<span class='ToggleFlyout enhance-options'></span>");
	var preferencesButton = $('<a href="#" class="MeButton FlyoutButton" title="Enhance Settings"><span class="Sprite Sprite16 SpOptions"></span><!-- span class="label">Enhance Options</span --></a>');
	preferencesControl.append(preferencesButton).append($('<span class="Arrow SpFlyoutHandle"></span>'));
	
	var preferencesMenu = $('<div class="Flyout MenuItems" ></div>');
	preferencesMenu.append($('<div class="title">PWE Vanilla Enhancement v'+getFullVersion()+'</div>'));
	var content = $('<div class="menu-content" ></div>');
	content.append(makeFeatureMenu());
	//content.append(makeThemeMenu());
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
	var categories = ["samurai", "jellyfish", "raven", "greenmonkey", "baby", "monkey2", "tiger2"]; 
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
			textArea.val(text + ENHANCE_IDENTIFIER);
	};	
	var addTwitchEmotes = function(textArea) {
		var text = textArea.val();
		for (var i = 0; i < TWITCH_EMOTES.length; i++) {
			text = text.replace(new RegExp(TWITCH_EMOTES[i] + "(?!\\.png)", "g"), 
				"[img]http://cdn.rawgit.com/asterpw/e/m/twitch/"+TWITCH_EMOTES[i]+".png[/img]");
		}
		textArea.val(text);
	};

	container.find("input.CommentButton, #Form_SendMessage, #Form_Share, #Form_AddComment").click(function(){
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

var makeShowHideAllCategories = function(container) {
	this.target = ".MeMenu .link-preferences";  //override positioning
	this.positionMethod = "after";
	return $('<li class="'+this.id+'"><a href="http://perfectworld.vanillaforums.com/categories/?ShowAllCategories=false">My Categories</a></li>' +
		'<li class="'+this.id+'"><a href="http://perfectworld.vanillaforums.com/categories/?ShowAllCategories=true">All Categories</a></li>');
};

var makeDraftsLink = function(container) {
	this.target = ".MeMenu .link-preferences";  //override positioning
	this.positionMethod = "after";
	return $('<li class="'+this.id+'"><a href="http://perfectworld.vanillaforums.com/drafts">Manage Drafts</a></li>');
};

var makeGameLinks = function(container) {
	var links = "";
	var gamelinks = ["arc-mobile|ARC|http://www.arcgames.com/en/games",
		"apbreloaded|APB on ARC|http://www.arcgames.com/en/games/APB_Reloaded",
		"battleoftheimmortals|BOI on ARC|http://www.arcgames.com/en/games/battle-of-the-immortals",
		"blacklightretribution|BLR on ARC|http://www.arcgames.com/en/games/blacklight-retribution",
		"championsonline|CO on ARC|http://www.arcgames.com/en/games/champions-online",
		"elsword|Elsword on ARC|http://www.arcgames.com/en/games/Elsword",
		"ethersagaodyssey|ESO on ARC|http://www.arcgames.com/en/games/ether-saga-odyssey",
		"forsakenworld|FW on ARC|http://www.arcgames.com/en/games/forsaken-world",
		"jadedynasty|JD on ARC|http://www.arcgames.com/en/games/jade-dynasty",
		"neverwinter|NW on ARC|http://www.arcgames.com/en/games/neverwinter",
		"prime-world|PW on ARC|http://www.arcgames.com/en/games/Prime_World",
		"pwi|PWI on ARC|http://www.arcgames.com/en/games/pwi",
		"pwi|Calc|http://mypers.pw/1.8/",
		"pwi|PWDB|http://pwdatabase.com",
		"pwi|Aster Tools|http://aster.ohmydays.net/pw",
		"raiderz|Raiderz on ARC|http://www.arcgames.com/en/games/raiderz",
		"royal-quest|RQ on ARC|http://www.arcgames.com/en/games/Royal_Quest",
		"star-conflict|SC on ARC|http://www.arcgames.com/en/games/Star_Conflict",
		"startrekonline|STO on ARC|http://www.arcgames.com/en/games/star-trek-online",
		"stronghold-kingdoms|SK on ARC|http://www.arcgames.com/en/games/Stronghold_Kingdoms",
		"Swordsman|Swordsman on ARC|http://www.arcgames.com/en/games/swordsman",
		"waroftheimmortals|WOI on ARC|http://www.arcgames.com/en/games/war-of-the-immortals",
		"startrekonline|Wiki|http://sto.gamepedia.com/",
		"startrekonline|Lore|http://sto.gamepedia.com/Lore",
		"startrekonline|Commodities|http://sto.gamepedia.com/Commodities",
		"championsonline|Wiki|http://www.championswiki.com/index.php?title=Main_Page",
		"championsonline|PDB|http://primusdatabase.com",
		"championsonline|Reddit|http://www.reddit.com/r/ChampionsOnlineFFA/",
		"startrekonline|Reddit|http://www.reddit.com/r/sto/"];
		
	for (var i=0; i < gamelinks.length; i++) {
		linkdata = gamelinks[i].split("|");
		if($(".CrumbLabel.Category-"+linkdata[0]).length > 0)
			links += '<li class="'+this.id+'"><a href="'+linkdata[2]+'">'+linkdata[1]+'</a></li>';
	}
	return $(links);
};

var hideBlockedUsers = function() {
	$(".Comment, .Discussion, td .Block.Wrap").show();
	$(".unhideComment").remove();
	$(".unblockUser").hide();
	if (pweEnhanceSettings.links.blockUser.enabled)
		$(".blockUser").show();
	$(".Mine .blockUser").hide();
	$(".EditDiscussion").closest(".PageTitle").siblings(".ItemDiscussion").find(".blockUser").hide();
	for (var user in pweEnhanceSettings.blockedUsers) {
		var unhideControl = $("<div class='unhideComment'>Show blocked comment</div>").click(function(){
			$(this).siblings(".Comment, .Discussion").show();
			$(this).siblings(".Comment, .Discussion").find(".unblockUser").show();
			$(this).siblings(".Comment, .Discussion").find(".blockUser").hide();
			$(this).remove();
		});
		$('.PhotoWrap[title="'+user+'"]').closest(".Block.Wrap").hide();
		var blocked = $('.PhotoWrap[title="'+user+'"]').closest(".Comment, .Discussion").hide();
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
	container.append($('<img src="'+this.thumbnail+'">'));
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
	new LinkFeature("Show/Hide All Categories", "showHideAllCategories", "Add show/hide all categories links to Account Options Menu", makeShowHideAllCategories),
	new LinkFeature("Show Draft Link", "draftLink", "Add manage drafts link to Account Options Menu", makeDraftsLink),
	new LinkFeature("Show/Hide Game Links", "gameLinks", "Add Game-specific links", makeGameLinks, {enabled: false}),
	new LinkFeature("Block User action", "blockUser", "Show block user action", makeBlockUser)
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
	document.getElementsByTagName('html')[0].setAttribute('class', 'is-embedded');
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
	window.onbeforeunload = function(){ return "The page is attempting to redirect to arc despite my best efforts to stop it, are you ok with that?";};
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
		if (savedSettings.version && savedSettings.version >= "0.9.0") {
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
loadCSS("https://cdn.rawgit.com/asterpw/spectrum/master/spectrum.css");
loadCSS("https://rawgit.com/asterpw/pwevanillaenhance/261c88cb0670a9ef0f5904d01ebd75454521ae2f/pwevanillaenhance.user.css");
getSettings();
preloadThemes();

var jQueryLoaded = function() {
//$(document).ready(function() {
	preventEmbed();
	window.onbeforeunload = null;
	if (pweEnhanceSettings.version < VERSION) {
		showWhatsNewDialog();
	}
	handleThemes();
	installFeatures($('.FormWrapper'));
	installFeatures($('.Head'));
	installFeatures($('.Item-BodyWrap'));
	makeThemeManager();
	makeEmoteManager();
	makeEnhancePreferencesMenu();
	applyTitles();
	addPreviews();
	redirectUrls();
	hideBlockedUsers();
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
