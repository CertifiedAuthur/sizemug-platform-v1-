const recents = [
  {
    title: "Strategy",
    user: "You",
    minutes: 2,
    collaborators: ["https://images.unsplash.com/photo-1508184964240-ee96bb9677a7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D", "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D", "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"],
  },

  {
    title: "UI design planning",
    user: "Stacy",
    minutes: 44,
    collaborators: ["https://plus.unsplash.com/premium_photo-1664870883044-0d82e3d63d99?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D", "https://plus.unsplash.com/premium_photo-1687832783818-8857f0c07ea4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzd8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D"],
  },

  {
    title: "UX design planning",
    user: "Musa",
    minutes: 6,
    collaborators: ["https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjZ8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTV8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D", "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTZ8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D", "https://plus.unsplash.com/premium_photo-1687832783818-8857f0c07ea4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzd8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D"],
  },

  {
    title: "Strategy",
    user: "Baaki",
    minutes: 15,
    collaborators: ["https://images.unsplash.com/photo-1508184964240-ee96bb9677a7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D"],
  },

  {
    title: "UI design planning",
    minutes: 38,
    user: "Ramoni",
    collaborators: ["https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D", "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D"],
  },

  {
    title: "Strategy",
    user: "Esther",
    minutes: 51,
    collaborators: ["https://images.unsplash.com/photo-1532074205216-d0e1f4b87368?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D", "https://plus.unsplash.com/premium_photo-1664870883044-0d82e3d63d99?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D", "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"],
  },
];

const boardsData = [
  {
    status: "private",
    title: "Strategy",
    user: "You",
    minutes: 2,
  },

  {
    status: "private",
    title: "Sizemug Small",
    user: "You",
    minutes: 4,
  },

  {
    status: "private",
    title: "Sizemug Medium",
    user: "Sizemug",
    minutes: 8,
  },

  {
    status: "private",
    title: "Sizemug Large",
    user: "Larger Size",
    minutes: 13,
  },

  {
    status: "private",
    title: "The Player",
    user: "Ziyech",
    minutes: 45,
  },

  {
    status: "private",
    title: "Javascript",
    user: "Ziyech",
    minutes: 32,
  },

  {
    status: "private",
    title: "Nodejs",
    user: "Ziyech",
    minutes: 27,
  },

  {
    status: "private",
    title: "Python",
    user: "Ziyech",
    minutes: 14,
  },

  {
    status: "private",
    title: "Commandcodes",
    user: "commandcodes",
    minutes: 8,
  },

  {
    status: "public",
    title: "The whoal",
    user: "Desmond",
    minutes: 20,
    collaborators: ["https://images.unsplash.com/photo-1508184964240-ee96bb9677a7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D"],
  },

  {
    status: "public",
    title: "New Boards",
    user: "Samvic",
    minutes: 20,
    collaborators: ["https://images.unsplash.com/photo-1508184964240-ee96bb9677a7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D", "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D", "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"],
  },

  {
    status: "public",
    title: "Sizemug",
    user: "sizemug",
    minutes: 10,
    collaborators: ["https://images.unsplash.com/photo-1508184964240-ee96bb9677a7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D", "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D", "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"],
  },

  {
    status: "public",
    title: "The Player",
    user: "Ziyech",
    minutes: 45,
    collaborators: ["https://images.unsplash.com/photo-1508184964240-ee96bb9677a7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D", "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D", "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"],
  },

  {
    status: "private",
    title: "New Boards",
    user: "Samvic",
    minutes: 20,
  },

  {
    status: "public",
    title: "Complex English",
    user: "Samvic Sarah",
    minutes: 15,
    collaborators: ["https://images.unsplash.com/photo-1508184964240-ee96bb9677a7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D", "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"],
  },

  {
    status: "public",
    title: "Commandcodes",
    user: "commandcodes",
    minutes: 5,
    collaborators: ["https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D", "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"],
  },

  {
    status: "public",
    title: "Complex English",
    user: "Samvic Sarah",
    minutes: 15,
    collaborators: ["https://images.unsplash.com/photo-1508184964240-ee96bb9677a7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D", "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D", "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"],
  },
];

// // Generate Random Color
// const getValue = () => Math.floor(Math.random() * 255 + 1);
// const getColor = () => {
//   const random1 = getValue();
//   const random2 = getValue();
//   const random3 = getValue();

//   return `rgb(${random1},${random2},${random3})`;
// };

