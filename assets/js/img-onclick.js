const thumbnails = document.querySelectorAll('.thumb');

thumbnails.forEach((thumb) => {
  thumb.addEventListener('click', function () {
    document.getElementById('mainImage').src = this.src;
  });
});
