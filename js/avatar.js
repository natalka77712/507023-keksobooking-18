'use strict';

(function () {
  var IMAGE_WIDTH = 70;
  var IMAGE_HEIGHT = 70;
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var fileChooserAvatar = document.querySelector('.ad-form__field input[type=file]');
  var previewAvatar = document.querySelector('.ad-form-header__preview img');
  var fileChooserPhoto = document.querySelector('.ad-form__upload input[type=file]');
  var previewPhoto = document.querySelector('.ad-form__photo');

  var createNewPhoto = function () {
    var photoCard = document.createElement('img');
    photoCard.width = IMAGE_WIDTH;
    photoCard.height = IMAGE_HEIGHT;
    photoCard.style.backgroundSize = 'contain';
    photoCard.style.backgroundPosition = 'center';
    photoCard.style.backgroundRepeat = 'no-repeat';
    return photoCard;
  };

  var deleteImage = function () {
    var image = previewPhoto.querySelectorAll('img');
    image.forEach(function (pic) {
      pic.remove();
    });
  };

  var loadFile = function (chooser, photo) {
    var file = chooser.files[0];
    if (file) {
      var fileName = file.name.toLowerCase();
      var matches = FILE_TYPES.some(function (it) {
        return fileName.endsWith(it);
      });

      if (matches) {
        var reader = new FileReader();
        reader.addEventListener('load', function () {
          photo.src = reader.result;
        });

        reader.readAsDataURL(file);
      }
    }
  };
  var onAvatarLoad = function () {
    loadFile(fileChooserAvatar, previewAvatar);
  };

  var onPhotoLoad = function () {
    loadFile(fileChooserPhoto, previewPhoto.appendChild(createNewPhoto()));
  };

  fileChooserAvatar.addEventListener('change', onAvatarLoad);
  fileChooserPhoto.addEventListener('change', onPhotoLoad);

  window.avatar = {
    deleteImage: deleteImage,
  };
})();