const boardRecents = [
  {
    title: "Strategy",
    user: "You",
    minutes: 2,
    collaborators: ["https://images.unsplash.com/photo-1508184964240-ee96bb9677a7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D", "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D", "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"],
  },

  {
    title: "UI design planning",
    user: "Stacy",
    minutes: 44,
    collaborators: ["https://plus.unsplash.com/premium_photo-1664870883044-0d82e3d63d99?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D", "https://plus.unsplash.com/premium_photo-1687832783818-8857f0c07ea4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzd8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D"],
  },

  {
    title: "UX design planning",
    user: "Musa",
    minutes: 6,
    collaborators: ["https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjZ8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTV8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D", "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTZ8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D", "https://plus.unsplash.com/premium_photo-1687832783818-8857f0c07ea4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzd8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D"],
  },

  {
    title: "Strategy",
    user: "Baaki",
    minutes: 15,
    collaborators: ["https://images.unsplash.com/photo-1508184964240-ee96bb9677a7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D"],
  },

  {
    title: "UI design planning",
    minutes: 38,
    user: "Ramoni",
    collaborators: ["https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D", "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D"],
  },

  {
    title: "Strategy",
    user: "Esther",
    minutes: 51,
    collaborators: ["https://images.unsplash.com/photo-1532074205216-d0e1f4b87368?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D", "https://plus.unsplash.com/premium_photo-1664870883044-0d82e3d63d99?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D", "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"],
  },
];

// const boardsData = [
//   {
//     status: "private",
//     title: "Strategy",
//     user: "You",
//     minutes: 2,
//   },

//   {
//     status: "private",
//     title: "Sizemug Small",
//     user: "You",
//     minutes: 4,
//   },

//   {
//     status: "private",
//     title: "Sizemug Medium",
//     user: "Sizemug",
//     minutes: 8,
//   },

//   {
//     status: "private",
//     title: "Sizemug Large",
//     user: "Larger Size",
//     minutes: 13,
//   },

//   {
//     status: "private",
//     title: "The Player",
//     user: "Ziyech",
//     minutes: 45,
//   },

//   {
//     status: "private",
//     title: "Javascript",
//     user: "Ziyech",
//     minutes: 32,
//   },

//   {
//     status: "private",
//     title: "Nodejs",
//     user: "Ziyech",
//     minutes: 27,
//   },

//   {
//     status: "private",
//     title: "Python",
//     user: "Ziyech",
//     minutes: 14,
//   },

//   {
//     status: "private",
//     title: "Commandcodes",
//     user: "commandcodes",
//     minutes: 8,
//   },

//   {
//     status: "public",
//     title: "The whoal",
//     user: "Desmond",
//     minutes: 20,
//     collaborators: ["https://images.unsplash.com/photo-1508184964240-ee96bb9677a7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D"],
//   },

//   {
//     status: "public",
//     title: "New Boards",
//     user: "Samvic",
//     minutes: 20,
//     collaborators: ["https://images.unsplash.com/photo-1508184964240-ee96bb9677a7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D", "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D", "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"],
//   },

//   {
//     status: "public",
//     title: "Sizemug",
//     user: "sizemug",
//     minutes: 10,
//     collaborators: ["https://images.unsplash.com/photo-1508184964240-ee96bb9677a7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D", "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D", "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"],
//   },

//   {
//     status: "public",
//     title: "The Player",
//     user: "Ziyech",
//     minutes: 45,
//     collaborators: ["https://images.unsplash.com/photo-1508184964240-ee96bb9677a7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D", "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D", "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"],
//   },

//   {
//     status: "private",
//     title: "New Boards",
//     user: "Samvic",
//     minutes: 20,
//   },

//   {
//     status: "public",
//     title: "Complex English",
//     user: "Samvic Sarah",
//     minutes: 15,
//     collaborators: ["https://images.unsplash.com/photo-1508184964240-ee96bb9677a7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D", "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"],
//   },

//   {
//     status: "public",
//     title: "Commandcodes",
//     user: "commandcodes",
//     minutes: 5,
//     collaborators: ["https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D", "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"],
//   },

//   {
//     status: "public",
//     title: "Complex English",
//     user: "Samvic Sarah",
//     minutes: 15,
//     collaborators: ["https://images.unsplash.com/photo-1508184964240-ee96bb9677a7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D", "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D", "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"],
//   },
// ];

