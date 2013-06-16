
var isBrowser = browserInfo();
var isTouch = ("createTouch" in document);
var tap_click = isTouch ? 'tap' : 'click';

// hide top address bar
addEventListener("load", function() { setTimeout(hideURLbar, 0); }, false); 
function hideURLbar(){ 
	window.scrollBy(0, 1);
}

;(function ($) {
	$.extend($.fn, {
		swipeClickSlider:function(options) {
			var opts = $.extend({}, options);
			$(this).each(function () {
				var touchWrap = $(this), id = this.id;
				var moveLength = touchWrap.find('li').length;
				if (moveLength > 1) {
					var itemNav = '<div id="'+ id +'_slideBtns" class="slideBtns"><ul><li class="on">1</li>';
					for (i = 1; i < moveLength; i++) {
						itemNav += "<li>" + (i + 1) + "</li>";
					};
					itemNav += '</ul></div>';						
					touchWrap.append(itemNav);
					
					var bullets = $('#'+ id +'_slideBtns').find('li'),
						slider = new Swipe(document.getElementById(id), {
							callback:function (e, pos) {
								bullets.eq(pos).addClass('on').siblings().removeClass('on');
							}
						});
					bullets.on(tap_click, function () {
						$(this).addClass('on').siblings().removeClass('on');
						slider.slide(parseInt($(this).index(), 10), 300);
					});	
				}
			});
		},
		tab:function(toggle) {
			if (!$(this).length) return false;
			$(this).children().on(tap_click, function () {
				var target = $($(this).data('showtarget'));
				if (target.length) {
					if (toggle) {
						target.toggle().siblings().hide();
						$(this).toggleClass('on').siblings().removeClass('on');
					} else {
						target.show().siblings().hide();
						$(this).addClass('on').siblings().removeClass('on');
					}
					return false;
				}
			});
		},
		qtyBox:function() {
			if (!$(this).length) return false;
			$(this).each(function () {
				var inputBox = $(this).find('input'), qtyShow = $(this).find('span');
				$(this).find('a').on(tap_click, function () {
					var qty = Number(inputBox.val()),
						add = $(this).data('add');

					if (add) {
						if (qty < 9999) {
							qty += 1;
						}
					} else {
						if (qty > 1) {
							qty -= 1;
						}
					}
					inputBox.val(qty);
					qtyShow.text(qty);
					return false;
				});
			});
		},
		checkbox:function(setting) {
			var opt = { className:'mimicalBox', onChange:null };
			setting = setting || {};
			$.extend(opt, setting);

			$(this).each(function () {
				var input = $(this);
				input.hide().after('<span class="' + opt.className + (input.attr('disabled') ? ' disbaled' : '') + '"></span>');

				var checkbox = input.next('span');
				if (input.attr('checked')) {    // if it is oncheck, add a class name to it.
					checkbox.addClass('checked');
				}
				;
				input.change(function () {    // change the custome box status when the input value has been changed ( when you click the label element )
					inputChanged(input, checkbox, opt.onChange);
				});
			});
			function inputChanged(input, checkbox, onChange) {
				var check = input.attr('checked');
				if (onChange) {
					onChange(check, checkbox, input);
				}
				input.attr('checked') ? checkbox.addClass('checked') : checkbox.removeClass('checked');
			}
		}
	});
	
	$(function () {
		/* Optimized PLACEHOLDER for iOS6 - Mooki ( http://mooki83.tistory.com ) */
		if (isBrowser.ios6_0) {
			$(window).bind("orientationchange.fm_optimizeInput", fm_optimizeInput);
		}
		/* Form validate methods */
		var happy = happyMethods();
		
		$('#main-nav').tab(true);
		$('#pListOptions').tab(true);
		
		$("#signin").on(tap_click, function () {
			$("#originalUrl").val(window.location);
			$("#loginForm").submit();
			return false;
		});

		$('#toStandardSite,#toStandardSite404').on(tap_click, function(){
			(_gaq=(_gaq||[])).push(['_trackEvent', 'MWD-MobileUXEvent', location.href, 'Switch_Standard_'+currentSite.name]);
			$.cookie('to-standard-site', 'true', { expires: 1, path: '/' });
			window.location.reload();
			return false;
		});
		
		$('#switchViewModel').on(tap_click, function () {
			if ($(this).hasClass('viewWithGrid')) {
				$(this).removeClass('viewWithGrid').html('List<span class="icon-gridlist"></span>');
				$('#product-list').removeClass('listView').addClass('gridView');
				$.cookie('mViewList', null, {path: '/' });
			} else {
				$(this).addClass('viewWithGrid').html('Grid<span class="icon-gridlist"></span>');
				$('#product-list').removeClass('gridView').addClass('listView');
				$.cookie('mViewList', 'Y', {path: '/' });
			}
		});
		
		// Product detail page
		$('#slider').swipeClickSlider();
		
		$('#qtySetting').qtyBox();

		$("#billing").on(tap_click, function () {
			$("#addBillingAddressForm").submit();
		});
		$('#chooseCard').find('a').on(tap_click, function () {
			$(this).parent().addClass('on').siblings().removeClass();
			return false;
		});
		$('#chooseToSubmit li').on("click", function () {
			$(this).find("input").attr("checked",true);
			$(this).parents('form').submit();
		});

		//myaccount--->address book and creditcards
		$("#editList").on(tap_click, 'li', function () {
			var self = $(this), form = $(this).parents("form");
			formValueInit(form, self);
			form.submit();
		});

		//pdp--->show more add button
		$("#morePdpOptionBtn").on(tap_click,function(){
			var optionBox=$(this).closest(".boxContainer").next(".moreOption");
			var stockBox=$(this).closest("li[id=stockBox]");
			$(this).fastButton({isfastBtn:true});
			if(optionBox.hasClass("action")){
				optionBox.height(0).removeClass("action");
				stockBox.removeClass("moreOptionWrap");
			}
			else{
				optionBox.height(optionBox.attr("heightlimit")+"px").addClass("action");
				stockBox.addClass("moreOptionWrap");
			}
		});

		//pdp--->postZipCodeForm
		$("#postZipCodeFormBtn").on(tap_click, function () {
			$(this).hide().parent().find("form").show();
		});

		//myaccount--->aboutBaby radio change
		$(".radioLableBox li").on(tap_click,function(){
			$(".radioLableBox li").removeClass("checked");
			$(this).addClass("checked");
			$(".radioLableBox li input[type=radio]").removeAttr("checked");
			$(this).find("input[type=radio]").attr("checked","checked");
			multiplesBabyInfo.hide();
			var $multiples=$("#multiples");
			if($multiples.val()=="multiples"&&$multiples.parent().parent().hasClass("checked"))multiplesBabyInfo.show();
		});

		// $('#chooseList').on(tap_click, 'li', function () {
			// var self = $(this), input = $('#' + $(this).data('input'));
			// input.val($(this).data('value'));
			// $(this).addClass('current').siblings().removeClass('current');
		// });
		
		//add billing address
		if( $('#ajax_saveAddress').length ){
			var addressForm = $('#ajax_saveAddress'),
				cancelBtn = $('#ajax_addCancel'),
				cardForm = $('#cardDetail'), 
				addressList = cardForm.hasClass('checkoutMark') ? $('#addressList') : $('#editAddress');
				
			var backToCardForm = function( reset ){
					if( reset || cancelBtn.hasClass('edit') ) {	// reset the form
						addressForm.find('input[type="text"], input[type="tel"]').val('');
						cancelBtn.removeClass('edit');
					}
					
					addressForm.find('.errorMsg').hide();
					addressForm.hide().find('.unhappyMessage').remove();
					addressForm.find('.unhappy').removeClass('unhappy');
					cardForm.show();
				};
			
			// Edit billing address
			if( addressList.find('.editAddress').length ){
				addressList.on(tap_click, '.editAddress', function (e) {
					// formValueInit($('#editbillingForm'), $(this).parent());
					// formValueInit($("#editbillingForm"), $("#cardDetail"));
					// $('#editbillingForm').submit();
					// return false;
					var item = $(this).parent(), addressId = item.find('input').val();
					item.addClass('editing');
					
					cancelBtn.addClass('edit');
					formValueInit(addressForm, item, 'input[type="text"], input[type="tel"],input[type="hidden"]');
					
					cardForm.hide();
					addressForm.show()
				});
			}
			
			
			$("#newbilling").on(tap_click, function () {
				cardForm.hide();
				addressForm.show();
			});
			cancelBtn.on(tap_click, function(){
				backToCardForm( $(this).hasClass('edit') );
			});
			
			addressForm.isHappy({
				fields:{
					'#name':{test:happy.addressName},
					'#fromCity':{test: happy.name, arg: 'Please enter only letters for City.'},
					'#zipCode':	{test: happy.zipCode},
					'#fieldState': { test: happy.USState},
					'#phone':	{test: happy.USPhone}
				},
				onHappy: function( form ){
					var data = createData($(form)),
						type = cancelBtn.is('.edit') ? 'edit' : 'add',
						url = type == 'edit' ? $(form).data('editaction') : $(form).attr('action');
					
					var loading = loadingBox($(form));
					$.ajax({
						type:		'POST',
						url:		url,
						contentType:"application/json", 
						dataType:	"json",
						data:		JSON.stringify(data),
						success:	function(data){
							loading.close();
							var card = data.selectedCreditCard, items = data.billingAddresses, list = '';
							for( var i = 0; i < items.length; i++ ){
								list += '<li>\
								<input type="radio" name="billingAddressId" id="address_'+ i +'" value="'+ items[i].AddressId + '"' + ((items[i].AddressType == 'B' && items[i].IsSelected) ? '" checked="checked"' : '' ) + '>\
								<label for="address_'+ i +'" onclick="">\
									<span class="addressId" style="display:none;">'+ items[i].AddressId +'</span>\
									<strong class="name">'+ items[i].Name +'</strong>\
									<span class="addressLine1">'+ items[i].Addressline1 +'</span>,' +
									( items[i].Addressline2 ? '<span class="addressLine2">'+ items[i].Addressline2 +'</span>,' : '') + 
									'<span class="city">'+ items[i].City +'</span>,\
									<span class="state">'+ items[i].State +'</span>,\
									<span class="zipCode">'+ items[i].Zipcode +'</span>,\
									<span class="phone">'+ items[i].PhoneNumber +'</span>,\
									<span class="addressType" style="display:none;">'+ items[i].AddressType +'</span>\
								</label>' + (cardForm.hasClass('checkoutMark') ? '' : '<i class="editAddress">Edit</i>') + // disabled edit function on checkout pages.
								'</li>';
							}
                            addressList.html(list);
							if( card && card.CreditCardId ){	// reset the credit card ID
								$('#creditCardId').val(card.CreditCardId);
								$('#creditCardIdTemp').val(card.CreditCardId);
							}
							
							backToCardForm( true );
						},
						error:		function(e){
							loading.close();
							var msgBox = $(form).find('.errorMsg');
							msgBox.html(JSON.parse(e.response).message).show();
						}
					});
				}
			});

			cardForm.isHappy({
				fields:{
					'#cardNumber' 	: { test:happy.cardNumber},
					'#securityCode'	: { test:happy.securityCode},
					'#expirationDate':{ test:happy.cardDate}
				},
				otherTest: function(form){
					var errorBox = $('#addressCheckedMsg');
					if(addressList.find('li').length){
						if($(form).find('input[name="billingAddressId"]').filter(':checked').length){
							$('#addressCheckedMsg').hide();
							return true;
						} else {
							errorBox.html('Please choose a billing address for this card.').show();
							return false;
						}
					} else {
						errorBox.html('Please add a billing address for this card.').show();
						return false;
					}
				}
			});			
		}

		$('#sampleList').find('input[type="checkbox"]').checkbox({
			onChange:function (checked, checkbox, input) {
				if (checked) {
					if ($('#sampleList').children('.checked').length >= 3) {
						var item = input.parent(); 
						item.append('<div class="msgBox">Sorry, 3 samples you can select.</div>');
						input[0].checked = false;
						setTimeout(function(){
							item.find('.msgBox').remove();
						}, 2000);
					} else {
						input.parent().addClass('checked');
					}
				} else {
					input.parent().removeClass('checked');
				}
			}
		});
		
		//mask
		$('#expirationDate').mask('99/9999');
		$('#phone').mask('(999) 999-9999');
		$('#dueDate').mask('99/99/9999');
		
		/* Form validate */
		$('#userLoginForm').isHappy({
			fields:{
				'#email':	{test:happy.email},
				'#password':{ test:happy.passwordlegacysignin}
			}
		});
		$('#registerForm').isHappy({
			fields:{
				'#uemail'	: { test: happy.email},
				'#upassword': { test: happy.password},
				'#upasswordConfirm':{
					required:	['sometimes', 'Your two passwords do not match, please try again.'],
					test: happy.equal,
					arg:function () {
						return [$('#upassword').val(), 'Your two passwords do not match, please try again.'];
					}
				},
				'#zipCode':{ test:happy.zipCode }
			}
		});
		$('#editAddressForm').isHappy({
			fields:{
				'#name':{test:happy.addressName},
				'#zipCode':{test:happy.zipCode},
				'#fieldState': { test: happy.USState},
				'#phone':{test:happy.USPhone}
			}
		});
		
		$('#forgetPasswordForm').isHappy({
			fields:{
				'#email':{test:happy.email}
			}
		});
		$('#resetPasswordForm').isHappy({
			fields:{
				'#password' : 	{test:happy.passwordlegacysignin},
				'#newPassword' :{test:happy.password},
				'#newPasswordConfirm':{
					required:	['sometimes', 'Your two passwords do not match, please try again.'],
					test:happy.equal,
					arg:function () {
						return [$('#newPassword').val(), 'Your two passwords do not match, please try again.'];
					}
				}
			}
		});
		$('#resetForgotPasswordForm').isHappy({
			fields:{
				'#newPassword' : 	{test:happy.password},
				'#verifyNewPassword':{
					required:	['sometimes', 'Your two passwords do not match, please try again.'],
					test:happy.equal,
					arg:function () {
						return [$('#newPassword').val(), 'Your two passwords do not match, please try again.'];
					}
				}
			}
		});
		$('#promotionCodeForm').isHappy({
			fields:{
				'#promotionCode':{test:happy.promotionCode}
			}
		});
		$('#addAdressForm').isHappy({
			fields:{
				'#name':{test:happy.addressName},
				'#fromCity':{test: happy.name, arg: 'Please enter only letters for City.'},
				'#zipCode':	{test: happy.zipCode},
				'#fieldState': { test: happy.USState},
				'#phone':	{test: happy.USPhone}
			}
		});
		
		$('#contactInfoForm').isHappy({
			fields: {
				'#phone':	{test: happy.USPhone},
				'#lastName':{test: happy.name},
				'#email': {test: happy.email}
			}
		});
		
		$('#postZipCodeForm').isHappy({
			fields: {
				'#zipCode':{test: happy.zipCode}
			}
		});
		$('#searchForm').isHappy();
		
		//baby registry
		$("#babyInfoForm").isHappy({
			fields:{
				'#dueDate':$("#dueDate").attr("readonly")=="readonly"?{}:$("#dueDate").attr("hasModifiedExpectedDate")=="false"?{test:happy.date}:{test:happy.afterNowDate}
			}
		});
		
		$("#aboutYouForm").isHappy({
			fields:{
				'#name':{test:happy.addressName},
				'#city':{test: happy.name, arg: 'Please enter only letters for City.'},
				'#zipCode':{test:happy.zipCode},
				'#state': { test: happy.USState},
				'#phone':{test:happy.USPhone}
			}
		});
		$("#createNewAddress").isHappy({
			fields:{
				'#name':{test:happy.addressName},
				'#city':{test: happy.name, arg: 'Please enter only letters for City.'},
				'#zipCode':{test:happy.zipCode},
				'#state': { test: happy.USState},
				'#phone':{test:happy.USPhone}
			}
		});
		
		$("#creditCardForm").isHappy({
			fields:{
				'#securityCode'	: { test:happy.securityCode}
			}
		});
		
		;(function($){
			var $showMoreBtn=$("#show-more-btn"),showMore={},doDataKey="doing",$container=$($showMoreBtn.data("container")),loadInfo=$showMoreBtn.data("load-info");
			if(!$showMoreBtn.length)return;
			var loading = loadingBox($showMoreBtn.parent(),{info:loadInfo,css:{background:'rgba(255,255,255,1)'}});
			$.extend(showMore,{
					load:function(){
						var index = $showMoreBtn.data("index")*1,total=$showMoreBtn.data("total")*1;
						if(index>=total||$showMoreBtn.data(doDataKey))return;
						loading.show();
						$showMoreBtn.data("index",index+1);
						$showMoreBtn.data(doDataKey,true);
						$.ajax({
							type:		'GET',
							url:		$showMoreBtn.data("url"),
							contentType:"application/json", 
							dataType:	"html",
							data:		{"index":index},
							success:	function(data){
											if(!data||!data.trim||!data.trim().indexOf("<li")==0){return;}
											data&&$container.append(data);
											if(index==total-1){
												$showMoreBtn.hide();
											}
										},
							complete:   function(){showMore.end();}
						});
					},
					end:function(){
						var index = $showMoreBtn.data("index")*1,total=$showMoreBtn.data("total")*1;
						$showMoreBtn.data(doDataKey,false);
						if(index%3==0)
							loading.close();
						if(index>=total){$(window).off("scroll",scroll);$showMoreBtn.remove();loading.close();}
					}
			});
			$showMoreBtn.on('tap click',function(e){
			     $showMoreBtn.fastButton({isfastBtn:true});
			});
			$showMoreBtn.on(tap_click,showMore.load);
			var scroll=function(){
				var index = $showMoreBtn.data("index")*1,total=$showMoreBtn.data("total")*1,showHeight=$container.children().eq(0).height();
				if(index%3==0)return;
				var pageNaviTop=$(".pageNavi").offset().top,$window=$(window),top=$window.scrollTop()+$window.height();
				if(pageNaviTop-showHeight<top)showMore.load();
			}
			$(window).on("scroll",scroll);
		})($);
	});
	
	
	//QS-39444 CO18196:[mobile-web] Amazon fraud check pixel widget
	var userLoginForm = $('#userLoginForm');
	var registerForm = $('#registerForm');
	if((userLoginForm.length != 0) || (registerForm.length != 0)){
		var script = document.createElement("script");
		script.id = 'fwcim-script';
		script.src = 'https://images-na.ssl-images-amazon.com/images/G/01/x-locale/common/login/fwcim.js';
		var $script = $(script);
		$script.bind('load', function(){
			if(userLoginForm.length != 0){
				fwcim.profile('userLoginForm');					
			}else{
				fwcim.profile('registerForm');
			}
		});
		$("head").append(script);
	}
	
	updateVisitorInfo();
	
	$(".dropDown").dropDownSelect();
	
	var babyInfoForm=$("#babyInfoForm");
	var multiplesBabyInfo=babyInfoForm.find('#multiplesBabyInfo');
	if($('input[name=babyInfo][checked]').val()=="multiples"){
		multiplesBabyInfo.show();
	};
	if(multiplesBabyInfo.length){
		babyInfoForm.find('input[type=radio]').bind("change",function(){
			multiplesBabyInfo.hide();
			var $multiples=$("#multiples");
			if($multiples.val()=="multiples"&&$multiples.parent().parent().hasClass("checked"))multiplesBabyInfo.show();
		});
		multiplesBabyInfo.find(".qtySetting").numBox();
	}
	
})(Zepto);	

