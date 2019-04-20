$(document).ready(function () {
	$('h2.toggler-closed').next().hide();
	$('h2.toggler').click(function () {
		if ($(this).hasClass('toggler-closed')) {
			$(this).next().slideDown();
			$(this).removeClass('toggler-closed').addClass('toggler-open');
		} else {
			$(this).next().slideUp();
			$(this).removeClass('toggler-open').addClass('toggler-closed');
		}
	});
	
	$('a.popup').click(function() {
		window.open($(this).attr('href'));
		return false;
	});
	
	$('#show-sections').click(function () {
        var $this = $(this);
        if ($this.hasClass('opened')) {
            $('.toggler').removeClass('toggler-open toggler-closed').addClass('toggler-closed').next().hide();
            $this.removeClass('opened').text('Show all sections');          
        } else {
            $('.toggler').removeClass('toggler-open toggler-closed').addClass('toggler-open').next().show();
            $this.addClass('opened').text('Hide all sections');
        }
    });
});