const collaboratorData = [
  {
    name: "Victor M. Nott",
    image: "https://images.unsplash.com/photo-1440589473619-3cde28941638?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZmluZSUyMGZlbWFsZSUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
    verified: true,
  },
  {
    name: "Hester J. Salmons",
    image: "https://images.unsplash.com/photo-1464863979621-258859e62245?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8ZmluZSUyMGZlbWFsZSUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
    verified: false,
  },
  {
    name: "Tracy R. Scott",
    image: "https://plus.unsplash.com/premium_photo-1695908426422-ed52fdff2a47?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZmluZSUyMGZlbWFsZSUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
    verified: true,
  },

  {
    name: "Rosemary R. Brock",
    image: "https://images.unsplash.com/photo-1473707669572-40d832255b5e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGZpbmUlMjBmZW1hbGUlMjBwcm9maWxlfGVufDB8fDB8fHww",
    verified: false,
  },

  {
    name: "Tony H. Smith",
    image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGZpbmUlMjBmZW1hbGUlMjBwcm9maWxlfGVufDB8fDB8fHww",
    verified: false,
  },

  {
    name: "Lynn B. Blankenship",
    image: "https://plus.unsplash.com/premium_photo-1669704098858-8cd103f4ac2e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGZpbmUlMjBmZW1hbGUlMjBwcm9maWxlfGVufDB8fDB8fHww",
    verified: true,
  },
  {
    name: "Jessica J. Spiller",
    image: "https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmluZSUyMG1hbGUlMjBwcm9maWxlJTIwd2l0aCUyMGJyZWFzdHxlbnwwfHwwfHx8MA%3D%3D",
    verified: false,
  },
  {
    name: "Kathleen J. Dennis",
    image: "https://images.unsplash.com/photo-1441786485319-5e0f0c092803?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZmluZSUyMG1hbGUlMjBwcm9maWxlJTIwd2l0aCUyMGJyZWFzdHxlbnwwfHwwfHx8MA%3D%3D",
    verified: true,
  },
  {
    name: "Constance W. Fredette",
    image: "https://images.unsplash.com/photo-1541752171745-4176eee47556?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGZpbmUlMjBtYWxlJTIwcHJvZmlsZSUyMHdpdGglMjBicmVhc3R8ZW58MHx8MHx8fDA%3D",
    verified: true,
  },
];

const commentsData = [
  {
    id: 238797,
    name: "Eduardo M. Mosley",
    photo: "https://images.unsplash.com/photo-1556474835-b0f3ac40d4d1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fGZpbmUlMjBtYWxlJTIwcHJvZmlsZSUyMHdpdGglMjBicmVhc3R8ZW58MHx8MHx8fDA%3D",
    comment: "We might need to consider the timeline for this project.",
    createdAt: "1 hour ago",
    replies: [],
    parentCommentId: 789,
  },

  {
    id: 576892,
    name: "Minnie D. Cuellar",
    photo: "https://images.unsplash.com/photo-1601233749202-95d04d5b3c00?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzF8fGZpbmUlMjBtYWxlJTIwcHJvZmlsZSUyMHdpdGglMjBicmVhc3R8ZW58MHx8MHx8fDA%3D",
    comment: "Has anyone considered the budget implications?",
    createdAt: "32 min ago",
    replies: [],
    parentCommentId: 789,
  },

  {
    id: 789,
    name: "Maxine M. Hutchinson",
    photo: "https://images.unsplash.com/photo-1541752171745-4176eee47556?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGZpbmUlMjBtYWxlJTIwcHJvZmlsZSUyMHdpdGglMjBicmVhc3R8ZW58MHx8MHx8fDA%3D",
    comment: "This concept is excellent! Let's explore it further in our next meeting and brainstorm potential implementation strategies.",
    createdAt: "2 min ago",
  },
  {
    id: 219,
    name: "Candice J. Robertson",
    photo: "https://images.unsplash.com/photo-1526888935184-a82d2a4b7e67?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzB8fGZpbmUlMjBtYWxlJTIwcHJvZmlsZSUyMHdpdGglMjBicmVhc3R8ZW58MHx8MHx8fDA%3D",
    comment: "I agree! This could be a great opportunity.",
    createdAt: "2 min ago",
    replies: [],
  },
  {
    id: 29,
    name: "Gilbert P. Moore",
    photo: "https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDJ8fGZpbmUlMjBtYWxlJTIwcHJvZmlsZSUyMHdpdGglMjBicmVhc3R8ZW58MHx8MHx8fDA%3D",
    comment: "Good idea. We should definitely discuss it further.",
    createdAt: "2 min ago",
    replies: [],
  },
  {
    id: 2172,
    name: "Sarah H. Edwards",
    photo: "https://plus.unsplash.com/premium_photo-1703382945989-abbdc339770e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Njl8fGZpbmUlMjBtYWxlJTIwcHJvZmlsZSUyMHdpdGglMjBicmVhc3R8ZW58MHx8MHx8fDA%3D",
    comment: "I have some concerns about the technical feasibility.",
    createdAt: "4 days ago",
    replies: [],
  },
];
