const randomTitles = ["Epic Mountain Adventure", "City Lights at Night", "Cooking with Friends", "Surfing the Waves", "A Day in the Life", "Street Art Stories", "Sunset Boulevard", "Tech Unboxing", "Hidden Waterfalls", "Urban Exploration"];

const randomAuthors = ["Olivia Smith", "Liam Johnson", "Emma Williams", "Noah Brown", "Ava Jones", "Elijah Garcia", "Sophia Martinez", "Lucas Miller", "Mia Davis", "Mason Rodriguez"];

const randomImages = ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500", "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=500", "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=500", "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=500", "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?w=500", "https://images.unsplash.com/photo-1519985176271-adb1088fa94c?w=500", "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=500", "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500"];

const randomVideos = ["https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4", "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_2mb.mp4", "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_5mb.mp4", "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_10mb.mp4"];

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomClip() {
  const type = Math.random() > 0.5 ? "video" : "image";
  return {
    type,
    media: type === "video" ? getRandom(randomVideos) : getRandom(randomImages),
  };
}

function getRandomClips(count) {
  return Array.from({ length: count }, getRandomClip);
}

const glivClips = [
  {
    id: 1,
    title: getRandom(randomTitles),
    author: getRandom(randomAuthors),
    thumbnail: getRandom(randomImages),
    clips: getRandomClips(1),
  },
  {
    id: 2,
    title: getRandom(randomTitles),
    author: getRandom(randomAuthors),
    thumbnail: getRandom(randomImages),
    clips: getRandomClips(2),
  },
  {
    id: 3,
    title: getRandom(randomTitles),
    author: getRandom(randomAuthors),
    thumbnail: getRandom(randomImages),
    clips: getRandomClips(3),
  },
  {
    id: 4,
    title: getRandom(randomTitles),
    author: getRandom(randomAuthors),
    thumbnail: getRandom(randomImages),
    clips: getRandomClips(4),
  },
  {
    id: 5,
    title: getRandom(randomTitles),
    author: getRandom(randomAuthors),
    thumbnail: getRandom(randomImages),
    clips: getRandomClips(5),
  },
  {
    id: 6,
    title: getRandom(randomTitles),
    author: getRandom(randomAuthors),
    thumbnail: getRandom(randomImages),
    clips: getRandomClips(6),
  },
  {
    id: 7,
    title: getRandom(randomTitles),
    author: getRandom(randomAuthors),
    thumbnail: getRandom(randomImages),
    clips: getRandomClips(7),
  },
  {
    id: 8,
    title: getRandom(randomTitles),
    author: getRandom(randomAuthors),
    thumbnail: getRandom(randomImages),
    clips: getRandomClips(8),
  },
];

const streamerChats = [
  {
    sender: {
      name: "Emmy Watson",
      emoji: null,
      role: null,
      badge: null,
    },
    message: "Hey everyone 👋 just joined!",
    status: "offline",
  },

  {
    sender: {
      name: "Jacob Jones",
      emoji: "❌",
      role: "Host",
      badge: "medal-gold-level-1",
    },
    message: "Welcome!",
    status: "offline",
  },

  {
    sender: {
      name: "Camaron Williamson",
      emoji: "❌",
      role: null,
      badge: "sg-pioneer",
    },
    message: "This is my first time here, love the vibe already 🙌",
    status: "offline",
  },

  {
    sender: {
      name: "Ronald Richards",
      emoji: "💬",
      role: "Co-Host",
    },
    message: "Where’s everyone tuning in from?",
    status: "active", // 💬 indicates active status
  },

  {
    sender: {
      name: "Floyd Miles",
      emoji: "💬",
      role: "Top Gifted 1",
    },
    message: "The audio is 💤 — super crisp!",
    status: "active",
  },

  {
    sender: {
      name: "Darlene Robertson",
      emoji: "❌",
      role: null,
      badge: null,
    },
    message: "You got me hooked with that intro 💤💤💤",
    status: "offline",
  },

  {
    sender: {
      name: "Bessie Cooper",
      emoji: "💬",
      role: "Top Gifted 2",
    },
    message: "Back again 💤 never miss your streams!",
    status: "active",
  },

  {
    sender: {
      name: "Kathryn Murphy",
      emoji: "💬",
      role: "Top Gifted 3",
    },
    message: "Omg this setup looks 💤💤💤",
    status: "active",
  },

  {
    sender: {
      name: "Ralph Edwards",
      emoji: "❌",
      role: null,
      badge: "sg-100-days-streamer-badge",
    },
    message: "Can we get a shoutout? 💬",
    status: "offline",
  },

  {
    sender: {
      name: "Esther Howard",
      emoji: null,
      role: null,
    },
    message: "Wow the chat is moving fast today!",
    status: null,
  },
];

