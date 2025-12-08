/**
 * This API is for getting comments
 */
async function getPostComments() {
  const [userResponse, commentResponse] = await Promise.all([fetch("https://randomuser.me/api/?results=40"), fetch("https://jsonplaceholder.typicode.com/comments?_limit=20")]);

  if (!userResponse.ok || !commentResponse.ok) {
    throw new Error("One or more API calls failed");
  }

  const [userData, commentData] = await Promise.all([userResponse.json(), commentResponse.json()]);

  let userIndex = 0;

  return commentData.map((comment) => {
    const user = userData.results[userIndex++];
    const hasReplies = Math.random() > 0.5; // 50% chance of having replies

    const commentObject = {
      id: comment.id,
      content: `${comment.body.at(0).toUpperCase()}${comment.body.slice(1)}`,
      photo: user?.picture?.medium,
      date: timeAgo(user?.dob?.date),
      replies: [],
    };

    if (hasReplies) {
      const replyCount = Math.floor(Math.random() * 3) + 1; // 1 to 3 replies
      for (let i = 0; i < replyCount; i++) {
        const replyUser = userData.results[userIndex++];

        commentObject.replies.push({
          id: `${comment.id}-reply-${i}`,
          content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim cupiditate perspiciatis, expedita dolore reprehenderit soluta ex? At reiciendis facilis consectetur velit quasi, minima nam quos repellendus iure quae enim saepe.",
          photo: replyUser?.picture?.medium,
          date: timeAgo(replyUser?.dob?.date),
        });
      }
    }

    return commentObject;
  });
}
