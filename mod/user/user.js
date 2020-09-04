/**
 * @version 0.7.0
 * @license MIT license
 * @link    https://chagry.com
 * @author  Grigori <git@chagry.com>
 * @package user.user.js
 */

(function($, undefined) {

	$.extend( {

		user: {

			/**
			 * Funct setup. Init mod user.
			 */
			setup: function() {

				// Wallet var.
				$.m.user.wallet = {};

				// Image for qr code
				//$.m.user.img = {};
				//$.m.user.img.qr = new Image();
				//$.m.user.img.qr.src = "img/css/qr.png";
				//$.m.user.img.qrp = new Image();
				//$.m.user.img.qrp.src = "img/css/qrp.png";

				// add modal read qr code.
				//$('#event').mustache('qrCodeReadModal', $.m);
				$('#event').mustache('signModal', $.m);

				// Setup html home.
				$.user.homePage();
			},

			/**
			 * Funct homePage.
			 */
			homePage: function() {

				// Clean windows.
				$.tmpl.clean();

				// Verif si menu user prensant dans le dom.
				if(!$('#sidebarHome').length) $('#'+$.m.div.mRight).empty().mustache('sidebarHome', $.m);

				// Boucle btn body.
				$('#'+$.m.div.mRight+' .sub-menu').each(function() {

					// hover btn
					$(this).mouseenter(function() {

						// Play sound.
						$.voix.play($.m.voix.sound.btnOver);
					});
				});

				// If btc adress exist
				if($.m.user.wallet.addr) {

					// add tmpl. DOC.
					$('#'+$.m.div.page).empty().mustache('wallet', $.m);

					// Page paper wallet.
					$.user.paperWalletFunc('blue');

					// Add video paper wallet bitcoin.
					$('#videoPaperWallet').tubeplayer({
						initialVideo	: $.m.user.vid,
						protocol		: $.m.protocol
					});

					// qr code generate.
					$('#qrCodeAdr').qrcode({
						text		: 'bitcoin:'+$.m.user.wallet.addr,
						render		: 'canvas',
						minVersion	: 2,
						maxVersion	: 20,
						ecLevel		: 'H',
						top			: 0,
						size		: 250,
						fill		: '#333333',
						background	: null,
						radius		: 0.5,
						mode		: 0
					});

					// qr code generate.
					$('#qrKeyCodeAdr').qrcode({
						text		: $.m.user.wallet.key,
						render		: 'canvas',
						minVersion	: 5,
						maxVersion	: 20,
						ecLevel		: 'H',
						top			: 0,
						size		: 250,
						fill		: '#333333',
						background	: null,
						radius		: 0.5,
						mode		: 0
					});

					// Valid Form.
					$('#formSignMess').validate();

					// event. Form send. listen.
					$('#formSignMess').on('formSignMess', $.user.signFUNC);

					// Valid Form.
					$('#formVerif').validate();

					// event. Form send. listen.
					$('#formVerif').on('formVerif', $.user.verifFUNC);

					// Valid Form.
					$('#formDecryptMess').validate();

					// event. Form send. listen.
					$('#formDecryptMess').on('formDecryptMess', $.user.decryptFUNC);

					// Valid Form.
					$('#formCrypte').validate();

					// event. Form send. listen.
					$('#formCrypte').on('formCrypte', $.user.cryptFUNC);
				}

				// Else not btc adress
				else {

					// add tmpl. DOC.
					$('#'+$.m.div.page).empty().mustache('userHomePage', $.m);

					// Valid Form.
					$('#formLogin').validate();

					// event. Form send. listen.
					$('#formLogin').on('formLogin', $.user.sendLogin);

					// Controle pass phrase for complexity.
					$('#formLogin #passPhrase').keyup($.user.passPhraseControl);

					// Tooltip page.
					$('#'+$.m.div.page+' span').tooltip();

					//var mymap = L.map('mapid').setView([51.505, -0.09], 13);
				}
			},

			/**
			 * Funct passPhraseControl.
			 */
			passPhraseControl: function() {

				// var expression reg control.
				var anUpperCase = /[A-ZÉÈÄËÏÖÜŸÃÑÊÕÀÁÂÎÃÔÒÓÇÝÛÚÙÆ]/;
				var aLowerCase = /[a-zéèçàôùúûîêäëïöüÿãñõœ]/;
				var aNumber = /[0-9]/;
				var aSpecial = /[ !@#$%^&*()\-\/_\'"§;.,:+\=]/;
				var Resultat = 0;

				// If empty, not message. Vide html div.
				if(!$('#formLogin #passPhrase').val()) $('#messDangerPhrase').empty();

				// Else not vide.
				else {

					// Phrase.
					var p = $('#formLogin #passPhrase').val();

					// var number of constante.
					var numUpper = 0;
					var numLower = 0;
					var numNums = 0;
					var numSpecials = 0;
					var numLongeur = p.length;
					var PassScore = 0

					// Each in prase
					for(var i=0; i<p.length; i++) {

						// Incremonte var of canstante.
						if(anUpperCase.test(p[i])) numUpper++;
						else if(aLowerCase.test(p[i])) numLower++;
						else if(aNumber.test(p[i])) numNums++;
						else if(aSpecial.test(p[i])) numSpecials++;
					}

					// If small phrase. bad result.
					if(numLongeur < 10) PassScore -= 3;
					// Esle edit pass var.
					else PassScore += Math.floor(numLongeur / 10);

					// If not specials caracter.
					if(numSpecials <1) PassScore -= 1;
					// else specials caracter.
					else PassScore += Math.floor(numSpecials /2);

					// caracter.
					if(numUpper * 10 < numLongeur) PassScore -= Math.floor(numLongeur / 20);
					else PassScore += Math.floor(numUpper /3);

					// Number.
					if(numNums * 10 < numLongeur) PassScore -= Math.floor(numLongeur / 20);
					else PassScore += Math.floor(numNums /3);

					// Maj
					if(numLower * 5 < numLongeur) PassScore -= Math.floor(numLongeur / 20);
					else PassScore += Math.floor(numLower /4);

					// Analize score. bad html div.
					if(PassScore <= 20) {

						// Add var to model.
						$.m.user.messPass = {"alert" : "danger", "icone" : "ban", "message" : "PHRASE_DANGER"};
						// Edit html dom.
						$('#messDangerPhrase').empty().mustache('messDangerPhraseHTML', $.m);
					}

					// warning html div.
					else if(PassScore <=40) {

						// Add var to model.
						$.m.user.messPass = {"alert" : "warning", "icone" : "exclamation-triangle", "message" : "PHRASE_WARNING"};
						// Edit html dom.
						$('#messDangerPhrase').empty().mustache('messDangerPhraseHTML', $.m);
					}

					// good html div.
					else {

						// Add var to model.
						$.m.user.messPass = {"alert" : "success", "icone" : "check", "message" : "PHRASE_SUCCES"};
						// Edit html dom.
						$('#messDangerPhrase').empty().mustache('messDangerPhraseHTML', $.m);
					}
				}
			},

			/**
			 * Funct signFUNC.
			 */
			signFUNC: function() {

				// If btc adress exist.
				if($.m.user.wallet.addr) {

					// Private Key+Address
					var sec = new Bitcoin.ECKey($.m.user.wallet.hash);
					var adr = ''+sec.getBitcoinAddress();
					var key = ''+sec.getExportedPrivateKey();
					var payload = Bitcoin.Base58.decode(key);
					var compressed = payload.length == 38;

					// If good adr bitcoin.
					if($.m.user.wallet.addr == adr) {

						// Message
						$.m.user.wallet.mess = $('#formSignMess #mess').val();

						// Signature of message
						$.m.user.wallet.sign = $.user.sign_message(sec, $.m.user.wallet.mess, compressed);

						// If good adr bitcoin.
						if($.m.user.wallet.sign) {

							// Show modal in page.
							$('#signModal').modal('show');
							// Add info to page.
							$('#signModalSign').html($.m.user.wallet.sign);
							$('#modalTire').html($.lng.tr('SIGNATURE', true));
							$('#modalLabel').html($.lng.tr('SIGN_RESULT_GOOD', true));
							$('#messModalSign').html($.lng.tr('MESSAGE', true)+' : '+$.m.user.wallet.mess);

							// Play sound.
							$.voix.play($.m.voix.sound.click);

							// Destruct var.
							sec = '';
						}

						// Else not sign
						else {

							// Destruct var.
							sec = '';

							// Error.
							$.tmpl.error('WARNING_SIGN_MESS_ERR');
						}
					}

					// If not btcAdr.
					else $.tmpl.error('FORM_WARNING_ADDR_BTC_INVALID');
				}

				// If not btcAdr.
				else $.tmpl.error('WARNING_NOT_CONNECTED');
			},

			/**
			 * Funct verifFUNC.
			 */
			verifFUNC: function() {

				// If good adr bitcoin on sign.
				if($.user.verify_message($('#formVerif #sign').val(), $('#formVerif #mess').val())==$('#formVerif #btcadr').val()) {

					// Afficher alert message god sign.
					swal({
						title: $.lng.tr('CONTROL_SIGN'),
						text: $.lng.tr('VALIDE_SIGN'),
						type: "success"
					});

					// Play sound.
					$.voix.play($.m.voix.sound.click);
				}

				// If not btcAdr.
				else $.tmpl.error('WARNING_SIGN_INVALID');
			},

			/**
			 * Funct sendLogin.
			 */
			sendLogin: function() {

				// If btc adress exist.
				if(!$.m.user.wallet.addr) {

					// PassPhrase.
					$.m.user.wallet.passPhrase = $('#formLogin #passPhrase').val();

					// Hash pass phrase bitcoin.
					$.m.user.wallet.hash = Crypto.SHA256($('#formLogin #passPhrase').val(), { asBytes: true });

					// Private Key+Address
					var sec = new Bitcoin.ECKey($.m.user.wallet.hash);

					// Add address bitcoin.
					$.m.user.wallet.addr = ''+sec.getBitcoinAddress();

					// Private Key
					$.m.user.wallet.key = ''+sec.getExportedPrivateKey();

					// Creat RSA key for cryptage.
					$.m.user.wallet.RSAkey = cryptico.generateRSAKey($.m.user.wallet.passPhrase, $.m.user.bitsRsa);
					$.m.user.wallet.PublicKeyString = cryptico.publicKeyString($.m.user.wallet.RSAkey);

					// Destruct var.
					sec = '';

					// event. login. trigger.
					$('#'+$.m.div.event).trigger('login');

					// Delete menu right.
					$('#'+$.m.div.mRight).empty();

					// Setup html.
					$.user.homePage();

					// add button in menu tmpl.
					$('#'+$.m.div.menu).mustache('mUserOff', $.m);
					$('#headMenu').mustache('mUserOff', $.m);

					// Init popup sur les lien.
					$('.mUserOff button').tooltip();

					// Play sound.
					$.voix.play($.m.voix.sound.click);
				}

				// If not btcAdr.
				else $.tmpl.error('WARNING_CONNECTED');
			},

			/**
			 * Funct sendLogout.
			 */
			sendLogout: function() {

				// If btc adress exist.
				if($.m.user.wallet.addr) {

					// Add address bitcoin.
					$.m.user.wallet = {};

					// Delete menu right.
					$('#'+$.m.div.mRight).empty();

					// Delete button in menu tmpl.
					$('.mUserOff').remove();

					// Play sound.
					$.voix.play($.m.voix.sound.click);

					// Setup html.
					$.user.homePage();

					// event. login. trigger.
					$('#'+$.m.div.event).trigger('logout');
				}

				// If not btcAdr.
				else $.tmpl.error('WARNING_NOT_CONNECTED');
			},

			/**
			 * Function sign_message interne.
			 * @param   ...
			 */
			sign_message: function(private_key, message, compressed, addrtype) {

				function msg_numToVarInt(i) {
					if (i < 0xfd) {
						return [i];
					} else if (i <= 0xffff) {
						// can't use numToVarInt from bitcoinjs, BitcoinQT wants big endian here (!)
						return [0xfd, i & 255, i >>> 8];
					} else {
						throw ("message too large");
					}
				}

				function msg_bytes(message) {
					var b = Crypto.charenc.UTF8.stringToBytes(message);
					return msg_numToVarInt(b.length).concat(b);
				}

				function msg_digest(message) {
					var b = msg_bytes("Bitcoin Signed Message:\n").concat(msg_bytes(message));
					return Crypto.SHA256(Crypto.SHA256(b, {asBytes:true}), {asBytes:true});
				}

				if (!private_key) return false;

				var signature = private_key.sign(msg_digest(message));
				var address = new Bitcoin.Address(private_key.getPubKeyHash());
				address.version = addrtype ? addrtype : 0;

				//convert ASN.1-serialized signature to bitcoin-qt format
				var obj = Bitcoin.ECDSA.parseSig(signature);
				var sequence = [0];
				sequence = sequence.concat(obj.r.toByteArrayUnsigned());
				sequence = sequence.concat(obj.s.toByteArrayUnsigned());

				for (var i = 0; i < 4; i++) {
					var nV = 27 + i;
					if (compressed)
						nV += 4;
					sequence[0] = nV;
					var sig = Crypto.util.bytesToBase64(sequence);
					if ($.user.verify_message(sig, message, addrtype) == address) return sig;
				}
				return false;
			},

			/**
			 * Funct verify_message interne.
			 */
			verify_message: function(signature, message, addrtype) {

				function msg_numToVarInt(i) {
					if (i < 0xfd) {
						return [i];
					} else if (i <= 0xffff) {
						// can't use numToVarInt from bitcoinjs, BitcoinQT wants big endian here (!)
						return [0xfd, i & 255, i >>> 8];
					} else {
						throw ("message too large");
					}
				}

				function msg_bytes(message) {
					var b = Crypto.charenc.UTF8.stringToBytes(message);
					return msg_numToVarInt(b.length).concat(b);
				}

				function msg_digest(message) {
					var b = msg_bytes("Bitcoin Signed Message:\n").concat(msg_bytes(message));
					return Crypto.SHA256(Crypto.SHA256(b, {asBytes:true}), {asBytes:true});
				}

				try {
					var sig = Crypto.util.base64ToBytes(signature);
				} catch(err) {
					return false;
				}
				if (sig.length != 65) return false;
				// extract r,s from signature
				var r = BigInteger.fromByteArrayUnsigned(sig.slice(1,1+32));
				var s = BigInteger.fromByteArrayUnsigned(sig.slice(33,33+32));
				// get recid
				var compressed = false;
				var nV = sig[0];
				if (nV < 27 || nV >= 35) return false;
				if (nV >= 31) {
					compressed = true;
					nV -= 4;
				}
				var recid = BigInteger.valueOf(nV - 27);
				var ecparams = getSECCurveByName("secp256k1");
				var curve = ecparams.getCurve();
				var a = curve.getA().toBigInteger();
				var b = curve.getB().toBigInteger();
				var p = curve.getQ();
				var G = ecparams.getG();
				var order = ecparams.getN();
				var x = r.add(order.multiply(recid.divide(BigInteger.valueOf(2))));
				var alpha = x.multiply(x).multiply(x).add(a.multiply(x)).add(b).mod(p);
				var beta = alpha.modPow(p.add(BigInteger.ONE).divide(BigInteger.valueOf(4)), p);
				var y = beta.subtract(recid).isEven() ? beta : p.subtract(beta);
				var R = new ECPointFp(curve, curve.fromBigInteger(x), curve.fromBigInteger(y));
				var e = BigInteger.fromByteArrayUnsigned(msg_digest(message));
				var minus_e = e.negate().mod(order);
				var inv_r = r.modInverse(order);
				var Q = (R.multiply(s).add(G.multiply(minus_e))).multiply(inv_r);
				var public_key = Q.getEncoded(compressed);
				var addr = new Bitcoin.Address(Bitcoin.Util.sha256ripe160(public_key));
				addr.version = addrtype ? addrtype : 0;
				return addr.toString();
			},

			/**
			 * Function scanQR. Affiche modal avec scaner de Qr code.
			 * @param a id du input ou inclure le resulta du scan.
			 * @param f le formulaire pour le declanchement du sbmit. Si vide, pas de declanchement.
			 */
			scanQR: function(a, f) {

				// Control if access to user media.
				navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
				if(navigator.getUserMedia) {

					// Clean windows.
					$('.tooltip').remove();

					// See modal.
					$('#qrCodeReadModal').modal({backdrop: false});
					$('#qrCodeReadModal').modal('show');

					// Init webcam.
					$('#reader').html5_qrcode(

						// Success scan qr code.
						function(data) {

							// If bitcoin link or just string.
							if (data.indexOf('bitcoin:') !== -1) {

								// If var in bitcoin link.
								if(data.indexOf('?') !== -1) {

									// Extract url.
									var arrUrl = data.split('?');

									// Si le input amount et le amount da le qr code son present.
									if($('#btcsth').length != 0 && arrUrl[1].indexOf('amount') !== -1) {

										// Extract key = valus.
										var arrVar = arrUrl[1].split('&');

										// Boucle sur les variable de l'url bitcoin.
										$.each(arrVar, function(key, val) {

											// Extract var.
											var arrKey = val.split('=');

											// Si la var est amount alors ajouter la somme dans le input.
											if(arrKey[0] == 'amount') $('#btcsth').val(arrKey[1]);
										});
									}

									// Extract btc address.
									var href = arrUrl[0];
									var match = href.match(/bitcoin:([13][123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]+)/);

									// Return btc addr.
									$('#'+a).val(match[1]);
								}

								// If not var in btc link.
								else {

									// Extract btc address.
									var href = data;
									var match = href.match(/bitcoin:([13][123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]+)/);

									// Return btc addr.
									$('#'+a).val(match[1]);
								}
							}

							// Else not bitcoin link. Return juste the string.
							else $('#'+a).val(data);

							// Close scan modal.
							$.user.closeQrReadModal();

							// Si var de retour pour submit form. Declanche le submit du form.
							if(f) $('#'+f).submit();
						},

						function(error){},

						//show read errors
						function(videoError){}
					);

				// Else not access user media.
				} else {

					// erreur.
					$.tmpl.error('NOT_ACCESS_USER_MEDIA');
				}
			},

			/**
			 * closeQrReadModal.
			 * Return void.
			 */
			closeQrReadModal: function() {

				// Stop use the camera.
				$('#reader').html5_qrcode_stop();

				// Close modal.
				$('#qrCodeReadModal').modal('hide');

				// Empty div reader.
				$('#reader').empty();
			},

			/*
			 * Funct paperWalletFunc. print paper wallet.
			 * @param e color wallet.
			 */
			paperWalletFunc: function(e) {

				// Ajouter l'image au dom.
				$('#imgWallet').empty().html('<div class="spinner"><div class="rect1"></div> <div class="rect2"></div> <div class="rect3"></div> <div class="rect4"></div> <div class="rect5"></div></div>');

				// Function pour afficher un text par lettre.
				function wrapText(context, text, x, y, maxWidth, lineHeight) {
					var words = text.split('');
					var line = '';
					// Boucle sur le tableau du text.
					for(var n = 0; n < words.length; n++) {
						var testLine = line + words[n];
						var metrics = context.measureText(testLine);
						var testWidth = metrics.width;
						if (testWidth > maxWidth && n > 0) {
							context.fillText(line, x, y);
							line = words[n];
							y += lineHeight;
						}
						else {
							line = testLine;
						}
					}
					// Dessiner le text dans le canvas.
					context.fillText(line, x, y);
				}

				// Creat canvas.
				var canvas = document.createElement("canvas");
				canvas.width = 2480;
				canvas.height = 3508;
				var context = canvas.getContext('2d');

				// Var qrAddrObj contien le src du qrcode addr btc.
				var qrAddrObj = new Image();
				// add img src code.
				qrAddrObj.src = $.user.qrCodeInit('bitcoin:'+$.m.user.wallet.addr);

				// Var qrAddrObj contien le src du qrcode key.
				var qrKeyObj = new Image();
				// add img src code.
				qrKeyObj.src = $.user.qrCodeInit($.m.user.wallet.key);

				// Var qrAddrObj contien le src du qrcode key.
				var qrPassObj = new Image();
				// add img src code.
				qrPassObj.src = $.user.qrCodeInit($.m.user.wallet.passPhrase);

				// Init paper wallet img.
				var imgFond = new Image();

				// A la fin de l'importation de l'image de fond pour le paper wallet.
				imgFond.onload = function() {

					// Dessiner le fond.
					context.drawImage(imgFond, 0, 0);

					// Dessiner dans les canvas le qrCode.
					context.drawImage(qrAddrObj, 545, 795);
					context.drawImage(qrPassObj, 630, 3050);
					context.drawImage(qrKeyObj, 2035, 3050);

					// Dessiner le text info.
					context.font = '19pt Arial';
					context.fillStyle = '#333333';

					// Dessiner le text addr.
					context.fillText($.m.user.wallet.addr, 20, 1160);

					// Dessiner la clé privée.
					wrapText(context, $.m.user.wallet.key, 1550, 3125, 320, 30);

					// Dessiner la phrase secrete.
					wrapText(context, $.m.user.wallet.passPhrase, 1110, 3125, 320, 30);

					// rotate around that point, converting our
					// angle from degrees to radians
					context.translate(2480, 3508);
					context.rotate(180 * (Math.PI/180));

					// Dessiner dans les canvas le qrCode.
					context.drawImage(qrAddrObj, 545, 795);
					context.drawImage(qrPassObj, 630, 3050);
					context.drawImage(qrKeyObj, 2035, 3050);

					// Dessiner le text addr.
					context.fillText($.m.user.wallet.addr, 20, 1160);

					// Dessiner la clé privée.
					wrapText(context, $.m.user.wallet.key, 1550, 3125, 320, 30);

					// Dessiner la phrase secrete.
					wrapText(context, $.m.user.wallet.passPhrase, 1110, 3125, 320, 30);

					// and restore the co-ords to how they were when we began
					context.restore();

					// save canvas image as data url (png format by default)
					var dataURL = canvas.toDataURL('image/jpeg', 0.9);

					// Generait l'image.
					var img='<a href="'+dataURL+'" download="PaperWallet.jpg" target="_blank"><img class="img-responsive img-thumbnail" src="'+dataURL+'" alt="Bitcoin Paper Wallet"></a>';

					// Ajouter l'image au dom.
					$('#imgWallet').empty().html(img);
				}

				// Look color paper wallet. L'image source pour le paper wallet blue.
				if(e == 'blue') imgFond.src = "img/btc/paperWallet.jpg";
				else if(e == 'orange') imgFond.src = "img/btc/paperWalletOrange.jpg";
				else if(e == 'green') imgFond.src = "img/btc/paperWalletGreen.jpg";
				else if(e == 'rose') imgFond.src = "img/btc/paperWalletRose.jpg";
				else imgFond.src = "img/btc/paperWallet.jpg";
			},

			/*
			 * Funct qrCodeInit. return img src code.
			 * @param e text for qr code.
			 */
			qrCodeInit: function(e) {

				// Content html
				var qrAddr = $('<div id="qrDiv"></div>');

				// qr code generate.
				qrAddr.qrcode({
					text		: e,
					render		: 'image',
					minVersion	: 2,
					maxVersion	: 20,
					ecLevel		: 'H',
					top			: 0,
					size		: 300,
					fill		: '#333333',
					background	: null,
					radius		: 0.5,
					mode		: 0
				});

				// Return reponse.
				return qrAddr[0].children[0].src;
			},
		}
	});

})(jQuery);
