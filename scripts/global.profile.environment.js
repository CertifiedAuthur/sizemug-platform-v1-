/**
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */
const environmentItems = [
  {
    label: "Default",
    value: "default",
    icon: `<svg width="12" height="20" viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_5619_115459)"><path d="M1.28746 9.04303C1.28746 9.04303 1.17646 9.08908 1.13395 8.94974C1.1989 8.83756 0.83402 7.8551 4.31397 7.20209C8.04899 6.66598 9.89938 7.43826 9.84034 7.39339C9.90174 7.42291 7.84943 6.51129 4.81347 6.83721C1.88733 7.21272 1.27093 7.79251 0.844647 8.58604C0.844647 8.58604 0.726562 7.45951 0.726562 7.27884C0.750179 7.18556 1.45042 5.67525 5.33186 5.19937C5.37556 5.17457 3.02803 5.1238 1.24023 6.28457C1.24732 6.28457 1.14931 5.93032 1.74918 5.49222C2.34905 5.05413 3.91012 4.35034 5.99196 4.27123C7.01693 4.21809 8.37254 4.38931 9.33375 4.74357C10.315 5.08955 10.9007 5.57724 10.8594 5.98936C10.8532 6.11423 10.8261 6.23718 10.7791 6.35306C10.7909 6.35306 11.3695 6.51602 11.2798 7.34733C11.19 8.17865 11.2503 9.01233 10.8275 8.98281C10.772 9.03358 10.2902 8.15621 6.01794 8.11843C1.75036 8.26485 1.34769 9.09262 1.28746 9.04303Z" fill="#000000"/><path d="M2.5445 13.81C2.52623 13.7886 2.50607 13.7688 2.48428 13.7509C2.45469 13.7249 2.4222 13.7023 2.38745 13.6836C2.36146 13.6691 2.33221 13.6614 2.30243 13.6612C2.29072 13.6614 2.2794 13.6654 2.27022 13.6727C2.26104 13.6799 2.25451 13.69 2.25165 13.7014C2.22125 13.7843 2.19756 13.8696 2.1808 13.9564C2.17253 13.9942 2.16545 14.032 2.15955 14.0745C2.10168 13.686 2.04146 13.2928 1.99068 12.9007C1.80411 11.5534 1.63643 10.1978 1.50772 8.90947L1.46875 8.52334C1.60219 8.49382 1.74035 8.46311 1.88323 8.43359L1.91157 8.71818C1.91983 8.80084 1.92928 8.8835 1.93755 8.96734L1.97651 9.33458C2.10168 10.4977 2.24929 11.7022 2.41461 12.8937C2.45633 13.1983 2.49963 13.5038 2.5445 13.81Z" fill="#000000"/><path d="M2.75034 15.1726C2.7409 15.2049 2.73027 15.2356 2.71846 15.2647C2.70548 15.3009 2.68886 15.3357 2.66886 15.3686C2.65468 15.3933 2.63535 15.4146 2.61218 15.4312C2.60213 15.437 2.59073 15.4401 2.57912 15.4401C2.56751 15.4401 2.55611 15.437 2.54606 15.4312C2.52523 15.4183 2.50741 15.401 2.49376 15.3807C2.48012 15.3603 2.47098 15.3373 2.46694 15.3131C2.44772 15.2414 2.43702 15.1677 2.43506 15.0935C2.43172 14.9986 2.43409 14.9035 2.44214 14.8089C2.45035 14.7066 2.46454 14.6049 2.48465 14.5042C2.50355 14.4039 2.52598 14.3082 2.55196 14.2196C2.56377 14.1783 2.57558 14.1405 2.58857 14.1016C2.6417 14.47 2.6913 14.8242 2.75034 15.1726Z" fill="#000000"/><path d="M9.21848 15.6512L9.20313 15.6749C9.20313 15.6583 9.20312 15.6418 9.21139 15.6253L9.25744 15.5898C9.24327 15.6111 9.23029 15.6312 9.21848 15.6512Z" fill="#000000"/><path d="M9.6155 15.6589L9.62849 15.6494C9.54976 16.1658 9.46592 16.6708 9.37697 17.1644C9.20929 18.1327 9.03216 19.0538 8.85149 19.8887C6.93852 20.139 5.06333 19.9583 3.1173 19.4163C2.93899 18.6027 2.76304 17.7124 2.59891 16.7771C2.52451 16.3615 2.45366 15.9364 2.38281 15.5054L2.39344 15.5148C2.43866 15.5538 2.49467 15.5781 2.55404 15.5845C2.58265 15.5882 2.61174 15.5849 2.63886 15.5751C2.66598 15.5652 2.69034 15.549 2.70991 15.5278C2.74218 15.4958 2.76892 15.4587 2.78902 15.418C2.87286 15.9364 2.95788 16.4441 3.04409 16.9365C3.07006 17.0818 3.09604 17.227 3.12084 17.3687C3.23893 17.9839 3.34638 18.5708 3.46092 19.1199C5.16607 19.6489 6.83342 19.7989 8.51495 19.5167C8.62359 18.9853 8.73222 18.4197 8.83968 17.8269C8.87156 17.6474 8.90463 17.4644 8.93651 17.2802C8.93651 17.2802 8.93651 17.2731 8.93651 17.2695C9.00382 16.8846 9.06995 16.489 9.13489 16.0887C9.16323 16.0604 9.19157 16.0296 9.21873 15.9966C9.28014 15.9234 9.33682 15.8478 9.3935 15.771C9.47099 15.741 9.54534 15.7034 9.6155 15.6589Z" fill="#000000"/><path d="M9.67967 15.3203C9.67141 15.377 9.66196 15.4384 9.65369 15.4904C9.61365 15.5217 9.57142 15.5501 9.52734 15.5754C9.55686 15.5281 9.58521 15.4833 9.61 15.4408C9.6348 15.3982 9.6596 15.3557 9.67967 15.3203Z" fill="#000000"/><path d="M9.75277 14.832L9.73269 14.9655C9.73097 14.9625 9.72853 14.9601 9.72561 14.9584C9.70152 14.936 9.66994 14.9233 9.63704 14.923C9.60398 14.923 9.57918 14.9442 9.56029 14.9855C9.56029 14.9855 9.5473 15.0139 9.52959 15.0469C9.51187 15.08 9.4918 15.1178 9.467 15.165C9.4422 15.2123 9.41386 15.2524 9.38198 15.2996C9.35277 15.3444 9.32041 15.387 9.28515 15.4272C9.26912 15.4454 9.25218 15.4627 9.23438 15.4791C9.25563 15.3374 9.27807 15.1946 9.29932 15.0505C9.33651 15.0171 9.37597 14.9863 9.41741 14.9584C9.4869 14.9096 9.56387 14.8725 9.64531 14.8486C9.68026 14.8384 9.71638 14.8329 9.75277 14.832Z" fill="#000000"/><path d="M10.5336 8.41978C10.5218 8.54495 10.51 8.67012 10.497 8.79529C10.3624 10.1946 10.1923 11.6588 9.99867 13.1042C9.929 13.6238 9.85578 14.141 9.78021 14.6523C9.73527 14.6456 9.68976 14.6436 9.64441 14.6464C9.54382 14.6513 9.4448 14.6733 9.35156 14.7113C9.43186 14.1705 9.5098 13.6202 9.58773 13.0676C9.75895 11.7828 9.91365 10.4792 10.0424 9.21213C10.0624 9.01847 10.0813 8.82481 10.1002 8.63233C10.1008 8.62881 10.1008 8.62522 10.1002 8.6217C10.1097 8.52605 10.1179 8.43041 10.1274 8.33594C10.2632 8.36428 10.4013 8.39262 10.5336 8.41978Z" fill="#000000"/><path d="M1.69922 9.01449C1.85863 8.97671 2.02041 8.94482 2.18927 8.9153C2.35813 8.88578 2.53172 8.86098 2.7112 8.84091C3.08282 8.79428 3.45791 8.78163 3.83183 8.80312C3.46255 8.85505 3.09861 8.93961 2.74427 9.05582C2.57423 9.10896 2.40891 9.16682 2.25067 9.22468C2.09244 9.28255 1.93775 9.34277 1.79605 9.4089C1.76298 9.27428 1.7311 9.14439 1.69922 9.01449Z" fill="#000000"/><path d="M10.2494 9.29024C9.97665 9.19223 9.67435 9.09895 9.35789 9.0092C9.04142 8.91946 8.70606 8.8368 8.35889 8.76359C8.01172 8.69037 7.65038 8.62307 7.28432 8.57701C6.91172 8.52617 6.5362 8.49974 6.16016 8.49789C6.53497 8.44434 6.91282 8.41476 7.29141 8.40933C7.66573 8.40107 8.03534 8.40933 8.39314 8.43531C8.75093 8.46129 9.10164 8.49317 9.4252 8.5345C9.74875 8.57583 10.064 8.62779 10.3569 8.68801C10.3156 8.88167 10.2789 9.08241 10.2494 9.29024Z" fill="#000000"/><path d="M9.06813 17.7599C9.0268 17.7765 8.99964 17.7836 8.96776 17.7942L8.87683 17.8214C8.81661 17.8367 8.75875 17.8521 8.69853 17.865C8.58044 17.8922 8.46236 17.9135 8.34427 17.9312C8.10942 17.9656 7.87293 17.9876 7.63577 17.9973C7.3996 18.0079 7.16343 18.0044 6.92726 17.9973C6.80917 17.9914 6.69109 17.9831 6.573 17.9737C6.45492 17.9642 6.33683 17.9501 6.21875 17.9359L6.573 17.9111L6.92726 17.8721C7.16343 17.8391 7.3996 17.8001 7.62514 17.7458C7.85618 17.6934 8.08406 17.628 8.30767 17.5498C8.42575 17.5108 8.53085 17.4683 8.6383 17.421C8.69262 17.3986 8.74576 17.3738 8.7989 17.349L8.87565 17.31C8.8983 17.299 8.92037 17.2867 8.94178 17.2734C8.98547 17.4399 9.0268 17.5982 9.06813 17.7599Z" fill="#000000"/><path d="M2.93095 16.8633C3.05494 16.9412 3.18602 17.018 3.31591 17.09C3.4458 17.162 3.57688 17.2329 3.70795 17.2978C3.96751 17.4307 4.23625 17.5447 4.51211 17.6391C4.23387 17.6218 3.95746 17.5823 3.68551 17.521C3.54854 17.4915 3.41156 17.4572 3.27576 17.4206C3.13996 17.384 3.00535 17.3427 2.86719 17.3026C2.89199 17.1514 2.91206 17.0085 2.93095 16.8633Z" fill="#000000"/><path d="M8.54292 2.9103C8.55631 3.23543 8.56811 3.56803 8.57835 3.90812C8.57889 3.92294 8.57603 3.93768 8.56997 3.95122C8.56392 3.96475 8.55484 3.97671 8.54343 3.98618C8.53202 3.99565 8.51859 4.00238 8.50417 4.00584C8.48975 4.00929 8.47473 4.00939 8.46026 4.00613C8.10601 3.9707 7.75176 3.94472 7.38687 3.93055C7.1507 4.14075 6.91454 4.35684 6.67837 4.5812L6.53312 4.45249C6.76929 4.22813 7.01255 4.00967 7.24163 3.80066C7.24163 3.47475 7.22982 3.15592 7.22274 2.84654C7.10465 2.73672 6.97712 2.63044 6.85549 2.52653C6.33592 2.52653 5.81281 2.54896 5.29323 2.5962C5.27946 2.59911 5.26523 2.59902 5.2515 2.59594C5.23777 2.59286 5.22486 2.58685 5.21366 2.57834C5.20246 2.56982 5.19322 2.559 5.18657 2.54659C5.17993 2.53419 5.17603 2.5205 5.17515 2.50645C5.18223 2.06954 5.1905 1.6527 5.19877 1.26184C5.1287 1.21382 5.05903 1.16659 4.98976 1.12014C4.77366 1.14494 4.55993 1.17446 4.34501 1.20634C4.28243 1.21697 4.22693 1.18509 4.23519 1.13549C4.24464 0.964268 4.25291 0.797768 4.26235 0.637173C4.26864 0.609976 4.28352 0.585526 4.30479 0.567447C4.32606 0.549368 4.35258 0.538622 4.38044 0.536801C4.59771 0.506099 4.81499 0.478546 5.03227 0.454142C5.09485 0.447057 5.15035 0.477759 5.14327 0.522631C5.13854 0.680077 5.13382 0.837523 5.1291 0.99497L5.33811 1.13549C5.83406 1.08747 6.32962 1.05874 6.82479 1.04929C6.84058 1.0468 6.85672 1.04754 6.87222 1.05147C6.88772 1.0554 6.90226 1.06244 6.91495 1.07215C6.92765 1.08187 6.93824 1.09406 6.94609 1.10799C6.95393 1.12193 6.95887 1.13731 6.96059 1.1532C6.97358 1.54642 6.98421 1.96326 6.99365 2.40136C7.11174 2.50527 7.23809 2.61155 7.3609 2.72019C7.71909 2.73278 8.07334 2.7564 8.42366 2.79104C8.45423 2.79414 8.48279 2.80771 8.50452 2.82944C8.52625 2.85117 8.53982 2.87973 8.54292 2.9103Z" fill="#000000"/><path d="M4.9018 2.8191C4.64438 2.84862 4.38814 2.88286 4.13425 2.92419C4.10453 2.92866 4.07702 2.94254 4.05577 2.96379C4.03451 2.98505 4.02063 3.01256 4.01617 3.04228C4.00908 3.2631 4.002 3.48864 3.99609 3.71772C3.99606 3.73206 3.99938 3.7462 4.00577 3.75902C4.01217 3.77185 4.02147 3.78301 4.03294 3.79161C4.0444 3.80021 4.05772 3.80601 4.07182 3.80856C4.08592 3.81111 4.10043 3.81033 4.11418 3.80629C4.37042 3.76732 4.63021 3.73426 4.89118 3.7071C4.92144 3.70399 4.9497 3.69056 4.97121 3.66905C4.99272 3.64754 5.00616 3.61927 5.00926 3.58901C5.00926 3.35284 5.01635 3.12966 5.01989 2.90766C5.01924 2.89357 5.01548 2.8798 5.00889 2.86733C5.00229 2.85486 4.99302 2.844 4.98173 2.83554C4.97044 2.82707 4.95743 2.82121 4.94361 2.81837C4.92979 2.81553 4.91551 2.81578 4.9018 2.8191Z" fill="#000000"/><path d="M5.59215 0.371281L5.86493 0.348845C5.92751 0.348845 5.98301 0.303973 5.98301 0.260281V0.0689847C5.98301 0.0252934 5.93342 -0.00422797 5.87201 0.000495416L5.60278 0.0229318C5.54137 0.0229318 5.48469 0.0678037 5.48469 0.110314V0.301612C5.47997 0.345303 5.52839 0.377185 5.59215 0.371281Z" fill="#000000"/><path d="M8.38623 1.64441L8.15006 1.6267C8.13671 1.62412 8.12296 1.62448 8.10976 1.62777C8.09657 1.63106 8.08425 1.63719 8.07368 1.64574C8.06311 1.65429 8.05453 1.66505 8.04855 1.67726C8.04257 1.68948 8.03933 1.70285 8.03906 1.71645L8.04969 1.92073C8.05331 1.9499 8.06716 1.97683 8.08879 1.99673C8.11042 2.01662 8.13841 2.02819 8.16778 2.02937L8.40394 2.04944C8.41718 2.05207 8.43083 2.05172 8.44391 2.04842C8.45699 2.04512 8.46917 2.03895 8.47957 2.03036C8.48997 2.02177 8.49833 2.01097 8.50404 1.99875C8.50975 1.98653 8.51267 1.97319 8.51258 1.9597L8.50195 1.75305C8.49778 1.72453 8.48407 1.69826 8.46305 1.67853C8.44204 1.65881 8.41496 1.64678 8.38623 1.64441Z" fill="#000000"/><path d="M9.14923 2.22857C9.01579 2.20968 8.88118 2.19315 8.74538 2.1778C8.73212 2.17494 8.71839 2.17512 8.70522 2.17833C8.69204 2.18154 8.67976 2.1877 8.66931 2.19634C8.65885 2.20497 8.65049 2.21587 8.64485 2.2282C8.63921 2.24053 8.63644 2.25398 8.63674 2.26754C8.63674 2.38563 8.64855 2.51434 8.65327 2.63951C8.65679 2.66961 8.67036 2.69764 8.69179 2.71907C8.71322 2.7405 8.74126 2.75408 8.77136 2.75759C8.90716 2.77413 9.04177 2.79302 9.17639 2.81309C9.18946 2.81624 9.20308 2.8163 9.21617 2.81324C9.22926 2.81019 9.24145 2.80412 9.25178 2.79551C9.26211 2.78691 9.27028 2.77601 9.27564 2.76368C9.281 2.75136 9.28341 2.73795 9.28266 2.72453C9.28266 2.59818 9.27086 2.47301 9.26377 2.34902C9.26072 2.31909 9.24781 2.29103 9.22708 2.26923C9.20635 2.24743 9.17897 2.23313 9.14923 2.22857Z" fill="#000000"/><path d="M3.86412 2.72993C3.87002 2.5717 3.8771 2.41583 3.88419 2.25759C3.88419 2.20446 3.83577 2.17021 3.7661 2.18202C3.58544 2.21626 3.40477 2.25287 3.22646 2.29302C3.19722 2.29863 3.17034 2.31288 3.14929 2.33393C3.12824 2.35498 3.11398 2.38187 3.10837 2.4111C3.10129 2.56461 3.09302 2.72049 3.08594 2.88344C3.08594 2.93776 3.13199 2.97201 3.19576 2.95784C3.37406 2.91887 3.55591 2.88108 3.73895 2.84684C3.76971 2.84368 3.79859 2.83054 3.82119 2.80943C3.84379 2.78833 3.85887 2.76041 3.86412 2.72993Z" fill="#000000"/><path d="M10.5929 13.4125C10.4323 14.532 10.2528 15.6561 10.0568 16.7401C10.046 16.8005 10.0202 16.8572 9.98187 16.9051C9.94351 16.9529 9.89377 16.9904 9.83719 17.0141C9.73092 17.0566 9.57386 17.1097 9.37666 17.1676C9.24913 17.2054 9.10389 17.2432 8.94565 17.2857H8.93739L8.91141 17.2916C8.11788 17.4805 7.00552 17.6541 5.98173 17.5703C4.97328 17.5266 3.86683 17.2267 3.06622 16.9503L3.04614 16.9433L2.92806 16.9007C2.80997 16.8594 2.70252 16.8181 2.60214 16.7827C2.38487 16.6976 2.21246 16.6209 2.09792 16.5642C2.04192 16.5371 1.99283 16.4976 1.95436 16.4487C1.9159 16.3998 1.88907 16.3428 1.87592 16.282C1.68581 15.2546 1.51104 14.1966 1.35517 13.1456C1.33628 13.0276 1.39296 12.9284 1.49333 12.9236C1.5937 12.9189 1.76256 12.9095 1.99401 12.9036C2.11209 12.9036 2.25734 12.8977 2.41675 12.8965C3.17958 12.8859 4.36515 12.887 5.98999 12.9225C7.64318 12.9579 8.82402 13.0193 9.58331 13.0772C9.74272 13.089 9.88206 13.1008 10.0025 13.1126C10.2127 13.1327 10.3662 13.1504 10.4619 13.1669C10.5575 13.1834 10.613 13.2803 10.5929 13.4125Z" fill="#000000"/></g><defs><clipPath id="clip0_5619_115459"><rect width="10.5603" height="20" fill="white" transform="translate(0.71875)"/></clipPath></defs></svg>`,
    images: [
      {
        defaultImage: true,
        select: true,
        URL: "./images/profile-environment/default.png",
      },
    ],
  },

  {
    label: "Bedroom",
    value: "bedroom",
    icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.648438 12.1523V12.9904C0.648438 13.306 0.904281 13.5619 1.21987 13.5619C1.53547 13.5619 1.79131 13.306 1.79131 12.9904V12.1523H0.648438Z" fill="black"/><path d="M14.2109 12.1523V12.9904C14.2109 13.306 14.4668 13.5619 14.7824 13.5619C15.098 13.5619 15.3538 13.306 15.3538 12.9904V12.1523H14.2109Z" fill="black"/><path d="M16 7.61719H0V11.7315H16V7.61719Z" fill="black"/><path d="M13.1512 2.4375H2.84781C2.37378 2.4375 1.98047 2.78794 1.98047 3.26191V4.80037L2.72931 4.79938C2.72119 4.76128 2.71691 4.7275 2.71691 4.68509C2.71691 4.34319 2.99409 4.07556 3.33597 4.07556H12.6632C13.0051 4.07556 13.2822 4.34319 13.2822 4.68509C13.2822 4.7275 13.2779 4.76128 13.2698 4.79938H14.0186V3.26188C14.0186 2.78794 13.6252 2.4375 13.1512 2.4375Z" fill="black"/><path d="M14.2702 5.75H1.72659L1.02344 6.78141H14.9789L14.2702 5.75Z" fill="black"/></svg>`,
    images: [
      {
        defaultImage: true,
        select: true,
        URL: "./images/profile-environment/bedroom.png",
      },
    ],
  },

  {
    label: "Living room",
    value: "living-room",
    icon: `<svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.04494 3.77938C2.23419 3.77938 2.42158 3.81667 2.59641 3.88912C2.77124 3.96157 2.93009 4.06776 3.06386 4.20162C3.19764 4.33548 3.30373 4.49439 3.37607 4.66926C3.44841 4.84414 3.48558 5.03156 3.48547 5.2208V7.41828H10.5154V5.21991C10.5156 4.94956 10.5918 4.68472 10.7354 4.45566C10.879 4.2266 11.0842 4.04257 11.3274 3.92462C11.5707 3.80667 11.8422 3.75955 12.111 3.78865C12.3798 3.81776 12.635 3.92191 12.8473 4.0892C13.0597 4.25649 13.2207 4.48017 13.312 4.73466C13.4032 4.98915 13.421 5.26417 13.3633 5.52829C13.3056 5.79241 13.1747 6.03496 12.9856 6.22821C12.7966 6.42145 12.5569 6.55759 12.2942 6.62107V10.7673C12.2939 10.8799 12.2491 10.9879 12.1694 11.0675C12.0898 11.1472 11.9818 11.192 11.8692 11.1923H2.13262C2.01998 11.192 1.91202 11.1472 1.83237 11.0675C1.75271 10.9879 1.70786 10.8799 1.70762 10.7673V6.62107C1.36421 6.53909 1.06286 6.33386 0.860804 6.04433C0.658745 5.75481 0.570048 5.40116 0.611556 5.05055C0.653064 4.69994 0.821887 4.37678 1.08597 4.14244C1.35004 3.9081 1.69188 3.7789 2.04494 3.77938ZM2.99247 2.97949C2.92593 2.95139 2.85816 2.92631 2.78936 2.90433V1.67586C2.78983 1.41315 2.89428 1.16131 3.07988 0.975373C3.26547 0.789441 3.51713 0.684539 3.77983 0.683594H10.2201C10.483 0.684303 10.7349 0.789101 10.9207 0.975059C11.1065 1.16102 11.211 1.41299 11.2115 1.67586V2.90433C11.1427 2.92631 11.0749 2.95139 11.0084 2.97949C10.5678 3.16555 10.1919 3.47744 9.92771 3.87611C9.66352 4.27479 9.52279 4.74254 9.52315 5.2208V6.42601H4.47773V5.2208C4.47774 4.74262 4.33687 4.27502 4.07272 3.87641C3.80857 3.4778 3.43285 3.16584 2.99247 2.97949Z" fill="black"/></svg>`,
    images: [
      {
        defaultImage: true,
        select: true,
        URL: "./images/profile-environment/living-room.png",
      },
    ],
  },

  {
    label: "Coffee shop",
    value: "coffee-shop",
    icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.6015 3.64062C12.5587 3.64062 12.5162 3.64162 12.474 3.64337V3.64112H3.65625V9.45237C3.65625 9.86978 3.82205 10.2701 4.11718 10.5653C4.4123 10.8604 4.81259 11.0263 5.23 11.0264H10.8998C11.3172 11.0262 11.7174 10.8604 12.0126 10.5652C12.3077 10.2701 12.4736 9.86979 12.4737 9.45237V9.03837C12.5157 9.04012 12.5582 9.04162 12.601 9.04162C14.1508 9.04162 15.407 7.87537 15.407 6.32612C15.4072 4.77662 14.151 3.64062 12.6015 3.64062ZM12.6015 7.97212C12.5587 7.97212 12.5162 7.96987 12.474 7.96687V4.70312C12.5157 4.70062 12.5587 4.69862 12.6015 4.69862C13.5405 4.69862 14.3018 5.38712 14.3018 6.32637C14.3018 7.26562 13.5407 7.97212 12.6015 7.97212Z" fill="black"/><path d="M15.7182 11.3672V11.4217C15.7182 11.8391 15.5523 12.2394 15.2572 12.5345C14.9621 12.8297 14.5619 12.9956 14.1445 12.9957H1.89797C1.48056 12.9956 1.08027 12.8298 0.785144 12.5346C0.490016 12.2394 0.324219 11.8391 0.324219 11.4217V11.3672H15.7185H15.7182Z" fill="black"/></svg>`,
    images: [
      {
        defaultImage: true,
        select: true,
        URL: "./images/profile-environment/coffee-shop.png",
      },
    ],
  },

  {
    label: "Office",
    value: "office",
    icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.27446 13.8673C2.03177 13.8501 1.80233 13.7587 1.60797 13.6013C1.53713 13.5442 1.42035 13.4192 1.36654 13.3437C1.27284 13.2133 1.2012 13.042 1.16841 12.874L1.15355 12.7952V10.8858V8.97643H3.72273H6.29191V9.62591C6.29191 10.3408 6.29237 10.3034 6.33876 10.4027C6.39589 10.5253 6.52078 10.6319 6.65446 10.6729C6.69446 10.6855 6.75501 10.6855 8.00995 10.6855H9.32305L9.38132 10.666C9.52541 10.6169 9.65395 10.4865 9.70297 10.3388L9.72011 10.2897V9.63323V8.97666H12.2895H14.8588V10.9002V12.8237L14.8428 12.8946C14.8051 13.0587 14.7491 13.192 14.6651 13.317C14.568 13.4607 14.4553 13.5737 14.3114 13.6705C14.1302 13.7925 13.9559 13.8511 13.7245 13.8677C13.6078 13.8792 2.40129 13.8792 2.27743 13.8673H2.27446ZM7.0241 9.465V8.97666H8.00435H8.98472V9.465V9.95346H8.00435H7.0241V9.465ZM1.15104 6.69563C1.15104 5.01929 1.15104 5.1346 1.19103 4.97734C1.25159 4.73814 1.41864 4.49266 1.63014 4.32969C1.78062 4.21391 1.93145 4.14386 2.12135 4.10146L2.20705 4.08203H3.63852H5.06988V3.40089V2.71974L5.08588 2.6626C5.16015 2.40043 5.37862 2.19369 5.63936 2.13757C5.69649 2.125 5.79864 2.125 8.01052 2.125H10.3217L10.3903 2.14443C10.688 2.22671 10.8975 2.46626 10.9341 2.76603C10.9341 2.80374 10.9456 3.06431 10.9456 3.45449V4.08283H12.3292C13.2847 4.08283 13.7353 4.08283 13.7856 4.09426C14.0398 4.12169 14.2812 4.23551 14.4727 4.41883C14.6718 4.60946 14.7853 4.81003 14.84 5.06706L14.856 5.14477V6.69666V8.24854H8.00025H1.14453V6.70374L1.15104 6.69563ZM9.96155 3.58649V3.09449H8.00435H6.04728V3.58649V4.07837H8.00435H9.96155V3.58649Z" fill="black"/></svg>`,
    images: [
      {
        defaultImage: true,
        select: true,
        URL: "./images/profile-environment/office.png",
      },
    ],
  },

  {
    label: "Classroom",
    value: "classroom",
    icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_5619_115527)"><path d="M15.8074 5.63709L8.72703 2.37791C8.49738 2.27213 8.25275 2.21875 8 2.21875C7.74725 2.21875 7.50269 2.27213 7.27297 2.37791L0.192594 5.63709C0.0755625 5.69119 0 5.80909 0 5.93794C0 6.06678 0.0755625 6.18469 0.192594 6.23878L7.27297 9.49797C7.50262 9.60375 7.74725 9.65737 8 9.65737C8.25275 9.65737 8.49737 9.60375 8.72709 9.49797L14.315 6.92591V9.51594C14.0932 9.54094 13.9203 9.72969 13.9203 9.95775C13.9203 10.1565 14.0518 10.3285 14.2392 10.3833L13.8613 12.8768H15.6012L15.2234 10.3833C15.4108 10.3285 15.5423 10.1565 15.5423 9.95775C15.5423 9.72969 15.3693 9.54094 15.1476 9.51594V6.54256L15.8075 6.23878C15.9245 6.18469 16.0001 6.06678 16.0001 5.93794C16.0001 5.80909 15.9244 5.69119 15.8074 5.63709Z" fill="black"/><path d="M7.99866 10.8358C7.64722 10.8358 7.30669 10.7611 6.98659 10.6138L3.52344 9.01953V12.1957C3.52344 12.893 5.6305 13.7776 7.99866 13.7776C10.3668 13.7776 12.4739 12.893 12.4739 12.1957V9.01953L9.01059 10.6138C8.69069 10.7611 8.35022 10.8358 7.99866 10.8358Z" fill="black"/></g><defs><clipPath id="clip0_5619_115527"><rect width="16" height="16" fill="white"/></clipPath></defs></svg>`,
    images: [
      {
        defaultImage: true,
        select: true,
        URL: "./images/profile-environment/classroom.png",
      },
    ],
  },

  {
    label: "Library",
    value: "library",
    icon: `<svg width="16" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.65374 10.6031C1.55262 10.5265 1.56713 10.3995 1.56713 10.3995L2.12734 3.73505C2.12734 3.73505 2.13609 3.66166 2.16873 3.62412C2.18931 3.60065 2.21534 3.56652 2.26441 3.54646C2.82782 3.31606 5.89033 1.65708 7.43305 3.20172C7.68873 3.49793 7.96627 3.93516 7.96627 4.26838V9.90881C7.96627 9.90881 7.97289 10.0285 7.86462 10.1009C7.83913 10.118 7.73235 10.1666 7.60649 10.1037C5.23283 8.91606 2.58142 10.2686 1.91251 10.6233C1.77833 10.6944 1.67369 10.6184 1.65374 10.6031ZM15.0868 10.6233C14.4179 10.2686 11.7665 8.91606 9.39283 10.1037C9.26697 10.1666 9.16019 10.118 9.1347 10.1009C9.02654 10.0285 9.03315 9.90881 9.03315 9.90881V4.26838C9.03315 3.93516 9.3107 3.49793 9.56638 3.20172C11.1091 1.65708 14.1521 3.31596 14.7155 3.54646C14.7646 3.56652 14.7906 3.60065 14.8112 3.62412C14.8438 3.66166 14.8526 3.73505 14.8526 3.73505L15.4323 10.3995C15.4323 10.3995 15.4468 10.5265 15.3457 10.6031C15.3257 10.6184 15.2211 10.6944 15.0868 10.6233ZM9.95539 13.5338C9.99294 13.5247 10.0582 13.4865 10.0812 13.4511C10.1063 13.4123 10.1215 13.3853 10.1263 13.335C10.1791 12.3346 11.8591 11.4024 15.0838 13.3033C15.1665 13.3503 15.2615 13.3455 15.3425 13.2867C15.4345 13.2198 15.433 13.1067 15.433 13.1067V12.5155C15.433 12.5155 15.4334 12.434 15.404 12.3892C15.3822 12.356 15.3533 12.3206 15.3053 12.2977C13.1448 10.8956 10.4137 10.274 9.0275 12.1279C9.00819 12.173 8.98985 12.1933 8.94985 12.2244C8.88947 12.2714 8.81587 12.2684 8.81587 12.2684H8.19134C8.19134 12.2684 8.11774 12.2714 8.05737 12.2244C8.01737 12.1933 7.99902 12.173 7.97971 12.1279C6.59347 10.274 3.86238 10.8662 1.70195 12.2684C1.65395 12.2913 1.62505 12.3266 1.60318 12.3599C1.57385 12.4047 1.57417 12.4862 1.57417 12.4862V13.0773C1.57417 13.0773 1.57267 13.1905 1.66473 13.2574C1.74569 13.3162 1.84073 13.321 1.92339 13.2739C5.14814 11.373 6.82814 12.3346 6.88094 13.335C6.88574 13.3853 6.90089 13.4123 6.92606 13.4511C6.94899 13.4865 7.01427 13.5247 7.05182 13.5338C7.82185 13.725 8.93833 13.8004 9.95539 13.5338Z" fill="#000000"/></svg>`,
    images: [
      {
        defaultImage: true,
        select: true,
        URL: "./images/profile-environment/library.png",
      },
    ],
  },

  {
    label: "Reception",
    value: "reception",
    icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_7077_116043)"><path d="M20 18.1562H4V19.6241H20V18.1562Z" fill="black"/><path d="M9.5943 8.1705C9.5943 8.1705 11.0527 8.46237 12.9484 6.56644C13.8234 7.73331 14.4068 8.31644 14.4068 8.31644V10.067C14.9925 9.46319 15.3546 8.64097 15.3546 7.73328C15.3546 5.88063 13.8529 4.37891 12.0005 4.37891C10.1482 4.37891 8.64648 5.88063 8.64648 7.73328C8.64648 8.64097 9.00858 9.46319 9.5943 10.067V8.1705Z" fill="black"/><path d="M14.2502 12.0391C14.0147 12.1678 12.0007 16.5895 12.0007 16.5895C12.0007 16.5895 9.98678 12.1678 9.75122 12.0391C7.48403 12.857 7.38281 14.6893 7.38281 17.5663H16.6188C16.6188 14.6892 16.5176 12.857 14.2502 12.0391Z" fill="black"/><path d="M10.9961 11.8438V13.1826L12.0002 12.8412L13.0044 13.1826V11.8438L12.0002 12.1852L10.9961 11.8438Z" fill="black"/></g><defs><clipPath id="clip0_7077_116043"><rect width="16" height="16" fill="white" transform="translate(4 4)"/></clipPath></defs></svg>`,
    images: [
      {
        defaultImage: true,
        select: true,
        URL: "./images/profile-environment/reception.png",
      },
    ],
  },

  {
    label: "Restaurant",
    value: "restaurant",
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_7077_115680)"><path d="M7.73334 4L6.66667 9.86667C6.51051 10.7253 8.56694 11.1264 8.53334 12L8.26667 18.9333C8.22571 19.9993 9.33334 20 9.33334 20C9.33334 20 10.441 19.9993 10.4 18.9333L10.1333 12C10.0998 11.1279 11.9823 10.7405 12 9.86667L10.9333 4H10.4L10.6667 8.26667L9.86667 8.8L9.6 4H9.06667L8.8 8.8L8 8.26667L8.26667 4H7.73334ZM16.8 4C16.0145 4 14.7049 4.69856 14.1812 5.74581C13.7449 6.53131 13.6 8.28608 13.6 9.33333V12C13.6 12.8727 14.7636 13.0667 15.2 13.0667L14.6667 18.9333C14.5701 19.9956 15.7333 20 15.7333 20C15.7333 20 16.8 20 16.8 18.9333V4Z" fill="black"/></g><defs><clipPath id="clip0_7077_115680"><rect width="16" height="16" fill="white" transform="translate(4 4)"/></clipPath></defs></svg>`,
    images: [
      {
        defaultImage: true,
        select: true,
        URL: "./images/profile-environment/restaurant.png",
      },
    ],
  },
];
const availableEnvironmentList = document.getElementById("availableEnvironmentList");
const PROFILE_ENV = "profile-environment";

