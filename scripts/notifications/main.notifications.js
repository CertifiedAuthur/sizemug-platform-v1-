/**
 *
 * Type of notification here
 * - comment_reply
 * - comment_like
 * - task_assigned
 * - board_created
 * - board_comment
 * - board_invitation
 * - paper_created
 * - paper_invitation
 * - space_invitation
 * - thread_invitation
 * - collaboration_accepted
 * - collaboration_declined
 * - money_sent
 * - money_received
 * - platform_message
 * - user_suggestion
 *
 */

const notificationsData = [
  // Recent notifications (2 days ago)
  {
    title: "Ameer",
    image: "/icons/notification_icons/Paris-Avatar.png",
    type: "comment_reply",
    description: 'Ameer replied to your comment "Nice Job 🔥"',
    timeAgo: "2 days ago",
    days: 2,
    clicked: false,
    rightIcon: "comment",
    rightImage: "images/Notifications/profile-2.png",
  },
  {
    title: "Ameer",
    image: "/icons/notification_icons/Paris-Avatar.png",
    type: "comment_like",
    description: 'Ameer liked your comment "Nice Job 🔥"',
    timeAgo: "2 days ago",
    days: 2,
    clicked: false,
    rightIcon: "heart",
    rightImage: "images/Notifications/profile-2.png",
  },
  {
    title: "Design Review",
    image: "/icons/notification_icons/Sleek-Avatar.png",
    type: "task_assigned",
    description: 'Ameer assigned you a new task: "Design Review"',
    timeAgo: "2 days ago",
    days: 2,
    clicked: false,
    rightIcon: "task",
    rightImage: "images/Notifications/profile-2.png",
  },
  {
    title: "UX Research",
    image: "/icons/notification_icons/Board-Avatar.png",
    type: "board_created",
    description: 'You created a new board: "UX Research."',
    timeAgo: "2 days ago",
    days: 2,
    clicked: false,
    rightIcon: "board",
  },
  {
    title: "UX Research",
    image: "/icons/notification_icons/Board-Avatar.png",
    type: "board_comment",
    description: 'Ameer commented on your board: "We can improve this 💡"',
    timeAgo: "2 days ago",
    days: 2,
    clicked: false,
    rightIcon: "board",
    rightImage: "images/Notifications/profile-2.png",
  },
  {
    title: "School Essay",
    image: "/icons/notification_icons/Document-Avatar.png",
    type: "paper_created",
    description: 'You created a new paper: "School Essay"',
    timeAgo: "2 days ago",
    days: 2,
    clicked: false,
    rightIcon: "paper",
  },

  // 1 month ago notifications
  {
    title: "UX Design",
    image: "images/Notifications/profile-2.png",
    type: "collaboration_accepted",
    description: "Ameer accepted your collaboration request.",
    timeAgo: "1 month ago",
    days: 30,
    clicked: true,
    rightIcon: "collaboration",
  },
  {
    title: "UX Design",
    image: "images/Notifications/profile-2.png",
    type: "collaboration_declined",
    description: "Ameer declined your collaboration request.",
    timeAgo: "1 month ago",
    days: 30,
    clicked: true,
    rightIcon: "collaboration",
  },
  {
    title: "You",
    image: "/icons/notification_icons/notify-money.svg",
    type: "money_sent",
    description: "You sent $200.00 USD to Ameer",
    timeAgo: "1 month ago",
    days: 30,
    clicked: true,
    rightImage: "images/Notifications/profile-2.png",
  },
  {
    title: "Ameer",
    image: "images/Notifications/profile-2.png",
    type: "money_received",
    description: "Ameer sent you $1,200.00 USD",
    timeAgo: "1 month ago",
    days: 30,
    clicked: true,
    rightIcon: "dollar",
  },
  {
    title: "Sizemug",
    image: "images/sizemug.png",
    type: "platform_message",
    description: "You haven't posted in a while, share something today!",
    timeAgo: "1 month ago",
    days: 30,
    clicked: true,
  },
  {
    title: "Sizemug",
    image: "images/sizemug.png",
    type: "platform_message",
    description: "You have unread messages waiting",
    timeAgo: "1 month ago",
    days: 30,
    clicked: true,
    rightAction: "Messages",
  },
  {
    title: "Wade",
    image: "images/Notifications/profile.png",
    type: "user_suggestion",
    description: "New user suggestions based on your interests.",
    timeAgo: "1 month ago",
    days: 30,
    clicked: true,
    rightAction: "Visit profile",
  },
  {
    title: "UX Research",
    image: "images/Notifications/profile-2.png",
    type: "board_invitation",
    description: 'Ameer is inviting you to a board: "UX Research."',
    timeAgo: "1 month ago",
    days: 30,
    clicked: true,
    rightActions: ["accept", "decline"],
  },
  {
    title: "School Essay",
    image: "images/Notifications/profile-2.png",
    type: "paper_invitation",
    description: 'Ameer is inviting you to a new paper: "School Essay."',
    timeAgo: "1 month ago",
    days: 30,
    clicked: true,
    rightActions: ["accept", "decline"],
    actionButton: "Preview Paper",
  },
  {
    title: "ThinkTank 🧠",
    image: "images/Notifications/profile-2.png",
    type: "space_invitation",
    description: 'Ameer is inviting you to a space: "ThinkTank 🧠"',
    timeAgo: "1 month ago",
    days: 30,
    clicked: true,
    rightActions: ["accept", "decline"],
  },
  {
    title: "ThinkTank 🧠",
    image: "images/Notifications/profile-2.png",
    type: "thread_invitation",
    description: 'Ameer is inviting you to a thread: "Announcement"',
    timeAgo: "1 month ago",
    days: 30,
    clicked: true,
    rightActions: ["accept", "decline"],
  },
];