// 2) A full array of (now) ten viewers:
const allViewers = [
  {
    id: "1",
    name: "Floyd Miles",
    avatarUrl: "https://images.unsplash.com/photo-1575936123452-b67c3203c357?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",
    tagline: "An innovative software engineer known for his groundbreaking work…",
    badges: ["Top Gifted"],
    isFollowing: true,
    isFollower: false,
    totalGiftsSent: 42,
    isVIP: false,
    borderColor: "",
    isHost: true,
  },
  {
    id: "2",
    name: "Theresa Webb",
    avatarUrl: "https://media.istockphoto.com/id/2194078950/photo/profile-picture-of-smiling-confident-arabic-businessman.webp?a=1&b=1&s=612x612&w=0&k=20&c=42Z7FDi1u5Ogevtd0xMUkTWM7hDzrre4YOlbHKvK_T8=",
    tagline: "An innovative software engineer known for her groundbreaking work…",
    badges: ["Coin Hoarde"],
    isFollowing: false,
    isFollower: true,
    totalGiftsSent: 7,
    isVIP: false,
  },
  {
    id: "3",
    name: "Marvin McKinney",
    avatarUrl: "https://media.istockphoto.com/id/1305462732/photo/headshot-studio-portrait-of-a-woman-in-profile-looking-at-the-camera.webp?a=1&b=1&s=612x612&w=0&k=20&c=eUD1dQpwz-vwxv4N6Y8CGHlL6L-klb-xDYm5qmJcJD0=",
    tagline: "An innovative software engineer known for his groundbreaking work…",
    badges: ["Combo 50"],
    isFollowing: false,
    isFollower: false,
    totalGiftsSent: 63,
    isVIP: false,
  },
  {
    id: "4",
    name: "Ralph Edwards",
    avatarUrl: "https://images.unsplash.com/photo-1695927621677-ec96e048dce2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZSUyMHBob3RvfGVufDB8fDB8fHww",
    tagline: "An innovative software engineer known for his groundbreaking work…",
    badges: ["Trophy Seeker"],
    isFollowing: true,
    isFollower: true,
    totalGiftsSent: 15,
    isVIP: false,
  },
  {
    id: "5",
    name: "Bessie Cooper",
    avatarUrl: "https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cHJvZmlsZSUyMHBob3RvfGVufDB8fDB8fHww",
    tagline: "An innovative software engineer known for her groundbreaking work…",
    badges: ["Top Gifted", "Top Gifted"], // stacked badge
    isFollowing: false,
    isFollower: false,
    totalGiftsSent: 27,
    isVIP: false,
  },

  {
    id: "3",
    name: "Marvin McKinney",
    avatarUrl: "https://media.istockphoto.com/id/1305462732/photo/headshot-studio-portrait-of-a-woman-in-profile-looking-at-the-camera.webp?a=1&b=1&s=612x612&w=0&k=20&c=eUD1dQpwz-vwxv4N6Y8CGHlL6L-klb-xDYm5qmJcJD0=",
    tagline: "An innovative software engineer known for his groundbreaking work…",
    badges: ["Combo 50"],
    isFollowing: false,
    isFollower: false,
    totalGiftsSent: 63,
    isVIP: false,
  },

  {
    id: "6",
    name: "Ronald Richards",
    avatarUrl: "https://images.unsplash.com/photo-1688888745596-da40843a8d45?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZSUyMHBob3RvfGVufDB8fDB8fHww",
    tagline: "An innovative software engineer known for his groundbreaking work…",
    badges: ["Combo 100"],
    isFollowing: false,
    isFollower: true,
    totalGiftsSent: 100,
    isVIP: false,
  },

  {
    id: "7",
    name: "Savannah Nguyen",
    avatarUrl: "https://images.unsplash.com/photo-1672863601285-253fc82db868?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cHJvZmlsZSUyMHBob3RvfGVufDB8fDB8fHww",
    tagline: "An innovative software engineer known for her groundbreaking work…",
    badges: ["Pioneer"],
    isFollowing: true,
    isFollower: true,
    totalGiftsSent: 3,
    isVIP: true,
  },
  {
    id: "8",
    name: "Eliza Jacobs",
    avatarUrl: "https://plus.unsplash.com/premium_photo-1689977968861-9c91dbb16049?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cHJvZmlsZSUyMHBob3RvfGVufDB8fDB8fHww",
    tagline: "Front‑end magician & midnight coder.",
    badges: ["Pioneer"],
    isFollowing: false,
    isFollower: false,
    totalGiftsSent: 0,
    isVIP: true,
  },
  {
    id: "9",
    name: "Guy Hawkins",
    avatarUrl: "https://plus.unsplash.com/premium_photo-1690086519096-0594592709d3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHByb2ZpbGUlMjBwaG90b3xlbnwwfHwwfHx8MA%3D%3D",
    tagline: "Full‑stack wizard with a love for algorithms.",
    badges: ["Combo 50"],
    isFollowing: true,
    isFollower: false,
    totalGiftsSent: 5,
    isVIP: true,
  },
  {
    id: "10",
    name: "Jane Appleseed",
    avatarUrl: "https://images.unsplash.com/photo-1620000617482-821324eb9a14?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHByb2ZpbGUlMjBwaG90b3xlbnwwfHwwfHx8MA%3D%3D",
    tagline: "Always shipping, never resting.",
    badges: ["Combo 100"],
    isFollowing: false,
    isFollower: true,
    totalGiftsSent: 20,
    isVIP: true,
  },
];
