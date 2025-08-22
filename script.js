// Tab switching functionality
function showSection(sectionId) {
	// Hide all sections
	const sections = document.querySelectorAll('.section');
	sections.forEach(function(section) {
		section.classList.remove('active');
	});

	// Remove active class from all nav buttons
	const navButtons = document.querySelectorAll('.nav-btn');
	navButtons.forEach(function(btn) {
		btn.classList.remove('active');
	});

	// Show selected section
	const selectedSection = document.getElementById(sectionId);
	if (selectedSection) {
		selectedSection.classList.add('active');
	}

	// Determine which nav button to activate
	let clickedButton = null;
	var activeEl = document.activeElement;
	if (activeEl && activeEl.classList && activeEl.classList.contains('nav-btn')) {
		clickedButton = activeEl;
	} else {
		// Fallback by order: [0] -> terms, [1] -> privacy
		const buttonsArray = Array.prototype.slice.call(navButtons);
		if (sectionId === 'terms' && buttonsArray[0]) {
			clickedButton = buttonsArray[0];
		}
		if (sectionId === 'privacy' && buttonsArray[1]) {
			clickedButton = buttonsArray[1];
		}
	}
	if (clickedButton) {
		clickedButton.classList.add('active');
	}

	// Update URL when user clicks a nav button
	if (activeEl && activeEl.classList && activeEl.classList.contains('nav-btn') && window.history && window.history.pushState) {
		const newUrl = buildUrlForSection(sectionId);
		window.history.pushState({ sectionId: sectionId }, '', newUrl);
	}
}

// Build a URL for the given section, respecting GitHub Pages base path
function buildUrlForSection(sectionId) {
	// Use relative links so it works on both user and project pages
	if (sectionId === 'privacy') {
		return './privacy';
	}
	return './';
}

// Decide which section to show based on the current path
function getSectionFromPath(pathname) {
	const parts = pathname.split('/').filter(function(part) { return part.length > 0; });
	const last = parts[parts.length - 1] || '';
	if (last.toLowerCase() === 'privacy') {
		return 'privacy';
	}
	// Treat anything else as terms (root or /terms)
	return 'terms';
}

function applyRoute(pathname) {
	const sectionId = getSectionFromPath(pathname);
	showSection(sectionId);
}

// Initialize routing and enhance UX
document.addEventListener('DOMContentLoaded', function() {
	// Support GitHub Pages SPA redirect: if ?p=/privacy is present, rewrite URL and apply route
	var params = new URLSearchParams(window.location.search);
	var redirectPath = params.get('p');
	if (redirectPath) {
		try {
			var decoded = decodeURIComponent(redirectPath);
			// Replace the URL to the intended path without reloading
			if (window.history && window.history.replaceState) {
				window.history.replaceState({}, '', decoded);
			}
			applyRoute(decoded);
		} catch (e) {
			applyRoute(window.location.pathname);
		}
	} else {
		applyRoute(window.location.pathname);
	}

	// Handle browser navigation
	window.addEventListener('popstate', function() {
		applyRoute(window.location.pathname);
	});

	// Add smooth scrolling for better UX
	document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
		anchor.addEventListener('click', function(e) {
			e.preventDefault();
			var target = document.querySelector(this.getAttribute('href'));
			if (target) {
				target.scrollIntoView({
					behavior: 'smooth',
					block: 'start'
				});
			}
		});
	});
});