$(document).ready(function() {
	getMinutes();
});

$('.modal').on('shown.bs.modal', function() {
	$(this).find('input').focus();
});

function getMinutes() {
	$.ajax({
		url: '/minutes',
		type: 'GET',
		dataType: 'json'
	}).done(function(data) {
		$("#remaining-minutes").text(data);
		console.log(data);
	}).fail(function(err) {
		console.log(err);
	});
}

$("#use").submit(function(e) {
	e.preventDefault();

	$.ajax({
		url: '/minutes',
		type: 'POST',
		dataType: 'json',
		data: $(this).serialize()
	}).done(function(data) {
		$("#use-modal").modal('hide');
		$("#remaining-minutes").text(data);
		console.log(data);
	}).fail(function(xhr, status, err) {
		console.log("caught", xhr);
		$("#use-error").text(xhr.responseText);
		$("#use-alert").show();

		setTimeout(function() {
			$("#use-alert").hide();
		}, 5000);
	}).always(function() {
		$("#minutes").val("");
	});
});

$("#voucher").submit(function(e) {
	e.preventDefault();

	$.ajax({
		url: '/code',
		type: 'POST',
		data: $(this).serialize(),
		dataType: 'json'
	}).done(function(data) {
		console.log(data);
		$("#voucher-modal").modal('hide');
		$("#remaining-minutes").text(data);
	}).fail(function(xhr, status, err) {
		$("#voucher-error").text(xhr.responseText);
		$("#voucher-alert").show();
		setTimeout(function() {
			$("#voucher-alert").hide();
		}, 5000);
	}).always(function() {
		$("#code").val("");
	});
});