function updateVisitorInfo(){
	//asynchronous get cart quantity
	var mainDiv = $('#main-nav'),
		$cart=mainDiv.find('a.iconCart'),
		$cartText=$cart.find('b'),
		visitorServer=$cart.data('visitor-url'),
		defaultData={cartQuantity:0,hasBabyRegistry:false},
		$addToMyBabyRegistryBtn=$("#addToMyBabyRegistryBtn"),
		requestData={"_":new Date().getTime(),returnBabyRegistry:!!$addToMyBabyRegistryBtn.length};
	$.ajax({
		type:		'GET',
		url:		 visitorServer,
		dataType:   'json',
		data :		requestData,
		success:	function(data){
			updateView(data);
		},
		error: 		function(){
			updateView();
		}
	});
	function updateView(data){
		data=$.extend({},defaultData,data||{});
		$cartText.text(data.cartQuantity);
		if($addToMyBabyRegistryBtn.length&&data.hasBabyRegistry){
			$addToMyBabyRegistryBtn.show();
}
	}
}
var getCartQtyAndPriceCount=updateVisitorInfo;
var getNavigationCustomName=function(){};
var reloadSnapToolbar=function(){};

function formValueInit(form, item, elements) {	
	var inputs = elements ? form.find(elements) : form.find('input[type="hidden"]');
    if (item.is('form')) {
        inputs.each(function () {
            var name = $(this).attr('name');
            var valueEle = item.find('input[name="' + name + '"]');
			var value = '';
            if( valueEle.length ){
				if( valueEle.attr('type') == 'radio' ){
					value = valueEle.filter(':checked').val();
				} else if( valueEle.attr('type') == 'checkbox' ){
					value = [];
					valueEle.filter(':checked').each(function(){
						value[value.length] = $(this).val();
					});
					value = value.join(',');
				} else {
					value = valueEle.val();
				}
				$(this).val(value);
			}
        });
    } else {
        inputs.each(function () {
            var valueEle = item.find('.' + $(this).attr('name'));
            if (valueEle.length) {
                $(this).val($.trim(valueEle.text()));
            }
        });
    }
}

