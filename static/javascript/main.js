window.onload = function () {
  function handleFileSelect(event) {
    event.stopPropagation();
    event.preventDefault();

    var files = event.dataTransfer.files; // Retrieve the file list from the event

    // Process the files
    for (var i = 0, file; file = files[i]; i++) {
            // Perform any necessary operations with the file
      console.log(file.name);
      console.log(file.size);
      console.log(file.type);
    }
  }

  function handleDragOver(event) {
    event.stopPropagation();
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy'; // Set the drop effect to copy
  }
};
