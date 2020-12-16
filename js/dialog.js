/**
 * Modal windows (dialogs).
 */

// ...

let dialogs = [],
	overlay = null;

class Dialog {
	static all() {
		return dialogs;
	}

	static last() {
		return dialogs[dialogs.length - 1];
	}

	/**
	 * @returns {jQuery}|null
	 */
	static get overlay() {
		return overlay;
	}

	/**
	 * @param {jQuery} value
	 */
	static set overlay(value) {
		overlay = value;
	}

	constructor(element, events, options) {
		let defaultOptions = {
				width  : null,
				content: '',
				url    : false,
				data   : {},
				close  : true
			},
			defaultEvents = {
				onCreate : () => {},
				onClose  : () => {},
				onShow   : () => {},
				onDestroy: () => {},
			};

		this.NAMESPACE = 'dialog';

		this.isShown = false;

		this.options = $.extend({}, defaultOptions, options);
		this.events = $.extend({}, defaultEvents, events);

		this.$document = $(document);
		this.$window = $(window);
		this.body = $('body');
		this.inputs = null;

		if (typeof element === 'object') {
			this.element = element;
		} else if (typeof element === 'string') {
			this.element = $(element);
		} else {
			this.element = null;
		}

		// Create a dialog
		this.create();
	}

	// ...

	hideOverlay() {
		Dialog.overlay
			.one(SH.transitionEnd, () => {
				Dialog.overlay.addClass('hide');

				// Unlock the body
				this.body
					.css('width', 'auto')
					.removeClass('dialog-scroll-lock');

				// Enable only those inputs that were disabled
				this.inputs.each((i, el) => {
					let element = $(el),
						disabled = element.data('dialog-already-disabled') || false;

					if (!disabled) {
						element.prop('disabled', false);
					}
				});

				this.$window.off('resize.' + this.NAMESPACE);
			})
			.removeClass('appeared');
	}

	setEvents() {
		this.$document.on('keyup.' + this.NAMESPACE, event => {
			if (event.keyCode === 27) {
				// Close the dialog by pressing `ESC`
				this.close();
			}
		});
	}

	resize() {
		this.body.css('width', this.$window.outerWidth(true) - $.scrollMeasure() + 'px');
	}

	// ...
}

export default Dialog;
