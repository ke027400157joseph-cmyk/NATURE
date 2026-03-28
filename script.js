document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // 1. PAGE DETECTION
    // =========================================
    const path = window.location.pathname;
    const isHomePage = path.includes('index.html') || path === '/' || path.endsWith('/');
    const isAboutPage = path.includes('about.html');

    console.log(`Current Page: ${isHomePage ? 'Home' : (isAboutPage ? 'About' : 'Other')}`);


    // =========================================
    // 2. COMMON FEATURES (Works on ALL pages)
    // =========================================
    
    // A. Image Fallback (Prevents broken images if joseph.jpg is missing)
    const userImages = document.querySelectorAll('img[onerror]');
    userImages.forEach(img => {
        img.addEventListener('error', function() {
            this.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80';
            this.onerror = null;
        });
    });

    // B. Dynamic Copyright Year
    const yearElements = document.querySelectorAll('.copyright, .content-footer p');
    yearElements.forEach(el => {
        const currentYear = new Date().getFullYear();
        el.innerHTML = el.innerHTML.replace(/\d{4}/, currentYear);
    });

    // C. Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger, .mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    // Create hamburger button if it doesn't exist (for About page)
    if (!hamburger && window.innerWidth <= 900) {
        const logoContainer = document.querySelector('.nav-flex');
        if (logoContainer) {
            const btn = document.createElement('div');
            btn.innerHTML = '<i class="fa-solid fa-bars"></i>';
            btn.className = 'mobile-menu-btn';
            btn.style.cssText = 'font-size: 1.5rem; cursor: pointer; color: #2e7d32; display: block;';
            
            // Hide nav links initially on mobile
            if (navLinks) {
                navLinks.style.display = 'none';
                logoContainer.appendChild(btn);
                
                btn.addEventListener('click', () => {
                    const isVisible = navLinks.style.display === 'flex';
                    navLinks.style.display = isVisible ? 'none' : 'flex';
                    if (!isVisible) {
                        navLinks.style.flexDirection = 'column';
                        navLinks.style.position = 'absolute';
                        navLinks.style.top = '60px';
                        navLinks.style.left = '0';
                        navLinks.style.width = '100%';
                        navLinks.style.background = '#fff';
                        navLinks.style.padding = '20px';
                        navLinks.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                        btn.innerHTML = '<i class="fa-solid fa-times"></i>';
                    } else {
                        btn.innerHTML = '<i class="fa-solid fa-bars"></i>';
                    }
                });
            }
        }
    } else if (hamburger) {
        // Existing hamburger logic for Home page
        hamburger.addEventListener('click', () => {
            const isVisible = navLinks.style.display === 'flex';
            if (isVisible) {
                navLinks.style.display = 'none';
                // Reset styles for desktop view if resized
                if(window.innerWidth > 900) {
                    navLinks.style = ''; 
                }
            } else {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '70px';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = 'rgba(6, 78, 59, 0.95)';
                navLinks.style.padding = '20px';
                navLinks.style.textAlign = 'center';
            }
        });
    }


    // =========================================
    // 3. HOME PAGE SPECIFIC ANIMATIONS
    // =========================================
    if (isHomePage) {
        // A. Parallax Effect on Scroll
        window.addEventListener('scroll', () => {
            const hero = document.querySelector('.hero');
            if (hero) {
                const scrolled = window.scrollY;
                hero.style.backgroundPositionY = `${scrolled * 0.5}px`;
            }
        });

        // B. Floating Badge Animation Control
        const badge = document.querySelector('.floating-badge');
        if (badge) {
            badge.style.animation = 'bounce 2s infinite';
        }

        // C. Feature Cards Staggered Fade-In
        const featureCards = document.querySelectorAll('.feature-card');
        const observerOptions = { threshold: 0.2 };
        
        const featureObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 200); // 200ms delay between each card
                    featureObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        featureCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.6s ease-out';
            featureObserver.observe(card);
        });
    }


    // =========================================
    // 4. ABOUT PAGE SPECIFIC ANIMATIONS
    // =========================================
    if (isAboutPage) {
        // A. Smooth Scroll Fade-In for All Content
        const fadeElements = document.querySelectorAll(
            '.page-header, .text-block, .grid-item, .value-card, .sidebar-section'
        );

        const aboutObserverOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };

        const aboutObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    aboutObserver.unobserve(entry.target);
                }
            });
        }, aboutObserverOptions);

        // Inject CSS for 'visible' class if not already present
        if (!document.getElementById('about-animations')) {
            const style = document.createElement('style');
            style.id = 'about-animations';
            style.innerHTML = `
                .page-header, .text-block, .grid-item, .value-card, .sidebar-section {
                    opacity: 0;
                    transform: translateY(30px);
                    transition: all 0.6s ease-out;
                }
                .visible {
                    opacity: 1 !important;
                    transform: translateY(0) !important;
                }
            `;
            document.head.appendChild(style);
        }

        fadeElements.forEach((el, index) => {
            el.style.transitionDelay = `${index * 0.1}s`; // Stagger effect
            aboutObserver.observe(el);
        });

        // B. Image Grid Hover Effects (Enhanced)
        const gridItems = document.querySelectorAll('.grid-item');
        gridItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.querySelector('img').style.transform = 'scale(1.05)';
            });
            item.addEventListener('mouseleave', () => {
                item.querySelector('img').style.transform = 'scale(1)';
            });
        });
    }

    console.log("EcoWatch Scripts Loaded Successfully 🌿");
});
/* =========================================
   GALLERY MODAL LOGIC
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Select all "Read More" links in the gallery
    const readMoreLinks = document.querySelectorAll('.read-more');
    
    // 2. Create the Modal HTML dynamically (so you don't have to write it in HTML)
    const modalHTML = `
        <div id="reportModal" class="modal-overlay">
            <div class="modal-content">
                <button class="close-modal">&times;</button>
                <div class="modal-header">
                    <h2 id="modalTitle">Project Title</h2>
                    <span id="modalCategory" class="modal-category">Category</span>
                </div>
                <div class="modal-body">
                    <img id="modalImage" src="" alt="Project Detail">
                    <div class="modal-text">
                        <h3>Overview</h3>
                        <p id="modalDescription">Description goes here...</p>
                        
                        <h3>Key Impact</h3>
                        <ul id="modalStats" class="stats-list">
                            <!-- Stats injected via JS -->
                        </ul>
                        
                        <div class="modal-action">
                            <a href="#" class="btn-download"><i class="fa-solid fa-file-pdf"></i> Download Full Report (PDF)</a>
                            <a href="contact.html" class="btn-contact">Contact Team</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Append modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // 3. Define Data for Each Project (Simulating a Database)
    // You can edit the text here to match your real reports
    const projectData = {
        "Reforestation Drive": {
            category: "Conservation",
            image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",
            description: "This initiative aims to plant 10,000 native trees in the Nairobi outskirts. The project focuses on combating soil erosion, restoring natural habitats for local wildlife, and creating green corridors for urban cooling.",
            stats: [
                "<strong>10,000+</strong> Trees Planted",
                "<strong>50+</strong> Hectares Restored",
                "<strong>200+</strong> Volunteers Involved"
            ]
        },
        "River Cleanup": {
            category: "Water Systems",
            image: "https://images.unsplash.com/photo-1589553416260-f586c8f1514f?auto=format&fit=crop&w=800&q=80",
            description: "A community-led effort to remove plastic waste from the Nairobi River. We organize weekly cleanup drives and educate locals on proper waste disposal to prevent future pollution.",
            stats: [
                "<strong>500kg</strong> Waste Removed",
                "<strong>12</strong> Weekly Drives",
                "<strong>3km</strong> River Bank Cleared"
            ]
        },
        "Air Quality Monitoring": {
            category: "Technology",
            image: "https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?auto=format&fit=crop&w=800&q=80",
            description: "Deployment of low-cost IoT sensors across industrial zones to track PM2.5 and NO2 levels in real-time. Data is made public to hold polluters accountable and inform residents.",
            stats: [
                "<strong>25</strong> Sensors Deployed",
                "<strong>24/7</strong> Real-time Data",
                "<strong>5</strong> Industrial Zones Covered"
            ]
        },
        "Highland Protection": {
            category: "Conservation",
            image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
            description: "Protecting the Aberdare ranges from illegal logging. We work with rangers and local communities to monitor forest health and preserve critical water catchment areas.",
            stats: [
                "<strong>500</strong> Hectares Protected",
                "<strong>0</strong> Illegal Logging Incidents (YTD)",
                "<strong>100%</strong> Community Support"
            ]
        },
        "Wildlife Corridors": {
            category: "Wildlife",
            image: "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?auto=format&fit=crop&w=800&q=80",
            description: "Creating safe passage for elephants and other wildlife between fragmented forest patches. This reduces human-wildlife conflict and ensures genetic diversity.",
            stats: [
                "<strong>3</strong> Corridors Established",
                "<strong>50+</strong> Elephant Sightings",
                "<strong>20%</strong> Reduction in Conflict"
            ]
        },
        "Community Education": {
            category: "Education",
            image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80",
            description: "Workshops in local schools teaching the next generation about sustainability, climate change, and practical conservation skills.",
            stats: [
                "<strong>15</strong> Schools Visited",
                "<strong>2,000+</strong> Students Reached",
                "<strong>50</strong> Workshops Held"
            ]
        }
    };

    // 4. Event Listeners
    const modal = document.getElementById('reportModal');
    const closeBtn = document.querySelector('.close-modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalCategory = document.getElementById('modalCategory');
    const modalImage = document.getElementById('modalImage');
    const modalDesc = document.getElementById('modalDescription');
    const modalStats = document.getElementById('modalStats');

    readMoreLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Stop normal link behavior
            
            // Get the project title from the card (h3 tag)
            const card = link.closest('.gallery-item');
            const title = card.querySelector('h3').innerText;
            
            // Get data from our object
            const data = projectData[title];
            
            if (data) {
                // Populate Modal
                modalTitle.innerText = title;
                modalCategory.innerText = data.category;
                modalImage.src = data.image;
                modalDesc.innerText = data.description;
                
                // Populate Stats List
                modalStats.innerHTML = data.stats.map(stat => `<li>${stat}</li>`).join('');
                
                // Show Modal
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden'; // Stop background scrolling
            } else {
                alert("Report details coming soon!");
            }
        });
    });

    // Close Modal Logic
    const closeModal = () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    
    // Close if clicking outside the content box
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
});
/* =========================================
   CONTACT PAGE MAP LOGIC
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    
    // Check if we are on the contact page by looking for the map div
    const mapElement = document.getElementById('worldMap');
    
    if (mapElement) {
        // 1. Initialize Map centered on Mfangano Island (Sena)
        // Coordinates approx: -0.55, 34.35
        const map = L.map('worldMap').setView([-0.550, 34.350], 13);

        // 2. Add OpenStreetMap Tiles (Free & Live)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        // 3. Add Custom Marker for "KE0274PEFAM"
        const customIcon = L.icon({
            iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // Green leaf pin
            iconSize: [38, 38],
            iconAnchor: [19, 38],
            popupAnchor: [0, -30]
        });

        L.marker([-0.550, 34.350], { icon: customIcon })
            .addTo(map)
            .bindPopup("<b>EcoWatch Base</b><br>Sena, Mfangano Island<br>KE0274PEFAM")
            .openPopup();
    }

    // ... (Keep your existing Form Submission & Mobile Menu code here) ...
});
/* =========================================
   GALLERY BUTTON LOGIC
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Select the "View More Photos" button
    const viewMoreBtn = document.querySelector('.btn-outline'); // This targets the button in contact.html

    if (viewMoreBtn) {
        viewMoreBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Stop default link behavior momentarily
            
            // Get the target URL from the href attribute (should be gallery.html)
            const targetUrl = viewMoreBtn.getAttribute('href');
            
            // Add a small fade-out effect before switching pages (Optional but looks nice)
            document.body.style.opacity = '0';
            document.body.style.transition = 'opacity 0.3s ease';
            
            setTimeout(() => {
                window.location.href = targetUrl; // Redirect to gallery page
            }, 300); // Wait 300ms for fade out
        });
    }

    // 2. Fade In Effect when landing on Gallery Page
    // If we are on the gallery page, fade it in smoothly
    if (window.location.pathname.includes('gallery.html')) {
        document.body.style.opacity = '0';
        window.addEventListener('load', () => {
            document.body.style.transition = 'opacity 0.5s ease';
            document.body.style.opacity = '1';
        });
    }
});
/* =========================================
   PROJECT DETAILS MODAL LOGIC
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Select all "View Details" links
    const viewDetailsLinks = document.querySelectorAll('.read-more');
    
    // 2. Create the Modal HTML Structure dynamically
    const modalHTML = `
        <div id="projectModal" class="modal-overlay">
            <div class="modal-container">
                <button class="close-modal">&times;</button>
                
                <div class="modal-header-image">
                    <img id="modalImg" src="" alt="Project Image">
                    <div class="modal-badge" id="modalBadge">Active</div>
                </div>
                
                <div class="modal-content">
                    <div class="modal-meta">
                        <span id="modalDate"><i class="fa-regular fa-calendar"></i> Date</span>
                        <span id="modalLocation"><i class="fa-solid fa-location-dot"></i> Location</span>
                    </div>
                    
                    <h2 id="modalTitle">Project Title</h2>
                    
                    <div class="modal-body">
                        <p id="modalDescription">Project description goes here...</p>
                        
                        <h4>Key Objectives:</h4>
                        <ul id="modalObjectives" class="objectives-list">
                            <!-- List items injected via JS -->
                        </ul>
                        
                        <div class="modal-stats-grid">
                            <div class="stat-box">
                                <i class="fa-solid fa-users"></i>
                                <span id="stat1">0</span>
                                <small>People Reached</small>
                            </div>
                            <div class="stat-box">
                                <i class="fa-solid fa-tree"></i>
                                <span id="stat2">0</span>
                                <small>Trees Planted</small>
                            </div>
                            <div class="stat-box">
                                <i class="fa-solid fa-recycle"></i>
                                <span id="stat3">0</span>
                                <small>Waste Removed</small>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-footer">
                        <a href="contact.html" class="btn-get-involved">Get Involved <i class="fa-solid fa-arrow-right"></i></a>
                        <a href="#" class="btn-download-report"><i class="fa-solid fa-file-pdf"></i> Download Report</a>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Append modal to the body
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // 3. Define Project Data (The "Database")
    // Edit this section to change the details for each project
    const projectData = {
        "Urban Reforestation Drive": {
            image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",
            badge: "Active",
            date: "Jan 2026 - Present",
            location: "Nairobi, Kenya",
            description: "This initiative aims to combat urban heat islands by planting 10,000 native trees across Nairobi. We work with local communities to identify suitable areas and ensure long-term care for the saplings.",
            objectives: [
                "Plant 10,000 native tree species",
                "Reduce local temperatures by 2°C",
                "Engage 500+ community volunteers",
                "Create green corridors for wildlife"
            ],
            stats: { people: "500+", trees: "10,000", waste: "2 Tons" }
        },
        "IoT Air Quality Network": {
            image: "https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?auto=format&fit=crop&w=800&q=80",
            badge: "New",
            date: "Mar 2026 - Present",
            location: "Industrial Area, Nairobi",
            description: "We are deploying a network of low-cost IoT sensors to monitor PM2.5 and NO2 levels in real-time. This data is made public to hold polluters accountable and inform residents about air quality risks.",
            objectives: [
                "Install 50 sensors in hotspots",
                "Provide real-time public data dashboard",
                "Alert schools during high pollution days",
                "Advocate for stricter emission laws"
            ],
            stats: { people: "10,000+", trees: "N/A", waste: "N/A" }
        },
        "River & Beach Cleanups": {
            image: "group-photo.jpg", // Uses your photo
            badge: "Ongoing",
            date: "Feb 2026 - Present",
            location: "Mfangano Island",
            description: "Weekly community-led cleanup drives targeting plastic waste along the shores of Lake Victoria and local rivers. We educate locals on waste segregation and recycling opportunities.",
            objectives: [
                "Remove 500kg of plastic monthly",
                "Educate 20 schools on waste management",
                "Partner with recycling firms",
                "Restore aquatic habitats"
            ],
            stats: { people: "200+", trees: "50", waste: "2 Tons" }
        },
        "Highland Forest Protection": {
            image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
            badge: "Planning",
            date: "Apr 2026",
            location: "Aberdares Range",
            description: "A strategic project to protect critical water catchment areas in the Aberdares from illegal logging. We collaborate with KFS rangers and local communities to monitor forest health.",
            objectives: [
                "Patrol 50km of forest boundary",
                "Install camera traps for monitoring",
                "Train 50 community scouts",
                "Protect endangered species habitats"
            ],
            stats: { people: "50", trees: "Protected", waste: "N/A" }
        },
        "Green Schools Program": {
            image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80",
            badge: "Active",
            date: "Jan 2026 - Present",
            location: "Nationwide Schools",
            description: "An educational program visiting schools to teach students about climate change, recycling, and sustainable living. We establish 'Green Clubs' in participating schools.",
            objectives: [
                "Visit 30 schools in 2026",
                "Establish 15 Green Clubs",
                "Distribute 1,000 educational kits",
                "Train 50 teachers on sustainability"
            ],
            stats: { people: "2,000+", trees: "500", waste: "1 Ton" }
        },
        "Public Data Dashboard": {
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
            badge: "Beta",
            date: "Mar 2026",
            location: "Online Platform",
            description: "Developing an open-source web platform that visualizes environmental data collected from our sensors and partners. This tool empowers citizens and policymakers with actionable insights.",
            objectives: [
                "Launch beta version in Q2 2026",
                "Integrate data from 5 partners",
                "Create interactive maps and charts",
                "Ensure mobile accessibility"
            ],
            stats: { people: "5,000+", trees: "N/A", waste: "N/A" }
        }
    };

    // 4. Event Listeners for Buttons
    const modal = document.getElementById('projectModal');
    const closeBtn = document.querySelector('.close-modal');
    
    // Elements to populate
    const mImg = document.getElementById('modalImg');
    const mBadge = document.getElementById('modalBadge');
    const mDate = document.getElementById('modalDate');
    const mLoc = document.getElementById('modalLocation');
    const mTitle = document.getElementById('modalTitle');
    const mDesc = document.getElementById('modalDescription');
    const mObj = document.getElementById('modalObjectives');
    const s1 = document.getElementById('stat1');
    const s2 = document.getElementById('stat2');
    const s3 = document.getElementById('stat3');

    viewDetailsLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Get the project title from the card (h3 tag)
            const card = link.closest('.project-card');
            const title = card.querySelector('h3').innerText;
            
            // Get data from our object
            const data = projectData[title];
            
            if (data) {
                // Populate Modal
                mImg.src = data.image;
                mBadge.innerText = data.badge;
                // Color code badges
                mBadge.style.background = data.badge === 'Active' ? '#2ecc71' : 
                                          data.badge === 'New' ? '#e74c3c' : 
                                          data.badge === 'Planning' ? '#f39c12' : '#3498db';
                
                mDate.innerHTML = `<i class="fa-regular fa-calendar"></i> ${data.date}`;
                mLoc.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${data.location}`;
                mTitle.innerText = title;
                mDesc.innerText = data.description;
                
                // Populate Objectives List
                mObj.innerHTML = data.objectives.map(obj => `<li>${obj}</li>`).join('');
                
                // Populate Stats
                s1.innerText = data.stats.people;
                s2.innerText = data.stats.trees;
                s3.innerText = data.stats.waste;
                
                // Show Modal
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden'; // Stop background scrolling
            }
        });
    });

    // Close Modal Logic
    const closeModal = () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    
    // Close if clicking outside the content box
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
});
/* =========================================
   PROJECTS FILTER LOGIC
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                // Add active to clicked button
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                projectCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    
                    if (filterValue === 'all' || category === filterValue) {
                        card.style.display = 'flex';
                        // Add fade-in animation
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        card.style.display = 'none';
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                    }
                });
            });
        });
    }
});
document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Sticky Navbar Effect ---
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- 2. Mobile Menu Toggle ---
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');
    const icon = hamburger.querySelector('i');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            // Toggle Icon between Bars and X
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                icon.style.color = '#1a4d2e'; // Dark color when open
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                // Revert color based on scroll position
                if (window.scrollY > 50) {
                    icon.style.color = '#1a4d2e';
                } else {
                    icon.style.color = '#ffffff';
                }
            }
        });
    }

    // --- 3. Close Mobile Menu when clicking a link ---
    document.querySelectorAll('.nav-links li a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            if(icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });
});
document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Sticky Navbar ---
    const navbar = document.getElementById('navbar');
    if(navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) navbar.classList.add('scrolled');
            else navbar.classList.remove('scrolled');
        });
    }

    // --- 2. Mobile Menu ---
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');
    if(hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = hamburger.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.replace('fa-bars', 'fa-times');
                icon.style.color = '#1a4d2e';
            } else {
                icon.classList.replace('fa-times', 'fa-bars');
                icon.style.color = window.scrollY > 50 ? '#1a4d2e' : '#ffffff';
            }
        });
    }

    // --- 3. Project Filtering ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    if(filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filterValue = btn.getAttribute('data-filter');
                
                projectCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    if (filterValue === 'all' || category === filterValue) {
                        card.style.display = 'flex';
                        setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 50);
                    } else {
                        card.style.display = 'none';
                        card.style.opacity = '0';
                    }
                });
            });
        });
    }

    // --- 4. Project Details Modal ---
    const viewDetailsLinks = document.querySelectorAll('.read-more');
    if(viewDetailsLinks.length > 0) {
        // Create Modal HTML
        const modalHTML = `
            <div id="projectModal" class="modal-overlay">
                <div class="modal-container">
                    <button class="close-modal">&times;</button>
                    <div class="modal-header-image">
                        <img id="modalImg" src="" alt="Project">
                        <div class="modal-badge" id="modalBadge">Active</div>
                    </div>
                    <div class="modal-content">
                        <div class="modal-meta">
                            <span id="modalDate"><i class="fa-regular fa-calendar"></i> Date</span>
                            <span id="modalLocation"><i class="fa-solid fa-location-dot"></i> Location</span>
                        </div>
                        <h2 id="modalTitle">Project Title</h2>
                        <div class="modal-body">
                            <p id="modalDescription">Description...</p>
                            <h4>Key Objectives:</h4>
                            <ul id="modalObjectives" class="objectives-list"></ul>
                            <div class="modal-stats-grid">
                                <div class="stat-box"><i class="fa-solid fa-users"></i><span id="stat1">0</span><small>People</small></div>
                                <div class="stat-box"><i class="fa-solid fa-tree"></i><span id="stat2">0</span><small>Trees</small></div>
                                <div class="stat-box"><i class="fa-solid fa-recycle"></i><span id="stat3">0</span><small>Waste</small></div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <a href="contact.html" class="btn-get-involved">Get Involved <i class="fa-solid fa-arrow-right"></i></a>
                            <a href="#" class="btn-download-report"><i class="fa-solid fa-file-pdf"></i> Download Report</a>
                        </div>
                    </div>
                </div>
            </div>`;
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Data
        const projectData = {
            "Urban Reforestation Drive": { image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80", badge: "Active", date: "Jan 2026", location: "Nairobi", description: "Planting 10,000 native trees to combat heat islands.", objectives: ["Plant 10k trees", "Reduce temp by 2°C", "Engage 500 volunteers"], stats: { p: "500+", t: "10k", w: "2T" } },
            "IoT Air Quality Network": { image: "https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?auto=format&fit=crop&w=800&q=80", badge: "New", date: "Mar 2026", location: "Industrial Area", description: "Real-time monitoring of PM2.5 and NO2 levels.", objectives: ["Install 50 sensors", "Public dashboard", "Alert schools"], stats: { p: "10k+", t: "N/A", w: "N/A" } },
            "River & Beach Cleanups": { image: "group-photo.jpg", badge: "Ongoing", date: "Feb 2026", location: "Mfangano Island", description: "Weekly cleanup drives on Lake Victoria shores.", objectives: ["Remove 500kg plastic", "Educate 20 schools", "Recycle waste"], stats: { p: "200+", t: "50", w: "2T" } },
            "Highland Forest Protection": { image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80", badge: "Planning", date: "Apr 2026", location: "Aberdares", description: "Protecting water catchment areas from logging.", objectives: ["Patrol 50km", "Camera traps", "Train scouts"], stats: { p: "50", t: "Protected", w: "N/A" } },
            "Green Schools Program": { image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80", badge: "Active", date: "Jan 2026", location: "Schools", description: "Teaching students about climate change.", objectives: ["Visit 30 schools", "Green Clubs", "Training teachers"], stats: { p: "2k+", t: "500", w: "1T" } },
            "Public Data Dashboard": { image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80", badge: "Beta", date: "Mar 2026", location: "Online", description: "Open-source platform for environmental data.", objectives: ["Launch beta", "Integrate partners", "Interactive maps"], stats: { p: "5k+", t: "N/A", w: "N/A" } }
        };

        const modal = document.getElementById('projectModal');
        const closeBtn = document.querySelector('.close-modal');
        
        viewDetailsLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const title = link.closest('.project-card').querySelector('h3').innerText;
                const data = projectData[title];
                if(data) {
                    document.getElementById('modalImg').src = data.image.includes('group-photo') ? 'group-photo.jpg' : data.image;
                    document.getElementById('modalBadge').innerText = data.badge;
                    document.getElementById('modalBadge').style.background = data.badge === 'Active' ? '#2ecc71' : data.badge === 'New' ? '#e74c3c' : '#f39c12';
                    document.getElementById('modalDate').innerHTML = `<i class="fa-regular fa-calendar"></i> ${data.date}`;
                    document.getElementById('modalLocation').innerHTML = `<i class="fa-solid fa-location-dot"></i> ${data.location}`;
                    document.getElementById('modalTitle').innerText = title;
                    document.getElementById('modalDescription').innerText = data.description;
                    document.getElementById('modalObjectives').innerHTML = data.objectives.map(o => `<li>${o}</li>`).join('');
                    document.getElementById('stat1').innerText = data.stats.p;
                    document.getElementById('stat2').innerText = data.stats.t;
                    document.getElementById('stat3').innerText = data.stats.w;
                    modal.style.display = 'flex';
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        const closeModal = () => { modal.style.display = 'none'; document.body.style.overflow = 'auto'; };
        if(closeBtn) closeBtn.addEventListener('click', closeModal);
        window.addEventListener('click', (e) => { if(e.target === modal) closeModal(); });
    }

    // --- 5. Dynamic Year ---
    const yearSpan = document.getElementById('year');
    if(yearSpan) yearSpan.textContent = new Date().getFullYear();
});
document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Sticky Navbar ---
    const navbar = document.getElementById('navbar');
    if(navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) navbar.classList.add('scrolled');
            else navbar.classList.remove('scrolled');
        });
    }

    // --- 2. Mobile Menu ---
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');
    if(hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = hamburger.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.replace('fa-bars', 'fa-times');
                icon.style.color = '#1a4d2e';
            } else {
                icon.classList.replace('fa-times', 'fa-bars');
                icon.style.color = window.scrollY > 50 ? '#1a4d2e' : '#ffffff';
            }
        });
    }

    // --- 3. Gallery Filtering ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if(filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filterValue = btn.getAttribute('data-filter');
                
                galleryItems.forEach(item => {
                    const category = item.getAttribute('data-category');
                    if (filterValue === 'all' || category === filterValue) {
                        item.style.display = 'flex';
                        setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'translateY(0)'; }, 50);
                    } else {
                        item.style.display = 'none';
                        item.style.opacity = '0';
                    }
                });
            });
        });
    }

    // --- 4. Gallery Modal (Popup) ---
    const readMoreLinks = document.querySelectorAll('.read-more');
    const circleFrames = document.querySelectorAll('.circle-frame');
    
    if(readMoreLinks.length > 0 || circleFrames.length > 0) {
        // Create Modal HTML
        const modalHTML = `
            <div id="galleryModal" class="modal-overlay">
                <div class="modal-container">
                    <button class="close-modal">&times;</button>
                    <div class="modal-header-image">
                        <img id="modalImg" src="" alt="Gallery Image">
                    </div>
                    <div class="modal-content">
                        <h2 id="modalTitle">Image Title</h2>
                        <p id="modalDesc">Description goes here...</p>
                        <div class="modal-footer">
                            <a href="contact.html" class="btn-view-full">Get Involved</a>
                        </div>
                    </div>
                </div>
            </div>`;
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        const modal = document.getElementById('galleryModal');
        const closeBtn = document.querySelector('.close-modal');
        const mImg = document.getElementById('modalImg');
        const mTitle = document.getElementById('modalTitle');
        const mDesc = document.getElementById('modalDesc');

        // Function to open modal
        const openModal = (item) => {
            const imgSrc = item.querySelector('img').src;
            const title = item.querySelector('h3').innerText;
            const desc = item.querySelector('p').innerText;
            
            // Handle fallback image logic if needed
            mImg.src = imgSrc.includes('group-photo') ? 'group-photo.jpg' : imgSrc;
            mTitle.innerText = title;
            mDesc.innerText = desc;
            
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        };

        // Add click listeners to "View Report" links
        readMoreLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const item = link.closest('.gallery-item');
                openModal(item);
            });
        });

        // Add click listeners to Circle Images
        circleFrames.forEach(frame => {
            frame.addEventListener('click', () => {
                const item = frame.closest('.gallery-item');
                openModal(item);
            });
        });

        // Close Logic
        const closeModal = () => { modal.style.display = 'none'; document.body.style.overflow = 'auto'; };
        if(closeBtn) closeBtn.addEventListener('click', closeModal);
        window.addEventListener('click', (e) => { if(e.target === modal) closeModal(); });
    }

    // --- 5. Dynamic Year ---
    const yearSpan = document.getElementById('year');
    if(yearSpan) yearSpan.textContent = new Date().getFullYear();
});