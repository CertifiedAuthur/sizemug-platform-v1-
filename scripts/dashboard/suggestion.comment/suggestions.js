const commentSuggestions = document.getElementById("comment_suggestions");

// Function to render comment suggestion
function renderCommentSuggestion(recommends) {
  commentSuggestions.innerHTML = ""; // clear container

  recommends.forEach((recommend, i) => {
    const html = `
      <div class="scrolling_item" role="button" data-scroll-item-id="${recommend.id}">
          <div>${recommend.hasVideo ? `<video src="${recommend.taskVideo}"></video>` : `<img src="${recommend.taskImages[0]}" alt="${recommend.username}" />`}</div>
          <div>
            <div class="top">
              <img src="${recommend.userPhoto}" alt="" />
              <h4>${recommend.username}</h4>
              <a href="#">Follow</a>
            </div>
            <p>Top 10 places to Visit In Paris | France tfyugihojl</p>
            <time>${recommend.date}</time>
          </div>
      </div>
  `;

    commentSuggestions.insertAdjacentHTML("beforeend", html);
  });
}

//////////////////////////////
//////////////////////////////
// Suggestion Scrolling Events
commentSuggestions.addEventListener("click", (e) => {
  const scrollingItem = e.target.closest(".scrolling_item");

  if (scrollingItem) {
    const { scrollItemId } = scrollingItem.dataset;
    const scrollItem = suggestionScrollingData.find((item) => item.id === +scrollItemId);

    updateSuggestionCommentInterface(scrollItem);
  }
});

function renderCommentListsSuggestion(recommends) {
  landingSuggestionComment.innerHTML = ""; // clear container

  recommends.forEach((recommend, i) => {
    const html = `
                     <div class="comment-contents">
                      <img src="${recommend.photo}" class="comment-sender-avatar rounded-full" />
                      <div class="comment-message-container">
                        <p class="comment-message">${recommend.content}</p>
                        <div class="comment-tlr-group">
                          <span class="comment-time">${recommend.date}</span>
                          <div class="comment-lr-group hidden hide">
                            <span class="comment-l-group"><span class="likes material-symbols-outlined">thumb_up</span><span class="count-likes">2.4k</span></span>
                            <a href="#" class="comment-reply">Reply 1</a>
                            <a href="#" class="w-4 h-4 font-medium material-symbols-outlined">message</a>
                          </div>
                        </div>
                      </div>
                    </div>
  `;

    landingSuggestionComment.insertAdjacentHTML("beforeend", html);
  });
}

const commentUserPhoto = document.querySelector(".suggestion_comment--nav img");
const commentUsername = document.querySelector(".suggestion_comment--nav h2");
const commentTime = document.querySelector(".suggestion_comment--nav time");
const commentAttachmentImages = document.getElementById("attached_images--wrapper");
const commentAttachmentVideo = document.getElementById("attached_video--wrapper");
const landingSuggestionComment = document.getElementById("suggestion_comment");
const suggestionCommentTitle = document.getElementById("suggestion_comment--sections--title");
const suggestionTagsContainer = document.getElementById("part_1--hashtags");
const suggestionVideoPlay = document.getElementById("suggestionVideoPlay");

function updateSuggestionCommentInterface(data) {
  commentUserPhoto.src = data.userPhoto;
  commentUsername.textContent = data.username;
  commentTime.textContent = data.date;
  suggestionCommentTitle.textContent = data.taskTitle;

  // update tags
  suggestionTagsContainer.innerHTML = "";
  data.tags.forEach((tag) => {
    const markup = `<a href="/hashtag.html">${tag}</a>`;
    suggestionTagsContainer.insertAdjacentHTML("beforeend", markup);
  });

  if (data.hasVideo) {
    // Suggestion video
    commentAttachmentImages.classList.add(HIDDEN);
    commentAttachmentVideo.classList.remove(HIDDEN);

    const { taskVideo } = data;

    suggestionVideoPlay.src = taskVideo;

    // Update progress bar
    suggestionVideoPlay.addEventListener("timeupdate", function () {
      const percentage = (this.currentTime / this.duration) * 100;
      document.querySelector(".suggestion-video-progress-track").style.width = `${percentage}%`;
    });
  } else {
    // Suggestion images
    commentAttachmentVideo.classList.add(HIDDEN);
    commentAttachmentImages.classList.remove(HIDDEN);

    commentAttachmentImages.innerHTML = "";
    data.taskImages.forEach((img) => {
      const html = `<img src="${img}" alt="${data.name}" />`;
      commentAttachmentImages.insertAdjacentHTML("beforeend", html);
    });
  }

  // suggestion comment :)
  getLandingModalComments().then((res) => {
    renderSuggestionComments(res);
  });
}