const mainNotification = document.getElementById("main_notification--list");

// Helper function to generate right content for notifications
function getRightContent(rightIcon, rightImage, rightAction, rightActions) {
  if (rightActions && rightActions.length > 0) {
    return `
      <div class="notification_actions">
        <button class="action_btn accept">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m9.55 18l-5.7-5.7l1.425-1.425L9.55 15.15l9.175-9.175L20.15 7.4z"/></svg>
        </button>
        <button class="action_btn decline">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"/></svg>
        </button>
      </div>
    `;
  }

  if (rightAction) {
    return `<button class="notification_action">${rightAction}</button>`;
  }

  if (rightIcon) {
    const iconMap = {
      comment: '<svg width="24" height="24" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.75 13C3.75 10.1997 3.75 8.79961 4.29496 7.73005C4.77434 6.78924 5.53924 6.02434 6.48005 5.54496C7.54961 5 8.94974 5 11.75 5H18.25C21.0503 5 22.4504 5 23.52 5.54496C24.4608 6.02434 25.2256 6.78924 25.705 7.73005C26.25 8.79961 26.25 10.1997 26.25 13V14.5C26.25 17.3002 26.25 18.7004 25.705 19.77C25.2256 20.7107 24.4608 21.4756 23.52 21.955C22.4504 22.5 21.0503 22.5 18.25 22.5H9.26776C8.93625 22.5 8.6183 22.6317 8.38389 22.8661L5.88389 25.3661C5.09642 26.1536 3.75 25.5959 3.75 24.4822V22.5V16.25V13ZM11.25 10C10.5596 10 10 10.5596 10 11.25C10 11.9403 10.5596 12.5 11.25 12.5H18.75C19.4404 12.5 20 11.9403 20 11.25C20 10.5596 19.4404 10 18.75 10H11.25ZM11.25 15C10.5596 15 10 15.5596 10 16.25C10 16.9404 10.5596 17.5 11.25 17.5H15C15.6904 17.5 16.25 16.9404 16.25 16.25C16.25 15.5596 15.6904 15 15 15H11.25Z" fill="url(#paint0_linear_2644_40747)"/><defs><linearGradient id="paint0_linear_2644_40747" x1="3.75" y1="21.8988" x2="25.3352" y2="8.78202" gradientUnits="userSpaceOnUse"><stop stop-color="#37B6F2"/><stop offset="1" stop-color="#31C6FE"/></linearGradient></defs></svg>',
      heart: '<svg width="24" height="24" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.56335 17.3853L14.3153 25.6068C14.6398 25.9116 14.802 26.064 15 26.064C15.198 26.064 15.3602 25.9116 15.6847 25.6068L15.6847 25.6068L24.4367 17.3853C26.8819 15.0882 27.1788 11.3082 25.1223 8.65758L24.7356 8.15918C22.2753 4.98822 17.337 5.52002 15.6083 9.14206C15.3641 9.6537 14.6359 9.6537 14.3917 9.14206C12.663 5.52002 7.72465 4.98823 5.26443 8.15918L4.87773 8.65759C2.82118 11.3083 3.11813 15.0882 5.56335 17.3853Z" fill="url(#paint0_linear_2644_40765)" stroke="url(#paint1_linear_2644_40765)" stroke-width="2"/><defs><linearGradient id="paint0_linear_2644_40765" x1="1.25" y1="21.625" x2="27.4371" y2="5.49373" gradientUnits="userSpaceOnUse"><stop stop-color="#E592C9"/><stop offset="1" stop-color="#F3627E"/></linearGradient><linearGradient id="paint1_linear_2644_40765" x1="1.25" y1="21.625" x2="27.4371" y2="5.49373" gradientUnits="userSpaceOnUse"><stop stop-color="#E592C9"/><stop offset="1" stop-color="#F3627E"/></linearGradient></defs></svg>',
      task: '<svg width="24" height="24" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_2644_40781)"><path d="M24.4084 4.12605H18.4084C18.1685 3.4132 17.711 2.79363 17.1002 2.35471C16.4894 1.9158 15.7563 1.67969 15.0042 1.67969C14.2521 1.67969 13.5189 1.9158 12.9082 2.35471C12.2974 2.79363 11.8399 3.4132 11.6 4.12605H5.83335C5.62927 4.09653 5.42125 4.11063 5.22302 4.16741C5.02479 4.2242 4.84085 4.32237 4.68335 4.45546C4.52585 4.58855 4.39836 4.75353 4.3093 4.93951C4.22024 5.12549 4.17163 5.32824 4.16669 5.53438V26.8844C4.16778 27.0704 4.2055 27.2544 4.27771 27.4259C4.34991 27.5974 4.45518 27.7529 4.5875 27.8837C4.71983 28.0145 4.87662 28.1179 5.04891 28.1881C5.22121 28.2583 5.40565 28.2938 5.59169 28.2927H24.4084C24.5944 28.2938 24.7788 28.2583 24.9511 28.1881C25.1234 28.1179 25.2802 28.0145 25.4125 27.8837C25.5449 27.7529 25.6501 27.5974 25.7223 27.4259C25.7945 27.2544 25.8323 27.0704 25.8334 26.8844V5.53438C25.8323 5.34834 25.7945 5.16434 25.7223 4.99288C25.6501 4.82142 25.5449 4.66586 25.4125 4.53508C25.2802 4.40431 25.1234 4.30088 24.9511 4.23069C24.7788 4.16051 24.5944 4.12495 24.4084 4.12605ZM9.40835 6.62605C9.40835 6.40504 9.49615 6.19308 9.65243 6.0368C9.80871 5.88052 10.0207 5.79272 10.2417 5.79272H13.1084V5.26772C13.1084 4.75607 13.3116 4.26538 13.6734 3.90359C14.0352 3.5418 14.5259 3.33855 15.0375 3.33855C15.5492 3.33855 16.0399 3.5418 16.4016 3.90359C16.7634 4.26538 16.9667 4.75607 16.9667 5.26772V5.83438H19.8334C20.0544 5.83438 20.2663 5.92218 20.4226 6.07846C20.5789 6.23474 20.6667 6.4467 20.6667 6.66772V8.16772H9.37502L9.40835 6.62605ZM21.5084 14.3177L13.9084 21.9177L9.54169 17.5511C9.32067 17.33 9.19651 17.0303 9.19651 16.7177C9.19651 16.4052 9.32067 16.1054 9.54169 15.8844C9.7627 15.6634 10.0625 15.5392 10.375 15.5392C10.6876 15.5392 10.9873 15.6634 11.2084 15.8844L13.925 18.6011L19.875 12.6511C20.096 12.43 20.3958 12.3059 20.7084 12.3059C21.0209 12.3059 21.3207 12.43 21.5417 12.6511C21.7627 12.8721 21.8869 13.1718 21.8869 13.4844C21.8869 13.7969 21.7627 14.0967 21.5417 14.3177H21.5084Z" fill="#8837E9"/></g><defs><clipPath id="clip0_2644_40781"><rect width="30" height="30" fill="white"/></clipPath></defs></svg>',
      board: '<svg width="24" height="24" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M4.38933 16.2439V9.06515C4.38933 6.69988 5.99608 4.61648 8.2659 3.9883C8.83229 3.83155 9.42469 3.75 10.0122 3.75H11.0846C13.1862 3.75 15.6526 5.38896 16.5579 7.55601C17.5456 7.62575 18.5299 7.76189 19.504 7.96444C22.2509 8.53559 24.4513 10.6556 25.172 13.379C25.7706 15.6412 25.7787 18.0517 25.18 20.3139C24.4481 23.0799 22.2237 25.1934 19.4339 25.7735L19.2397 25.8138C16.4429 26.3954 13.5571 26.3954 10.7603 25.8138L10.5661 25.7735C7.77627 25.1934 5.55192 23.0799 4.81997 20.3139C4.57825 19.4004 4.43544 18.4628 4.3905 17.5205L4.38933 17.5172V17.4955C4.37021 17.0786 4.37024 16.6609 4.38933 16.2439ZM18.3916 10.1854C17.965 10.114 17.5615 10.4035 17.4904 10.8321C17.4193 11.2606 17.7075 11.666 18.1341 11.7374L18.1874 11.7463C20.0384 12.0563 21.3951 13.6652 21.3951 15.5505C21.3951 15.985 21.7457 16.3372 22.1782 16.3372C22.6107 16.3372 22.9613 15.985 22.9613 15.5505C22.9613 12.8961 21.0511 10.6307 18.4448 10.1943L18.3916 10.1854Z" fill="url(#paint0_linear_2644_40898)"/><defs><linearGradient id="paint0_linear_2644_40898" x1="4.375" y1="22.0875" x2="26.1875" y2="10.5511" gradientUnits="userSpaceOnUse"><stop stop-color="#37B6F2"/><stop offset="1" stop-color="#31C6FE"/></linearGradient></defs></svg>',
      paper: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.59998 2.4C1.59998 1.07452 2.67449 0 3.99998 0H17.1313L22.4 5.26862V21.6C22.4 22.9254 21.3254 24 20 24H3.99998C2.67449 24 1.59998 22.9254 1.59998 21.6V2.4ZM6.39998 6.4H11.2V8H6.39998V6.4ZM17.6 11.2H6.39998V12.8H17.6V11.2ZM17.6 16H12.8V17.6H17.6V16Z" fill="#1C64F2"/></svg>',
      collaboration: `<svg width="24" height="24" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.25 7.5C11.25 7.99246 11.347 8.48009 11.5355 8.93506C11.7239 9.39003 12.0001 9.80343 12.3483 10.1517C12.6966 10.4999 13.11 10.7761 13.5649 10.9645C14.0199 11.153 14.5075 11.25 15 11.25C15.4925 11.25 15.9801 11.153 16.4351 10.9645C16.89 10.7761 17.3034 10.4999 17.6517 10.1516C17.9999 9.80343 18.2761 9.39003 18.4645 8.93506C18.653 8.48009 18.75 7.99246 18.75 7.5C18.75 7.00754 18.653 6.51991 18.4645 6.06494C18.2761 5.60996 17.9999 5.19657 17.6516 4.84835C17.3034 4.50013 16.89 4.22391 16.4351 4.03545C15.9801 3.847 15.4925 3.75 15 3.75C14.5075 3.75 14.0199 3.847 13.5649 4.03545C13.11 4.22391 12.6966 4.50013 12.3483 4.84835C12.0001 5.19657 11.7239 5.60997 11.5355 6.06494C11.347 6.51991 11.25 7.00755 11.25 7.5L11.25 7.5Z" stroke="#1C64F2" stroke-width="3"/>
<path d="M5.54727 17.3798C5.12079 17.626 4.74698 17.9539 4.44719 18.3445C4.1474 18.7352 3.9275 19.1812 3.80004 19.6568C3.67259 20.1325 3.64007 20.6286 3.70435 21.1169C3.76863 21.6051 3.92844 22.0759 4.17467 22.5024C4.4209 22.9289 4.74872 23.3027 5.13941 23.6025C5.5301 23.9023 5.97602 24.1222 6.4517 24.2496C6.92737 24.3771 7.4235 24.4096 7.91174 24.3453C8.39998 24.281 8.87079 24.1212 9.29727 23.875C9.72375 23.6288 10.0976 23.301 10.3973 22.9103C10.6971 22.5196 10.917 22.0737 11.0445 21.598C11.1719 21.1223 11.2045 20.6262 11.1402 20.1379C11.0759 19.6497 10.9161 19.1789 10.6699 18.7524C10.4236 18.3259 10.0958 17.9521 9.70512 17.6523C9.31443 17.3525 8.86851 17.1326 8.39284 17.0052C7.91716 16.8777 7.42103 16.8452 6.93279 16.9095C6.44455 16.9738 5.97374 17.1336 5.54726 17.3798L5.54727 17.3798Z" stroke="#1C64F2" stroke-width="3"/>
<path d="M24.4527 17.3798C24.8792 17.626 25.253 17.9539 25.5528 18.3446C25.8526 18.7352 26.0725 19.1812 26.2 19.6568C26.3274 20.1325 26.3599 20.6286 26.2957 21.1169C26.2314 21.6051 26.0716 22.0759 25.8253 22.5024C25.5791 22.9289 25.2513 23.3027 24.8606 23.6025C24.4699 23.9023 24.024 24.1222 23.5483 24.2496C23.0726 24.3771 22.5765 24.4096 22.0883 24.3453C21.6 24.281 21.1292 24.1212 20.7027 23.875C20.2763 23.6288 19.9024 23.301 19.6027 22.9103C19.3029 22.5196 19.083 22.0737 18.9555 21.598C18.8281 21.1223 18.7955 20.6262 18.8598 20.1379C18.9241 19.6497 19.0839 19.1789 19.3301 18.7524C19.5764 18.3259 19.9042 17.9521 20.2949 17.6523C20.6856 17.3525 21.1315 17.1326 21.6072 17.0052C22.0828 16.8777 22.579 16.8452 23.0672 16.9095C23.5555 16.9738 24.0263 17.1336 24.4527 17.3798L24.4527 17.3798Z" stroke="#1C64F2" stroke-width="3"/>
<path d="M19.8672 23.2158C20.1128 23.4729 20.394 23.6946 20.7031 23.873C21.1295 24.1192 21.5998 24.2795 22.0879 24.3438C22.4529 24.3918 22.8226 24.3855 23.1846 24.3262C23.1665 24.3445 23.1501 24.3646 23.1318 24.3828C22.064 25.4507 20.7956 26.298 19.4004 26.876C18.0053 27.4538 16.51 27.751 15 27.751C13.49 27.751 11.9947 27.4538 10.5996 26.876C9.20442 26.298 7.936 25.4507 6.86816 24.3828C6.84977 24.3644 6.83272 24.3447 6.81445 24.3262C7.17669 24.3857 7.54683 24.3918 7.91211 24.3438C8.40017 24.2794 8.87054 24.1192 9.29688 23.873C9.60583 23.6947 9.88628 23.4727 10.1318 23.2158C10.6359 23.5679 11.1764 23.8671 11.7471 24.1035C12.7783 24.5307 13.8838 24.751 15 24.751C16.1162 24.751 17.2217 24.5307 18.2529 24.1035C18.8234 23.8672 19.3633 23.5677 19.8672 23.2158ZM12.0977 5.125C11.8653 5.40875 11.676 5.72635 11.5352 6.06641C11.3468 6.52121 11.25 7.00871 11.25 7.50098C11.25 7.85718 11.301 8.21114 11.4004 8.55176C10.5056 8.96993 9.68904 9.5405 8.98926 10.2402C8.20011 11.0294 7.57462 11.967 7.14746 12.998C6.77375 13.9003 6.55871 14.8597 6.51074 15.833L6.5 16.251C6.5 16.4955 6.51221 16.7396 6.5332 16.9824C6.18807 17.0666 5.85573 17.1996 5.54688 17.3779C5.12051 17.6241 4.74701 17.9522 4.44727 18.3428C4.22323 18.6347 4.04363 18.9578 3.91406 19.3008C3.64136 18.3092 3.5 17.2837 3.5 16.251C3.50005 14.7411 3.79726 13.2456 4.375 11.8506C4.95293 10.4555 5.80037 9.18693 6.86816 8.11914C7.936 7.05136 9.20445 6.20387 10.5996 5.62598C11.0877 5.42382 11.5886 5.25775 12.0977 5.125ZM17.9014 5.125C18.4107 5.25778 18.912 5.4237 19.4004 5.62598C20.7956 6.20387 22.064 7.05136 23.1318 8.11914C24.1996 9.18693 25.0471 10.4555 25.625 11.8506C26.2027 13.2456 26.5 14.7411 26.5 16.251C26.5 17.2838 26.3577 18.3091 26.085 19.3008C25.9554 18.9579 25.7767 18.6347 25.5527 18.3428C25.253 17.9522 24.8795 17.6241 24.4531 17.3779C24.144 17.1995 23.8112 17.0666 23.4658 16.9824C23.4868 16.7396 23.5 16.4955 23.5 16.251C23.5 15.1349 23.2797 14.0292 22.8525 12.998C22.4254 11.967 21.7999 11.0294 21.0107 10.2402C20.3108 9.54029 19.4938 8.96996 18.5986 8.55176C18.6981 8.21107 18.75 7.85725 18.75 7.50098C18.75 7.00873 18.6532 6.52119 18.4648 6.06641C18.3239 5.72619 18.1338 5.40885 17.9014 5.125Z" fill="#1C64F2"/>
</svg>`,
      dollar: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.48 12.0037C17.641 11.3005 16.5745 10.9272 15.48 10.9537H8.44502C8.12427 10.9618 7.80517 10.9051 7.50685 10.787C7.20852 10.6689 6.9371 10.4918 6.70882 10.2663C6.48054 10.0409 6.30011 9.77164 6.17832 9.4748C6.05653 9.17795 5.99589 8.85958 6.00002 8.53875C5.9922 8.41387 5.9922 8.28863 6.00002 8.16375C6.09461 7.59046 6.39522 7.07141 6.84541 6.70407C7.29561 6.33674 7.86441 6.14638 8.44502 6.16875H15.375C15.9403 6.16825 16.4874 6.36856 16.9187 6.73395C17.3501 7.09934 17.6376 7.60607 17.73 8.16375H19.98C19.8858 7.00715 19.3598 5.92835 18.5066 5.14184C17.6534 4.35532 16.5354 3.91869 15.375 3.91875H13.005V0.46875H11.13V3.91875H8.44502C7.2846 3.91869 6.16664 4.35532 5.31342 5.14184C4.46021 5.92835 3.93421 7.00715 3.84002 8.16375C3.83254 8.28864 3.83254 8.41386 3.84002 8.53875C3.84002 9.14349 3.95914 9.7423 4.19056 10.301C4.42198 10.8597 4.76118 11.3674 5.1888 11.795C6.0524 12.6586 7.2237 13.1437 8.44502 13.1437H15.555C15.8732 13.1357 16.1898 13.1915 16.4862 13.3078C16.7825 13.424 17.0525 13.5985 17.2804 13.8207C17.5083 14.043 17.6893 14.3086 17.8129 14.602C17.9365 14.8953 18.0001 15.2104 18 15.5287C18.0156 15.6984 18.0156 15.8691 18 16.0387C17.8809 16.5665 17.5859 17.0381 17.1634 17.3761C16.7409 17.7141 16.2161 17.8984 15.675 17.8987H8.62502C8.08397 17.8984 7.55912 17.7141 7.13663 17.3761C6.71414 17.0381 6.41912 16.5665 6.30002 16.0387H4.03502C4.16393 17.1658 4.70298 18.206 5.54945 18.9612C6.39592 19.7164 7.49064 20.1337 8.62502 20.1337H11.13V23.5387H13.005V20.1337H15.555C16.6894 20.1337 17.7841 19.7164 18.6306 18.9612C19.4771 18.206 20.0161 17.1658 20.145 16.0387V15.5287C20.1432 14.855 19.9931 14.1899 19.7054 13.5807C19.4176 12.9715 18.9993 12.4331 18.48 12.0037Z" fill="#01C749"/></svg>',
    };

    return `
      <div class="notification_icon">
        <span class="notification_icon_element">
          ${iconMap[rightIcon] || ""}
        </span>
        ${rightImage ? `<img src="${rightImage}" alt="" class="notification_user_avatar" />` : ""}
      </div>
    `;
  }

  if (rightImage) {
    return `<img src="${rightImage}" alt="" class="notification_user_avatar" />`;
  }

  return "";
}

