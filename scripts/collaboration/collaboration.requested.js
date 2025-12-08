function renderCollaboratorsRequested(collaborationArray, container) {
  container.innerHTML = "";

  collaborationArray.forEach((collaborate, index) => {
    const html = `
            <div style="position: relative">
                <div class="tab_overflow_item_wrapper">
                  <div>
                    <div class="item_overflow_wrapper">
                      <div class="tab_overflow_item start_collaboration--layout">
                        <div class="right_hand">
                          <div class="user_info">
                            <div class="profile_image" id="profile_image_requested--btn--${index}">
                              <div style="position: relative; height: 100%">
                                <img src="${collaborate.profile_image}" alt="${
      collaborate.name
    }" title="${collaborate.description}" />
                                <span class="online_sign"></span>
                              </div>

                              <div class="profile_details_container collaboration-hidden"  aria-hidden="true" id="profile_image_requested--${index}">
                                <div class="image_wrapper">
                                  <img src="${
                                    collaborate.profile_image
                                  }" alt="${collaborate.name}" />
                                </div>

                                <div class="info">
                                  <div>
                                     <h2>${collaborate.name}</h2>
                                    <p>
                                      Psychologist/Expert in Behavior
                                      Modification
                                    </p>
                                  </div>

                                  <div class="location-subject">
                                    <div>
                                      <img
                                        src="images/subject1.png"
                                        alt="Subject"
                                      />
                                      <span>${collaborate.subject}</span>
                                    </div>

                                    <div class="location">
                                      <img
                                        src="icons/red_location.svg"
                                        alt="Location"
                                      />
                                      <span>${collaborate.location}</span>
                                    </div>
                                  </div>

                                  <button>Request</button>
                                </div>
                              </div>
                            </div>

                            <div class="content">
                              <div class="name">
                                <h2 title="User name">${collaborate.name}</h2>

                                <span>Online</span>
                              </div>

                                <div title="${
                                  collaborate.description
                                }" class="description">${
      collaborate.description
    }</div>
                            </div>
                          </div>

                          <div class="marketing_location">
                            <div class="row">
                              <img
                                src="images/collaboration-marketing.png"
                                alt="Marketing"
                              />

                              <span>${collaborate.subject}</span>
                            </div>

                            <div class="row">
                              <img
                                src="images/collaboration-location.png"
                                alt="Collaboration"
                              />
                              <span>${collaborate.location}</span>
                            </div>
                          </div>

                         <div class="collaborators">
                          <p>${
                            collaborate.name.split(" ")[0]
                          } is collaborating with:</p>

                          <div class="overlapping_images">
                            ${collaborate.collaborators.map((img, i) => {
                              if (i + 1 > 5) return;

                              return `<img src="${img}" alt="${collaborate.name}" />`;
                            })}
                            <div class="more ${
                              collaborate.collaborators.length < 5 &&
                              "collaboration-hidden"
                            }">+${collaborate.collaborators.length - 5}</div>
                            <button class="add ${
                              collaborate.collaborators.length &&
                              "collaboration-hidden"
                            }">
                              &#x2b;
                            </button>
                          </div>
                         </div>
                        </div>

                        <div class="left_hand">
                          <button class="start_collaboration collaboration_page--btn">Start</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>`;

    container.insertAdjacentHTML("beforeend", html);

    // Set up Popper for this dropdown
    const buttonEl = document.getElementById(
      `profile_image_requested--btn--${index}`
    );
    const dropdownEl = document.getElementById(
      `profile_image_requested--${index}`
    );

    const popperInstance = Popper.createPopper(buttonEl, dropdownEl, {
      placement: "bottom-end",
      modifiers: [
        {
          name: "offset",
          options: {
            offset: [0, 8],
          },
        },
      ],
    });

    // Add click event listener to toggle dropdown
    buttonEl.addEventListener("click", () => {
      const dropdownStatus = JSON.parse(dropdownEl.ariaHidden);

      if (dropdownStatus) {
        hideAllProfileDropdown();
        dropdownEl.classList.remove(COLLABORATIONHIDDEN);
        popperInstance.update();
        dropdownEl.ariaHidden = false;
      } else {
        hideAllProfileDropdown();
      }
    });
  });
}