///////////////////////////
///////////////////////////
///////////////////////////
// Suggestion Video handler
const suggestionModalPlayPause = document.getElementById("suggestionModalPlayPause");
const suggestionVideoMute = document.getElementById("suggestionVideoMute");

suggestionModalPlayPause.addEventListener("click", () => {
  const mode = suggestionModalPlayPause.getAttribute("data-mode");

  if (mode === "pause") {
    suggestionModalPlayPause.setAttribute("data-mode", "play");
    suggestionVideoPlay.pause();
  } else {
    suggestionModalPlayPause.setAttribute("data-mode", "pause");
    suggestionVideoPlay.play();
  }
});

// Render Suggestion Comments
function renderSuggestionComments(commentsData) {
  landingSuggestionComment.innerHTML = "";

  function createCommentHtml(comment, isReply = false) {
    return `
        <div class="comment-thread">
          <div class="comment-contents ${isReply ? "reply" : ""}">
            <img src="${comment.photo}" class="comment-sender-avatar rounded-full" />
            <div class="comment-message-container">
              <p class="comment-message">${comment.content}</p>
              <div class="comment-tlr-group">
                <span class="comment-time">${comment.date}</span>
                <div class="comment-lr-group">
                  <button class="comment-l-group">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24"><path fill="black" d="M13.731 3.25a2.09 2.09 0 0 0-1.982 1.464l-.802 2.491a2 2 0 0 1-.442.76a9.5 9.5 0 0 0-1.528 2.218h-.652a2.25 2.25 0 0 0-1.243-.856c-.289-.078-.617-.077-.998-.077h-.168c-.38 0-.71 0-.998.077a2.25 2.25 0 0 0-1.591 1.59c-.078.29-.077.618-.077 1v6.167c0 .38 0 .71.077.998a2.25 2.25 0 0 0 1.59 1.591c.29.078.618.078 1 .077h.167c.38 0 .71 0 .998-.077a2.25 2.25 0 0 0 1.289-.923H15c1.341 0 2.256-.058 2.984-.367a3.87 3.87 0 0 0 1.58-1.24c.465-.618.68-1.426.999-2.622l.04-.148l.691-2.367l.01-.03c.16-.534.293-.98.37-1.35c.078-.379.116-.764.015-1.15a2.35 2.35 0 0 0-.992-1.382c-.339-.219-.717-.296-1.098-.331c-.367-.034-.823-.034-1.364-.034h-2.302c.533-1.695.358-3.066.07-3.977c-.333-1.058-1.342-1.502-2.221-1.502zm-4.98 15v-6.334l-.001-.233h1.182l.294-.636a8 8 0 0 1 1.38-2.064c.35-.377.611-.828.77-1.319l.8-2.49a.59.59 0 0 1 .555-.424h.051c.45 0 .714.21.791.454c.246.779.424 2.15-.416 3.959a.75.75 0 0 0 .68 1.066h3.364c.584 0 .97 0 1.26.027c.285.027.38.072.421.098c.171.11.3.287.356.5c.015.058.027.177-.034.47c-.06.296-.175.68-.347 1.254l-.002.005l-.698 2.386l-.002.008c-.377 1.413-.523 1.91-.79 2.265a2.37 2.37 0 0 1-.967.76c-.409.173-1.026.248-2.398.248zm-3.445-7.475c.071-.019.18-.025.694-.025c.513 0 .623.006.694.025a.75.75 0 0 1 .53.53c.02.072.026.182.026.695v6c0 .513-.006.623-.025.694a.75.75 0 0 1-.53.53c-.072.02-.182.026-.695.026s-.623-.006-.694-.026a.75.75 0 0 1-.53-.53c-.02-.071-.026-.18-.026-.694v-6c0-.513.007-.623.026-.694a.75.75 0 0 1 .53-.53"/></svg>
                    <span class="count-likes">${comment.likes || ""}</span>
                  </button>
                  <button class="add_comment_to_comment">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#000" d="m6.825 12l2.9 2.9q.3.3.288.7t-.313.7q-.3.275-.7.288t-.7-.288l-4.6-4.6q-.3-.3-.3-.7t.3-.7l4.6-4.6q.275-.275.688-.275T9.7 5.7q.3.3.3.713t-.3.712L6.825 10H16q2.075 0 3.538 1.463T21 15v3q0 .425-.288.713T20 19t-.712-.288T19 18v-3q0-1.25-.875-2.125T16 12z"/></svg>
                  </button>
                  ${comment?.replies?.length > 0 ? `<button class="comment-reply">Reply ${isReply ? "2" : "1"}</button>` : ""}
                </div>
              </div>
              <button class="comment-item-option" aria-expanded="false">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="#000" d="M8 2.5a1.22 1.22 0 0 1 1.25 1.17A1.21 1.21 0 0 1 8 4.84a1.21 1.21 0 0 1-1.25-1.17A1.22 1.22 0 0 1 8 2.5m0 8.66a1.17 1.17 0 1 1-1.25 1.17A1.21 1.21 0 0 1 8 11.16m0-4.33a1.17 1.17 0 1 1 0 2.34a1.17 1.17 0 1 1 0-2.34"/></svg>

                <ul class="animation-dropdown">
                  <li role="button" data-type="copy">
                    <span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 7V7C14 6.06812 14 5.60218 13.8478 5.23463C13.6448 4.74458 13.2554 4.35523 12.7654 4.15224C12.3978 4 11.9319 4 11 4H8C6.11438 4 5.17157 4 4.58579 4.58579C4 5.17157 4 6.11438 4 8V11C4 11.9319 4 12.3978 4.15224 12.7654C4.35523 13.2554 4.74458 13.6448 5.23463 13.8478C5.60218 14 6.06812 14 7 14V14" stroke="#33363F" stroke-width="2"></path><rect x="10" y="10" width="10" height="10" rx="2" stroke="#33363F" stroke-width="2"></rect></svg></span>
                    <span>Copy</span>
                  </li>
                  <li role="button" data-type="highlight">
                    <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#33363F" d="M4.95 7.325L4.2 6.6q-.3-.275-.288-.687T4.2 5.2q.3-.3.713-.312t.712.287l.725.725q.275.275.288.688T6.35 7.3q-.275.275-.687.288t-.713-.263M11 4V3q0-.425.288-.712T12 2t.713.288T13 3v1q0 .425-.288.713T12 5t-.712-.288T11 4m6.7 1.875l.7-.7q.275-.275.688-.275t.712.3q.275.275.275.7t-.275.7l-.7.7q-.275.275-.688.288t-.712-.263q-.3-.3-.3-.725t.3-.725M9 20v-3l-2.425-2.425q-.275-.275-.425-.638T6 13.176V11q0-.825.587-1.412T8 9h8q.825 0 1.413.588T18 11v2.175q0 .4-.15.763t-.425.637L15 17v3q0 .825-.587 1.413T13 22h-2q-.825 0-1.412-.587T9 20m2 0h2v-3.825l3-3V11H8v2.175l3 3zm1-4.5"/></svg></span>
                    <span class="text">Highlight</span>
                  </li>
                  <li role="button" data-type="report">
                    <span><svg width="16" height="16" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.1934 17.4805C12.4767 17.4805 12.7144 17.3845 12.9064 17.1925C13.0984 17.0005 13.194 16.7631 13.1934 16.4805C13.1927 16.1978 13.0967 15.9605 12.9054 15.7685C12.714 15.5765 12.4767 15.4805 12.1934 15.4805C11.91 15.4805 11.6727 15.5765 11.4814 15.7685C11.29 15.9605 11.194 16.1978 11.1934 16.4805C11.1927 16.7631 11.2887 17.0008 11.4814 17.1935C11.674 17.3861 11.9114 17.4818 12.1934 17.4805ZM11.1934 13.4805H13.1934V7.48047H11.1934V13.4805ZM8.44336 21.4805L3.19336 16.2305V8.73047L8.44336 3.48047H15.9434L21.1934 8.73047V16.2305L15.9434 21.4805H8.44336ZM9.29336 19.4805H15.0934L19.1934 15.3805V9.58047L15.0934 5.48047H9.29336L5.19336 9.58047V15.3805L9.29336 19.4805Z" fill="#33363F"></path></svg></span>
                    <span>Report</span>
                  </li>
                </ul>
              </button>

              <div class="reply_to_comment ${HIDDEN}">
                <div class="reply_to_comment_tools_wrapper">
                  <div spellcheck="false" contenteditable="true">Add a reply...</div>
                  <button class="commentReplyInputWithEmoji">
                    <!-- prettier-ignore -->
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 16 16"><path fill="#000" d="M6.25 7.75a.75.75 0 1 0 0-1.5a.75.75 0 0 0 0 1.5m-.114 1.917a.5.5 0 1 0-.745.667A3.5 3.5 0 0 0 8 11.5a3.5 3.5 0 0 0 2.609-1.166a.5.5 0 0 0-.745-.667A2.5 2.5 0 0 1 8 10.5c-.74 0-1.405-.321-1.864-.833M10.5 7A.75.75 0 1 1 9 7a.75.75 0 0 1 1.5 0M14 8A6 6 0 1 0 2 8a6 6 0 0 0 12 0M3 8a5 5 0 1 1 10 0A5 5 0 0 1 3 8"/></svg>
                  </button>
                  <button class="commentReplyInputWithGift">
                    <!-- prettier-ignore -->
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M3 9a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1zm9-1v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7m2.5-4a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5a2.5 2.5 0 0 1 0 5"/></g></svg>
                  </button>
                </div>
                <button class="add_new_reply_comment">Add</button>
              </div>
            </div>
          </div>
          ${isReply ? "" : '<div class="reply-connector"></div>'}
        </div>
  `;
  }

  commentsData.forEach((comment) => {
    let commentHtml = createCommentHtml(comment);

    if (comment.replies && comment.replies.length > 0) {
      commentHtml += '<div class="replies">';
      comment.replies.forEach((reply) => {
        commentHtml += createCommentHtml(reply, true);
      });
      commentHtml += "</div>";
    }

    landingSuggestionComment.insertAdjacentHTML("beforeend", commentHtml);
  });

  /////////////////////////////////////////
  /////////////////////////////////////////
  /////////////////////////////////////////
  // Handle comments options
  const commentOptions = landingSuggestionComment.querySelectorAll(".comment-item-option");

  function hideAllCommentOption() {
    const option = document.querySelectorAll(".comment-item-option");
    option.forEach((btn) => btn.setAttribute("aria-expanded", false));
  }

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".comment-item-option")) {
      hideAllCommentOption();
    }
  });

  commentOptions.forEach((option) => {
    option.addEventListener("click", (e) => {
      const commentMessageContainer = e.target.closest(".comment-message-container");

      hideAllCommentOption();

      if (e.target.closest('[data-type="copy"]')) {
        const content = commentMessageContainer.querySelector(".comment-message").textContent;

        navigator.clipboard
          .writeText(content)
          .then(() => {
            showFlashMessage("Text copied to clipboard successfully!", "", "success", 2000);
          })
          .catch((err) => {
            console.error("Failed to copy: ", err);
          });
        return;
      }

      const highlightOption = e.target.closest('[data-type="highlight"]');
      if (highlightOption) {
        const commentMessage = commentMessageContainer.querySelector(".comment-message");

        if (commentMessage.classList.contains("highlighted")) {
          highlightOption.querySelector(".text").textContent = "Highlight";
          commentMessage.classList.remove("highlighted");
        } else {
          highlightOption.querySelector(".text").textContent = "Unhighlight";
          commentMessage.classList.add("highlighted");
        }
        return;
      }

      if (e.target.closest('[data-type="report"]')) {
        return showGlobalReportModal();
      }

      const optionBtn = e.target.closest(".comment-item-option");
      if (optionBtn) {
        const isExpanded = optionBtn.getAttribute("aria-expanded") === "true";

        if (isExpanded) {
          optionBtn.setAttribute("aria-expanded", false);
        } else {
          optionBtn.setAttribute("aria-expanded", true);
        }
      }
    });
  });

  // Like Comment
  const commentLGroup = landingSuggestionComment.querySelectorAll(".comment-l-group");
  commentLGroup.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      const hasLiked = thumb.classList.contains("liked");

      if (hasLiked) {
        thumb.classList.remove("liked");
      } else {
        thumb.classList.add("liked");
      }
    });
  });

  // Show Reply Comments
  const commentReply = landingSuggestionComment.querySelectorAll(".comment-reply");
  commentReply.forEach((reply) => {
    reply.addEventListener("click", () => {
      const commentThread = reply.closest(".comment-thread");
      const nextElementSibling = commentThread.nextElementSibling;

      if (nextElementSibling.classList.contains("replies")) {
        nextElementSibling.classList.remove(HIDDEN);
      }
    });
  });

  // Show Reply To Comment Input
  const addCommentToComment = landingSuggestionComment.querySelectorAll(".add_comment_to_comment");
  addCommentToComment.forEach((form) => {
    form.addEventListener("click", () => {
      const commentThread = form.closest(".comment-thread");
      const replyToComment = commentThread.querySelector(".reply_to_comment");
      const allReplyToComment = landingSuggestionComment.querySelectorAll(".reply_to_comment");

      allReplyToComment.forEach((reply) => reply.classList.add(HIDDEN));
      replyToComment.classList.remove(HIDDEN);
    });
  });

  // Show Emoji Modal
  const commentReplyInputWithEmojis = landingSuggestionComment.querySelectorAll(".commentReplyInputWithEmoji");
  commentReplyInputWithEmojis.forEach((emoji) => {
    emoji.addEventListener("click", (e) => showCommentModalEmoji());
  });

  // Listen for Submit Reply Input content
  const addNewReplyCommentBtns = landingSuggestionComment.querySelectorAll(".add_new_reply_comment");
  addNewReplyCommentBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const replyToComment = btn.closest(".reply_to_comment");
      const editor = replyToComment.querySelector('[contenteditable="true"]');

      if (!editor.innerHTML.length || editor.innerHTML === "Add a reply...") return;

      const newComment = {
        photo: "https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
        content: editor.innerHTML,
        date: "1 seconds ago",
      };

      const markup = createCommentHtml(newComment);

      const commentThread = btn.closest(".comment-thread");
      const nextElementSibling = commentThread.nextElementSibling;

      if (nextElementSibling.classList.contains("replies")) {
        nextElementSibling.insertAdjacentHTML("beforeend", markup);
      } else {
        const replyContainer = document.createElement("div");
        replyContainer.classList.add("replies");

        // Insert it after commentThread
        commentThread.insertAdjacentElement("afterend", replyContainer);

        // Now append the new comment to it
        replyContainer.insertAdjacentHTML("beforeend", markup);

        editor.innerHTML = "Add a reply...";

        // Hide input fields
        return hideAllReplyCommentInputFields();
      }
    });
  });
}

