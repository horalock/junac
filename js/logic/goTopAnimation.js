function showGotopOnScroll() { 
  let container = document.getElementById('scroll-top'); 
  if (window.scrollY > 600) { 
    container.classList.add('visible-container'); 
  } else { 
    container.classList.remove('visible-container'); 
  } 
}
window.addEventListener('scroll', showGotopOnScroll);