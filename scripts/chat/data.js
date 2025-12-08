const USERID = 23801298912;
const MESSAGE_TRUNC_LENGTH = 200;

let taggedObjectInfo;
let currentOpened;
let currentOpenedGroup;
let currentOpenedLive;

let previewImage;
let previewVideoBlobURL;
let previewDocumentInfo;

/**
 *
 *
 *
 *
 * Chat messages
 *
 *
 *
 *
 */
let chatMessages = [
  // 1
  {
    userId: 1,
    messages: [
      {
        sender_id: USERID,
        receiver_id: 8192709189,
        message_id: 8122816,
        type: "text",
        message: {
          text: "Hey, how are you doing?",
          tagged_message: null,
        },
        photo: null,
        videoURL: null,
        timestamp: "1670001001",
        reactions: ["❤️", "❤️", "❤️", "❤️", "😀", "😀", "😀", "👍", "👍", "👍"],
        status: "sent",
      },

      {
        sender_id: USERID,
        receiver_id: 8192709189,
        message_id: 56789,
        type: "text",
        message: {
          text: "Anything for your boy? ☺️",
          tagged_message: {
            userId: USERID,
            text: "Hey, how are you doing?",
            taggedMessageId: 8122816,
          },
        },
        photo: null,
        videoURL: null,
        timestamp: "1670001001",
        status: "sent",
        reactions: [],
      },

      {
        sender_id: 8192709189,
        receiver_id: USERID,
        message_id: 3425,
        type: "text",
        message: {
          text: `https://google.com commandcodes is a passionate software engineer with expertise in frontend and backend development, specializing in Next.js, React.js, Node.js, and Express.js. With years of experience in building scalable web and mobile applications, commandcodes is currently expanding their skill set by learning Golang and Laravel to enhance backend performance. Beyond development, [Your Name] is dedicated to technical content creation, helping others master frontend challenges for mobile and web through engaging YouTube videos and tutorials. Their content covers modern technologies, best practices, and in-depth guides on topics like React, useEffect, and UI/UX development. Currently, [Your Name] is actively working on a live video SaaS project in Nigeria, applying their expertise to create innovative solutions. They also have a strong interest in building applications related to Facebook Pages, integrating social media APIs, and developing tools similar to Canva, incorporating zooming, dragging, and drawing functionalities. In addition to technical skills, [Your Name] is preparing for mobile app development roles, refining problem-solving abilities through LeetCode challenges and strengthening communication and critical thinking. Their long-term goal is to work remotely with a global tech company, delivering impactful solutions while continuing to share knowledge with the developer community. Connect with [Your Name] to explore opportunities, discuss technology trends, or collaborate on exciting projects!`,
          tagged_message: {
            userId: USERID,
            text: "Hey, how are you doing?",
            taggedMessageId: 8122816,
          },
        },
        photo: null,
        videoURL: null,
        timestamp: "1670001010",
        status: "sent",
        reactions: ["❤️", "👍", "👍", "👍"],
      },

      {
        sender_id: USERID,
        receiver_id: 8192709189,
        message_id: 78902893,
        type: "text",
        message: {
          text: "Check this out: https://sizemug.com and also visit http://github.com/official-commandcodes",
          tagged_message: null,
        },
        photo: null,
        videoURL: null,
        timestamp: "1670001010",
        status: "sent",
        reactions: [],
      },

      // Sent photo without text
      {
        sender_id: 8192709189,
        receiver_id: USERID,
        message_id: 45765674563,
        type: "photo",
        photos: ["https://images.unsplash.com/photo-1513097847644-f00cfe868607?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjJ8fHN0eWxpc2glMjB3b21hbiUyMGltYWdlfGVufDB8fDB8fHww"],
        videoURL: null,
        message: null,
        timestamp: "1670001010",
        status: "sent",
        reactions: [],
      },

      // Sent photo with text
      {
        sender_id: USERID,
        receiver_id: 8192709189,
        message_id: 785645636457,
        type: "photo",
        photos: ["https://images.unsplash.com/photo-1513097847644-f00cfe868607?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjJ8fHN0eWxpc2glMjB3b21hbiUyMGltYWdlfGVufDB8fDB8fHww"],
        videoURL: null,
        message: {
          text: "Whats the full gist? 👂",
        },
        timestamp: "1670001010",
        status: "sent",
        reactions: ["❤️", "❤️", "😀"],
      },

      // Sent Document with text
      {
        sender_id: USERID,
        receiver_id: 8192709189,
        message_id: 785645636457,
        type: "document",
        photos: ["https://images.unsplash.com/photo-1513097847644-f00cfe868607?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjJ8fHN0eWxpc2glMjB3b21hbiUyMGltYWdlfGVufDB8fDB8fHww"],
        videoURL: null,
        message: {
          text: "Check this out",
        },
        document: {
          filename: "Sizemug.pdf",
          size: "342 KB",
          thumbnail: "/assets/images/document-preview.png",
          type: "pdf",
        },
        timestamp: "1670001010",
        status: "sent",
        reactions: [],
      },

      // Missed Call
      {
        sender_id: USERID,
        receiver_id: 8192709189,
        message_id: 65474634354657,
        type: "voice_call",
        document: null,
        photos: null,
        videoURL: null,
        message: null,
        call_category: "missed",
        timestamp: "1670001010",
        status: "sent",
        reactions: [],
      },

      {
        sender_id: 8192709189,
        receiver_id: USERID,
        message_id: 78697234423,
        type: "voice_call",
        document: null,
        photos: null,
        videoURL: null,
        message: null,
        call_category: "missed",
        timestamp: "1670001010",
        status: "sent",
        reactions: [],
      },

      {
        sender_id: 8192709189,
        receiver_id: USERID,
        message_id: 32424234234234,
        type: "video_call",
        document: null,
        photos: null,
        videoURL: null,
        message: null,
        call_category: "missed",
        timestamp: "1670001010",
        status: "sent",
        reactions: [],
      },

      {
        sender_id: USERID,
        receiver_id: 8192709189,
        message_id: 3423432423243,
        type: "video_call",
        document: null,
        photos: null,
        videoURL: null,
        message: null,
        call_category: "missed",
        timestamp: "1670001010",
        status: "sent",
        reactions: [],
      },

      {
        sender_id: USERID,
        receiver_id: 8192709189,
        message_id: 6689276532782,
        type: "recorded_audio",
        document: null,
        photos: null,
        videoURL: null,
        message: null,
        call_category: null,
        audioURL: "/music/Salam-Alaikum.mp3",
        timestamp: "1670001010",
        status: "sent",
        reactions: [],
      },

      {
        sender_id: 8192709189,
        receiver_id: USERID,
        message_id: 762012381623,
        type: "recorded_audio",
        document: null,
        photos: null,
        videoURL: null,
        message: null,
        call_category: null,
        audioURL: "/music/water.mp3",
        timestamp: "1670001010",
        status: "sent",
        reactions: [],
      },

      {
        sender_id: 8192709189,
        receiver_id: USERID,
        message_id: 98762356871,
        type: "typing",
        typingContent: "",
        document: null,
        photos: null,
        videoURL: null,
        message: null,
        call_category: null,
        audioURL: null,
        timestamp: "172657367901230",
        status: "sent",
        reactions: [],
      },

      {
        sender_id: USERID,
        receiver_id: 8192709189,
        message_id: 67810823236329,
        type: "map",
        thumbnail: "/images/sender-map.png",
        location_address: "His Grace Boutique",
        coords: [7.7965121, 4.5640697],
        timestamp: "87672892563",
        status: "sent",
        reactions: [],
        message: {
          text: "Whats the full gist? 👂",
        },
      },

      {
        sender_id: 8192709189,
        receiver_id: USERID,
        message_id: 678823236329,
        type: "map",
        thumbnail: "/images/receiver-map.png",
        location_address: "BLUE AND WHITE HOTEL AND SUITES",
        coords: [7.7914823, 4.5554521],
        timestamp: "87672892563",
        status: "sent",
        reactions: [],
        message: {
          text: "Whats the full gist? 👂",
        },
      },
    ],
  },

  // 2
  {
    userId: 2,
    messages: [
      {
        sender_id: 827282625262728,
        receiver_id: USERID,
        message_id: 7298618923,
        type: "photo",
        photos: ["https://images.unsplash.com/photo-1513097847644-f00cfe868607?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjJ8fHN0eWxpc2glMjB3b21hbiUyMGltYWdlfGVufDB8fDB8fHww"],
        videoURL: null,
        message: null,
        timestamp: "1670001010",
        status: "sent",
        reactions: [],
      },

      // Sent photo with text
      {
        sender_id: USERID,
        receiver_id: 827282625262728,
        message_id: 92390123213,
        type: "photo",
        photos: ["https://images.unsplash.com/photo-1513097847644-f00cfe868607?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjJ8fHN0eWxpc2glMjB3b21hbiUyMGltYWdlfGVufDB8fDB8fHww"],
        videoURL: null,
        message: {
          text: "Whats the full gist? 👂",
        },
        timestamp: "1670001010",
        status: "sent",
        reactions: [],
      },

      {
        sender_id: USERID,
        receiver_id: 827282625262728,
        message_id: 92390123213,
        type: "video_call",
        document: null,
        photos: null,
        videoURL: null,
        message: null,
        call_category: "missed",
        timestamp: "1670001010",
        status: "sent",
        reactions: ["✅"],
      },
    ],
  },

  // 3
  {
    userId: 3,
    messages: [],
  },

  // 4
  {
    userId: 4,
    messages: [
      {
        sender_id: USERID,
        receiver_id: 8527890189871,
        message_id: 8122816,
        type: "text",
        message: {
          text: "Hey, how are you doing?",
          tagged_message: null,
        },
        photo: null,
        videoURL: null,
        timestamp: "1670001001",
        status: "sent",
        reactions: ["🚨"],
      },
      {
        sender_id: USERID,
        receiver_id: 8527890189871,
        message_id: 56789,
        type: "text",
        message: {
          text: "Anything for your boy? ☺️",
          tagged_message: null,
        },
        photo: null,
        videoURL: null,
        timestamp: "1670001001",
        status: "sent",
        reactions: [],
      },
      {
        sender_id: 8527890189871,
        receiver_id: USERID,
        message_id: 3425,
        type: "text",
        message: {
          text: "I'm good, thanks! How about you?",
          tagged_message: null,
        },
        photo: null,
        videoURL: null,
        timestamp: "1670001010",
        status: "sent",
        reactions: [],
      },
    ],
  },

  // 5
  {
    userId: 5,
    messages: [
      {
        sender_id: USERID,
        receiver_id: 7899771265612,
        message_id: 8122816,
        type: "text",
        message: {
          text: "Hey, how are you doing?",
          tagged_message: null,
        },
        photo: null,
        videoURL: null,
        timestamp: "1670001001",
        status: "sent",
        reactions: ["❤️", "👍"],
      },
      {
        sender_id: USERID,
        receiver_id: 7899771265612,
        message_id: 56789,
        type: "text",
        message: {
          text: "Anything for your boy? ☺️",
          tagged_message: null,
        },
        photo: null,
        videoURL: null,
        timestamp: "1670001001",
        status: "sent",
        reactions: [],
      },
      {
        sender_id: 7899771265612,
        receiver_id: USERID,
        message_id: 3425,
        type: "text",
        message: {
          text: "I'm good, thanks! How about you?",
          tagged_message: null,
        },
        photo: null,
        videoURL: null,
        timestamp: "1670001010",
        status: "sent",
        reactions: [],
      },
    ],
  },

  // 6
  {
    userId: 6,
    messages: [
      {
        sender_id: 8192709189,
        receiver_id: USERID,
        message_id: 8122816,
        type: "text",
        message: {
          text: "Hey, how are you doing?",
          tagged_message: null,
        },
        photo: null,
        videoURL: null,
        timestamp: "1670001001",
        status: "sent",
        reactions: [],
      },

      {
        sender_id: USERID,
        receiver_id: 8192709189,
        message_id: 71761289,
        type: "task",
        taskStatus: "pending",
        message: null,
        photo: null,
        videoURL: null,
        timestamp: "1670001001",
        status: "sent",
        reactions: [],
      },
    ],
  },

  // 7
  {
    userId: 7,
    messages: [
      {
        sender_id: 1177819272,
        receiver_id: USERID,
        message_id: 71761289,
        type: "task",
        taskStatus: "pending",
        message: null,
        photo: null,
        videoURL: null,
        timestamp: "1670001001",
        status: "sent",
        reactions: [],
      },
      {
        sender_id: 1177819272,
        receiver_id: USERID,
        message_id: 8122816,
        type: "text",
        message: {
          text: "Hello there :)",
          tagged_message: null,
        },
        photo: null,
        videoURL: null,
        timestamp: "1670001001",
        status: "sent",
        reactions: [],
      },
    ],
  },

  // 8
  {
    userId: 8,
    messages: [
      {
        sender_id: 781123812391,
        receiver_id: USERID,
        message_id: 7817923771289371,
        type: "text",
        taskStatus: "pending",
        message: { text: "Hello Man 👋" },
        photo: null,
        videoURL: null,
        timestamp: "1670001001",
        request: true, // request property manage if the user request has been accepted(true) or not(false)
        status: "sent",
        reactions: [],
      },
    ],
  },
];

