
(function($) {
  
  "use strict";  

  $(window).on('load', function() {
  	
    /* Page Loader active
    ========================================================*/
    $('#preloader').fadeOut();

    $('[data-toggle="tooltip"]').tooltip()

	$('[data-toggle="popover"]').popover()
  
  });      

}(jQuery));

  ///  Review và xử lý anh 
  function previewImages() {

    var preview = document.querySelector('.img-post-field');
    
    if (this.files) {
      [].forEach.call(this.files, readAndPreview);
    }
    function readAndPreview(file) {
      if (!/\.(jpe?g|png|gif)$/i.test(file.name)) {
        return alert(file.name + " is not an image");
      } 
      var reader = new FileReader();
      
      reader.addEventListener("load", function() {
        var image = new Image();
        image.style.height  = 'auto';
        image.title  = file.name;
        image.src    = this.result;
        image.className +=  'rounded form-control';
        preview.appendChild(image);
      }); 
      reader.readAsDataURL(file);
    }
  }

  $( document ).ready(function() {
    document.querySelector('#upload-photo').addEventListener("change", previewImages);
    $( "#upload-photo" ).change(function() {
      previewImages()
      $('#modal-post').modal('show')
    });
  
    $(".edit-img-post" ).click(function() {
      $('#upload-photo').trigger('click'); 
    });

    $(".remove-img-post" ).click(function() {
      $('#upload-photo').val(""); 
      $('.img-post-field img').remove('img');
      // $('.edit-post-field').css({"display": "none"});
    });
  });

    
