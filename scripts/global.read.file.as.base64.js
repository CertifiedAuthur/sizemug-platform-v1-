/**
 * Reads an array of image files and converts them to Base64-encoded strings.
 *
 * @param {FileList|Array<File>} files - An array or FileList of image files to be read.
 * @returns {Promise<Array<string>>} A promise that resolves to an array of Base64-encoded strings of the image files.
 *
 * @example
 * const files = document.querySelector('input[type="file"]').files;
 * readFilesAsBase64(files).then(base64Strings => {
 *   console.log(base64Strings); // Array of Base64-encoded strings
 * }).catch(error => {
 *   console.error(error); // Handle file reading errors
 * });
 */
const readFilesAsBase64 = (files, startsWith = "image") => {
  const promises = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    if (!file.type.startsWith(`${startsWith}/`)) continue;

    const promise = new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onloadend = function () {
        resolve(reader.result); // resolve with the base64 data
      };

      reader.onerror = function () {
        reject(new Error("File reading error"));
      };
    });

    promises.push(promise);
  }

  return Promise.all(promises); // Return a promise that resolves when all files are read
};
