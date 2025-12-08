const SIZEMUG_USER = "sizemug-user";

/**
 * Retrieves a dummy user object from local storage.
 * If the user object does not exist in local storage, it initializes an empty user object and stores it.
 *
 * @returns {Object} The dummy user object.
 */
function getDummyUser() {
  let user;

  if (!localStorage.getItem(SIZEMUG_USER)) {
    user = {};
    localStorage.setItem(SIZEMUG_USER, JSON.stringify(user));
  } else {
    user = JSON.parse(localStorage.getItem(SIZEMUG_USER));
  }

  return user;
}

getDummyUser();

/**
 * Updates the user's profile photo with a new image.
 *
 * This function updates the profile image displayed in the header and
 * stores the updated user information in local storage. If no new image
 * is provided, it will use the existing user image or a default profile image.
 *
 * @param {string} newImage - The URL of the new profile image.
 *
 * @example
 * // Update the profile photo with a new image URL
 * updateUserProfilePhoto('https://example.com/new-profile-photo.jpg');
 *
 * @remarks
 * - The function assumes that `getDummyUser` returns a user object.
 * - The function uses `DEFAULT_PROFILE_IMAGE` as a fallback image.
 * - The function stores the updated user object in local storage under the key `SIZEMUG_USER`.
 */
const DEFAULT_PROFILE_IMAGE = "./images/profileImages/no-profile.png";

function updateUserProfilePhoto(newImage) {
  const profileHeaderImg = document.getElementById("profileHeaderImg");
  const user = getDummyUser();

  user.image = newImage || DEFAULT_PROFILE_IMAGE;
  profileHeaderImg.src = user.image;
  localStorage.setItem(SIZEMUG_USER, JSON.stringify(user));
}
