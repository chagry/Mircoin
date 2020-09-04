/*
 * @version 0.7.0
 * @license MIT license
 * @link    https://chagry.com
 * @author  Grigori <git@chagry.com>
 * @package	home.home.js
 */

(function($, undefined) {
	
	$.extend( {
		
		home: {
			
			/*
			 * Funct setup. Init mod home.
			 */
			setup: function() {
				
				// Setup html home.
				//$.home.homePage();
			},
			
			/*
			 * Funct homePage.
			 */
			homePage: function() {
				
				// Clean windows.
				$.tmpl.clean();
				
				// if not menu right, add in dom.
				if(!$('#sidebarHome').length) $('#'+$.m.div.mRight).empty().mustache('sidebarHome', $.m);
				
				// Boucle btn body.
				$('#'+$.m.div.mRight+' .sub-menu').each(function() {
					
					// hover btn
					$(this).mouseenter(function() {
						
						// Play sound.
						$.voix.play($.m.voix.sound.btnOver);
					});
				});
					
				// add tmpl homePage.
				$('#'+$.m.div.page).empty().mustache('homePage', $.m);
			},
		}
	});
	
})(jQuery);