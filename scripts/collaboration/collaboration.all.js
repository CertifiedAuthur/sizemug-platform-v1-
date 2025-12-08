function renderCollaboratorsAll(collaborationArray, container) {
  container.innerHTML = "";

  if (!collaborationArray.length) {
    // Update UI to default
    handleSearchPerform("remove", "add");

    return;
  }

  collaborationArray.forEach((collaborate, index) => {
    const html = `
            <div style="position: relative">
                <div class="tab_overflow_item_wrapper">
                  <div>
                    <div class="item_overflow_wrapper">
                      <div class="tab_overflow_item">
                        <div class="right_hand">
                          <div class="user_info">
                            <div class="profile_image" id="profile_image_all--btn--${index}">
                              <div style="position: relative; height: 100%">
                                <img src="${collaborate.profile_image}" alt="${collaborate.name}" title="${collaborate.description}"/>
                                <span class="online_sign"></span>
                              </div>

                              <div class="profile_details_container collaboration-hidden" aria-hidden="true" id="profile_image_all--${index}">
                                <div class="image_wrapper">
                                  <img src="${collaborate.profile_image}" alt="${collaborate.name}" />
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

                                <div title="${collaborate.description}" class="description">${collaborate.description}</div>
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
                          <p>${collaborate.name.split(" ")[0]} is collaborating with:</p>

                          <div class="overlapping_images">
                            ${collaborate.collaborators.map((img, i) => {
                              if (i + 1 > 5) return;

                              return `<img src="${img}" alt="${collaborate.name}" />`;
                            })}
                            <div class="more ${collaborate.collaborators.length < 5 && "collaboration-hidden"}">+${collaborate.collaborators.length - 5}</div>
                            <button class="add ${collaborate.collaborators.length && "collaboration-hidden"}">
                              &#x2b;
                            </button>
                          </div>
                         </div>
                        </div>

                        <div class="left_hand">
                          <div class="left_hand_wrapper">
                            <button class="collaboration_page--btn">
                              <img
                                src="images/collaborate.png"
                                alt="Collaboration"
                              />
                            </button>

                            <button class="shared_collab--btn collab_invite">
                             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 14 14"><path fill="#000000" fill-rule="evenodd" d="M8 3a3 3 0 1 1-6 0a3 3 0 0 1 6 0m2.75 4.5a.75.75 0 0 1 .75.75V10h1.75a.75.75 0 0 1 0 1.5H11.5v1.75a.75.75 0 0 1-1.5 0V11.5H8.25a.75.75 0 0 1 0-1.5H10V8.25a.75.75 0 0 1 .75-.75M5 7c1.493 0 2.834.655 3.75 1.693v.057h-.5a2 2 0 0 0-.97 3.75H.5A.5.5 0 0 1 0 12a5 5 0 0 1 5-5" clip-rule="evenodd"/></svg>
                            </button>

                            <button class="bookmark">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#000" d="m12 18l-4.2 1.8q-1 .425-1.9-.162T5 17.975V5q0-.825.588-1.412T7 3h10q.825 0 1.413.588T19 5v12.975q0 1.075-.9 1.663t-1.9.162z"/></svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>`;

    container.insertAdjacentHTML("beforeend", html);

    // Set up Popper for this dropdown
    const buttonEl = document.getElementById(`profile_image_all--btn--${index}`);
    const dropdownEl = document.getElementById(`profile_image_all--${index}`);

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
