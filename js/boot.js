/*
 * @version 0.7.0
 * @license MIT license
 * @link    https://chagry.com
 * @author  Grigori <git@chagry.com>
 * @package	extend function.js
 */

(function($, undefined) {

	$.extend( {
		/**
		 * @package template Start.
		 */
		tmpl: {
			
			/**
			 * spinOn. add spinner.
			 * @param e div conteneur balise i.
			 * @param i name icon.
			 */
			spinOn: function(e, i) {
				
				// add in tmpl.
				$('#'+e).removeClass(i).addClass($.m.tmpl.html.spinClass);
			},
			
			/**
			 * spinOff. close spinner.
			 * @param e div conteneur.
			 * @param i name icone add.
			 */
			spinOff: function(e, i) {
			
				// remove icone.
				$('#'+e).removeClass($.m.tmpl.html.spinClass).addClass(i);
			},
			
			/**
			 * Funct error.
			 * @param e Message erreur.
			 */
			error: function(e) {
				
				// render erreur.
				toastr.error($.lng.tr(e, true));
				
				// Play sound after 500ms.
				setTimeout(function() { $.voix.play($.m.voix.sound.error); }, 500);
			},
			
			/**
			 * Funct msg.
			 * @param e Message.
			 */
			msg: function(e) {
				
				// render erreur.
				toastr.success($.lng.tr(e, true));
				
				// Play sound after 500ms.
				setTimeout(function() { $.voix.play($.m.voix.sound.click); }, 500);
			},
			
			/**
			 * clean. Clean windows.
			 */
			clean: function() {
				
				// Scroll top content.
				window.scrollTo(0,0);
				
				// Clean windows.
				$('.popover').remove();
				$('.tooltip').remove();
			},
			
			/**
			 * anim. animation.css.
			 * @param e Element.
			 * @param effect The number.
			 * @param r remove class after.
			 * @param callback execut end function.
			 */
			anim: function(e, effect, r, callback) {
				
				// Add animation.
				e.addClass('animated '+ effect);
				
				// Event end animation.
				e.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
					
					// if remove anim.
					if(r) e.removeClass('animated '+ effect);
					
					// If call back.
					if(callback) callback(e);
				});
			},
			
			/**
			 * niceNumber. ex: '12 345 542'
			 * @param e The number.
			 * Return string number nice.
			 */
			niceNumber: function(e) {
				
				// return.
				return e.toString().replace(/(\d)(?=(?:\d{3})+(?:$))/g, '$1 ');
			},
			
			/**
			 * Funct setupValidatorForm. validator form.
			 */
			setupValidatorForm : function() {
				
				// Param validation input.
				jQuery.validator.setDefaults( { 
					
					// regle input.
					rules: $.m.tmpl.rules,
					
					// Message.
					messages: $.m.tmpl.messages,
					
					// class erreur
					errorClass: "help-block",
					errorElement: "small",
					
					// div render.
					errorPlacement: function(error, e) {
						
						// div erreur.
						error.appendTo($(e).parents(".form-group"));
					},
					
					// invalidHandler.
					showErrors: function(errorMap, errorList) {
						
						// boucle error.
						$.each(errorList, function(key, val) {
							
							//translate error.
							val.message = $.lng.tr(val.message, true);
						});
						
						// Print error.
						this.defaultShowErrors();
					},
					
					// if input good.
					highlight:function(e, errorClass, validClass) {
						
						// add class erreur.
						$(e).parents('.form-group').addClass('has-error');
						// if success.
						$(e).parents('.form-group').removeClass('has-success'); 
					},
					
					// If bad input.
					unhighlight: function(e, errorClass, validClass) {
						
						// if erreur.
						$(e).parents('.form-group').removeClass('has-error');
						// add class success.
						$(e).parents('.form-group').addClass('has-success');
					},
					
					// after valid.
					submitHandler: function(form) {
						
						// Event.
						$('#'+form.id).trigger(form.id);
					}
				});
			},
		},
		/**
		 * @package langue. Start.
		 */
		lng: {
			
			/**
			 * Funct get.
			 * @return code langue actuel. ex: 'fr'
			 */
			get: function() {
				
				// Not langue.
				if(!$.m.lng.langue) {
					
					// Cookie langue.
					var lngCookie = $.cookie($.m.lng.cookie);
					
					// if cookie.
					if(lngCookie!=undefined) {
						
						// if code cookie in array.
						if($.inArray(lngCookie, $.m.lng.list) > -1) $.m.lng.langue=lngCookie;
						
						// if not code in array.
						else {
							
							// first code in array.
							$.m.lng.langue=$.m.lng.list[0];
							
							// New cookie.
							$.cookie($.m.lng.cookie, $.m.lng.langue);
						}
					}
					
					// if not cookie.
					else {
						
						// if code lingua in array.
						if($.inArray($.linguaGetLanguage(), $.m.lng.list) > -1) $.m.lng.langue=$.linguaGetLanguage();
						
						// if not code in array. first.
						else $.m.lng.langue=$.m.lng.list[0];
						
						// New cookie.
						$.cookie($.m.lng.cookie, $.m.lng.langue);
					}
				}
				
				// return langue.
				return $.m.lng.langue;
			},
			
			/**
			 * Function tr.
			 * @param   string $e string for translate.
			 * @param   bool   $p if false, return juste string and not html. defaut : false.
			 * @return  array string or html
			 */
			tr: function(e, p) {
				
				// Content.
				var transit = $.lingua(e);
				
				// If not translate.
				if(!transit) transit=e;
				
				// if not $p. Return html.
				if(p) return '<span class="langTr" data-langue="'+e+'">'+transit+'</span>';
				
				// if $p. Return juste string.
				else return transit;
			},
			
			/**
			 * Function tx.
			 * @param   array $e array for translate.
			 * @return  string of array.
			 */
			tx: function(e) {
				
				// Result.
				var result = '';
				
				// Boucle param.
				$.each( e, function(key, val) {
					
					// If lang = e.key
					if($.lng.get() == key) result = val;
				});
				
				// If not code langue in array.
				if(!result) result = e[Object.keys(e)[0]];
				
				// Return result.
				return result;
			},
			
			/**
			 * Function changeLangue.
			 * @param   string $param code langue "en".
			 * @access  public
			 */
			changeLangue: function(param) {
				
				// if code in array langue dispo.
				if($.inArray(param, $.m.lng.list) > -1) {
					
					// if langue != langue actu.
					if($.m.lng.langue!=param) {
						
						// Modif langue in objet.
						$.m.lng.langue=param;
						
						// this will also update controls by ID
						$.linguaLoad($.m.lng.langue);
						
						// New cookie.
						$.cookie($.m.lng.cookie, $.m.lng.langue);
						
						// Lague of date
						moment.lang($.m.lng.langue);
						
						// translate text in page.
						$('.langTr').each(function() {
							
							// Animation complete.
							$(this).fadeOut(400, function() {
							
								// translate texte.
								$(this).text($.lng.tr($(this).data('langue')));
								
								// add contenue.
								$(this).fadeIn(400);
							});
						});
						
						// tooltip [data-tr|="tooltip"].
						$('[data-tr]').each(function() {
							
							// translate texte in tooltip.
							$(this).attr('data-original-title', $.lng.tr($(this).data('tr')));
						});
						
						// flag & title menu langue.
						$('.icoLangue').fadeOut(400, function() { 
							
							// flag img and title.
							$(this).attr({
								src: $.m.lng.root+$.m.lng.langue+$.m.lng.extension,
								alt: $.m.lng.langue
								// add new titre div parent de l'image flag.
							}).parent().attr("data-original-title", $.lng.tr($.m.lng.langue));
							
							// print flag.
							$(this).fadeIn(400);
						});
						
						// event. Tmpl mod.
						$('#'+$.m.div.event).trigger($.m.event.langue);
					}
				}
			},
		},
		/**
		 * @package sound Start.
		 */
		voix: {
			
			/**
			 * Funct init.
			 */
			init: function() {
				
				// if sound is on.
				if($.m.voix.is) {
					
					// if not load sound.
					if(!$.m.voix.load.sound) {
						
						// Load sound for api.
						$.ionSound({
							sounds: $.m.voix.sound.list,
							path: $.m.voix.sound.url,
							multiPlay: true
						});
						
						// sound load on.
						$.m.voix.load.sound = true;
					}
				}
			},
			
			/**
			 * Funct play.
			 * @param str -> sound name
			 */
			play: function(str) {
				
				// if sound is on.
				if($.m.voix.is) {
					
					// Play sound.
					$.ionSound.play(str);
				}
			},
			
			/**
			 * Funct toggle. 
			 */
			toggle: function() {
				
				// if toggle is on.
				if($.m.voix.is) {
						
					// off toogle.
					$.m.voix.is=false;
					
					// New cookie.
					$.cookie('voixSound', 0);
					
					// Change btn icon.
					$('#mSound i').removeClass('fa-volume-up').addClass('fa-volume-off');
				}
				
				// If off
				else {
					
					// on toogle.
					$.m.voix.is=true;
					
					// Init plugin.
					$.voix.init();
					
					// New cookie.
					$.cookie('voixSound', 1);
					
					// Play sound.
					$.voix.play($.m.voix.sound.click);
					
					// Change btn icon.
					$('#mSound i').removeClass('fa-volume-off').addClass('fa-volume-up');
				}
			},
		}
	});
	
})(jQuery);

