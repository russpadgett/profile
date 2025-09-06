/**
 * Common functionality for Russell Padgett's portfolio website
 */

// Load common components
async function loadComponent(elementId, componentPath) {
	try {
		const response = await fetch(componentPath);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const html = await response.text();
		document.getElementById(elementId).innerHTML = html;
		return true;
	} catch (error) {
		console.error(`Error loading component ${componentPath}:`, error);
		return false;
	}
}

// Set up navigation active state
function setActiveNavigation(currentPage) {
	// Remove active class from all nav links
	document.querySelectorAll('.nav-link').forEach((link) => {
		link.classList.remove('active');
	});

	// Add active class to current page
	if (currentPage) {
		const currentLink = document.querySelector(`[data-page="${currentPage}"]`);
		if (currentLink) {
			currentLink.classList.add('active');
		}
	}
}

// Fix navigation links based on current path
function fixNavigationPaths() {
	const currentPath = window.location.pathname;
	const isInSubfolder = currentPath !== '/' && currentPath.includes('/') && !currentPath.endsWith('index.html');

	// Update brand link
	const brandLink = document.getElementById('brand-link');
	if (brandLink) {
		brandLink.href = isInSubfolder ? '../../' : './';
	}

	// Update navigation links
	document.querySelectorAll('.nav-link[data-page]').forEach((link) => {
		const page = link.getAttribute('data-page');
		// If we're at the root, navigate to pages subdirectory
		// If we're in a page subdirectory, navigate to sibling directories
		link.href = isInSubfolder ? `../${page}/` : `./pages/${page}/`;
	});
}

// Set current year in footer
function setCurrentYear() {
	const yearElement = document.getElementById('year');
	if (yearElement) {
		yearElement.textContent = new Date().getFullYear();
	}
}

// Initialize common functionality
async function initializeCommon(currentPage = null) {
	// Determine the relative path to components based on current location
	const currentPath = window.location.pathname;
	const isInSubfolder = currentPath !== '/' && currentPath.includes('/') && !currentPath.endsWith('index.html');
	const componentsPath = isInSubfolder ? '../components/' : './components/';

	// Load header and footer components
	const headerLoaded = await loadComponent('header-placeholder', `${componentsPath}header.html`);
	const footerLoaded = await loadComponent('footer-placeholder', `${componentsPath}footer.html`);

	if (headerLoaded) {
		// Fix navigation paths after header is loaded
		fixNavigationPaths();

		// Set active navigation
		setActiveNavigation(currentPage);
	}

	if (footerLoaded) {
		// Set current year after footer is loaded
		setCurrentYear();
	}

	// Load Bootstrap JavaScript
	if (!document.querySelector('script[src*="bootstrap"]')) {
		const script = document.createElement('script');
		script.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js';
		document.head.appendChild(script);
	}
}


// Export for use in individual pages
window.initializeCommon = initializeCommon;