/**
 *
 *
 *
 *
 * Chat Users
 *
 *
 *
 *
 */
const chatItems = [
  {
    id: 1,
    name: "Liam Johnson",
    verified: true,
    message: "Hello how have you been?",
    type: "text",
    time: "9:20 AM",
    unreadCount: null,
    profileImage: "https://images.unsplash.com/photo-1505033575518-a36ea2ef75ae?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
    messageNew: true,
    onlineStatus: true,
    document: {
      name: "Document name",
    },
    image: null,
    messages: [{}],
    video: null,
    status: "new",
  },
  {
    id: 2,
    name: "Emma Davis",
    verified: false,
    message: "Hello how have you been?",
    type: "document",
    time: "9:20 AM",
    unreadCount: 16,
    profileImage: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
    messageNew: false,
    onlineStatus: true,
    document: null,
    video: null,
    status: "new",
  },
  {
    id: 3,
    name: "Noah Brown",
    verified: false,
    message: "Been here for a while where have you been?",
    type: "text",
    time: "9:20 AM",
    unreadCount: null,
    profileImage: "https://images.unsplash.com/photo-1499557354967-2b2d8910bcca?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
    messageNew: false,
    onlineStatus: false,
    document: null,
    video: null,
    status: "unread",
  },
  {
    id: 4,
    name: "Olivia Martinez",
    verified: true,
    message: "Happy birthday!! 🎉",
    type: "text",
    time: "9:20 AM",
    unreadCount: 3,
    profileImage: null,
    messageNew: false,
    onlineStatus: false,
    document: null,
    video: null,
    status: "unread",
  },
  {
    id: 5,
    name: "James Wilson",
    verified: false,
    message: "Image name",
    type: "image",
    time: "9:20 AM",
    unreadCount: 24,
    profileImage: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
    messageNew: false,
    onlineStatus: true,
    document: null,
    video: null,
    images: [
      {
        text: "This is you in 2012",
        image: "",
        filename: "Image name 2067",
      },
    ],
    status: "favourite",
  },
  {
    id: 6,
    name: "Sophia Taylor",
    verified: false,
    message: null,
    type: "video",
    time: "9:20 AM",
    unreadCount: null,
    profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
    messageNew: false,
    onlineStatus: true,
    document: null,
    video: null,
    images: [
      {
        text: "This is you in 2012",
        image: "",
        filename: "Your image in 2010",
      },
    ],
    status: "following",
  },
  {
    id: 7,
    name: "Benjamin Lee",
    verified: false,
    message: "",
    type: "image",
    time: "9:20 AM",
    unreadCount: 24,
    profileImage: "https://images.unsplash.com/photo-1532074205216-d0e1f4b87368?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
    messageNew: false,
    onlineStatus: false,
    document: null,
    video: "./assets/videos/2.mp4",
    images: null,
    status: "followers",
  },

  {
    id: 8,
    name: "Emma Okwo",
    verified: false,
    message: "Image name",
    type: "text",
    time: "10:20 AM",
    unreadCount: 1,
    profileImage: "https://images.unsplash.com/photo-1532074205216-d0e1f4b87368?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
    messageNew: true,
    onlineStatus: true,
    document: null,
    video: null,
    images: null,
    status: "request",
  },
];

