let slideIndex = 0;
const slides = document.querySelectorAll(".slide");

function showSlide(index) {
    slides.forEach((slide) => slide.classList.remove("active"));
    slideIndex = (index + slides.length) % slides.length;
    slides[slideIndex].classList.add("active");
}

function moveSlide(step) {
    showSlide(slideIndex + step);
}