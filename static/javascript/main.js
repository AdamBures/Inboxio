window.onload = function () {
  const led = document.getElementById("ledPic");
  const button = document.getElementById("btnPic");
  const lcd = document.getElementById("lcdPic");

  const lst = document.getElementById("lstDiv");

  const btn = document.getElementById("btn");
  const btn_save_rpy = document.getElementById("btn_save_rpy");
  const open = document.getElementById("btn_open");

  const pins = document.getElementById("pins");
  const pins_lcd = document.getElementById("lcd_pins")
  const menu = document.getElementById("menu_check");

  var moving = false;
  var newImage;

  var X;
  var Y;

  led.addEventListener("mousedown", initialClick.bind(led), false);
  button.addEventListener("mousedown", initialClick.bind(button), false);
  lcd.addEventListener("mousedown", initialClick.bind(lcd), false);

  btn.addEventListener("mousedown", save_as_py, false);
  btn_save_rpy.addEventListener("mousedown", save_as_rpy, false);
  open.addEventListener("mousedown", open_file, false);

  menu.addEventListener("mousedown", more_components, false);

  function more_components() {
    console.log("Components");
    const components = document.getElementById("menu");
    if (components.style.display === "none") {
      components.style.display = "block";
      const children = components.children;
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        child.addEventListener("mousedown", initialClick.bind(child), false);
      }
    } else {
      components.style.display = "none";
    }
  }


  function show_menu() {
    var submit = document.getElementById('pin_btn');
    var submit2 = document.getElementById('pin_btn2');
    var error = document.getElementById("pin_error");
    var element = this;
    error.innerHTML = "";

    if (element.id === "lcd") {
      console.log(element.id)
      if (pins_lcd.style.display === "none") {
        pins_lcd.style.display = "block";
      } else {
        pins_lcd.style.display = "none";
      }

      var lcd_rs = document.getElementById("lcd_rs");
      var lcd_en = document.getElementById("lcd_en");
      var lcd_d4 = document.getElementById("lcd_d4");
      var lcd_d5 = document.getElementById("lcd_d5");
      var lcd_d6 = document.getElementById("lcd_d6");
      var lcd_d7 = document.getElementById("lcd_d7");
      var lcd_backlight = document.getElementById("lcd_backlight");
      var lcd_columns = document.getElementById("lcd_columns");
      var lcd_rows = document.getElementById("lcd_rows");
      var lcd_message = document.getElementById("lcd_message");

      pins_lcd.style.left = X + 50 + "px";
      pins_lcd.style.top = Y + 50 + "px";
      pins_lcd.style.position = "absolute";

      submit2.onclick = function () {
        console.log("Clicked")
        component.dataset.lcd_rs = lcd_rs.value;
        component.dataset.lcd_en = lcd_en.value;
        component.dataset.lcd_d4 = lcd_d4.value;
        component.dataset.lcd_d5 = lcd_d5.value;
        component.dataset.lcd_d6 = lcd_d6.value;
        component.dataset.lcd_d7 = lcd_d7.value;
        component.dataset.lcd_backlight = lcd_backlight.value;
        component.dataset.lcd_columns = lcd_columns.value;
        component.dataset.lcd_rows = lcd_rows.value;
        component.dataset.message = lcd_message.value;
      }
    }
    else {
      const pins_lst = ["7", "11", "13", "15", "16", "18", "22", "29", "31", "32", "33", "36", "37"];
      if (pins.style.display === "none") {
        pins.style.display = "block";
      } else {
        pins.style.display = "none";
      }

      var input = document.getElementById("pin");
      input.value = "";
      pins.style.left = X + 50 + "px";
      pins.style.top = Y + 50 + "px";
      pins.style.position = "absolute";

      submit.onclick = function () {
        if (pins_lst.includes(input.value)) {
          console.log("Is in list");
          element.dataset.pin = input.value;
          error.innerHTML = ""
          console.log("Clicked");
        }
        else {
          error.innerHTML = "ERROR: Invalid PIN!";
        }
      }

    };

    console.log(X, Y, this.id, this.dataset.pin, element);
  }

  function clearDiv(div) {
    div.innerHTML = "";
  }

  function open_file() {
    // Get a reference to the file input element
    var fileInput = document.getElementById("fileInput");

    // Add an event listener to the file input element to handle when a file is selected
    fileInput.addEventListener('change', function () {
      // Get the selected file
      var file = fileInput.files[0];

      // Create a new FileReader object
      var reader = new FileReader();

      // Add an event listener to the FileReader object to handle when the file is loaded
      reader.addEventListener('load', function () {
        // Get the contents of the file as a string
        var fileContents = reader.result;

        // Do something with the file contents
        var lines = fileContents.split('\n');

        // Loop over the lines in the file
        for (var i = 0; i < lines.length; i++) {
          // Do something with each line
          console.log(lines[i]);
          var type = lines[i].split(' = ')[0];
          var details = lines[i].split(' = ')[1];
          var variables = details.slice(1, -1).split(', ');


          component = document.createElement("img");
          component.src = variables[12];
          component.id = type.slice(0, 2);
          component.className = "component";
          if (type.includes("lcd")) {
            component.dataset.lcd_rs = variables[2];
            component.dataset.lcd_en = variables[3];
            component.dataset.lcd_d4 = variables[4];
            component.dataset.lcd_d5 = variables[5];
            component.dataset.lcd_d6 = variables[6];
            component.dataset.lcd_d7 = variables[7];
            component.dataset.lcd_backlight = variables[8];
            component.dataset.lcd_columns = variables[9];
            component.dataset.lcd_rows = variables[10];
            component.dataset.message = variables[11];
          }
          else {
            component.dataset.pin = "pin";
          }
          component.style.position = "absolute";
          component.style.width = "50px";
          component.style.height = "50px";
          component.style.left = variables[0];
          component.style.top = variables[1];

          clearDiv(lst)
          lst.appendChild(component);
        }
      });

      // Read the contents of the file as a string
      reader.readAsText(file);
    });

    // Simulate a click on the file input element to open the file dialog
    fileInput.click();
  }

  function save_file(filename, text) {
    const file = new Blob([text], { type: 'text/plain' });
    const fileUrl = URL.createObjectURL(file);
    const downloadLink = document.createElement("a");

    downloadLink.href = fileUrl;
    downloadLink.download = filename;

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  function save_as_rpy() {
    var lst = document.getElementById("lstDiv").children;
    var text = "";
    for (var i = 0; i < lst.length; i++) {
      console.log(lst[i]);
      if (lst[i].id === "lcd") {
        text += `${lst[i].id} = (${lst[i].style.left}, ${lst[i].style.top}, ${lst[i].dataset.lcd_rs}, ${lst[i].dataset.lcd_en}, ${lst[i].dataset.lcd_d4}, ${lst[i].dataset.lcd_d5}, ${lst[i].dataset.lcd_d6}, ${lst[i].dataset.lcd_d7}, ${lst[i].dataset.lcd_columns}, ${lst[i].dataset.lcd_rows}, ${lst[i].dataset.lcd_backlight}, ${lst[i].dataset.message}, ${lst[i].src})`;
        text += "\n";
      }
      else {
        text += `${lst[i].id} = (${lst[i].style.left}, ${lst[i].style.top}, ${lst[i].dataset.pin}, ${lst[i].src})`;
        text += "\n";
      }
    }
    save_file("template.rpy", text);
  }

  function save_as_py() {
    var lst = document.getElementById("lstDiv").children;
    var text = "from gpiozero import LED, Button\nfrom Adafruit_CharLCD import Adafruit_CharLCD\n\n";
    var led_count = 1;
    var btn_count = 1;
    var lcd_count = 1;
    for (var i = 0; i < lst.length; i++) {
      if (lst[i].id == "led") {
        text += `led${led_count} = LED(${lst[i].dataset.pin})`;
        text += "\n";
        led_count++;
      }
      if (lst[i].id == "btn") {
        text += `btn${btn_count} = Button(${lst[i].dataset.pin})`;
        text += "\n";
        btn_count++;
      }
      if (lst[i].id == "lcd") {
        text += `lcd${lcd_count} = Adafruit_CharLCD(${lst[i].dataset.lcd_rs}, ${lst[i].dataset.lcd_en}, ${lst[i].dataset.lcd_d4}, ${lst[i].dataset.lcd_d5}, ${lst[i].dataset.lcd_d6}, ${lst[i].dataset.lcd_d7}, ${lst[i].dataset.lcd_columns}, ${lst[i].dataset.lcd_rows}, ${lst[i].dataset.lcd_backlight})`;
        text += "\n";
        text += `lcd${lcd_count}.message(${lst[i].dataset.message})`
        text += "\n";
        lcd_count++;
      }
    }

    save_file("code.py", text);

  };

  function initialClick(e) {
    if (moving) {
      if (this.src === image.src) {
        document.removeEventListener("mousemove", move);
        moving = false;
      }
      return;
    }

    moving = true;
    image = this.getElementsByTagName("img")[0];
    if (image && image.src) {
      newImage = document.createElement("img");
      newImage.src = image.src;
      newImage.style.position = "absolute";
      newImage.style.width = "50px";
      newImage.style.height = "50px";
      newImage.style.left = X + "px";
      newImage.style.top = Y + "px";
      lst.appendChild(newImage);
      document.addEventListener("mousemove", move.bind(this, newImage), false);
      newImage.addEventListener("mouseup", create_img);
    }
  }

  function create_img() {
    if (83 < X) {
      document.removeEventListener("mousemove", move);
      component = document.createElement("img");
      component.src = image.src;
      component.id = image.alt;
      component.className = "component";
      if (image.alt === "lcd") {
        component.dataset.lcd_rs = "lcd_rs";
        component.dataset.lcd_en = "lcd_en";
        component.dataset.lcd_d4 = "lcd_d4";
        component.dataset.lcd_d5 = "lcd_d5";
        component.dataset.lcd_d6 = "lcd_d6";
        component.dataset.lcd_d7 = "lcd_d7";
        component.dataset.lcd_backlight = "lcd_backlight";
        component.dataset.lcd_columns = "lcd_columns";
        component.dataset.lcd_rows = "lcd_rows";
        component.dataset.message = "message";
      }
      else {
        component.dataset.pin = "pin";
      }
      component.style.position = "absolute";
      component.style.width = "50px";
      component.style.height = "50px";
      component.style.left = X + "px";
      component.style.top = Y + "px";
      lst.appendChild(component);
      component.addEventListener("mousedown", show_menu, false);
      moving = false;

      component.addEventListener("mouseover", () => {
        const deleteButton = document.createElement("button");
        deleteButton.id = "delete-button";
        deleteButton.textContent = "X";
        deleteButton.style.position = "absolute";
        deleteButton.style.left = `${parseInt(component.style.left) + 50}px`;
        deleteButton.style.top = `${parseInt(component.style.top) - 10}px`;
        lst.appendChild(deleteButton);

        deleteButton.addEventListener("mousedown", () => {
          component.remove();
          deleteButton.remove();
        });

      });

      component.addEventListener("mouseout", () => {
        console.log("We gone")
        deleteButtonTimeoutId = setTimeout(() => {
          const deleteButton = document.getElementById("delete-button");
          if (deleteButton) {
            deleteButton.remove();
          }
        }, 1000);
      });

      component.addEventListener("mouseenter", () => {
        // clear the timeout if the mouse enters the img element again
        clearTimeout(deleteButtonTimeoutId);
      });
    }

    else {
      newImage.remove();
      moving = false;
    }
  }

  function move(newImage, e) {
    console.log("Moving");
    if (newImage) {
      var newX = e.clientX - 10;
      var newY = e.clientY - 10;
      X = newX;
      Y = newY;
      newImage.style.left = newX + "px";
      newImage.style.top = newY + "px";
    }
  }
};
