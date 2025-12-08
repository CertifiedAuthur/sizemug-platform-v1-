// Post Detail View Management
class PostDetailView {
  constructor() {
    this.detailView = document.getElementById("postDetailView");
    this.backBtn = document.getElementById("backToPostsBtn");
    this.postsList = document.getElementById("creatorPostItems");

    this.init();
  }

  init() {
    if (!this.detailView) return;

    // Handle back button
    if (this.backBtn) {
      this.backBtn.addEventListener("click", () => this.hide());
    }

    // Handle post clicks
    if (this.postsList) {
      this.postsList.addEventListener("click", (e) => {
        const postItem = e.target.closest(".post-item, .creator_post_item");
        if (postItem) {
          this.show(this.getPostData(postItem));
        }
      });
    }

    // Handle edit button
    const editBtn = this.detailView.querySelector(".edit-btn");
    if (editBtn) {
      editBtn.addEventListener("click", () => {
        console.log("Edit post");
        // Add your edit logic here
      });
    }

    // Handle delete button
    const deleteBtn = this.detailView.querySelector(".delete-btn");
    if (deleteBtn) {
      deleteBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to delete this post?")) {
          console.log("Delete post");
          this.hide();
          // Add your delete logic here
        }
      });
    }
  }

  getPostData(postElement) {
    // Extract data from post element or use sample data
    return {
      title: "Posts title",
      description: "Posts description",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
      type: "Video",
      date: "2 Days ago",
      stats: {
        views: "273.6M",
        likes: "273.6M",
        shares: "273.6M",
        comments: "273.6M",
        newFollowers: "273.6M",
      },
      chartData: [2000, 1500, 3000, 2500, 4000, 3500, 5000],
    };
  }

  show(postData) {
    // Update content
    document.getElementById("postDetailTitle").textContent = postData.title;
    document.getElementById("postDetailDescription").textContent = postData.description;
    document.getElementById("postDetailImage").src = postData.image;
    document.getElementById("postDetailType").textContent = postData.type;
    document.getElementById("postDetailDate").textContent = postData.date;

    // Update stats
    document.getElementById("postViews").textContent = postData.stats.views;
    document.getElementById("postLikes").textContent = postData.stats.likes;
    document.getElementById("postShares").textContent = postData.stats.shares;
    document.getElementById("postComments").textContent = postData.stats.comments;
    document.getElementById("postNewFollowers").textContent = postData.stats.newFollowers;

    // Show view
    this.detailView.classList.remove("creator-hidden");
    document.body.style.overflow = "hidden";

    // Update chart data if chart exists
    setTimeout(() => {
      if (window.analyticsCharts && window.analyticsCharts.postDetailChart) {
        window.analyticsCharts.postDetailChart.updateData("views", postData.chartData);
      }
    }, 100);
  }

  hide() {
    document.getElementById("mainPostsViews").classList.remove(HIDDEN);
    this.detailView.classList.add(HIDDEN);
    document.body.style.overflow = "";
  }
}

// Initialize on DOM load
document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("postDetailView")) {
    window.postDetailView = new PostDetailView();
  }
});
