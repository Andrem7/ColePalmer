document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetPage = this.getAttribute('href');
            
            // Create transition overlay
            const transition = document.createElement('div');
            transition.className = 'page-transition';
            transition.innerHTML = '<div class="loading-animation">Loading...</div>';
            document.body.appendChild(transition);
            
            // Trigger transition
            setTimeout(() => {
                transition.classList.add('active');
            }, 10);
            
            // Navigate after animation
            setTimeout(() => {
                window.location.href = targetPage;
            }, 300);
        });
    });
    
    // Remove transition overlay when page loads
    window.addEventListener('load', function() {
        const existingTransition = document.querySelector('.page-transition');
        if (existingTransition) {
            existingTransition.remove();
        }
    });
});