const defaultProfilePhoto = `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.006 18.0965C17.0474 18.9624 18.4361 19.4819 19.9982 19.4819C21.5604 19.4819 22.9489 18.9624 23.9904 18.0965C25.5526 16.8844 26.4204 15.1528 26.4204 13.0749C26.4204 11.5165 25.8997 9.95802 24.8582 8.91905C23.6432 7.53377 21.9076 6.66797 19.9982 6.66797C18.0889 6.66797 16.1795 7.53377 15.1381 8.91905C14.0966 9.95802 13.4023 11.5165 13.4023 13.0749C13.4023 15.1528 14.4438 16.8844 16.006 18.0965Z" fill="white"/><path d="M23.4663 22.25C23.1191 22.25 22.7721 22.25 22.425 22.25H17.2176C16.8705 22.25 16.5233 22.25 16.1762 22.25C12.5311 22.7695 9.75391 25.8863 9.75391 29.5227C9.75391 30.5617 10.2746 31.4275 10.9689 31.7738C12.184 32.4665 14.614 33.3323 19.6476 33.3323C24.6813 33.3323 27.1115 32.4665 28.3265 31.7738C29.1943 31.2543 29.5415 30.3885 29.5415 29.5227C30.0621 25.8863 27.1115 22.7695 23.4663 22.25Z" fill="white"/></svg>`;

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
 * Group Chat Users
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
const groupChatItems = [
  {
    id: 1,
    name: "Tech Enthusiasts Hub 🚀",
    description: "A space for developers, designers, and tech lovers to discuss the latest trends, share knowledge, and collaborate on projects. Whether you're into web development, mobile apps, AI, or cloud computing, this is the place to connect and grow together!",
    unreadCount: null,
    profileImage: null,
    messageNew: true,
    activeOnline: 20,
    lastMessageId: 10,
  },

  {
    id: 2,
    name: "Casual Hangout & Chill 🎉",
    description: "A friendly and welcoming group chat where we talk about anything and everything—movies, music, memes, and daily life. No pressure, just good vibes and great conversations!",
    unreadCount: 16,
    profileImage: null,
    messageNew: false,
    activeOnline: 10,
    lastMessageId: 17,
  },

  {
    id: 3,
    name: "Startup & Business Builders 💡",
    description: "For entrepreneurs, freelancers, and professionals looking to exchange ideas, share insights, and support each other in the world of business and startups. From brainstorming new ventures to discussing marketing strategies, let’s build and grow together!",
    unreadCount: null,
    profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
    messageNew: false,
    activeOnline: 200,
    lastMessageId: 19,
  },

  {
    id: 4,
    name: "Creative Minds 🎨",
    description: "A community for artists, designers, and creative thinkers to discuss ideas, showcase their work, and inspire each other.",
    unreadCount: 2,
    profileImage: "https://plus.unsplash.com/premium_photo-1677529497048-2bf5899e68de?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHRlYW18ZW58MHx8MHx8fDA%3D",
    messageNew: true,
    activeOnline: 120,
    lastMessageId: 18,
  },

  {
    id: 5,
    name: "Photography Club",
    description: "A community for artists, designers, and creative thinkers to discuss ideas, showcase their work, and inspire each other.",
    unreadCount: 2,
    profileImage: "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fG1ldHRpbmd8ZW58MHx8MHx8fDA%3D",
    messageNew: true,
    activeOnline: 120,
    lastMessageId: 23,
  },

  {
    id: 6,
    name: "Video Creators",
    description: "A community for artists, designers, and creative thinkers to discuss ideas, showcase their work, and inspire each other.",
    unreadCount: 2,
    profileImage: "https://plus.unsplash.com/premium_photo-1679429320552-ec9038ccd550?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHRlYW18ZW58MHx8MHx8fDA%3D",
    messageNew: true,
    activeOnline: 120,
    lastMessageId: 26,
  },

  {
    id: 7,
    name: "Video Creators",
    description: "A community for artists, designers, and creative thinkers to discuss ideas, showcase their work, and inspire each other.",
    unreadCount: 2,
    profileImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8bWV0dGluZ3xlbnwwfHwwfHx8MA%3D%3D",
    messageNew: true,
    activeOnline: 120,
    lastMessageId: 28,
  },

  {
    id: 8,
    name: "Sizemug Video Creators",
    description: "A community for artists, designers, and creative thinkers to discuss ideas, showcase their work, and inspire each other.",
    unreadCount: 2,
    profileImage: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWV0dGluZ3xlbnwwfHwwfHx8MA%3D%3D",
    messageNew: true,
    activeOnline: 120,
    lastMessageId: 29,
  },
];

