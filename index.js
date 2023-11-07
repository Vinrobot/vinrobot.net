$(document).ready(function() {
	var a = $(".hero-content"), b = $(".bxslider li");
	$(window).resize(function() {
		var wHeight = $(this).height();
		a.css("margin-top", (wHeight - a.height()) / 2 + "px");
		b.css("height", wHeight + 20 + "px");
	}).resize();
	$("#hero").parallax();
});
