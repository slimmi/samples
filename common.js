// Common bootstrap file
((bootstrap) => {
	bootstrap(window.jQuery, window, document);
})(($, window, document) => {
	let $document = $(document),
		$window = $(window),
		$html = $('html, body');
	
	$document.ready(() => {
		// Back to top
		let $upButton = $('.up-btn'),
			toggleToTopButton = () => {
				let scrollTop = $window.scrollTop(),
					height = $window.height(),
					bottomTarget = $upButton.data('bottom-target') ? $($upButton.data('bottom-target')) : null,
					bottomTargetOffset = bottomTarget ? bottomTarget.offset().top : 0,
					offsetBottom = $window.scrollTop() + $window.height() - bottomTargetOffset;

				if (scrollTop >= height) {
					if (!$upButton.hasClass('show')) {
						$upButton.addClass('show');
					}

					if (bottomTarget) {
						if (offsetBottom >= 0) {
							$upButton.addClass('hide');
						} else {
							$upButton.removeClass('hide');
						}
					}
				} else {
					if ($upButton.hasClass('show')) {
						$upButton.removeClass('show');
					}
				}
			};

		$upButton.on('click', (e) => {
			let element = $(e.currentTarget),
				target = element.data('target') ? $(element.data('target')) : null;

			e.preventDefault();

			$html.animate({
				scrollTop: target ? target.offset().top : 0
			}, 250);
		});

		toggleToTopButton();

		$window.on('scroll resize', () => {
			toggleToTopButton();
		});
	});
});