///////////////////////////////////////////
///////////////////////////////////////////
///////////////////////////////////////////
///////////////////////////////////////////
///////////////////////////////////////////
///////////////////////////////////////////
///////////////////////////////////////////
///////////////////////////////////////////
function displaySuggestionCommentSkeleton() {
  const sideSkeleton = Array.from({ length: 15 }, (_, i) => i + 1);

  sideSkeleton.forEach((ske) => {
    const markup = `<div class="scrolling_item_skeleton skeleton---loading"></div>`;
    commentSuggestions.insertAdjacentHTML("beforeend", markup);
  });

  sideSkeleton.forEach((ske, i) => {
    if (i >= 5) return;

    const markup = `
                    <div id="comment_skeleton_loading--item">
                      <div class="comment_profile">
                        <div class="skeleton---loading"></div>
                      </div>

                      <div id="comment_main_content" class="comment_main_content">
                        <div class="skeleton---loading"></div>
                        <div class="skeleton---loading"></div>
                      </div>
                    </div>
    `;

    landingSuggestionComment.insertAdjacentHTML("beforeend", markup);
  });
}

displaySuggestionCommentSkeleton();

// Share event on suggestion comment
const suggestionCommentShareBtn = document.getElementById("suggestion_comment--share");
suggestionCommentShareBtn.onclick = () => {
  showGlobalShareFollowingModal();
};

