/*
 * @version 0.6.0
 * @license MIT license
 * @link    https://chagry.com
 * @author  Grigori <git@chagry.com>
 * @package	btc.btc.js
 */

(function($, undefined) {
	
	$.extend( {
		
		btc: {
			
			/**
			 * Funct setup.
			 */
			setup: function() {
				
				// Upload infos btc.
				$.btc.uploadInfos();
				
				// Base pour le change.
				fx.base = 'USD';
				
				// Extend model : Func return price btc in selected currency.
				$.m.BTCPRX = function() { 
					return function(text, render) {
						
						var tmp = '<span class="btcPrice" data-prix="'+Number(render(text)).toFixed(8)+'"></span>';
						if(fx.rates) tmp = '<span class="btcPrice" data-prix="'+Number(render(text)).toFixed(8)+'">'+accounting.formatNumber(fx(Number(render(text)).toFixed(8)).from('BTC').to($.m.btc.devise), 2, ' ')+'</span>';
						
						// Return result.
						return tmp;
					}
				};
				
				// Extend model : Func change satoshi amount to btc amount.
				$.m.STHBTC = function() { 
					return function(text, render) {
						
						// Return result.
						return accounting.formatNumber((Number(render(text))/100000000), 8, ' ');
					}
				};
				
				// Extend model : Func STHPRIX return price chose in satishi.
				$.m.STHPRX = function() { 
					return function(text, render) {
						
						var tmp = '<span class="btcPrice" data-prix="'+(Number(render(text))/100000000).toFixed(8)+'"></span>';
						if(fx.rates) tmp = '<span class="btcPrice" data-prix="'+(Number(render(text))/100000000).toFixed(8)+'">'+accounting.formatNumber(fx(Number(render(text)/100000000).toFixed(8)).from('BTC').to($.m.btc.devise), 2, ' ')+'</span>';
						
						// Return result.
						return tmp;
					}
				};
				
				// Extend model : Func date return devise + code. CODE ICO NAME
				$.m.CURRENCY = function() { 
					return function(text, render) {
						
						// Var return.
						var tmp = '';
						
						// Return the code of currency.
						if(render(text)=='CODE') {
							
							var tmp = '<span class="codePrice"></span>';
							if($.m.btc.devise) tmp = '<span class="codePrice">'+$.m.btc.devise+'</span>';
						}
						
						// Return image of currency.
						if(render(text)=='ICO') {
							
							tmp = '<span class="icoPrice"></span>';
							if($.m.btc.devise) tmp = '<span class="icoPrice"><img src="img/currency/'+$.m.btc.devise+'.jpg" height="20" alt="'+$.m.btc.devise+'"></span>';
						}
						
						// Return name of currency.
						if(render(text)=='NAME') {
							
							tmp = '<span class="namePrice"></span>';
							if($.m.btc.devise) tmp = '<span class="namePrice">'+$.lng.tr($.m.btc.devise, true)+'</span>';
						}
						
						// Return result.
						return tmp;
					}
				};
			},
			
			/**
			 * html uploadInfos.
			 */
			uploadInfos: function() {
				
				// connexion serveur.
				$.jsonRPC.request('btc_ticker', {
					
					// Param send.
					params : [],
					
					// Add url for cards.
					endPoint: $.m.btc.url,
					
					// succees.
					success : function(data) {
						
						// Add change price to monay.js.
						fx.rates = data.result.rates;
						
						// Var for menu currency in top menu.
						$.m.btc.menu = Array();
						
						// Creat array menu devise code.
						$.each(data.result.rates, function(key, val) {
							
							// add result tab log.
							$.m.btc.menu.push(key);
						});
						
						// Cookie devise.
						var btcCookie = $.cookie('currency');
						
						// if cookie.
						if(btcCookie!=undefined) {
							
							// if code cookie in array.
							if($.inArray(btcCookie, $.m.btc.menu) > -1) $.m.btc.devise=btcCookie;
							
							// if not code in array.
							else {
								
								// first code in array.
								$.m.btc.devise=$.m.btc.menu[0];
								
								// New cookie.
								$.cookie('currency', $.m.btc.devise);
							}
						}
						
						// if not cookie.
						else {
							
							// if not code in array. first.
							$.m.btc.devise='USD';
							
							// New cookie.
							$.cookie('currency', $.m.btc.devise);
						}
						
						// Begin news price interval.
						setTimeout($.btc.newPrice, data.result.nextSync*1000);
						
						// Edit html devise
						$.btc.editDevise();
						
						// Edit html Price
						$.btc.editPrice();
						
						// Var content xchange info.
						$.m.btc.xchange={};
						$.m.btc.xchange.fromCurr = 'BTC';
						$.m.btc.xchange.fromSum = 1;
						$.m.btc.xchange.toCurr = $.m.btc.devise;
						$.m.btc.xchange.toSum = accounting.formatNumber(fx(1).from('BTC').to($.m.btc.devise), 2, '');
						
						// Verif si le panel de change est prensant dans le dom.
						if($('#xChange').length) {
							
							// Add change info to dom.
							$('#xChange').empty().mustache('pChange', $.m);
						}
						
						// Controle input de change currency.
						$('#fromSum').keyup($.btc.xChangeFrom);
						$('#toSum').keyup($.btc.xChangeTo);
						
						// event. btc. trigger.
						$('#'+$.m.div.event).trigger('btc');
						
						// add menu btc.
						$('#'+$.m.div.menu).mustache('mBtc', $.m, {method:'prepend'});
						$('#headMenu').mustache('mBtc', $.m, {method:'prepend'});
						// Init popup sur les lien.
						$('#mBtc button').tooltip();
					},
					
					// erreur serveur.
					error : function(data) {
						
						// erreur.
						$.tmpl.error(data.error);
						
						// Upload infos btc. after 3mn.
						setTimeout($.btc.uploadInfos,180000);
					}
				});
			},
			
			/**
			 * html newPrice.
			 */
			newPrice: function() {
				
				// connexion serveur.
				$.jsonRPC.request('btc_ticker', {
					
					// Param send.
					params : [],
					
					// Add url for cards.
					endPoint: $.m.btc.url,
					
					// succees.
					success : function(data) {
						
						// Add change price to monay.js.
						fx.rates = data.result.rates;
						
						// Edit html Price
						$.btc.editPrice();
						
						// xChange panel edit. If to is btc. 8 chiffre apres la virgule.
						if($.m.btc.xchange.toCurr == 'BTC') $.m.btc.xchange.toSum = accounting.formatNumber(fx($.m.btc.xchange.fromSum).from($.m.btc.xchange.fromCurr).to($.m.btc.xchange.toCurr), 8, '');
						// xChange panel edit. Si non, 2 chiffre apres la virgule.
						else $.m.btc.xchange.toSum = accounting.formatNumber(fx($.m.btc.xchange.fromSum).from($.m.btc.xchange.fromCurr).to($.m.btc.xchange.toCurr), 2, '');
						
						// Verif si le panel de change est prensant dans le dom.
						if($('#xChange').length) {
							
							// Remlpacer la somme dans le input du change toSum
							$('#toSum').val($.m.btc.xchange.toSum);
						}
						
						// event. btc. trigger.
						$('#'+$.m.div.event).trigger('btc');
						
						// Begin news price interval.
						setTimeout($.btc.newPrice, data.result.nextSync*1000);
					},
					
					// erreur serveur.
					error : function(data) {
						
						// erreur.
						$.tmpl.error(data.error);
					}
				});
			},
			
			/**
			 * Function changePrices.
			 * @param   string $param code devise "USD".
			 */
			changePrices: function(param) {
				
				// if code in array devise dispo.
				if($.inArray(param, $.m.btc.menu) > -1) {
					
					// if devise != devise actu.
					if($.m.btc.devise!=param) {
						
						// Modif devise in objet.
						$.m.btc.devise=param;
						
						// New cookie.
						$.cookie('currency', $.m.btc.devise);
						
						// Edit html devise
						$.btc.editDevise();
						
						// Edit html Price
						$.btc.editPrice();
					}
				}
			},
			
			/**
			 * Funct editDevise.
			 */
			editDevise: function() {
				
				// edit code price in page.
				$('.codePrice').each(function() {
					
					// Animation complete.
					$(this).fadeOut(400, function() {
					
						// code texte.
						$(this).text($.m.btc.devise);
						
						// add contenue.
						$(this).fadeIn(400);
					});
				});
				
				// edit icon price in page.
				$('.icoPrice').each(function() {
					
					// Animation complete.
					$(this).fadeOut(400, function() {
					
						// img devise.
						$(this).html('<img src="img/currency/'+$.m.btc.devise+'.jpg" height="20" alt="'+$.m.btc.devise+'">');
						
						// add contenue.
						$(this).fadeIn(400);
					});
				});
				
				// edit name price in page.
				$('.namePrice').each(function() {
					
					// Animation complete.
					$(this).fadeOut(400, function() {
					
						// name html.
						$(this).html($.lng.tr($.m.btc.devise, true));
						
						// add contenue.
						$(this).fadeIn(400);
					});
				});
			},
			
			/**
			 * Funct editPrice.
			 */
			editPrice: function() {
				
				// edit code price in page.
				$('.btcPrice').each(function() {
					
					// If price html > new price
					if(fx(accounting.unformat($(this).data('prix')).toFixed(8)).from('BTC').to($.m.btc.devise)<(accounting.unformat($(this).text()))) {
						
						// Animation complete.
						$(this).fadeOut(400, function() {
								
							// code texte.
							$(this).text(accounting.formatNumber(fx(Number($(this).data('prix')).toFixed(8)).from('BTC').to($.m.btc.devise), 2, ' ')).addClass('text-danger');
							
							// add contenue.
							$(this).fadeIn(400);
						});
					}
					
					// If price html < new price
					if(fx(accounting.unformat($(this).data('prix')).toFixed(8)).from('BTC').to($.m.btc.devise)>(accounting.unformat($(this).text()))) {
					
						// Animation complete.
						$(this).fadeOut(400, function() {
							
							// code texte.
							$(this).text(accounting.formatNumber(fx(Number($(this).data('prix')).toFixed(8)).from('BTC').to($.m.btc.devise), 2, ' ')).addClass('text-success');
							
							// add contenue.
							$(this).fadeIn(400);
						});
					}
				});
				
				// Remove class after 4s.
				setTimeout(function () { 
					$('.btcPrice').removeClass('text-success text-danger');
				}, 4000);
			},
			
			/**
			 * Function xChangeCurrency.
			 * @param   string $param code devise "USD", and teken 1 or 2.
			 */
			xChangeCurrency: function(param, teken) {
				
				// if code in array devise dispo.
				if($.inArray(param, $.m.btc.menu) > -1) {
				
					// if teken == 1. Donc modifier fromCurr
					if(teken == 1) {
						
						// if devise != devise actu in xChange.
						if($.m.btc.xchange.fromCurr!=param) {
							
							// Modif devise in xChange.
							$.m.btc.xchange.fromCurr=param;
							
							// xChange panel edit. If to is btc. 8 chiffre apres la virgule.
							if($.m.btc.xchange.fromCurr == 'BTC') $.m.btc.xchange.fromSum = accounting.formatNumber(fx($.m.btc.xchange.toSum).from($.m.btc.xchange.toCurr).to($.m.btc.xchange.fromCurr), 8, '');
							
							// xChange panel edit. Si non, 2 chiffre apres la virgule.
							else $.m.btc.xchange.fromSum = accounting.formatNumber(fx($.m.btc.xchange.toSum).from($.m.btc.xchange.toCurr).to($.m.btc.xchange.fromCurr), 2, '');
							
							// Verif si le panel de change est prensant dans le dom.
							if($('#xChange').length) {
								
								// Remlpacer la somme dans le input du change toSum
								$('#fromSum').val($.m.btc.xchange.fromSum);
								
								// img devise in input.
								$('#fromIcon').html('<img src="img/currency/'+$.m.btc.xchange.fromCurr+'.jpg" height="25" alt="'+$.lng.tr($.m.btc.xchange.fromCurr)+'">');
								
								// code currency in input.
								$('#fromCode').text($.m.btc.xchange.fromCurr);
								
								// Name currency in input.
								$('#fromName').html($.lng.tr($.m.btc.xchange.fromCurr, true));
							}
							
						}
						
					}
					
					// if teken == 2. Donc modifier toCurr
					if(teken == 2) {
						
						// if devise != devise actu in xChange.
						if($.m.btc.xchange.toCurr!=param) {
							
							// Modif devise in xChange.
							$.m.btc.xchange.toCurr=param;
							
							// xChange panel edit. If to is btc. 8 chiffre apres la virgule.
							if($.m.btc.xchange.toCurr == 'BTC') $.m.btc.xchange.toSum = accounting.formatNumber(fx($.m.btc.xchange.fromSum).from($.m.btc.xchange.fromCurr).to($.m.btc.xchange.toCurr), 8, '');
							
							// xChange panel edit. Si non, 2 chiffre apres la virgule.
							else $.m.btc.xchange.toSum = accounting.formatNumber(fx($.m.btc.xchange.fromSum).from($.m.btc.xchange.fromCurr).to($.m.btc.xchange.toCurr), 2, '');
							
							// Verif si le panel de change est prensant dans le dom.
							if($('#xChange').length) {
								
								// Remlpacer la somme dans le input du change toSum
								$('#toSum').val($.m.btc.xchange.toSum);
								
								// img devise in input.
								$('#toIcon').html('<img src="img/currency/'+$.m.btc.xchange.toCurr+'.jpg" height="25" alt="'+$.lng.tr($.m.btc.xchange.toCurr)+'">');
								
								// code currency in input.
								$('#toCode').text($.m.btc.xchange.toCurr);
								
								// Name currency in input.
								$('#toName').html($.lng.tr($.m.btc.xchange.toCurr, true));
							}
						}
					}
				}
			},
			
			/**
			 * Function xChangeFrom. Declancher par la modification input change.
			 */
			xChangeFrom: function() {
				
				// Recup new price in input.
				$.m.btc.xchange.fromSum = $('#fromSum').val();
				
				// xChange panel edit. If to is btc. 8 chiffre apres la virgule.
				if($.m.btc.xchange.toCurr == 'BTC') $.m.btc.xchange.toSum = accounting.formatNumber(fx($.m.btc.xchange.fromSum).from($.m.btc.xchange.fromCurr).to($.m.btc.xchange.toCurr), 8, '');
				
				// xChange panel edit. Si non, 2 chiffre apres la virgule.
				else $.m.btc.xchange.toSum = accounting.formatNumber(fx($.m.btc.xchange.fromSum).from($.m.btc.xchange.fromCurr).to($.m.btc.xchange.toCurr), 2, '');
				
				// Remlpacer la somme dans le input du change toSum
				$('#toSum').val($.m.btc.xchange.toSum);
			},
			
			/**
			 * Function xChangeTo. Declancher par la modification input change.
			 */
			xChangeTo: function() {
				
				// Recup new price in input.
				$.m.btc.xchange.toSum = $('#toSum').val();
				
				// xChange panel edit. If to is btc. 8 chiffre apres la virgule.
				if($.m.btc.xchange.fromCurr == 'BTC') $.m.btc.xchange.fromSum = accounting.formatNumber(fx($.m.btc.xchange.toSum).from($.m.btc.xchange.toCurr).to($.m.btc.xchange.fromCurr), 8, '');
				
				// xChange panel edit. Si non, 2 chiffre apres la virgule.
				else $.m.btc.xchange.fromSum = accounting.formatNumber(fx($.m.btc.xchange.toSum).from($.m.btc.xchange.toCurr).to($.m.btc.xchange.fromCurr), 2, '');
				
				// Remlpacer la somme dans le input du change toSum
				$('#fromSum').val($.m.btc.xchange.fromSum);
			},
			
			
		}
	});
	
})(jQuery);