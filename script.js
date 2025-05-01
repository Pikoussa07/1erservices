// Attendre que le DOM soit complètement chargé
document.addEventListener('DOMContentLoaded', function() {
  // Préchargeur
  const preloader = document.querySelector('.preloader');
  window.addEventListener('load', function() {
    preloader.classList.add('hidden');
    setTimeout(() => {
      preloader.style.display = 'none';
    }, 500);
  });

  // Curseur personnalisé
  const cursor = document.querySelector('.cursor');
  const cursorFollower = document.querySelector('.cursor-follower');
  
  document.addEventListener('mousemove', function(e) {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    setTimeout(() => {
      cursorFollower.style.left = e.clientX + 'px';
      cursorFollower.style.top = e.clientY + 'px';
    }, 100);
  });
  
  document.addEventListener('mousedown', function() {
    cursor.classList.add('active');
    cursorFollower.classList.add('active');
  });
  
  document.addEventListener('mouseup', function() {
    cursor.classList.remove('active');
    cursorFollower.classList.remove('active');
  });
  
  // Effet hover sur les liens et boutons
  const links = document.querySelectorAll('a, button, .service-card, .portfolio-item');
  links.forEach(link => {
    link.addEventListener('mouseenter', function() {
      cursor.classList.add('active');
      cursorFollower.classList.add('active');
    });
    
    link.addEventListener('mouseleave', function() {
      cursor.classList.remove('active');
      cursorFollower.classList.remove('active');
    });
  });

  // Définir l'année actuelle dans le footer
  document.getElementById('currentYear').textContent = new Date().getFullYear();

  // Effet de défilement pour l'en-tête
  const header = document.querySelector('.header');
  const scrollToTopBtn = document.getElementById('scrollToTop');

  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
      scrollToTopBtn.classList.add('visible');
    } else {
      header.classList.remove('scrolled');
      scrollToTopBtn.classList.remove('visible');
    }
  });

  // Bouton de retour en haut
  scrollToTopBtn.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // Menu mobile
  const menuToggle = document.querySelector('.menu-toggle');
  const navList = document.querySelector('.nav-list');

  if (menuToggle) {
    menuToggle.addEventListener('click', function() {
      this.classList.toggle('active');
      
      // Créer le menu mobile s'il n'existe pas
      let mobileMenu = document.querySelector('.mobile-menu');
      
      if (!mobileMenu) {
        mobileMenu = document.createElement('div');
        mobileMenu.className = 'mobile-menu';
        mobileMenu.innerHTML = navList.outerHTML;
        document.body.appendChild(mobileMenu);
        
        // Ajouter des écouteurs d'événements aux liens du menu mobile
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
          link.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
          });
        });
      }
      
      mobileMenu.classList.toggle('active');
    });
  }

  // Lien de navigation actif basé sur la position de défilement
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function highlightNavLink() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100;
      const sectionId = section.getAttribute('id');
      
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNavLink);

  // Animation des compteurs
  const counters = document.querySelectorAll('.counter');
  
  function startCounting() {
    counters.forEach(counter => {
      const target = +counter.dataset.count;
      let count = 0;
      const duration = 2000; // 2 secondes
      const increment = target / (duration / 30); // Mise à jour toutes les 30ms
      
      const updateCount = () => {
        if (count < target) {
          count += increment;
          counter.textContent = Math.ceil(count);
          setTimeout(updateCount, 30);
        } else {
          counter.textContent = target;
        }
      };
      
      updateCount();
    });
  }
  
  // Démarrer l'animation lorsque la section est visible
  const heroSection = document.querySelector('.hero');
  
  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.bottom >= 0
    );
  }
  
  let counted = false;
  
  window.addEventListener('scroll', function() {
    if (heroSection && isInViewport(heroSection) && !counted) {
      startCounting();
      counted = true;
    }
  });
  
  // Vérifier également au chargement de la page
  if (heroSection && isInViewport(heroSection) && !counted) {
    startCounting();
    counted = true;
  }

  // Slider de témoignages
  const testimonialTrack = document.querySelector('.testimonial-track');
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  const prevBtn = document.querySelector('.testimonial-prev');
  const nextBtn = document.querySelector('.testimonial-next');
  
  if (testimonialTrack && testimonialCards.length > 0) {
    let currentIndex = 0;
    const cardWidth = testimonialCards[0].offsetWidth;
    const gap = 32; // 2rem gap
    const totalCards = testimonialCards.length;
    
    function updateSlider() {
      const offset = -(currentIndex * (cardWidth + gap));
      testimonialTrack.style.transform = `translateX(${offset}px)`;
    }
    
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + totalCards) % totalCards;
      updateSlider();
    });
    
    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % totalCards;
      updateSlider();
    });
    
    // Mise à jour du slider lors du redimensionnement de la fenêtre
    window.addEventListener('resize', () => {
      updateSlider();
    });
    
    // Défilement automatique
    setInterval(() => {
      currentIndex = (currentIndex + 1) % totalCards;
      updateSlider();
    }, 5000);
  }

  // Filtrage du portfolio
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      // Supprimer la classe active de tous les boutons
      filterBtns.forEach(btn => btn.classList.remove('active'));
      
      // Ajouter la classe active au bouton cliqué
      this.classList.add('active');
      
      // Obtenir la catégorie à filtrer
      const filterValue = this.getAttribute('data-filter');
      
      // Filtrer les éléments du portfolio
      portfolioItems.forEach(item => {
        if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 100);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // Soumission du formulaire de contact
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Obtenir les valeurs du formulaire
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const subject = document.getElementById('subject').value;
      const message = document.getElementById('message').value;
      
      // Ici, vous enverriez normalement les données à un serveur
      // Pour la démonstration, nous allons simplement afficher un message de succès
      console.log('Formulaire soumis:', { name, email, subject, message });
      
      // Afficher un message de succès avec animation
      const formContainer = document.querySelector('.contact-form-container');
      formContainer.innerHTML = `
        <div class="success-message" style="text-align: center; padding: 2rem;">
          <div class="success-icon" style="margin-bottom: 1rem; color: var(--primary);">
            <i class="fas fa-check-circle" style="font-size: 3rem;"></i>
          </div>
          <h3 style="margin-bottom: 1rem;">Message envoyé avec succès!</h3>
          <p style="color: var(--muted-foreground); margin-bottom: 1.5rem;">Merci de nous avoir contacté. Nous vous répondrons bientôt.</p>
          <button type="button" class="btn btn-primary btn-rounded" id="resetForm">Envoyer un autre message</button>
        </div>
      `;
      
      // Ajouter un écouteur d'événement au bouton de réinitialisation du formulaire
      document.getElementById('resetForm').addEventListener('click', function() {
        location.reload();
      });
    });
  }

  // Soumission du formulaire de newsletter
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Obtenir la valeur de l'email
      const email = newsletterForm.querySelector('input[type="email"]').value;
      
      // Ici, vous enverriez normalement les données à un serveur
      // Pour la démonstration, nous allons simplement afficher un message de succès
      console.log('Abonnement à la newsletter:', { email });
      
      // Afficher un message de succès
      const formContainer = newsletterForm.parentElement;
      const originalContent = formContainer.innerHTML;
      
      formContainer.innerHTML = `
        <div class="success-message">
          <p style="color: var(--primary); font-weight: 600; margin-bottom: 1rem;">
            <i class="fas fa-check-circle"></i> Abonnement réussi!
          </p>
          <p>Merci de vous être abonné à notre newsletter.</p>
        </div>
      `;
      
      // Réinitialiser le formulaire après 5 secondes
      setTimeout(() => {
        formContainer.innerHTML = originalContent;
        
        // Réinitialiser l'écouteur d'événement
        const newForm = document.getElementById('newsletterForm');
        if (newForm) {
          newForm.addEventListener('submit', arguments.callee);
        }
      }, 5000);
    });
  }

  // Effet de survol sur les cartes de service
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });

  // Défilement fluide pour les liens d'ancrage
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Décalage pour l'en-tête
          behavior: 'smooth'
        });
      }
    });
  });

  // Animation AOS (Animate On Scroll) personnalisée
  const animateElements = document.querySelectorAll('[data-aos]');
  
  function animateOnScroll() {
    animateElements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      const elementVisible = 150;
      
      if (elementPosition < windowHeight - elementVisible) {
        element.classList.add('aos-animate');
      } else {
        element.classList.remove('aos-animate');
      }
    });
  }
  
  // Ajouter des styles CSS pour les animations
  const style = document.createElement('style');
  style.textContent = `
    [data-aos] {
      opacity: 0;
      transform: translateY(50px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    [data-aos].aos-animate {
      opacity: 1;
      transform: translateY(0);
    }
    
    [data-aos="fade-up"] {
      transform: translateY(50px);
    }
    
    [data-aos="fade-down"] {
      transform: translateY(-50px);
    }
    
    [data-aos="fade-right"] {
      transform: translateX(-50px);
    }
    
    [data-aos="fade-left"] {
      transform: translateX(50px);
    }
    
    [data-aos-delay="100"] {
      transition-delay: 0.1s;
    }
    
    [data-aos-delay="200"] {
      transition-delay: 0.2s;
    }
    
    [data-aos-delay="300"] {
      transition-delay: 0.3s;
    }
    
    [data-aos-delay="400"] {
      transition-delay: 0.4s;
    }
  `;
  document.head.appendChild(style);
  
  window.addEventListener('scroll', animateOnScroll);
  window.addEventListener('load', animateOnScroll);
  
  // Animer les éléments visibles au chargement initial
  setTimeout(animateOnScroll, 100);
});