let groupMessages = [
  // Tech Enthusiasts Chats
  {
    messageId: 10,
    groupId: 1,
    senderId: {
      id: 90112890917,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
      name: "Amara",
    },
    type: "text",
    message: "Morning, team! Hope you all had a good night. 😊 What's the status on the client pitch deck?",
    taggedId: null,
    photos: null,
    document: null,
    time: "10:20",
    reactions: ["❤️", "😀", "😀"],
  },

  {
    messageId: 29,
    groupId: 8,
    senderId: {
      id: 8578672039153,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
      name: "Richard",
    },
    type: "text",
    message: "Morning, team! Hope you all had a good night 😊?.",
    taggedId: null,
    photos: null,
    document: null,
    time: "10:20",
    reactions: [],
  },

  {
    messageId: 11,
    groupId: 1,
    senderId: {
      id: USERID,
      image: "",
      name: "Musa Abdulkabir",
    },
    type: "text",
    message: "Morning, Amara! Working on the visuals now. Should have it ready for review by 2 PM.",
    taggedId: null,
    photos: null,
    document: null,
    time: "01:31",
    reactions: [],
  },

  {
    messageId: 12,
    groupId: 1,
    senderId: {
      id: 5678902193,
      image: "https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
      name: "Tunde",
    },
    type: "text",
    message: "Hey everyone 👋! I’ve wrapped up the brand guideline mockups. I’ll share them in a bit for feedback.",
    taggedId: null,
    photos: null,
    document: null,
    time: "03:56",
    reactions: ["❤️", "❤️", "😀", "👍"],
  },

  {
    messageId: 13,
    groupId: 1,
    senderId: {
      id: 5678902193,
      image: "https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
      name: "Tunde",
    },
    type: "text",
    message: "Let’s go sans-serif for this one. The client is leaning toward a modern, minimal vibe.",
    taggedId: null,
    photos: null,
    document: null,
    time: "08:48",
    reactions: [],
  },

  {
    messageId: 14,
    groupId: 1,
    senderId: {
      id: 456381893812,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
      name: "Amara",
    },
    type: "text",
    message: "Got it. I’ll update the headings.",
    taggedId: 12,
    photos: null,
    document: null,
    time: "02:12",
    reactions: [],
  },

  {
    messageId: 15,
    groupId: 1,
    senderId: {
      id: USERID,
      image: "",
      name: "Musa Abdulkabir",
    },
    type: "text",
    message: "Hello",
    taggedId: 10,
    photos: null,
    document: null,
    time: "06:30",
    reactions: [],
  },

  // Book Clubs
  {
    messageId: 16,
    groupId: 2,
    senderId: {
      id: 5617623709123,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
      name: "Kunle",
    },
    type: "text",
    message: "Morning, team! Hope you all had a good night 😊?.",
    taggedId: null,
    photos: null,
    document: null,
    time: "10:20",
    reactions: [],
  },

  {
    messageId: 17,
    groupId: 2,
    senderId: {
      id: 78701326791,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
      name: "Ayomide",
    },
    type: "text",
    message: "Morning, team! Hope you all had a good night 😊?.",
    taggedId: null,
    photos: null,
    document: null,
    time: "10:20",
    reactions: [],
  },

  // Fitness Group
  {
    messageId: 18,
    groupId: 3,
    senderId: {
      id: 8578672039153,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
      name: "Richard",
    },
    type: "text",
    message: "Morning, team! Hope you all had a good night 😊?.",
    taggedId: null,
    photos: null,
    document: null,
    time: "10:20",
    reactions: [],
  },

  {
    messageId: 19,
    groupId: 3,
    senderId: {
      id: 7189115361820937,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
      name: "Oshinme",
    },
    type: "text",
    message: "Morning, team! Hope you all had a good night 😊?.",
    taggedId: null,
    photos: null,
    document: null,
    time: "10:20",
    reactions: [],
  },

  {
    messageId: 20,
    groupId: 1,
    senderId: {
      id: 90112890917,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
      name: "Amara",
    },
    type: "typing",
    message: null,
    taggedId: null,
    photos: null,
    document: null,
    time: "10:20",
    reactions: [],
  },

  {
    messageId: 18,
    groupId: 4,
    senderId: {
      id: 8578672039153,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
      name: "Richard",
    },
    type: "text",
    message: "Morning, team! Hope you all had a good night 😊?.",
    taggedId: null,
    photos: null,
    document: null,
    time: "10:20",
    reactions: [],
  },

  {
    messageId: 23,
    groupId: 5,
    senderId: {
      id: 8578672039153,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
      name: "Richard",
    },
    type: "text",
    message: "Morning, team! Hope you all had a good night 😊?.",
    taggedId: null,
    photos: null,
    document: null,
    time: "10:20",
    reactions: [],
  },

  {
    messageId: 26,
    groupId: 6,
    senderId: {
      id: 8578672039153,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
      name: "Richard",
    },
    type: "text",
    message: "Morning, team! Hope you all had a good night 😊?.",
    taggedId: null,
    photos: null,
    document: null,
    time: "10:20",
    reactions: [],
  },

  {
    messageId: 28,
    groupId: 7,
    senderId: {
      id: 8578672039153,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
      name: "Richard",
    },
    type: "text",
    message: "Morning, team! Hope you all had a good night 😊?.",
    taggedId: null,
    photos: null,
    document: null,
    time: "10:20",
    reactions: [],
  },
];

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
 * Live Chats Lists
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
const liveChatList = [
  {
    id: 1,
    title: "project",
    interests: ["Tech", "Education", "Fashion", "Human"],
    description: "Engage with your customers instantly using our live chat system. Whether they have questions, need assistance, or require quick troubleshooting, our real-time messaging ensures they get the support they need—fast and efficiently. Improve customer satisfaction and keep your audience engaged with seamless communication.",
    newMessageCount: 99,
    profileImage: "https://plus.unsplash.com/premium_photo-1661290256778-3b821d52c514?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvamVjdHxlbnwwfHwwfHx8MA%3D%3D",
    activeOnline: 20,
    lastMessageId: 10,
  },

  {
    id: 2,
    title: "sizemug",
    interests: ["Education", "Tech", "Fashion", "Doctor", "Engineer", "Developer", "Programmer"],
    description: "Boost productivity with a live chat system designed for teams. Share updates, exchange files, and collaborate in real-time, all within a secure and intuitive chat environment. Whether you're working remotely or in-office, stay connected and streamline communication effortlessly.",
    newMessageCount: 8,
    profileImage: "https://images.unsplash.com/photo-1620325867502-221cfb5faa5f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvamVjdHxlbnwwfHwwfHx8MA%3D%3D",
    activeOnline: 20,
    lastMessageId: 10,
  },

  {
    id: 3,
    title: "project team",
    interests: ["Tech", "Fashion"],
    description: "Enhance user experience with a dynamic live chat feature. From website visitors to app users, provide instant responses, automate FAQs, and create meaningful interactions. Perfect for businesses, communities, and customer service teams looking to improve engagement and retention. Let me know if you want me to tweak these for a specific use case! 🚀",
    newMessageCount: 24,
    profileImage: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cHJvamVjdHxlbnwwfHwwfHx8MA%3D%3D",
    activeOnline: 20,
    lastMessageId: 10,
  },

  {
    id: 4,
    title: "working late",
    interests: ["Entrepreneur", "Fashion"],
    description: "Enhance user experience with a dynamic live chat feature. From website visitors to app users, provide instant responses, automate FAQs, and create meaningful interactions. Perfect for businesses, communities, and customer service teams looking to improve engagement and retention. Let me know if you want me to tweak these for a specific use case! 🚀",
    newMessageCount: 24,
    profileImage: "https://plus.unsplash.com/premium_photo-1677529496297-fd0174d65941?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dGVhbXxlbnwwfHwwfHx8MA%3D%3D",
    activeOnline: 10,
    lastMessageId: 10,
  },
];

