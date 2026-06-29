export function renderFooter() {
  return `
    <footer id="contact">
        <div class="container">
            <div class="footer-grid">
                <div class="footer-brand">
                    <h3>📚 Gyan Shala</h3>
                    <p>Providing free quality education to children living in urban slum communities.</p>
                    <div class="social-links">
                        <a href="#">📱</a>
                        <a href="#">🌐</a>
                        <a href="#">📷</a>
                        <a href="#">🐦</a>
                    </div>
                </div>
                <div class="footer-links-col">
                    <h4>About</h4>
                    <ul>
                        <li><a href="/about.html">Our Mission</a></li>
                        <li><a href="/programs.html">Programs</a></li>
                        <li><a href="/centers.html">Learning Centers</a></li>
                        <li><a href="/testimonials.html">Success Stories</a></li>
                    </ul>
                </div>
                <div class="footer-links-col">
                    <h4>Get Involved</h4>
                    <ul>
                        <li><a href="/volunteer.html">Volunteer</a></li>
                        <li><a href="#">Donate</a></li>
                        <li><a href="#">Partner with us</a></li>
                        <li><a href="#">Careers</a></li>
                    </ul>
                </div>
                <div class="footer-newsletter">
                    <h4>Newsletter</h4>
                    <p>Subscribe to get updates on our impact.</p>
                    <form class="newsletter-form" onsubmit="event.preventDefault(); alert('Subscribed successfully!');">
                        <input type="email" placeholder="Email address" required>
                        <button type="submit" class="btn-primary">Subscribe</button>
                    </form>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2026 Gyan Shala Smart Education Platform. All Rights Reserved.</p>
            </div>
        </div>
    </footer>
  `;
}
