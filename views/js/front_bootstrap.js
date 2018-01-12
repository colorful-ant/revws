(function() {
  var tag = document.createElement('script');
  tag.src = window.revwsData.appJsUrl;
  tag.setAttribute('defer', '');
  tag.setAttribute('async', '');
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  $(function() {
    $('[data-revws-create-trigger]').click(function(e) {
      e.preventDefault();
      if (window.revws) {
        window.revws({
          type: 'TRIGGER_CREATE_REVIEW'
        })
      }
    });
  })
})();