// LS (localstorage)
function uploadEnvironmentToLS() {
  // localStorage.removeItem(PROFILE_ENV);
  const profileEnv = JSON.parse(localStorage.getItem(PROFILE_ENV)) ?? null;

  if (!profileEnv) {
    console.log("Uploading profile env data to LS...");
    localStorage.setItem(PROFILE_ENV, JSON.stringify(environmentItems));
  }
}

uploadEnvironmentToLS();

function getEnvType(environmentName) {
  const profileEnvData = JSON.parse(localStorage.getItem(PROFILE_ENV)) ?? [];
  return profileEnvData.find((data) => data.label === environmentName);
}

/**
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */

document.addEventListener("DOMContentLoaded", () => {
  const profileENV = document.getElementById("profileENV");
  const profileEnvironmentLabel = document.getElementById("profileEnvironmentLabel");
  const environmentChangedModal = document.getElementById("environmentChangedModal");
  // Find the closest ancestor with the ID 'profileEnvironmentWrapper'
  const profileEnvironmentWrapper = document.getElementById("profileEnvironmentWrapper");

  const editEnvironmentModal = document.getElementById("editEnvironmentModal");

  function renderProfileEnvironment(environmentItems) {
    environmentItems.forEach((env, i) => {
      const markup = `
              <button class="environment-option-item ${i == 0 ? "active" : ""}" data-environment-name="${env.label}" data-environment="${env.value}">
                <div>
                  <span class="env-icon-house">${env.icon}</span>
                  <span>${env.label}</span>
                </div>

                <div class="animate__animated animate__fadeIn edit-environment">
                  <!-- prettier-ignore -->
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="#fff" d="m21.737 3.751l-2.42-2.42a1 1 0 0 0-1.414 0l-4.58 4.58a1 1 0 0 0-.293.707v2.42a1 1 0 0 0 1 1h2.42a1 1 0 0 0 .707-.293l4.58-4.58a1 1 0 0 0 0-1.414m-5.7 4.287H15.03V7.032l3.58-3.58l1.006 1.006ZM19 11a1 1 0 0 0-1 1v2.392l-1.48-1.48a2.78 2.78 0 0 0-3.929 0l-.698.697l-2.486-2.486a2.777 2.777 0 0 0-3.924 0L4 12.606V7a1 1 0 0 1 1-1h6a1 1 0 0 0 0-2H5a3.003 3.003 0 0 0-3 3v12a3.003 3.003 0 0 0 3 3h12a3.003 3.003 0 0 0 3-3v-7a1 1 0 0 0-1-1M5 20a1 1 0 0 1-1-1v-3.566l2.897-2.897a.8.8 0 0 1 1.096 0l3.168 3.167c.009.01.012.022.02.03L15.448 20Zm13-1a.97.97 0 0 1-.179.537l-4.514-4.514l.698-.698a.78.78 0 0 1 1.1 0L18 17.22Z"/></svg>
                </div>
              </button>
      `;

      profileENV.insertAdjacentHTML("beforeend", markup);
    });
  }

  renderProfileEnvironment(environmentItems);

  // Collapse Environment
  function collapseEnvironmentDropdown() {
    const environmentOptions = document.querySelectorAll(".environment-option-item");
    const profileExpandEnvironmentBtn = document.querySelector(".profileExpandEnvironmentBtn");
    profileEnvironmentWrapper.setAttribute("aria-expanded", false);
    profileExpandEnvironmentBtn.classList.remove("active");

    // Hide all environment options
    environmentOptions.forEach((option) => {
      option.style.display = "none";
    });
  }

  // Event Listeners
  profileENV.addEventListener("click", function (e) {
    const profileExpandEnvironmentBtn = e.target.closest(".profileExpandEnvironmentBtn");
    const environmentOptions = document.querySelectorAll(".environment-option-item");
    const environmentOption = e.target.closest(".environment-option-item");

    // Toggle profile environment visibility
    if (profileExpandEnvironmentBtn) {
      if (!profileEnvironmentWrapper) return;

      // Get the current expanded status
      const isExpanded = profileEnvironmentWrapper.getAttribute("aria-expanded") === "true";

      // Toggle the expanded status and visibility of environment options
      if (isExpanded) {
        collapseEnvironmentDropdown();
      } else {
        profileEnvironmentWrapper.setAttribute("aria-expanded", true);
        profileExpandEnvironmentBtn.classList.add("active");

        // Show all environment options
        environmentOptions.forEach((option) => {
          option.style.display = "flex";
        });
      }

      return;
    }

    // Edit Environment
    const editEnvironment = e.target.closest(".edit-environment");
    if (editEnvironment) {
      const { environmentName } = environmentOption.dataset;
      editEnvironmentModal.classList.remove(HIDDEN);

      collapseEnvironmentDropdown();
      updateEnvironmentModalLayout(environmentName);
      return;
    }

    // Set environment when an option is clicked
    if (environmentOption) {
      // Get the environment and environment name from the clicked option
      const environment = environmentOption.getAttribute("data-environment");
      const environmentName = environmentOption.getAttribute("data-environment-name");

      // Edit Environment selected
      const editEnvironment = e.target.closest(".edit-environment");
      if (editEnvironment) return;

      // If both environment and environment name are found
      if (environment && environmentName) {
        const imageData = getEnvType(environmentName).images.find((img) => img.select);

        // Update the profile environment label and data attribute
        profileEnvironmentLabel.innerText = environmentName;
        profileENV.setAttribute("data-environment", environment);

        document.getElementById("environmentBGImage").src = imageData?.URL ?? `./images/profile-environment/default.png`;

        // Remove active class from all options and add it to the clicked option
        environmentOptions.forEach((option) => {
          option.classList.remove("active");
        });
        environmentOption.classList.add("active");

        // Show the environment changed modal
        environmentChangedModal.classList.add("show");
        environmentChangedModal.querySelector("#environmentModalLabel").innerText = environmentName;

        clearTimeout(environmentTimeout);

        environmentTimeout = setTimeout(() => {
          environmentChangedModal.classList.remove("show");
        }, 3000);
      }

      return;
    }
  });

  // Outside click
  document.addEventListener("click", (e) => {
    if (!e.target.closest("#profileENV")) {
      collapseEnvironmentDropdown();
    }
  });

  /**
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   * Edit Environment Modal
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   */

  let currentENV;

  function updateEnvironmentModalLayout(environmentName) {
    const environment = environmentItems.find((env) => env.label === environmentName);
    const editEnvironmentTypeIcon = document.querySelector(".editEnvironmentType--icon");
    const editEnvironmentTypeText = document.querySelector(".editEnvironmentType--text");

    editEnvironmentTypeIcon.innerHTML = environment.icon;
    editEnvironmentTypeText.innerHTML = environment.label;
    editEnvironmentModal.setAttribute("data-env-opened", environmentName);
    currentENV = environmentName;

    // Render Available Env Images
    const envType = getEnvType(environmentName);

    if (envType) {
      renderAvailableEnvData(envType.images);
    }
  }

  function renderAvailableEnvData(data) {
    availableEnvironmentList.innerHTML = ""; // clear container first

    data.forEach((available, i) => {
      const { select, URL, defaultImage } = available;

      const markup = `
            <div class="available-env-item ${select ? "selected" : ""}" data-env-item="${i}">
              <img src="${URL || "./images/profile-environment/default.png"}" alt="" />

              <div class="available-env-action-items ${select ? "selected" : ""} animate__animated animate__fadeIn">
                <button aria-label="delete" class="${defaultImage ? HIDDEN : ""}" id="deleteEnvItem">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#fff" d="M7.616 20q-.667 0-1.141-.475T6 18.386V6h-.5q-.213 0-.356-.144T5 5.499t.144-.356T5.5 5H9q0-.31.23-.54t.54-.23h4.46q.31 0 .54.23T15 5h3.5q.213 0 .356.144t.144.357t-.144.356T18.5 6H18v12.385q0 .666-.475 1.14t-1.14.475zM17 6H7v12.385q0 .269.173.442t.443.173h8.769q.269 0 .442-.173t.173-.442zm-6.692 11q.213 0 .357-.144t.143-.356v-8q0-.213-.144-.356T10.307 8t-.356.144t-.143.356v8q0 .213.144.356q.144.144.356.144m3.385 0q.213 0 .356-.144t.143-.356v-8q0-.213-.144-.356Q13.904 8 13.692 8q-.213 0-.357.144t-.143.356v8q0 .213.144.356t.357.144M7 6v13z"/></svg>
                </button>
                <button aria-label="select" class="${select ? "active" : ""}" id="selectEnvItem">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#fff" d="m9.55 18l-5.7-5.7l1.425-1.425L9.55 15.15l9.175-9.175L20.15 7.4z" /></svg>
                </button>
              </div>
            </div>
    `;

      availableEnvironmentList.insertAdjacentHTML("afterbegin", markup);
    });
  }

  editEnvironmentModal.addEventListener("click", (e) => {
    if (e.target.id === "editEnvironmentModal") {
      editEnvironmentModal.classList.add(HIDDEN);
    }
  });

  // Upload Image to the environment
  const addNewEnvPhoto = document.getElementById("addNewEnvPhoto");
  const environmentImageInput = document.getElementById("environmentImageInput");

  addNewEnvPhoto.addEventListener("click", () => environmentImageInput.click());

  // Listen for environmentImageInput change
  environmentImageInput.addEventListener("change", (e) => {
    const files = [...e.target.files];

    if (files.length) {
      readFilesAsBase64(files).then((base64Images) => {
        const profileEnvData = JSON.parse(localStorage.getItem(PROFILE_ENV)) ?? [];
        const newData = profileEnvData.filter((env) => env.label !== currentENV);

        base64Images.forEach((img) => {
          const envType = getEnvType(currentENV);

          const obj = {
            ...envType,
            images: [
              ...envType.images,
              {
                defaultImage: false,
                select: false,
                URL: img,
              },
            ],
          };

          localStorage.setItem(PROFILE_ENV, JSON.stringify([...newData, obj]));

          const updateEnvInfo = getEnvType(currentENV);
          renderAvailableEnvData(updateEnvInfo.images);
        });
      });
    } else {
      console.log("Nothing was selected");
    }
  });

  // Event
  availableEnvironmentList.addEventListener("click", (e) => {
    // Delete Env Item
    const deleteEnvItem = e.target.closest("#deleteEnvItem");
    if (deleteEnvItem) {
      const availableEnvItem = deleteEnvItem.closest(".available-env-item");
      const envType = getEnvType(currentENV);
      const { envItem } = availableEnvItem.dataset;

      // Only delete images that are not defaultImage
      if (!envType.defaultImage) {
        envType.images.splice(+envItem, 1);

        const profileEnvData = JSON.parse(localStorage.getItem(PROFILE_ENV)) ?? [];
        const newData = profileEnvData.filter((env) => env.label !== currentENV);

        localStorage.setItem(PROFILE_ENV, JSON.stringify([...newData, envType]));

        const updateEnvInfo = getEnvType(currentENV);
        renderAvailableEnvData(updateEnvInfo.images);
      }
      return;
    }

    // Select Env
    const selectEnvItem = e.target.closest("#selectEnvItem");
    if (selectEnvItem) {
      const availableEnvItem = selectEnvItem.closest(".available-env-item");
      const envType = getEnvType(currentENV);
      const { envItem } = availableEnvItem.dataset;

      const profileEnvData = JSON.parse(localStorage.getItem(PROFILE_ENV)) ?? [];

      const resultMap = profileEnvData.map((data) => {
        if (data.label === currentENV) {
          return {
            ...data,
            images: data.images.map((image, i) => {
              return {
                ...image,
                select: i === +envItem, // Mark select true for the matched index, false otherwise
              };
            }),
          };
        } else {
          return data;
        }
      });

      localStorage.setItem(PROFILE_ENV, JSON.stringify(resultMap));

      const updateEnvInfo = getEnvType(currentENV);
      renderAvailableEnvData(updateEnvInfo.images);
      return;
    }
  });
});
