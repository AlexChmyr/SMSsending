
$(document).ready(function() {

	// поп-ап форма для ввода текста СМС
	$('body').append('<div class="newLead_popup" style="display: none; position: fixed; background-color: rgba(0, 0, 0, 0.6); top: 0; width: 100%; height: 100%; z-index: 999; ">' +
		'<div style="z-index: 2590; position: fixed; display: block; top: 50%; left: 50%;margin: -132px 0 0 -174px;">' +
		'<table class="popup-window popup-window-titlebar" cellspacing="0">' +
		'<tbody>' +
		'<tr class="popup-window-top-row">' +
		'<td class="popup-window-left-column">' +
		'<div class="popup-window-left-spacer"></div>' +
		'</td>' +
		'<td class="popup-window-center-column" style="cursor: move;">' +
		'<div class="popup-window-titlebar">'+
		'<span>'+
		'<span class="task-detail-popup-title">Окно отправки SMS</span>'+
		'</span>' +
		'</div>' +
		'</td>' +
		'<td class="popup-window-right-column">' +
		'<div class="popup-window-right-spacer"></div>' +
		'</td>' +
		'</tr>'+
		'<tr class="popup-window-content-row">' +
		'<td class="popup-window-left-column"></td>' +
		'<td class="popup-window-center-column">' +
		'<div class="popup-window-content">'+
		'<div class="task-quick-create-popup" style="display: block;font-weight: 700;font-size: 16px;width: 320px;">' +
		'<div class="webform task-webform">'+

		'<div style="height: 255px;">'+
		'<div style="width: 220px;margin: 5px;margin-left: auto;margin-right: auto;">'+
		'<span style="font-size: 20px">+ </span><input id="phonesms" type="tel" placeholder="телефон" value="'+$('.crm-item-tel-num').first().text()+'" style="display:inline; width: 198px;">'+
		'</div>'+
		'<div style="width: 220px;margin: 5px;margin-left: auto;margin-right: auto;">'+
		'<span style="font-size: 15px">Шаблон  </span>'+
		'<select id="selectRoot" name="select" size="1" style="width:160px">'+
		'<option selected value="0">Не выбран...</option>'+
		'</select>'+
		'</div>'+
		'<div style="width: 220px;margin-top: 11px;margin-left: auto;margin-right: auto; height: 28px;">'+
		'<textarea id ="textsms" placeholder="текст" style="padding-left: 15px;height: 152px;width: 205px;"></textarea>'+
		'</div>'+
		'</div>'+

		'<div class="webform-buttons task-buttons">'+
		'<a id="task-submit-button" class="webform-button webform-button-create">'+
		'<span class="webform-button-left"></span>'+
		'<span class="webform-button-text">Отправить SMS</span>'+
		'<span class="webform-button-right"></span>'+
		'</a>'+
		'<a class="webform-button-link webform-button-link-cancel">Отмена'+
		'</a>'+
		'</div>'+
		'</div>'+
		'</div>'+
		'</div>'+
		'</td>'+
		'<td class="popup-window-right-column"></td>'+
		'</tr>'+
		'<tr class="popup-window-bottom-row">'+
		'<td class="popup-window-left-column"></td>'+
		'<td class="popup-window-center-column"></td>'+
		'<td class="popup-window-right-column"></td>'+
		'</tr>'+
		'</tbody>'+
		'</table>'+
		'<a class="popup-window-close-icon popup-window-titlebar-close-icon" href="" style="right: 12px; top: 10px;"></a>'+
		'</div>'+
		'</div>');

	// показать окно
	$('.crm-activity-command-add-sms').on('click', function(){
		$('.newLead_popup').show();
	});

	// скрыть
	$(".popup-window-close-icon").on("click", function()
	{
		$(".newLead_popup").hide();
		return false;
	});

	$(".webform-button-link-cancel").on("click", function()
	{
		$(".newLead_popup").hide();
		return false;
	});

	$('.newLead_popup').on('click', function(e)
	{
		if ($(e.target).is('.newLead_popup'))
		{
			$('.newLead_popup').hide();
		}
		else
		{
			e.stopPropagation();
		}
	});

	// Отправка СМС
	$('#task-submit-button').on('click', function(e){
		if ($(e.target).is('#task-submit-button, .webform-button-text')){
			var text = $('#textsms').val();
			var phone = $('#phonesms').val();
			var entity = window.location.href.split('/')[4];
			var id = window.location.href.split('/')[6];
			var data = "phone="+phone+"&text="+text+"&entity="+entity+"&id="+id;

			$.ajax({
				type: "POST",
				url: '//crm.voda.com.ua/ajax/sms.ajax.php',
				data: data,
				success: function(data){
					alert('SMS: '+data);
				},
				error: function (request, status, error) {
					alert('SMS не отправлено: '+error);
				}
			});
			$(".newLead_popup").hide();
			e.stopPropagation();
		}
		else {
			e.stopPropagation();
		}
	});

});

// ++ Шаблоны СМС
// Загрузка названий шаблонов
$.ajax({
	type: "POST",
	url: '//crm.voda.com.ua/ajax/snippers.ajax.php',
	data: "infoType=labels",
	success: function(data){
		$("#selectRoot").append(data);
	}

});

// Загрузка тестов шаблонов
$.ajax({
	type: "POST",
	url: '//crm.voda.com.ua/ajax/snippers.ajax.php',
	data: "infoType=contents",
	success: function(data){
		$(".newLead_popup").append(data);
	}
});

// Переключение
$('#selectRoot').change(function(){

	var snpname = $('#selectRoot :selected').val();
	var snp = $('[snpname = '+snpname+']');

	if(snp.length){
		$('#textsms').val("");
		$('#textsms').val(snp.html());
	}
});

// -- Шаблоны СМС


