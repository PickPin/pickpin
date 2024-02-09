
// 画像アップロードイベントハンドラ
document.addEventListener('turbo:load', function () {
    const postForm = document.getElementById('imageForm');
    if (!postForm) return;
  
    const fileField = document.querySelector('input[type="file"]');
    fileField.addEventListener('change', function (e) {
      const file = e.target.files[0];
      const blob = window.URL.createObjectURL(file);
      const cancel_upload_button = document.getElementById("cancel-upload");
  
      // 'image-upload'クラスを持つ要素の背景画像を設定
      const imageUploadElement = document.querySelector('.image-upload');
      if (imageUploadElement && cancel_upload_button) {
        imageUploadElement.style.backgroundImage = `url(${blob})`;
        imageUploadElement.style.backgroundSize = 'cover'; // 背景画像のサイズ調整
        imageUploadElement.style.backgroundPosition = 'center'; // 背景画像を中央に配置
        cancel_upload_button.style.display = "block";
      }
    });
  });
  
  // 画像アップロードキャンセルボタンイベントリスナー
  const cancelUploadButton = document.getElementById('cancel-upload');
  cancelUploadButton.addEventListener('click', (e) => {
    const fileField = document.querySelector('input[type="file"]');
    const imageUploadElement = document.querySelector('.image-upload');
    const cancel_upload_button = document.getElementById("cancel-upload");
    e.preventDefault();
    if (fileField) {
      fileField.value = '';
      if (imageUploadElement) {
        cancel_upload_button.style.display = "none";
        imageUploadElement.style.backgroundImage = "none";
      }
    }
  });
  
