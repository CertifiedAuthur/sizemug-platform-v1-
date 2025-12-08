const CONSTANT = {
  POINTER: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#8837e9" d="M20.978 13.21a1 1 0 0 0-.396-1.024l-14-10a.999.999 0 0 0-1.575.931l2 17a1 1 0 0 0 1.767.516l3.612-4.416l3.377 5.46l1.701-1.052l-3.357-5.428l6.089-1.218a1 1 0 0 0 .782-.769"/></svg>`,
  PEN_SVG: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><path fill="#8b5cf6" d="M20.849 8.713a3.932 3.932 0 0 0-5.562-5.561l-.887.887l.038.111a8.75 8.75 0 0 0 2.093 3.32a8.75 8.75 0 0 0 3.43 2.13z" opacity="1"/><path fill="#8b5cf6" d="m14.439 4l-.039.038l.038.112a8.75 8.75 0 0 0 2.093 3.32a8.75 8.75 0 0 0 3.43 2.13l-8.56 8.56c-.578.577-.867.866-1.185 1.114a6.6 6.6 0 0 1-1.211.748c-.364.174-.751.303-1.526.561l-4.083 1.361a1.06 1.06 0 0 1-1.342-1.341l1.362-4.084c.258-.774.387-1.161.56-1.525q.309-.646.749-1.212c.248-.318.537-.606 1.114-1.183z"/></svg>`,
  HAND_SVG: `<svg width="27" height="26" viewBox="0 0 27 26" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.0801 1.00684C14.6473 0.962489 15.2366 1.14694 15.6689 1.66895C16.0523 2.13189 16.2249 2.75788 16.2891 3.43457C16.341 3.98193 16.4211 5.33395 16.5059 6.6709C16.7253 5.56505 16.9237 4.5334 16.9814 4.19629V4.19434C17.0522 3.78771 17.1951 3.22953 17.5322 2.75781C17.9081 2.23206 18.5141 1.83972 19.3408 1.86719L19.3398 1.86816C19.7082 1.88002 20.0627 1.96944 20.374 2.16406C20.6868 2.35967 20.8982 2.62434 21.0352 2.89258C21.2879 3.38798 21.3047 3.9347 21.3047 4.24316V4.24902C21.3027 4.61616 21.1598 5.91132 20.998 7.22168C20.9364 7.72132 20.8687 8.24125 20.8018 8.74023C20.9589 8.41831 21.1303 8.07105 21.3174 7.70801L21.3193 7.70605C21.7791 6.81903 22.3665 6.25099 23.0547 6.02051C23.7361 5.79234 24.3545 5.95104 24.748 6.19336C25.3414 6.55853 25.4996 7.19516 25.5 7.7002C25.5003 8.14551 25.3886 8.64517 25.1982 9.17969L25.1113 9.41016C24.8953 9.9657 24.4737 11.114 24.0967 12.1904C23.9084 12.7279 23.7335 13.2406 23.6025 13.6484C23.5369 13.8528 23.4836 14.0249 23.4463 14.1572C23.4037 14.3081 23.3965 14.3558 23.3984 14.3408C23.3207 14.9595 23.213 16.543 22.8438 18.1572C22.4775 19.7585 21.8053 21.648 20.4375 22.8652V22.8662C16.8089 26.0925 12.204 25.12 9.60059 23.4824H9.59961C8.27529 22.6487 7.08483 21.3605 6.01172 20.1846C4.89216 18.9578 3.8936 17.8464 2.85645 17.1191V17.1182C2.53624 16.8963 2.24698 16.6522 2.01953 16.3838C1.79525 16.119 1.58583 15.7777 1.52051 15.3682C1.44943 14.9222 1.56525 14.4903 1.83594 14.1367C2.02277 13.8928 2.2637 13.7101 2.5166 13.5713L2.77148 13.4463C3.62757 13.0732 4.54685 13.2623 5.19727 13.4912C5.88132 13.732 6.49286 14.097 6.87305 14.3584L7.79199 14.999C8.03589 15.1735 8.27984 15.3542 8.55273 15.5625C8.60952 15.0769 8.57792 14.3137 8.39844 13.3809L8.39746 13.376C8.27808 12.7403 7.92327 11.2736 7.57324 9.69434C7.24105 8.19554 6.89727 6.52802 6.87402 5.67969C6.84925 4.77452 7.08492 3.99828 7.67676 3.49219C8.24469 3.00662 8.93018 2.9537 9.39941 2.99414H9.40039C10.2501 3.06788 10.7255 3.71314 10.9531 4.13184C11.1381 4.47209 11.2616 4.843 11.3428 5.15234L11.4102 5.43848L11.4111 5.44141C11.4712 5.72484 11.6486 6.46002 11.8936 7.33496C11.8922 7.2907 11.891 7.24641 11.8896 7.20215C11.8457 5.72873 11.8222 4.11022 11.8867 3.46777C11.9575 2.74921 12.1941 2.13937 12.6191 1.69238C13.0491 1.24029 13.5857 1.04606 14.0781 1.00684H14.0801Z" stroke="#000000" stroke-width="2" /></svg>`,
  TEXT_SVG: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 12h4M9 4a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3m6-16a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3"/></svg>`,
  LOCK_SVG: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="#222222"><path d="M4.5 13.5c0-1.886 0-2.828.586-3.414S6.614 9.5 8.5 9.5h7c1.886 0 2.828 0 3.414.586s.586 1.528.586 3.414v1c0 2.828 0 4.243-.879 5.121c-.878.879-2.293.879-5.121.879h-3c-2.828 0-4.243 0-5.121-.879C4.5 18.743 4.5 17.328 4.5 14.5z"/><path stroke-linecap="round" d="M16.5 9.5V8A4.5 4.5 0 0 0 12 3.5v0A4.5 4.5 0 0 0 7.5 8v1.5"/></g></svg>`,
  UNLOCK_SVG: `<svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24"><g fill="none"><path stroke="white" d="M4 13c0-1.885 0-2.828.586-3.414S6.114 9 8 9h8c1.886 0 2.828 0 3.414.586S20 11.115 20 13v2c0 2.829 0 4.243-.879 5.122C18.243 21 16.828 21 14 21h-4c-2.828 0-4.243 0-5.121-.878C4 19.242 4 17.829 4 15z" /><path stroke="white" stroke-linecap="round" d="m16.5 9l.078-.62a5.52 5.52 0 0 0-2.41-5.273v0a5.52 5.52 0 0 0-6.68.416l-.818.709" /></g></svg>`,
  DELETE_SVG: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="#F43F5E" stroke-linecap="round" d="M9.5 14.5v-3m5 3v-3M3 6.5h18v0c-1.404 0-2.107 0-2.611.337a2 2 0 0 0-.552.552C17.5 7.893 17.5 8.596 17.5 10v5.5c0 1.886 0 2.828-.586 3.414s-1.528.586-3.414.586h-3c-1.886 0-2.828 0-3.414-.586S6.5 17.386 6.5 15.5V10c0-1.404 0-2.107-.337-2.611a2 2 0 0 0-.552-.552C5.107 6.5 4.404 6.5 3 6.5zm6.5-3s.5-1 2.5-1s2.5 1 2.5 1"/></svg>`,
  COMMENT_SVG: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none"><path fill="#222222" d="m4.827 7.138l.445.227zm.441 11.594l.354.353zm12.594-2.559l-.227-.445zm1.311-1.311l-.445-.227zm0-7.724l-.445.227zm-1.311-1.311l.227-.446zm-11.724 0l.227.445zm1.07 10.966l.353.353zM5 10.3c0-.848 0-1.455.04-1.93c.038-.469.11-.766.232-1.005l-.89-.454c-.206.403-.296.847-.34 1.378C4 8.814 4 9.469 4 10.3zm0 1.2v-1.2H4v1.2zm-1 0v5h1v-5zm0 5v1.914h1V16.5zm0 1.914c0 .846 1.023 1.27 1.622.671l-.707-.707a.1.1 0 0 1 .028-.013l.026.002a.06.06 0 0 1 .03.046zm1.622.671l1.939-1.939l-.707-.707l-1.94 1.94zM14.7 16H7.914v1H14.7zm2.935-.273c-.239.122-.536.195-1.005.234c-.476.039-1.082.039-1.93.039v1c.832 0 1.486 0 2.011-.043c.531-.043.975-.133 1.378-.338zm1.092-1.092a2.5 2.5 0 0 1-1.092 1.092l.454.892a3.5 3.5 0 0 0 1.53-1.53zM19 11.7c0 .848 0 1.455-.04 1.93c-.038.469-.11.766-.233 1.005l.892.454c.205-.403.295-.847.338-1.378c.043-.525.043-1.18.043-2.011zm0-1.4v1.4h1v-1.4zm-.273-2.935c.122.239.195.536.234 1.005C19 8.845 19 9.452 19 10.3h1c0-.832 0-1.486-.043-2.011c-.043-.531-.133-.975-.338-1.378zm-1.092-1.093a2.5 2.5 0 0 1 1.092 1.093l.892-.454a3.5 3.5 0 0 0-1.53-1.53zM14.7 6c.848 0 1.454 0 1.93.04c.469.038.766.11 1.005.232l.454-.89c-.403-.206-.847-.296-1.378-.34C16.186 5 15.531 5 14.7 5zM9.3 6h5.4V5H9.3zm-2.935.272c.239-.121.536-.194 1.005-.233C7.845 6 8.452 6 9.3 6V5c-.832 0-1.486 0-2.011.043c-.531.043-.975.133-1.378.338zM5.272 7.365a2.5 2.5 0 0 1 1.093-1.093l-.454-.89a3.5 3.5 0 0 0-1.53 1.529zm2.289 9.781A.5.5 0 0 1 7.914 17v-1a1.5 1.5 0 0 0-1.06.44z"/><path stroke="#222222" stroke-linecap="round" stroke-linejoin="round" d="M8.5 9.5h7m-7 3h5" stroke-width="1"/></g></svg>`,
  MOVE_SVG: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="#222222" stroke-linecap="round" stroke-linejoin="round" d="m14 5l-2-2m0 0l-2 2m2-2v18m0 0l2-2m-2 2l-2-2m9-5l2-2m0 0l-2-2m2 2H3m0 0l2 2m-2-2l2-2" stroke-width="1"/></svg>`,
  NOTE_SVG: `<svg width="24" height="24" viewBox="0 0 27 23" fill="none" xmlns="http://www.w3.org/2000/svg"><g filter="url(#filter0_d_9287_40185)"><path fill-rule="evenodd" clip-rule="evenodd" d="M21.474 13.563C18.162 15.201 11.128 16.518 6.797 17C3 12.824 3 1 3 1H17.04C17.04 1 16.301 12.084 21.474 13.563Z" fill="white"/><path d="M17.5742 0.5L17.5391 1.0332V1.03418C17.539 1.03516 17.5382 1.03689 17.5381 1.03906C17.5378 1.04376 17.5377 1.05167 17.5371 1.06152C17.5359 1.08124 17.5342 1.11116 17.5322 1.15039C17.5282 1.22916 17.5235 1.34636 17.5186 1.49609C17.5087 1.79581 17.4992 2.22744 17.5049 2.75C17.5163 3.79721 17.5855 5.20306 17.8115 6.64941C18.0384 8.10108 18.4193 9.56504 19.041 10.7432C19.6614 11.9185 20.4945 12.7627 21.6113 13.082L22.8555 13.4375L21.6953 14.0107C19.9815 14.8583 17.345 15.6075 14.625 16.2031C11.8939 16.8011 9.03509 17.2542 6.85254 17.4971L6.59863 17.5254L6.42676 17.3359C5.40668 16.2139 4.66777 14.6124 4.125 12.8887C3.57961 11.1566 3.21899 9.25688 2.97949 7.50195C2.73978 5.74534 2.6194 4.12194 2.55957 2.93848C2.52964 2.34637 2.51532 1.86292 2.50781 1.52734C2.50406 1.35956 2.50192 1.22814 2.50098 1.13867C2.50051 1.09445 2.50012 1.0604 2.5 1.03711V0.5H17.5742Z" stroke="black" stroke-opacity="0.7"/></g><defs><filter id="filter0_d_9287_40185" x="0" y="0" width="26.2344" height="22.0508" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset dy="2"/><feGaussianBlur stdDeviation="1"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_9287_40185"/><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_9287_40185" result="shape"/></filter></defs></svg>`,
  SHAPE_SVG: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="#000000" stroke-linecap="round" d="M12 3.5v17m8.5-8.5h-17" stroke-width="1"/></svg>`,
  COMMENT_SVG: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><path fill="#8b5cf6" d="m12 16l-5 5v-5H5c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v9c0 1.1-.9 2-2 2z"/></svg>`,
  CARD_SVG: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 21H20C20.7956 21 21.5587 20.6839 22.1213 20.1213C22.6839 19.5587 23 18.7956 23 18V6C23 5.20435 22.6839 4.44129 22.1213 3.87868C21.5587 3.31607 20.7956 3 20 3H4C3.20435 3 2.44129 3.31607 1.87868 3.87868C1.31607 4.44129 1 5.20435 1 6V18C1 18.7956 1.31607 19.5587 1.87868 20.1213C2.44129 20.6839 3.20435 21 4 21ZM3 6C3 5.73478 3.10536 5.48043 3.29289 5.29289C3.48043 5.10536 3.73478 5 4 5H20C20.2652 5 20.5196 5.10536 20.7071 5.29289C20.8946 5.48043 21 5.73478 21 6V18C21 18.2652 20.8946 18.5196 20.7071 18.7071C20.5196 18.8946 20.2652 19 20 19H4C3.73478 19 3.48043 18.8946 3.29289 18.7071C3.10536 18.5196 3 18.2652 3 18V6ZM5 16C5 15.7348 5.10536 15.4804 5.29289 15.2929C5.48043 15.1054 5.73478 15 6 15H9C9.26522 15 9.51957 15.1054 9.70711 15.2929C9.89464 15.4804 10 15.7348 10 16C10 16.2652 9.89464 16.5196 9.70711 16.7071C9.51957 16.8946 9.26522 17 9 17H6C5.73478 17 5.48043 16.8946 5.29289 16.7071C5.10536 16.5196 5 16.2652 5 16ZM5 13C5 12.7348 5.10536 12.4804 5.29289 12.2929C5.48043 12.1054 5.73478 12 6 12H12C12.2652 12 12.5196 12.1054 12.7071 12.2929C12.8946 12.4804 13 12.7348 13 13C13 13.2652 12.8946 13.5196 12.7071 13.7071C12.5196 13.8946 12.2652 14 12 14H6C5.73478 14 5.48043 13.8946 5.29289 13.7071C5.10536 13.5196 5 13.2652 5 13Z" fill="#8837E9" /></svg>`,
  CODEBLOCK_SVG: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 6H3.01919M3.01919 6H20.9809M3.01919 6C3 6.31438 3 6.70191 3 7.2002V16.8002C3 17.9203 3 18.4796 3.21799 18.9074C3.40973 19.2837 3.71547 19.5905 4.0918 19.7822C4.51921 20 5.079 20 6.19694 20H17.8031C18.921 20 19.48 20 19.9074 19.7822C20.2837 19.5905 20.5905 19.2837 20.7822 18.9074C21 18.48 21 17.921 21 16.8031V7.19691C21 6.70021 21 6.31368 20.9809 6M3.01919 6C3.04314 5.60768 3.09697 5.3293 3.21799 5.0918C3.40973 4.71547 3.71547 4.40973 4.0918 4.21799C4.51962 4 5.08009 4 6.2002 4H17.8002C18.9203 4 19.4796 4 19.9074 4.21799C20.2837 4.40973 20.5905 4.71547 20.7822 5.0918C20.9032 5.3293 20.957 5.60768 20.9809 6M20.9809 6H21M14 11L16 13L14 15M10 15L8 13L10 11" stroke="#8837E9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>`,
  ARROW_SVG: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><path fill="#8b5cf6" d="M15.843 8.157L9.66 10.63l.748.374l.015.008c.068.034.157.078.232.125a1 1 0 0 1 .346.345a.98.98 0 0 1 .1.737a1 1 0 0 1-.24.426c-.06.065-.134.132-.19.182l-.012.011l-2.677 2.422l.757.757l2.422-2.677l.01-.012c.051-.056.118-.13.183-.19a1 1 0 0 1 .426-.24a.98.98 0 0 1 .737.1c.19.11.294.263.345.346c.047.075.091.165.125.232l.008.015l.374.749zm.622-1.854c.092-.027.34-.1.616-.008a.98.98 0 0 1 .624.624c.091.276.02.524-.008.616c-.032.107-.082.23-.125.338l-.008.02l-3.115 7.787l-.008.02a4 4 0 0 1-.138.32c-.044.087-.16.308-.409.444a.98.98 0 0 1-.87.037a1 1 0 0 1-.444-.41a4 4 0 0 1-.165-.307l-.01-.019l-.503-1.007l-2.317 2.56l-.009.01c-.037.041-.09.1-.144.15a1 1 0 0 1-.337.213a1 1 0 0 1-.626.015a1 1 0 0 1-.347-.195c-.056-.047-.113-.104-.152-.143l-.01-.009l-1.319-1.32l-.01-.01a3 3 0 0 1-.142-.15a1 1 0 0 1-.195-.348a1 1 0 0 1 .015-.626a1 1 0 0 1 .212-.337c.05-.053.11-.107.151-.144l.01-.009l2.56-2.317l-1.007-.504l-.02-.01c-.099-.05-.214-.107-.307-.164a1 1 0 0 1-.408-.444a.98.98 0 0 1 .036-.87c.136-.249.357-.365.444-.409a4 4 0 0 1 .32-.138l.02-.008l7.787-3.115l.02-.008c.108-.043.231-.093.338-.125"/></svg>`,
  DOT_SVG: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><path fill="#8b5cf6" d="M2 2h20v20H2zm2 2v16h16V4zm2 3.5h12v2H6zm0 4h8v2H6z"/></svg>`,
  FLIP_SVG: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 3V21" stroke="#8837E9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path fill-rule="evenodd" clip-rule="evenodd" d="M20 8.2V8.16146C20 7.63431 20 7.17955 19.9694 6.80497C19.9371 6.40963 19.8658 6.01641 19.673 5.63803C19.3854 5.07354 18.9265 4.6146 18.362 4.32698C17.9836 4.13419 17.5904 4.06287 17.195 4.03057C16.8205 3.99997 16.3657 3.99998 15.8385 4H15.8H14V6H15.8C16.3766 6 16.7488 6.00078 17.0322 6.02393C17.3038 6.04612 17.4045 6.0838 17.454 6.10899C17.6422 6.20487 17.7951 6.35785 17.891 6.54601C17.9162 6.59545 17.9539 6.69617 17.9761 6.96784C17.9992 7.25117 18 7.62345 18 8.2V15.8C18 16.3766 17.9992 16.7488 17.9761 17.0322C17.9539 17.3038 17.9162 17.4045 17.891 17.454C17.7951 17.6422 17.6422 17.7951 17.454 17.891C17.4045 17.9162 17.3038 17.9539 17.0322 17.9761C16.7488 17.9992 16.3766 18 15.8 18H14V20H15.8H15.8385C16.3657 20 16.8204 20 17.195 19.9694C17.5904 19.9371 17.9836 19.8658 18.362 19.673C18.9265 19.3854 19.3854 18.9265 19.673 18.362C19.8658 17.9836 19.9371 17.5904 19.9694 17.195C20 16.8205 20 16.3657 20 15.8385V15.8V8.2ZM12 20V18H8.2C7.62344 18 7.25117 17.9992 6.96783 17.9761C6.69617 17.9539 6.59545 17.9162 6.54601 17.891C6.35785 17.7951 6.20486 17.6422 6.10899 17.454C6.0838 17.4045 6.04612 17.3038 6.02393 17.0322C6.00078 16.7488 6 16.3766 6 15.8V8.2C6 7.62345 6.00078 7.25117 6.02393 6.96784C6.04612 6.69617 6.0838 6.59545 6.10899 6.54601C6.20487 6.35785 6.35785 6.20487 6.54601 6.10899C6.59545 6.0838 6.69617 6.04612 6.96783 6.02393C7.25117 6.00078 7.62345 6 8.2 6H12V4H8.2H8.16146C7.63431 3.99998 7.17954 3.99997 6.80497 4.03057C6.40963 4.06287 6.01641 4.13419 5.63803 4.32698C5.07354 4.6146 4.6146 5.07354 4.32698 5.63803C4.13419 6.01641 4.06287 6.40963 4.03057 6.80497C3.99997 7.17955 3.99998 7.63432 4 8.16148V8.2V15.8V15.8385C3.99998 16.3657 3.99997 16.8205 4.03057 17.195C4.06287 17.5904 4.13419 17.9836 4.32698 18.362C4.6146 18.9265 5.07354 19.3854 5.63803 19.673C6.01641 19.8658 6.40963 19.9371 6.80497 19.9694C7.17955 20 7.63432 20 8.16148 20H8.2H12Z" fill="#8837E9"/></svg>`,
  FRAME_SVG: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 3V21M18 3V21M3 6H21M3 18H21" stroke="#8837E9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  ERASER_SVG: `<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 16 16"><path fill="#343330" fill-rule="evenodd" d="m9.646 3.268l2.586 2.586a.914.914 0 0 1 0 1.292L8.72 10.66L4.84 6.78l3.513-3.512a.914.914 0 0 1 1.292 0M3.78 7.84L1.768 9.854a.914.914 0 0 0 0 1.292L3.12 12.5h3.76l.78-.78zm9.513.366L9 12.5h6.25a.75.75 0 0 1 0 1.5H2.5L.707 12.207a2.414 2.414 0 0 1 0-3.414l6.586-6.586a2.414 2.414 0 0 1 3.414 0l2.586 2.586a2.414 2.414 0 0 1 0 3.414" clip-rule="evenodd"></path></svg>`,
  PEOPLE_SVG: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 12C13.6569 12 15 10.6569 15 9C15 7.34315 13.6569 6 12 6C10.3431 6 9 7.34315 9 9C9 10.6569 10.3431 12 12 12Z" stroke="#8837E9" stroke-width="2"/><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#8837E9" stroke-width="2"/><path d="M17.9691 20C17.81 17.1085 16.9247 15 11.9999 15C7.07521 15 6.18991 17.1085 6.03076 20" stroke="#8837E9" stroke-width="2" stroke-linecap="round"/></svg>`,
  MIND_MAP: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 18C11 18.9319 11 19.3978 11.1522 19.7654C11.3552 20.2554 11.7446 20.6448 12.2346 20.8478C12.6022 21 13.0681 21 14 21H18C18.9319 21 19.3978 21 19.7654 20.8478C20.2554 20.6448 20.6448 20.2554 20.8478 19.7654C21 19.3978 21 18.9319 21 18C21 17.0681 21 16.6022 20.8478 16.2346C20.6448 15.7446 20.2554 15.3552 19.7654 15.1522C19.3978 15 18.9319 15 18 15H14C13.0681 15 12.6022 15 12.2346 15.1522C11.7446 15.3552 11.3552 15.7446 11.1522 16.2346C11 16.6022 11 17.0681 11 18ZM11 18H9.2C8.07989 18 7.51984 18 7.09202 17.782C6.71569 17.5903 6.40973 17.2843 6.21799 16.908C6 16.4802 6 15.9201 6 14.8V9M6 9H18C18.9319 9 19.3978 9 19.7654 8.84776C20.2554 8.64477 20.6448 8.25542 20.8478 7.76537C21 7.39782 21 6.93188 21 6C21 5.06812 21 4.60218 20.8478 4.23463C20.6448 3.74458 20.2554 3.35523 19.7654 3.15224C19.3978 3 18.9319 3 18 3H6C5.06812 3 4.60218 3 4.23463 3.15224C3.74458 3.35523 3.35523 3.74458 3.15224 4.23463C3 4.60218 3 5.06812 3 6C3 6.93188 3 7.39782 3.15224 7.76537C3.35523 8.25542 3.74458 8.64477 4.23463 8.84776C4.60218 9 5.06812 9 6 9Z" stroke="#8837E9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>`,
};