let liveMessages = [
  // Tech Enthusiasts Chats
  {
    messageId: 10,
    liveId: 1,
    senderId: {
      id: 90112890917,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
      name: "Amara",
    },
    type: "text",
    message: "Morning, team! Hope you all had a good night. 😊 What's the status on the client pitch deck?",
    taggedId: null,
    photos: null,
    document: null,
    time: "10:20",
    reactions: [],
  },

  {
    messageId: 11,
    liveId: 1,
    senderId: {
      id: USERID,
      image: "",
      name: "Musa Abdulkabir",
    },
    type: "text",
    message: "Morning, Amara! Working on the visuals now. Should have it ready for review by 2 PM.",
    taggedId: null,
    photos: null,
    document: null,
    time: "01:31",
    reactions: [],
  },

  {
    messageId: 12,
    liveId: 1,
    senderId: {
      id: 5678902193,
      image: "https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
      name: "Tunde",
    },
    type: "text",
    message: "Hey everyone 👋! I’ve wrapped up the brand guideline mockups. I’ll share them in a bit for feedback.",
    taggedId: null,
    photos: null,
    document: null,
    time: "03:56",
    reactions: [],
  },

  {
    messageId: 13,
    liveId: 1,
    senderId: {
      id: 5678902193,
      image: "https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
      name: "Tunde",
    },
    type: "text",
    message: "Let’s go sans-serif for this one. The client is leaning toward a modern, minimal vibe.",
    taggedId: null,
    photos: null,
    document: null,
    time: "08:48",
    reactions: ["❤️", "❤️", "❤️", "❤️", "😀", "😀", "😀", "👍", "👍", "🔥"],
  },

  {
    messageId: 14,
    liveId: 1,
    senderId: {
      id: 456381893812,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
      name: "Amara",
    },
    type: "text",
    message: "Got it. I’ll update the headings.",
    taggedId: 12,
    photos: null,
    document: null,
    time: "02:12",
    reactions: [],
  },

  {
    messageId: 15,
    liveId: 1,
    senderId: {
      id: USERID,
      image: "",
      name: "Musa Abdulkabir",
    },
    type: "text",
    message: "Hello",
    taggedId: 10,
    photos: null,
    document: null,
    time: "06:30",
    reactions: ["❤️", "👍"],
  },

  // Book Clubs
  {
    messageId: 16,
    liveId: 2,
    senderId: {
      id: 5617623709123,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
      name: "Kunle",
    },
    type: "text",
    message: "Morning, team! Hope you all had a good night 😊?.",
    taggedId: null,
    photos: null,
    document: null,
    time: "10:20",
    reactions: [],
  },

  {
    messageId: 17,
    liveId: 2,
    senderId: {
      id: 78701326791,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
      name: "Ayomide",
    },
    type: "text",
    message: "Morning, team! Hope you all had a good night 😊?.",
    taggedId: null,
    photos: null,
    document: null,
    time: "10:20",
    reactions: [],
  },

  // Fitness Group
  {
    messageId: 18,
    liveId: 3,
    senderId: {
      id: 8578672039153,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
      name: "Richard",
    },
    type: "text",
    message: "Morning, team! Hope you all had a good night 😊?.",
    taggedId: null,
    photos: null,
    document: null,
    time: "10:20",
    reactions: [],
  },

  {
    messageId: 19,
    liveId: 3,
    senderId: {
      id: 7189115361820937,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
      name: "Oshinme",
    },
    type: "text",
    message: "Morning, team! Hope you all had a good night 😊?.",
    taggedId: null,
    photos: null,
    document: null,
    time: "10:20",
    reactions: ["❤️", "✅", "👍", "🔥"],
  },

  // Working Late
  {
    messageId: 18,
    liveId: 4,
    senderId: {
      id: 1698718212653,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
      name: "Richard",
    },
    type: "text",
    message: "Morning, team!?.",
    taggedId: null,
    photos: null,
    document: null,
    time: "10:20",
    reactions: [],
  },

  {
    messageId: 19,
    liveId: 4,
    senderId: {
      id: USERID,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
      name: "Oshinme",
    },
    type: "text",
    message: "How was yur night?.",
    taggedId: null,
    photos: null,
    document: null,
    time: "10:20",
  },

  {
    messageId: 20,
    liveId: 1,
    senderId: {
      id: 8578672039153,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
      name: "Richard",
    },
    type: "typing",
    message: null,
    taggedId: null,
    photos: null,
    document: null,
    time: "10:20",
    reactions: [],
  },
];