async function renderMainNotificationLists() {
  const fakeNotification = document.getElementById("fake_notification--content");
  const originalNotification = document.getElementById("original_notification--content");

  // Simulate fetching delay to show skeleton loader
  await new Promise((resolve) => setTimeout(resolve, 2000));

  mainNotification.innerHTML = ""; // clear any existing content
  if (fakeNotification) fakeNotification.remove(); // remove fake loading from DOM
  if (originalNotification) originalNotification.classList.remove(HIDDEN);

  const recents = notificationsData.filter((notify) => notify.days === 2);
  const monthAgo = notificationsData.filter((notify) => notify.days === 30);

  // Recent (2 days ago)
  if (recents.length > 0) {
    recents.forEach((recent, i) => {
      const { title, image, description, clicked, timeAgo, rightIcon, rightImage, rightAction, rightActions, actionButton } = recent;
      const isImageRounded = ["platform_message", "collaboration_accepted", "collaboration_declined"].includes(recent.type);

      const markup = `
          <li class="notification_item ${!clicked ? "unread" : ""}" data-type="${recent.type}">
            <div class="notification_left">
              <div class="notification_avatar">
                ${!clicked ? '<span class="unread_dot"></span>' : ""}
                <img src="${image}" alt="${title}" class="${isImageRounded ? "rounded" : ""}"/>
              </div>
              <div class="notification_content">
                <div class="notification_header">
                  <span class="notification_sender">${title}</span>
                  &bull;
                  <span class="notification_time">${timeAgo}</span>
                </div>
                <p class="notification_message">${description}</p>
                ${actionButton ? `<button class="notification_action_btn">${actionButton}</button>` : ""}
              </div>
            </div>
            <div class="notification_right">
              ${getRightContent(rightIcon, rightImage, rightAction, rightActions)}
            </div>
          </li>
        `;

      mainNotification.insertAdjacentHTML("beforeend", markup);
    });
  }

  // 1 month ago
  if (monthAgo.length > 0) {
    monthAgo.forEach((month, i) => {
      const { title, image, description, clicked, timeAgo, rightIcon, rightImage, rightAction, rightActions, actionButton } = month;
      const isImageRounded = ["platform_message", "collaboration_accepted", "collaboration_declined"].includes(month.type);

      const markup = `
          <li class="notification_item ${!clicked ? "unread" : ""}" data-type="${month.type}">
            <div class="notification_left">
              <div class="notification_avatar">
                ${!clicked ? '<span class="unread_dot"></span>' : ""}
                <img src="${image}" alt="${title}" class="${isImageRounded ? "rounded" : ""}"/>
              </div>
              <div class="notification_content">
                <div class="notification_header">
                  <span class="notification_sender">${title}</span>
                   &bull;
                  <span class="notification_time">${timeAgo}</span>
                </div>
                <p class="notification_message">${description}</p>
                ${actionButton ? `<button class="notification_action_btn">${actionButton}</button>` : ""}
              </div>
            </div>
            <div class="notification_right">
              ${getRightContent(rightIcon, rightImage, rightAction, rightActions)}
            </div>
          </li>
        `;

      mainNotification.insertAdjacentHTML("beforeend", markup);
    });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  renderMainNotificationLists();
});

document.querySelectorAll(".overlay").forEach((overlay) => {
  overlay.addEventListener("click", (e) => {
    e.stopPropagation();

    if (e.target.classList.contains("overlay")) {
      e.target.classList.add(HIDDEN);
    }
  });
});