function fm_optimizeInput() {	// fix iOs6 bug
    $("input[placeholder],textarea[placeholder]").each(function () {
        var tmpText = $(this).attr("placeholder");
        if (tmpText != "") {
            $(this).attr("placeholder", "").attr("placeholder", tmpText);
        }
    })
}

function happyMethods() {
	var happy = {
        USPhone:function (val) {
            return [/^\(?([2-9]{1}[0-9]{2})\)?[\- ]?\d{3}[\- ]?\d{4}$/.test(val), 'Please enter a valid phone number.'];
        },
		USState: function(val){
			var states = /(AA|AC|AE|AK|AL|AP|AR|AS|AZ|CA|CO|CT|DC|DE|FL|FM|GA|GU|HI|IA|ID|IL|IN|KS|KY|LA|MA|MD|ME|MH|MI|MN|MO|MP|MS|MT|NC|ND|NE|NH|NJ|NM|NV|NY|OH|OK|OR|PA|PR|PW|RI|SC|SD|TN|TX|UT|VA|VI|VT|WA|WI|WV|WY|ZZ)/i;
			//var states = AA-AC-AE-AK-AL-AP-AR-AS-AZ-CA-CO-CT-DC-DE-FL-FM-GA-GU-HI-IA-ID-IL-IN-KS-KY-LA-MA-MD-ME-MH-MI-MN-MO-MP-MS-MT-NC-ND-NE-NH-NJ-NM-NV-NY-OH-OK-OR-PA-PR-PW-RI-SC-SD-TN-TX-UT-VA-VI-VT-WA-WI-WV-WY-ZZ;
			return [ val.length == 2 && states.test($.trim(val)), 'Please enter a state.'];
		},
        date:function (val) { // matches mm/dd/yyyy (requires leading 0's (which may be a bit silly, what do you think?)
            return [/^(?:0[1-9]|1[0-2])\/(?:0[1-9]|[12][0-9]|3[01])\/(?:\d{4})$/.test(val), 'Date is invalid'];
        },
        cardDate:function (val) {    // MM/YYYY
        	if(val.length==5){
        		var s=(new Date()).getFullYear().toString();
        		val=val.substring(0,3)+s.substring(0,2)+val.split('/')[1];
        		$("#expirationDate").val(val);
        	}
            return [/^((0[1-9])|(1[0-2]))\/(\d{4})$/.test(val) && parseInt(val.split('/')[1]) > 2012, 'Please enter a valid expiration date. (MM/YYYY)|(MM/YY)'];
        },
        cardNumber:function (val) {
            return [/^\d{13,16}$/.test(val), 'Please make sure that your credit card number is 13-16 digits.'];
        },
        zipCode:function (val) {
            return [/^\d{5}$/.test(val), 'Please enter a zipcode.'];
        },
        addressName:function(val){
        	return [/^[A-Za-z \-\.']{1,31}$/.test(val), 'Please enter a valid name.'];
        },
        securityCode:function(val){
        	return [/^\d{3,4}$/.test(val), 'Please enter a valid security code.'];
        },
        email:function (val) {
            return [/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(val), 'Please enter a valid email address.'];
        },
		number:function(val, len_msg){
			return [val.length == len_msg[0] && !isNaN(parseInt(val)) && Number(val) == parseInt(val), len_msg[1] || 'Please enter a number'];
		},
		name:function(val, msg){
			return [/^[\w -]*$/.test(val), msg ? msg : 'Please enter only letters.']
		},
        eqLength:function (val, length) {
            return [val.length == length, 'The length should be equal to ' + length];
        },
        equal:function (val1, val2) {
            var msg = typeof val2[1] != 'undefined' ? val2[1] : 'Doesn\'t match';
            return [(val1 == val2[0]), msg];
        },
        minLength:function (val, length) {
            return [val.length >= length, 'Min length: ' + length];
        },
        maxLength:function (val, length) {
            return [val.length <= length, 'Max length: ' + length];
        },
        password:function (val) {
			var result = false;
			if( val.length >= 6 && val.length <= 20) {
				var charArray = val.split('');
				for( var i = 0; i < charArray.length; i++ ){
					if( isLetter(charArray[i]) ) {
						result = result === 'hasNumber' ? true : 'hasLetter';
					} else if( !isNaN(parseInt(charArray[i])) ) {
						result = result === 'hasLetter' ? true : 'hasNumber';
					}
					if ( result === true ) break;
				}
			}
            return [result == true, 'Passwords must contain at least 6 characters, including a combination of numbers and letters.']
        },
         passwordlegacysignin:function (val) {
			var result = false;
			if( $.trim(val).length >= 1) {
				result = true;
			}
            return [result == true, 'Please enter a password.']
        },
        promotionCode:function(val){
        	return [/^[a-zA-Z0-9\ \'\%\-\_\$\&\.\!]+$/.test(val), 'Please enter a valid promotionCode.'];
        },
        afterNowDate:function(val){
        	var testDate=happy.date(val);
        	if(!testDate[0]) return testDate;
        	var now = new Date(),dueDate=null;
        	now=new Date(now.getFullYear(),now.getMonth(),now.getDate());
        	var dueDates=/([\d]{2})\/([\d]{2})\/([\d]{4})/.exec(val);
        	if(dueDates&&dueDates.length==4){
            	var dueDate=new Date(dueDates[3]*1,dueDates[1]*1-1,dueDates[2]*1);
        }
        	return [dueDate&&now<=dueDate, 'The Due Date must be greater than or equal to now.'];;
    }
    };
	return happy;
}

function isLetter(a){
	return ( a >= 'a' && a <= 'z' ) || ( a >= 'A' && a <= 'Z' );
}

function browserInfo() {
    var u = navigator.userAgent;
    return {
        trident:u.indexOf('Trident') > -1, //IE
        presto:u.indexOf('Presto') > -1, //opera
        webKit:u.indexOf('AppleWebKit') > -1,
        gecko:u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,
        mobile:!!u.match(/AppleWebKit.*Mobile.*/),
        ios:!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
        ios6_0:!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) && (u.indexOf('6.0') > -1),
        android:u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
		iPhone:u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1,
        iPad:u.indexOf('iPad') > -1,
        webApp:u.indexOf('Safari') == -1
    };
}
function createData(form){
	var data = {};
    form.find('input').each(function(){
        var name = $(this).attr('name');
        var type = $(this).attr('type');
        if( name && type != 'submit' && type != 'reset' ){
            if( type == 'radio' ) {
                if( $(this).is(':checked') ){
                    data[name] = $(this).val();
                }
            } else if( type == 'checkbox' ) {
                data[name] = data[name].length ? data[name] : [];
                if( $(this).is(':checked') ){
                    data[name][data[name].length] =  $(this).val();
                }
            } else {
                data[name] = $(this).val();
            }
        }
    });
	form.find('select').each(function(){
		var name = $(this).attr('name');
		if( name ){
			data[name] = $(this).val();
		}
	});
	form.find('textarea').each(function(){
		var name = $(this).attr('name');
		if( name ){
			data[name] = $(this).val();
		}
	});
	return data;
}

function openHopup(left,top,width,height,bgImg,pageTitle,openPage){
	window.open(openPage);
}

function loadingBox(block,config){
	var defaultConfig={info:'',css:{}};
	config=$.extend({},defaultConfig,config||{});
	if(! block.find('.loadingBox').length){
		block.css({position: 'relative'});
		block.append('<div class="loadingBox"><div class="loadWrapBox"><span data-icon="&#xe00c" class="loadIcon"></span><p>'+config.info+'</p></div></div>');		
	}
	var loadingBox = block.find('.loadingBox');
	var loadWrapBox= block.find('.loadWrapBox');
	

	var css=$.extend({ width: '100%', height: '100%', top:0, left:0, position:'absolute'},config.css);
	loadingBox.css(css).show();
	
	var loadWrapLeft = '-'+loadWrapBox.width()/2+'px';
		loadWrapTop  = '-'+loadWrapBox.height()/2+'px';
	loadWrapBox.css({marginLeft:loadWrapLeft,marginTop:loadWrapTop});
	
	return {
		mseeage:	function(html, className){
			var htmlBox = loadingBox.find('p');
			htmlBox.attr('class', className).html(html).css({marginLeft: parseInt(htmlBox.innerWidth())/-2}).show();
		},
		close:	function(){
			loadingBox.hide();
		},
		show:function(){
			loadingBox.show();
		}
	}
}

function cdnUrl(path){
	if(currentSite&&currentSite.cdnServers&&"https:"!=document.location.protocol){
		var servers=currentSite.cdnServers.split(","),server=servers[parseInt(servers.length*Math.random())];
		return "http://"+server+path;
	}
	return path;
}

//pdp--->init Promotion Message
function initMoreAndLess(){
	$(".discounterList li[class*=promotion]").each(function(){
		var limitedHeight =getLessHeight($(this));
		if($(this).height() > limitedHeight){
			var currSpan=$(this).find("span");
			$(this).find("a").remove();
			fillMoreText(currSpan);
			cutCountMoreText($(this));
			$(this).html($(this).html() + " <a href='javascript:void(0);' class='linkMoreMsg' onclick='toggleMoreAndLess(this,\"open\")'>more</a>");
		}
	});
}

function cutCountMoreText(currLi){
	var limitedHeight=getLessHeight($(currLi));
	var currSpan=$(currLi).find("span");
	while ($(currLi).height() > limitedHeight) {
		if ($(currLi).height() <= limitedHeight) {
			break;
		}
	    var text =$.trim(currSpan.html().replace(" ...", ""));
        text = text.substr(0, text.lastIndexOf(" "));
        currSpan.html(text + " ...");
	}
}

function getLessHeight(currLi){
	var t=$(currLi).clone(true).addClass("ellipOverflow");
	$(currLi).after(t);
	var currHeight=t.height();
	t.remove();
	return currHeight;
}

function fillMoreText(currSpan){
	$(currSpan).text($(currSpan).attr("value"));
}

//pdp--->Show/Hide Promo Message
function toggleMoreAndLess(link,order){
	var row=$(link).parent();
	if(order=='open'){
		fillMoreText(row.find("span"));
		$(link).attr({"class":'linkLessMsg',"onclick":'toggleMoreAndLess(this,\"close\");'}).text("less");
	}
	else{
		cutCountMoreText(row);
		$(link).attr({"class":'linkMoreMsg',"onclick":'toggleMoreAndLess(this,\"open\");'}).text("more");
	}
}


//pdp--->init PDP SlideUp
function initDetailSlider(){
	var moreOption=$(".moreOption");
	moreOption.attr("heightLimit",moreOption.find("dd").length*61);
}

;(function($){
	(typeof _ready!="undefined")&&$(function(){
		$.each(_ready,function(){
			(typeof this=="function")&&this.call(window);
		});
	});
	initMoreAndLess();
    initDetailSlider();
	$(window).bind('orientationchange', function(e){
		initMoreAndLess();
	});
})(Zepto);	

