let gridDataItem;

// let gridDataItem; // []
let currentCommentModalMinimizedMedia; // {} I need this variable so that when I minimized the video through comment modal I can get access to it
let currentMinimizeGridItemIndex; // number - index

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
 */

// let commentModalVideoCaption = false; // This variable is used to detect whether the comment modal video needs caption or not ✌️ :)

const hashtags = ["#webdevelopment", "#javascript", "#frontend", "#coding", "#tech", "#programming", "#html", "#css", "#reactjs", "#nodejs", "#expressjs", "#api", "#webdesign", "#fullstack", "#developer", "#softwareengineering"];

function getRandomHashtags() {
  const shuffled = hashtags.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3); // Select 3 random hashtags
}

// Helper function to return a random task title
function getRandomTaskTitle() {
  const tasks = [
    "Complete the Data Dive",
    "Prepare Presentation",
    "Brainstorm New Ideas",
    "Analyze Market Trends",
    "Update User Profiles",
    "Develop the Deployment Strategy",
    "Close the Contract Countdown",
    "Develop the Deployment Strategy",
    "Prepare the Product Presentation",
    "Wrap Up the Weekly Wins",
    "Initiate the Client Collaboration",
    "Finalize the Design Details",
    "Polish the Project Plan",
    "Conquer the Code Crunch",
    "Blueprint the Future Vision",
    "Tackle the To-Do Tornado",
    "Launch the Marketing Masterpiece",
    "Organize the Inbox Overhaul",
  ];

  return tasks[Math.floor(Math.random() * tasks.length)];
}

// Helper function to return a random type
function getRandomType() {
  const types = ["repost", "new", "priority"];
  return types[Math.floor(Math.random() * types.length)];
}

// Helper function to return a random number in a range
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper function to return random task music
function getRandomMusic() {
  const musics = ["", "./music/running_chinese.mp3", "./music/Salam-Alaikum.mp3", "./music/sec.mp3", "./music/cool_down.mp3", "./music/thinking_droplet.mp3", "./music/water.mp3"];
  return musics[Math.floor(Math.random() * musics.length)];
}

const getLayoutRandomInterests = () => {
  const numInterests = Math.floor(Math.random() * sizemugGlobalInterests.length) + 1;

  const shuffledInterests = sizemugGlobalInterests.sort(() => 0.5 - Math.random());
  return shuffledInterests.slice(0, numInterests);
};

// Helper function to return random task images
function getRandomTaskImages() {
  // Get a random number of images (min 1, max 7)
  const numberOfImages = Math.floor(Math.random() * 7) + 1;

  // Shuffle the array to ensure random selection
  const shuffledImages = freeImages.sort(() => 0.5 - Math.random());

  // Return a subset of the shuffled array based on random number of images
  return shuffledImages.slice(0, numberOfImages);
}

function getLowQualityVideo(videoFiles) {
  // Sort video files by resolution (smallest first)
  const sortedFiles = videoFiles.sort((a, b) => a.height - b.height);

  // Return the lowest resolution video
  return sortedFiles[0]?.link || null;
}

const apiKey = "fTYBDItjJtbO8ZIPLIcXA0iQuub8JqbSchunQlZwh9LHFraPoOhfhjZC"; // Replace with your API key

async function generateUsersWithTasks(length = 100, query = "coding") {
  try {
    const [response1, response2] = await Promise.all([
      fetch(`https://randomuser.me/api/?results=${length}`),
      fetch(`https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&&per_page=80`, {
        headers: {
          Authorization: apiKey,
          "Content-Type": "application/json",
        },
      }),
    ]);

    const data1 = await response1.json();
    const data2 = await response2.json();
    const videos = data2.videos;

    const usersWithTasks = data1.results.map((user, i) => {
      const videoGenNumber = getRandomNumber(0, 79);

      const lowQualityVideo = getLowQualityVideo(videos[videoGenNumber].video_files);

      return {
        id: getRandomNumber(1, 2000),
        username: `${user.name.first} ${user.name.last}`,
        userPhoto: user.picture.medium,
        taskTitle: getRandomTaskTitle(),
        seen: getRandomNumber(1, 10),
        likes: getRandomNumber(20, 200),
        music: getRandomMusic(),
        audio: getRandomMusic(),
        height: getRandomNumber(350, 400),
        type: getRandomType(),
        taskImages: getRandomTaskImages(),
        tags: getRandomHashtags(),
        date: timeAgo(user.dob.date),
        hasVideo: getRandomNumber(1, 8) > 5 ? true : false,
        taskVideo: lowQualityVideo,
        taskVideoThumbnail: videos[videoGenNumber].video_pictures[0]?.picture,
        sizemugUsername: user.name.first,
        followering: Math.random() > 0.5,
        interests: getLayoutRandomInterests(),
        online: Math.random() > 0.5,
        liveTag: sizemugGlobalInterests[getRandomNumber(0, sizemugGlobalInterests.length - 1)].value,
      };
    });

    return usersWithTasks;
  } catch (error) {
    console.error("Error fetching data from API:", error);
  }
}
