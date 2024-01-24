import { Controller } from "@hotwired/stimulus"

let data = null;

export default class extends Controller {
  static targets = [ "output", "input"];
  
  connect() {
    data = new DataTransfer();
  }

  readImage(e) {
    let input = this.inputTarget;
    let output = this.outputTarget;

    if (input.files) {
      let files = Array.from(input.files);
      
      files.forEach((f) => data.items.add(f));
      for (let i = 0; i < files.length; i++) {
        this.readOne(files[i], i, output);
      }
      input.files = data.files;
    }
  }

  readOne(f, index, output) {
    let reader = new FileReader();
    reader.readAsDataURL(f);
    reader.onload = () => {
      const html= `<li>
                  <div>
                    <image src="${reader.result}"/>
                  </div>
                </li>`;
      output.insertAdjacentHTML('beforeend', html);
    };
  }
}