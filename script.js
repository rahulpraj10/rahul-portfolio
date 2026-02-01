$(document).ready(function () {

    // Smooth Scrolling
    $('a[href^="#"]').on('click', function (event) {
        var target = $(this.getAttribute('href'));
        if (target.length) {
            event.preventDefault();
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 80
            }, 800);

            // Close mobile menu on click
            if ($('.nav-links').hasClass('active')) {
                $('.nav-links').removeClass('active');
                $('.menu-toggle i').toggleClass('fa-bars fa-times');
            }
        }
    });

    // Mobile Menu Toggle
    $('.menu-toggle').click(function () {
        $('.nav-links').toggleClass('active');
        $(this).find('i').toggleClass('fa-bars fa-times');
    });

    // Active Link Switching on Scroll
    $(window).scroll(function () {
        var scrollDistance = $(window).scrollTop();

        // Sticky Navbar effect
        if (scrollDistance > 50) {
            $('.navbar').css('box-shadow', '0 5px 20px rgba(0,0,0,0.5)');
        } else {
            $('.navbar').css('box-shadow', 'none');
        }

        // Section highlighting
        $('.section').each(function (i) {
            if ($(this).position().top <= scrollDistance + 100) {
                $('.nav-links a.active').removeClass('active');
                $('.nav-links a').eq(i + 1).addClass('active');
            }
        });

        // Header highlight fix
        if (scrollDistance < 300) {
            $('.nav-links a.active').removeClass('active');
            $('.nav-links a').first().addClass('active');
        }

        // Scroll Reveal Animation
        $('.section').each(function () {
            var bottom_of_object = $(this).offset().top + 100;
            var bottom_of_window = $(window).scrollTop() + $(window).height();

            if (bottom_of_window > bottom_of_object) {
                $(this).animate({ 'opacity': '1' }, 500);
            }
        });
    });

    // Form Submission (Mock)
    $('.contact-form').submit(function (e) {
        e.preventDefault();
        var btn = $(this).find('button');
        var originalText = btn.text();

        btn.text('Sending...').css('opacity', '0.7');

        setTimeout(function () {
            btn.text('Message Sent!').css('background', '#22c55e');
            $('.contact-form')[0].reset();

            setTimeout(function () {
                btn.text(originalText).css('background', '');
                btn.css('opacity', '1');
            }, 3000);
        }, 1500);
    });

    // Interactive Star Background
    const canvas = document.getElementById('star-background');
    const ctx = canvas.getContext('2d');

    let width, height;
    let stars = [];
    let mouse = { x: 0, y: 0 };

    // Set canvas size
    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    window.addEventListener('resize', resize);
    resize();

    // Mouse tracking
    window.addEventListener('mousemove', (e) => {
        // Calculate mouse position relative to center (-0.5 to 0.5)
        mouse.x = (e.clientX / width) - 0.5;
        mouse.y = (e.clientY / height) - 0.5;
    });

    class Star {
        constructor() {
            this.init();
        }

        init() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.z = Math.random() * 2 + 0.5; // Depth factor
            this.size = Math.random() * 1.5;
            this.opacity = Math.random() * 0.5 + 0.3;
        }

        update() {
            // Move opposite to mouse with depth effect
            // Deeper stars (higher z) move slower, creating parallax
            let moveX = mouse.x * 30 * (1 / this.z);
            let moveY = mouse.y * 30 * (1 / this.z);

            this.x -= moveX * 0.1; // Smooth movement
            this.y -= moveY * 0.1;

            // Wrap around screen
            if (this.x < 0) this.x += width;
            if (this.x > width) this.x -= width;
            if (this.y < 0) this.y += height;
            if (this.y > height) this.y -= height;

            this.draw();
        }

        draw() {
            ctx.beginPath();
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Create stars
    function initStars() {
        stars = [];
        const starCount = Math.floor((width * height) / 6000); // Responsive star count
        for (let i = 0; i < starCount; i++) {
            stars.push(new Star());
        }
    }

    initStars();
    window.addEventListener('resize', initStars);

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, width, height);
        stars.forEach(star => star.update());
        requestAnimationFrame(animate);
    }

    animate();

    // Load Configuration
    function loadConfig() {
        $.getJSON('config.json', function (data) {
            // User Info
            if (data.user_info) {
                $('#greeting').text(data.user_info.greeting);
                $('#profile-name').text(data.user_info.name);
                $('#subtitle').text(data.user_info.subtitle);
            }
            if (data.copyright) {
                $('#copyright').html('&copy; ' + data.copyright);
            }

            // About
            if (data.about) {
                $('#bio-text').text(data.about.bio);

                // Stats
                if (data.about.stats) {
                    const statsContainer = $('#stats-container');
                    statsContainer.empty();
                    data.about.stats.forEach(stat => {
                        statsContainer.append(`
                            <div class="stat-item">
                                <h3>${stat.value}</h3>
                                <p>${stat.label}</p>
                            </div>
                        `);
                    });
                }

                // Skills
                if (data.about.skills) {
                    const skillsList = $('#skills-list');
                    skillsList.find('h3').nextAll().remove();
                    data.about.skills.forEach(skill => {
                        skillsList.append(`<span class="skill-tag">${skill}</span>`);
                    });
                }
            }

            // Resume
            if (data.resume) {
                const resumeTimeline = $('#resume-timeline');
                resumeTimeline.empty();
                data.resume.forEach(item => {
                    resumeTimeline.append(`
                        <div class="timeline-item">
                            <span class="date">${item.date}</span>
                            <h3>${item.role}</h3>
                            <span class="company">${item.company}</span>
                            <p>${item.description}</p>
                        </div>
                    `);
                });
            }

            // Contact
            if (data.contact) {
                $('#contact-email').text(data.contact.email);
                $('#contact-location').text(data.contact.location);

                // Social Links
                if (data.contact.social) {
                    const socialLinks = $('#social-links');
                    socialLinks.empty();
                    data.contact.social.forEach(social => {
                        socialLinks.append(`<a href="${social.link}"><i class="${social.icon}"></i></a>`);
                    });
                }
            }
        }).fail(function () {
            console.error("Could not load config.json");
        });
    }

    loadConfig();

});