//
const scrollStoriesData = [
  {
    id: 672,
    fullName: "Amelia Harrison",
    verified: true,
    userPhoto: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
    watched: true,
    medias: [
      {
        type: "image",
        caption: "A moment of peace in the chaos of life || 🌿",
        media: "https://images.unsplash.com/photo-1544894079-e81a9eb1da8b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGZyZWUlMjBpbWFnZXN8ZW58MHx8MHx8fDA%3D",
      },
      {
        type: "video",
        caption: "Chasing dreams, one step at a time || ✨. Typically represents a community, friends list, or user management options. Closed Captions (CC) Icon – Used for enabling or disabling subtitles or captions in a video.",
        media: "./assets/videos/1.mp4",
      },

      {
        type: "image",
        caption: "Life is too short to wait for the perfect moment, create it!. Closed Captions (CC) Icon – Used for enabling or disabling subtitles or captions in a video.",
        media: "./images/stories/story_image_7.svg",
      },

      {
        type: "image",
        caption: "Sometimes, the best things in life come when we least expect them.",
        media: "https://images.unsplash.com/photo-1533899114961-3aa0579cd5b8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzh8fGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D",
      },
    ],
  },

  {
    id: 372,
    fullName: "Lucas Mitchell",
    verified: true,
    userPhoto: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
    watched: false,
    medias: [
      {
        type: "image",
        caption: "Let the good vibes roll – it's all about enjoying the ride.",
        media: "./images/stories/story_image_8.svg",
      },

      {
        type: "image",
        caption: "Finding beauty in the little things that make each day unique.",
        media: "https://images.unsplash.com/photo-1533899114961-3aa0579cd5b8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzh8fGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D",
      },
    ],
  },

  {
    id: 182,
    fullName: "Emma Robinson",
    userPhoto: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
    watched: false,
    medias: [
      {
        type: "image",
        caption: "Smiling through the ups and downs, because every day is a new beginning.",

        media: "./images/stories/story_image_9.svg",
      },
    ],
  },

  {
    id: 132,
    watched: true,
    fullName: "Ethan Parker",
    userPhoto: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
    medias: [
      {
        type: "image",
        caption: "Escaping reality with a cup of coffee and a good book. 📚☕",
        media: "./images/stories/story_image_6.svg",
      },
      {
        type: "video",
        caption: "When life gives you lemons, make some magic.",
        media: "../assets/videos/2.mp4",
      },
    ],
  },

  {
    id: 400,
    watched: false,
    fullName: "James Morris",
    userPhoto: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
    medias: [
      {
        type: "image",
        caption: "Escaping reality with a cup of coffee and a good book. 📚☕",
        media: "https://images.unsplash.com/photo-1720884413532-59289875c3e1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZnJlZSUyMGltYWdlc3xlbnwwfHwwfHx8MA%3D%3D",
      },

      {
        type: "image",
        caption: "Here’s to the nights that turn into mornings and the friends that turn into family. || 👩‍👩‍👦‍👦",
        media: "https://images.unsplash.com/photo-1533899114961-3aa0579cd5b8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzh8fGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D",
      },
    ],
  },

  {
    id: 430,
    watched: true,
    fullName: "Alexander Brooks",
    userPhoto: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
    medias: [
      {
        type: "image",
        caption: "Adventure awaits beyond the horizon. Ready to take on the world! 🌍",
        media: "./images/stories/story_image_10.png",
      },

      {
        type: "image",
        caption: "Building my dreams with determination, one brick at a time. 🏗️",
        media: "https://images.unsplash.com/photo-1533899114961-3aa0579cd5b8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzh8fGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D",
      },
    ],
  },

  {
    id: 420,
    watched: false,
    fullName: "Benjamin Ross",
    userPhoto: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
    medias: [
      {
        type: "image",
        caption: "The sun will set, but it will rise again tomorrow. 🌅",
        media: "https://images.unsplash.com/photo-1533899114961-3aa0579cd5b8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzh8fGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D",
      },
      {
        type: "video",
        caption: "Celebrating life’s small wins – they all add up in the end.",
        media: "../assets/videos/3.mp4",
      },
    ],
  },

  {
    id: 470,
    watched: true,
    fullName: "Jackson Bailey",
    userPhoto: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
    medias: [
      {
        type: "image",
        caption: "Taking a moment to appreciate how far I've come. No stopping now!",
        media: "./images/stories/story_image_4.svg",
      },

      {
        type: "image",
        caption: "When you stop looking for happiness, that’s when it finds you.",
        media: "https://images.unsplash.com/photo-1533899114961-3aa0579cd5b8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzh8fGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D",
      },
    ],
  },

  {
    id: 570,
    watched: true,
    fullName: "Charlotte Bryant",
    verified: true,
    userPhoto: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
    medias: [
      {
        type: "image",
        caption: "Not every day is perfect, but there’s something good in every day.",
        media: "./images/stories/story_image_3.svg",
      },

      {
        type: "image",
        caption: "In a world where you can be anything, be kind. 🌟",
        media: "https://images.unsplash.com/photo-1533899114961-3aa0579cd5b8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzh8fGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D",
      },
    ],
  },

  {
    id: 836,
    watched: true,
    fullName: "William Turner",
    userPhoto: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
    medias: [
      {
        type: "image",
        caption: "Sometimes the hardest battles are the ones we fight within ourselves. Stay strong.",
        media: "./images/stories/story_image_2.svg",
      },

      {
        type: "image",
        caption: "A beautiful day begins with a positive mindset and a little bit of sunshine. 💋",
        media: "https://images.unsplash.com/photo-1533899114961-3aa0579cd5b8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzh8fGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D",
      },
    ],
  },

  {
    id: 68,
    watched: true,
    fullName: "Noah Cooper",
    verified: true,

    userPhoto: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
    medias: [
      {
        type: "image",
        caption: "Life isn’t about waiting for the storm to pass; it’s about learning to dance in the rain. || 🌧",
        media: "./images/stories/story_image_1.svg",
      },

      {
        type: "image",
        caption: "Be a voice, not an echo. 🗣️",
        media: "https://images.unsplash.com/photo-1533899114961-3aa0579cd5b8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzh8fGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D",
      },
    ],
  },
];

scrollStoriesData[10].pinIcon = "./images/stories/Story_pin_Icon1.svg";
scrollStoriesData[8].pinIcon = "./images/stories/Story_pin_Icon2.svg";
scrollStoriesData[9].pinIcon = "./images/stories/Story_pin_Icon2.svg";
scrollStoriesData[5].pinIcon = "./images/stories/Story_pin_Icon2.svg";
scrollStoriesData[6].pinIcon = "./images/stories/Story_pin_Icon2.svg";
scrollStoriesData[7].pinIcon = "./images/stories/Story_pin_Icon1.svg";
scrollStoriesData[1].pinIcon = "./images/stories/Story_pin_Icon1.svg";
scrollStoriesData[2].pinIcon = "./images/stories/Story_pin_Icon2.svg";
scrollStoriesData[3].pinIcon = "./images/stories/Story_pin_Icon1.svg";
scrollStoriesData[4].pinIcon = "./images/stories/Story_pin_Icon1.svg";