/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
const suggestionModalTag = document.getElementById("suggestionModalTag");
function updateSuggestionTagModal() {
  const randomNumber = getRandomNumber(1, 15);

  getSuggestionTags(randomNumber).then((comments) => {
    const dataLength = comments.length;
    const sliced4 = comments.slice(0, 4);

    // Update tag list
    suggestionModalTag.innerHTML = "";
    sliced4.forEach((s) => {
      const markup = `<img src="${s.photo}" alt="" class="people-tags" />`;
      suggestionModalTag.insertAdjacentHTML("beforeend", markup);
    });

    // Append the additional container
    if (dataLength >= 5) {
      suggestionModalTag.insertAdjacentHTML("beforeend", `<div class="tags--more people-tags">+${dataLength - 4}</div>`);
    }

    //  Update Comment Tag List Modal
    const commentTags = document.getElementById("comment_tags--list");
    commentTags.innerHTML = "";
    comments.forEach((comment) => {
      const html = `
        <li>
            <img src="${comment.photo}" alt="User Photo" />
            <h2>${comment.name}</h2>
        </li>
        `;
      commentTags.insertAdjacentHTML("beforeend", html);
    });
  });
}

suggestionModalTag.addEventListener("click", showGlobalCommentTagModal);

const suggestionModalReposted = document.getElementById("suggestionModalReposted");
function updateSuggestionReposted() {
  const randomNumber = getRandomNumber(1, 10);

  getSuggestionTags(randomNumber).then((comments) => {
    const dataLength = comments.length;
    const sliced4 = comments.slice(0, 4);

    // Update tag list
    suggestionModalReposted.innerHTML = "";
    sliced4.forEach((s) => {
      const markup = `<img src="${s.photo}" alt="" class="people-tags" />`;
      suggestionModalReposted.insertAdjacentHTML("beforeend", markup);
    });

    // Append the additional container
    if (dataLength >= 5) {
      suggestionModalReposted.insertAdjacentHTML("beforeend", `<div class="tags--more people-tags">+${dataLength - 4}</div>`);
    }
  });
}

suggestionModalReposted.addEventListener("click", showRepostedModal);

/**
 *
 *
 * Suggestion Emoji Handler
 *
 *
 *
 */

// Comment Input With Emoji
const suggestionCommentInputWithEmoji = document.getElementById("suggestionCommentInputWithEmoji");
suggestionCommentInputWithEmoji.addEventListener("click", showCommentModalEmoji);