/**
 * @package boot.js Start.
 */

$(function() {
	
	// Load model.
	$.getJSON( "js/boot.json", function(e) {
		
		// Setup model.
		$.extend({m : e});
		
		// Init le JSON RPC url & NameSpace.
		$.jsonRPC.setup({ endPoint : $.m.api, namespace : '' });
		
		// initialization establishes path and the base translate.
		$.linguaInit($.m.lng.url, $.m.lng.file);
		
		// try loading the default language.
		$.linguaLoad($.lng.get());
		
		// Langue actu for date
		moment.lang($.lng.get());
		
		// Extend model : Func translate return html.
		$.m.T = function(){ return function(text, render){ return $.lng.tr(render(text), true)}};
		
		// Extend model : Func translate return text.
		$.m.TX = function(){ return function(text, render){ return $.lng.tr(render(text))}};
		
		// Extend model : Func date return from now.
		$.m.FROMNOW = function(){ return function(text, render){ return '<span class="timeFromNow" data-timestamp="'+render(text)+'">'+moment(render(text), 'X').fromNow()+'</span>'}};
		
		// Extend model : Func date return LLLL.
		$.m.LLLL = function(){ return function(text, render){ return moment(render(text), 'X').format('LLLL')}};
		
		// Extend model : Func date return YMD.
		$.m.YMD = function(){ return function(text, render){ return moment(render(text), 'X').format('YYYY/MM/DD')}};
		
		// Extend model : Func date return H.
		$.m.H = function(){ return function(text, render){ return moment(render(text), 'X').format('HH:mm')}};
		
		// Extend model : Func nice Number.
		$.m.NICE_NUMBER = function() { return function(text, render) {return render(text).toString().replace(/(\d)(?=(?:\d{3})+(?:$))/g, '$1 ');}};
			
		// Load and init tmpl.
		$.Mustache.load('js/boot.htm').done(function () {
						
			// Init valide form.
			$.tmpl.setupValidatorForm();
			
			// Sound. listen login or logout. if sound is on.
			$('#'+$.m.div.event).on('login', function() {if($.m.voix.is) $.voix.init();});
			$('#'+$.m.div.event).on('logout', function() {if($.m.voix.is) $.voix.init();});
			
			// Sound look Cookie.
			var cook = $.cookie('voixSound');
					
			// if cookie. edit model
			if(cook!=undefined && cook==1) {$.m.voix.is = true;}
					
			// Init plugin.
			$.voix.init();
					
			// add soun button in menu tmpl.
			$('#'+$.m.div.menu).mustache('mVoix', $.m);
			
			// add langue button in menu haut.
			$('#'+$.m.div.menu).mustache('mLangue', $.m, {method:'prepend'});
			
			// add soun button in menu tmpl.
			$('#headMenu').mustache('mVoix', $.m);
			
			// add langue button in menu haut.
			$('#headMenu').mustache('mLangue', $.m, {method:'prepend'});
			
			// Tooltip menu.
			$('button').tooltip();
			
			// Toastr options
			toastr.options = {
				"debug": false,
				"newestOnTop": false,
				"positionClass": "toast-top-right",
				"closeButton": true,
				"toastClass": "animated fadeInDown",
			};
			
			// Set interval 1mn and controle time from now.
			setInterval(function(){
				
				// Parcoure les time from now in dom.
				$('.timeFromNow').each(function() {
					
					// Edit text from time.
					$(this).text(moment($(this).data('timestamp'), 'X').fromNow());
				}); 
			}, 60000);
				
			// Setup plugin.
			$.each($.m.plug.list, function(key, val) {
				
				// Load model module.
				$.getJSON($.m.plug.url+val+'/'+val+'.json', function(data) {
					
					// add loading model.
					$.m[val]=data;
					
					// Load tmpl.
					$.Mustache.load($.m.plug.url+val+'/'+val+'.htm').done(function () {
					
						//setup module.
						$[val].setup();
					});
				});
			});
		});
	});
});