class UIManager {
  constructor(app) {
    this.app = app;
    this._wire();
    this._syncInitialActive();

    // Listen to tool changes to update active button / cursor centrally
    if (this.app && this.app.toolManager) {
      this.app.toolManager.addEventListener("change", (e) => {
        const tool = e.detail.tool;
        // update cursor
        this._setCursorForTool(tool);
        // update active toolbar button UI (simple mapping)
        this._reflectActiveTool(tool);
      });
    }
  }

  _reflectActiveTool(tool) {
    // clear old
    this._clearActive();
    switch (tool) {
      case "select":
        this._setActive(document.getElementById("pointerToolbarButton"));
        break;
      case "pan":
        this._setActive(document.getElementById("handToolbarButton"));
        break;
      case "pen":
        this._setActive(document.getElementById("penToolbarButton"));
        break;
      case "text":
        this._setActive(document.getElementById("textToolbarButton"));
        break;
      case "note":
        this._setActive(document.getElementById("noteToolbarButton"));
        break;
      case "shape":
        this._setActive(document.getElementById("shapeToolbarButton"));
        break;
      case "arrow":
        this._setActive(document.getElementById("arrowToolbarButton"));
        break;
      case "comment":
        this._setActive(document.getElementById("commentToolbarButton"));
        break;
      case "mind-map":
        this._setActive(document.getElementById("mindMapToolbarButton"));
        break;
      default:
        break;
    }
  }
  //
  setCanvasCursor(svgString, hotspotX = 10, hotspotY = 10, fallback = "default") {
    const encoded = encodeURIComponent(svgString).replace(/'/g, "%27").replace(/"/g, "%22");
    return `url("data:image/svg+xml,${encoded}") ${hotspotX} ${hotspotY}, ${fallback}`;
  }

  // Apply a cursor string to all interactive layers
  _applyCursorToLayers(cursorCss) {
    const targets = [this.app && this.app.viewportNode, this.app && this.app.canvas, this.app && this.app.stage, this.app && this.app.svg && this.app.svg.node && this.app.svg.node()].filter(Boolean);
    targets.forEach((el) => {
      el.style.cursor = cursorCss;
    });
  }

  // Map tool name to cursor
  _setCursorForTool(toolName) {
    switch (toolName) {
      case "select": {
        // Use a hand cursor; fallback to grab for better UX
        const css = this.setCanvasCursor(CONSTANT.POINTER, 10, 10, "default");
        this._applyCursorToLayers(css);
        break;
      }
      case "pan": {
        // Use a hand cursor; fallback to grab for better UX
        const css = this.setCanvasCursor(CONSTANT.HAND_SVG, 10, 10, "grab");
        this._applyCursorToLayers(css);
        break;
      }
      case "pen": {
        // Hotspot near pen tip
        const css = this.setCanvasCursor(CONSTANT.PEN_SVG, 2, 22, "crosshair");
        this._applyCursorToLayers(css);
        break;
      }
      case "eraser": {
        // Hotspot near pen tip
        const css = this.setCanvasCursor(CONSTANT.ERASER_SVG, 2, 22, "crosshair");
        this._applyCursorToLayers(css);
        break;
      }
      case "note": {
        const css = this.setCanvasCursor(CONSTANT.NOTE_SVG, 16, 16, "copy");
        this._applyCursorToLayers(css);
        break;
      }
      case "text": {
        const css = this.setCanvasCursor(CONSTANT.TEXT_SVG, 16, 16, "text");
        this._applyCursorToLayers(css);
        break;
      }
      case "shape": {
        const css = this.setCanvasCursor(CONSTANT.SHAPE_SVG, 16, 16, "crosshair");
        this._applyCursorToLayers(css);
        break;
      }
      case "arrow": {
        const css = this.setCanvasCursor(CONSTANT.ARROW_SVG, 16, 16, "crosshair");
        this._applyCursorToLayers(css);
        break;
      }
      case "comment": {
        const css = this.setCanvasCursor(CONSTANT.COMMENT_SVG, 16, 16, "crosshair");
        this._applyCursorToLayers(css);
        break;
      }
      case "card": {
        const css = this.setCanvasCursor(CONSTANT.CARD_SVG, 16, 16, "crosshair");
        this._applyCursorToLayers(css);
        break;
      }
      case "flipcard": {
        const css = this.setCanvasCursor(CONSTANT.FLIP_SVG, 16, 16, "crosshair");
        this._applyCursorToLayers(css);
        break;
      }
      case "codeblock": {
        const css = this.setCanvasCursor(CONSTANT.CODEBLOCK_SVG, 16, 16, "crosshair");
        this._applyCursorToLayers(css);
        break;
      }
      case "frame": {
        const css = this.setCanvasCursor(CONSTANT.FRAME_SVG, 16, 16, "crosshair");
        this._applyCursorToLayers(css);
        break;
      }
      case "people": {
        const css = this.setCanvasCursor(CONSTANT.PEOPLE_SVG, 16, 16, "crosshair");
        this._applyCursorToLayers(css);
        break;
      }
      case "mind-map": {
        const css = this.setCanvasCursor(CONSTANT.MIND_MAP, 16, 16, "crosshair");
        this._applyCursorToLayers(css);
        break;
      }
      default: {
        this._applyCursorToLayers("default");
      }
    }
  }

  _penUIActive() {
    document.getElementById("penManagerContainer").classList.remove(HIDDEN);
  }

  _wire() {
    //
    const pointerBtn = document.getElementById("pointerToolbarButton");
    if (pointerBtn) {
      pointerBtn.addEventListener("click", () => {
        this._setActive(pointerBtn);
        this._setCursorForTool("select");
        this.app.setTool("select");
        this.app.setDrawingMode(false);
      });
    }

    //
    const handBtn = document.getElementById("handToolbarButton");
    if (handBtn) {
      handBtn.addEventListener("click", () => {
        this._setActive(handBtn);
        this.app.setTool("pan");
        this._setCursorForTool("pan");
        this.app.setDrawingMode(false);
      });
    }

    // Pen Handler
    const penBtn = document.getElementById("penToolbarButton");
    if (penBtn) {
      penBtn.addEventListener("click", () => {
        this._setActive(penBtn);
        this.app.setTool("pen"); // or "pen" if you prefer
        this._penUIActive();
      });
    }

    // Eraser button wiring (toggle tool & UI active state)
    const eraserBtn = document.getElementById("eraserTool");
    if (eraserBtn) {
      eraserBtn.addEventListener("click", (ev) => {
        // set app tool
        this.app.setTool("eraser");
        eraserBtn.classList.add("active");
        this._setCursorForTool("eraser");
      });
    }

    //
    const textToolbarButton = document.getElementById("textToolbarButton");
    if (textToolbarButton) {
      textToolbarButton.addEventListener("click", () => {
        this._setActive(textToolbarButton);
        this._setCursorForTool("text");
        this.app.setTool("text");
        this.app.setDrawingMode(false);
      });
    }

    // NOTE TOOLBAR
    const noteBtn = document.getElementById("noteToolbarButton");
    if (noteBtn) {
      noteBtn.addEventListener("click", () => {
        this._setActive(noteBtn);
        this._setCursorForTool("note");
        this.app.setTool("note");
        this.app.setDrawingMode(false);
        document.getElementById("noteManagerContainer").classList.remove(HIDDEN);
        this.app.notes.enablePlacementMode();
      });
    }

    // Shape
    const shapeToolbarButton = document.getElementById("shapeToolbarButton");
    if (shapeToolbarButton) {
      shapeToolbarButton.addEventListener("click", () => {
        this._setActive(shapeToolbarButton);
        this._setCursorForTool("shape");
        this.app.setTool("shape");
        document.getElementById("shapesManagerContainer").classList.remove(HIDDEN);
      });
    }

    // Arrow
    const arrowToolbarButton = document.getElementById("arrowToolbarButton");
    if (arrowToolbarButton) {
      arrowToolbarButton.addEventListener("click", () => {
        this._setActive(arrowToolbarButton);
        this._setCursorForTool("arrow");
        this.app.setTool("arrow");
        document.getElementById("arrowManagerContainer").classList.remove(HIDDEN);

        // Initialize arrow tool with default settings
        if (this.app.arrowManager) {
          this.app.arrowManager.setActive(true);
        }
      });
    }

    // comment
    const commentToolbarButton = document.getElementById("commentToolbarButton");
    if (commentToolbarButton) {
      commentToolbarButton.addEventListener("click", () => {
        this._setActive(commentToolbarButton);
        this._setCursorForTool("comment");
        this.app.setTool("comment");
      });
    }

    const mindMapToolbarButton = document.getElementById("mindMapToolbarButton");
    if (mindMapToolbarButton) {
      mindMapToolbarButton.addEventListener("click", () => {
        this._setActive(mindMapToolbarButton);
        this._setCursorForTool("mind-map");
        this.app.setTool("mind-map");
      });
    }

    //  keydown section:
    document.addEventListener("keydown", (e) => {
      // Only if not in text editing mode
      const activeElement = document.activeElement;
      if (activeElement.tagName !== "INPUT" && activeElement.tagName !== "TEXTAREA" && !activeElement.isContentEditable) {
        const key = e.key.toLowerCase();

        if (key === "escape") {
          document.getElementById("pointerToolbarButton")?.click();
          document.getElementById("dotVotingContainer").classList.add(HIDDEN);

          if (this.app) {
            this.app.ink.clearSelection();
          }
        }
      }
    });

    /////////////////// Hand tool: grabbing feedback while dragging
    const viewport = this.app && this.app.viewportNode;
    if (viewport) {
      viewport.addEventListener("pointerdown", () => {
        if (this.app && this.app.currentTool === "pan") {
          // switch to grabbing while pointer is held down
          this._applyCursorToLayers("grabbing");
        }
      });
      const resetGrab = () => {
        if (this.app && this.app.currentTool === "pan") {
          // back to grab when not dragging
          const css = this.setCanvasCursor(CONSTANT.HAND_SVG, 10, 10, "grab");
          this._applyCursorToLayers(css);
        }
      };
      viewport.addEventListener("pointerup", resetGrab);
      viewport.addEventListener("pointercancel", resetGrab);
      viewport.addEventListener("pointerleave", resetGrab);
    }
  }

  // Apply the active class to the single clicked button (clears others)
  _setActive(btn) {
    document.querySelectorAll("button.bar_tooltips").forEach((btn) => btn.classList.remove("active"));
    document.querySelectorAll(".manager_containers").forEach((container) => container.classList.add(HIDDEN));
    if (btn) btn.classList.add("active");
  }

  _clearActive() {
    document.querySelectorAll(".tools_container button").forEach((b) => b.classList.remove("active"));
  }

  // Read initial DOM .active and set model state explicitly (no synthetic click).
  _syncInitialActive() {
    const initial = document.querySelector(".tools_container button.active");
    const pointerBtn = document.getElementById("pointerToolbarButton");
    const handBtn = document.getElementById("handToolbarButton");
    const penBtn = document.getElementById("penToolbarButton");

    if (!initial) {
      // nothing marked active in DOM — default to pointer/select
      this.app.setTool && this.app.setTool("select");
      this._setActive(pointerBtn);
      this._setCursorForTool("select");
      return;
    }

    switch (initial.id) {
      case "pointerToolbarButton":
        this.app.setTool && this.app.setTool("select");
        this.app.setDrawingMode && this.app.setDrawingMode(false);
        this._setActive(pointerBtn);
        this._setCursorForTool("select");
        break;
      case "handToolbarButton":
        // explicitly enable pan in the model and mark hand active
        this.app.setPan && this.app.setPan(true);
        handBtn && handBtn.classList.add("active");
        this._clearActive();
        handBtn && handBtn.classList.add("active");
        this._setCursorForTool("pan");
        break;
      case "penToolbarButton":
        // explicitly enable drawing mode and clear pan
        this.app.setDrawingMode && this.app.setDrawingMode(true);
        this.app.setPan && this.app.setPan(false);
        penBtn && penBtn.classList.add("active");
        this._clearActive();
        penBtn && penBtn.classList.add("active");
        this._setCursorForTool("pen");
        break;
      default:
        // fallback
        this.app.setTool && this.app.setTool("select");
        this._setActive(pointerBtn);
        this._setCursorForTool("select");
    }
  }
}
