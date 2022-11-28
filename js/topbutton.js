export function topButton() {
  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      $('#top_btn').addClass('on');
    } else {
      $('#top_btn').removeClass('on');
    }
  });

  $('#top_btn').click(function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
