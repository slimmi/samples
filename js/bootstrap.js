/**
 * Common bootstrap file
 */
import {MDCTemporaryDrawer} from '@material/drawer';
import {MDCRipple} from '@material/ripple';
import {MDCTextField} from '@material/textfield';
import {MDCSelect} from '@material/select';
import {MDCSwitch} from '@material/switch';
import {Corner, MDCMenu} from '@material/menu';

// ...

window.addEventListener('load', () => {
	// Show page
	document.body.classList.remove('page--loading');
	document.body.style.opacity = 1;

	// Drawer
	const MOBILE_BREAKPOINT = 1200,
		drawerElement = document.getElementById('drawer'),
		drawerToggle = document.getElementById('menu-toggle');

	if (drawerElement) {
		const drawer = new MDCTemporaryDrawer(drawerElement);

		if (drawerToggle) {
			drawerToggle.addEventListener('click', () => drawer.open = true);
		}

		window.addEventListener('resize', () => {
			if (window.innerWidth > MOBILE_BREAKPOINT) {
				drawer.open = false;
			}
		});
	}

	// Ripples
	const ripples = document.querySelectorAll('.mdc-ripple-surface');

	[...ripples].forEach(element => {
		const ripple = new MDCRipple(element);

		if (element.classList.contains('mdc-icon-button')) {
			ripple.unbounded = true;
		}
	});

	// Expand panels
	const expansionPanelToggles = document.querySelectorAll('[data-expansion-target]');

	[...expansionPanelToggles].forEach(toggleElement => {
		const expansionPanels = document.querySelectorAll(toggleElement.getAttribute('data-expansion-target'));

		// Click event
		toggleElement.addEventListener('click', () => {
			[...expansionPanels].forEach(expansionPanel => {
				const container = expansionPanel.querySelector('.expansion-panel__container'),
					content = expansionPanel.querySelector('.expansion-panel__content');

				let isExpanded = expansionPanel.getAttribute('aria-expanded') === 'true';

				if (isExpanded) {
					container.style.height = `${content.clientHeight}px`;

					// Reflow
					container.offsetHeight;

					container.style.height = '0px';

					container.addEventListener(detectTransitionEndEvent(), () => {
						container.style.height = '';

						expansionPanel.setAttribute('aria-expanded', false);
					}, {
						once: true
					});
				} else {
					expansionPanel.setAttribute('aria-expanded', true);

					container.style.height = '0px';

					// Reflow
					container.offsetHeight;

					container.style.height = `${content.clientHeight}px`;

					container.addEventListener(detectTransitionEndEvent(), () => {
						container.style.height = '';
					}, {
						once: true
					});
				}
			});
		});
	});

	// ...

	// Collapse page
	const collapsePageButton = document.querySelector('.drawer__button-collapse');

	if (localStorage) {
		if (localStorage.getItem('page-collapsed') === 'true') {
			document.body.classList.add('page--collapsed');
			collapsePageButton.innerText = 'arrow_forward';
		} else {
			document.body.classList.remove('page--collapsed');
			collapsePageButton.innerText = 'arrow_back';
		}
	}

	if (collapsePageButton) {
		collapsePageButton.addEventListener('click', () => {
			if (localStorage) {
				if (localStorage.getItem('page-collapsed') === 'true') {
					document.body.classList.remove('page--collapsed');
					collapsePageButton.innerText = 'arrow_back';
					localStorage.setItem('page-collapsed', false);
				} else {
					document.body.classList.add('page--collapsed');
					collapsePageButton.innerText = 'arrow_forward';
					localStorage.setItem('page-collapsed', true);
				}
			}
		});
	}
});
