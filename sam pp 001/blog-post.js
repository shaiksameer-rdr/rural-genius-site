// Sample blog post data
const blogPost = {
    id: 1,
    title: 'From Village to Silicon Valley: A Rural Genius Success Story',
    content: '...', // Full content would be loaded from backend
    author: {
        name: 'Rajesh Patel',
        role: 'Student Alumni',
        image: 'path/to/author-image.jpg'
    },
    category: 'Student Stories',
    date: 'June 15, 2023',
    readTime: '5 min read',
    likes: 42,
    tags: ['#ruraltalent', '#AIlearning', '#successstory', '#inspiration']
};

// Sample comments data
let comments = [
    {
        id: 1,
        author: 'Priya Singh',
        content: 'Such an inspiring story! This gives hope to many aspiring rural students.',
        date: 'June 16, 2023',
        likes: 5
    },
    {
        id: 2,
        author: 'Amit Kumar',
        content: 'Great journey! Would love to know more about the specific challenges faced during the learning process.',
        date: 'June 15, 2023',
        likes: 3
    }
];

// Sample related posts
const relatedPosts = [
    {
        id: 2,
        title: 'How I Learned AI While Working on My Farm',
        author: 'Suresh Kumar',
        date: 'June 12, 2023',
        image: 'path/to/related-1.jpg'
    },
    {
        id: 3,
        title: 'Breaking Barriers: Rural Women in Tech',
        author: 'Meena Devi',
        date: 'June 10, 2023',
        image: 'path/to/related-2.jpg'
    },
    {
        id: 4,
        title: '5 Tips for Rural Students Learning AI',
        author: 'Dr. Ravi Kumar',
        date: 'June 8, 2023',
        image: 'path/to/related-3.jpg'
    }
];

// DOM Elements
const likeBtn = document.getElementById('likeBtn');
const commentInput = document.getElementById('commentInput');
const submitComment = document.getElementById('submitComment');
const commentsList = document.getElementById('commentsList');
const relatedPostsGrid = document.querySelector('.related-posts-grid');

// Initialize like button state
let isLiked = false;

// Like button functionality
likeBtn.addEventListener('click', () => {
    const likeCount = likeBtn.querySelector('.like-count');
    const currentLikes = parseInt(likeCount.textContent);
    
    if (!isLiked) {
        likeCount.textContent = currentLikes + 1;
        likeBtn.classList.add('liked');
    } else {
        likeCount.textContent = currentLikes - 1;
        likeBtn.classList.remove('liked');
    }
    
    isLiked = !isLiked;
});

// Create comment element
function createCommentElement(comment) {
    const commentElement = document.createElement('div');
    commentElement.classList.add('comment');
    commentElement.innerHTML = `
        <div class="comment-header">
            <strong>${comment.author}</strong>
            <span class="comment-date">${comment.date}</span>
        </div>
        <p>${comment.content}</p>
        <div class="comment-actions">
            <button class="like-comment" data-comment-id="${comment.id}">
                ${comment.likes} Likes
            </button>
        </div>
    `;
    return commentElement;
}

// Display comments
function displayComments() {
    commentsList.innerHTML = '';
    comments.forEach(comment => {
        commentsList.appendChild(createCommentElement(comment));
    });
}

// Submit new comment
submitComment.addEventListener('click', () => {
    const content = commentInput.value.trim();
    if (!content) return;

    // Check if user is logged in
    const token = localStorage.getItem('userToken');
    if (!token) {
        alert('Please log in to post a comment');
        return;
    }

    // Add new comment
    const newComment = {
        id: comments.length + 1,
        author: 'Current User', // Would be fetched from user profile
        content: content,
        date: new Date().toLocaleDateString(),
        likes: 0
    };

    comments.unshift(newComment);
    displayComments();
    commentInput.value = '';
});

// Share functionality
document.querySelectorAll('.share-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const platform = btn.dataset.platform;
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(document.title);
        
        let shareUrl;
        switch(platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                break;
        }
        
        window.open(shareUrl, '_blank', 'width=600,height=400');
    });
});

// Display related posts
function displayRelatedPosts() {
    relatedPostsGrid.innerHTML = '';
    relatedPosts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.classList.add('related-post-card');
        postElement.innerHTML = `
            <img src="${post.image}" alt="${post.title}">
            <div class="related-post-info">
                <h4><a href="blog-post.html?id=${post.id}">${post.title}</a></h4>
                <div class="related-post-meta">
                    <span class="author">By ${post.author}</span>
                    <span class="date">${post.date}</span>
                </div>
            </div>
        `;
        relatedPostsGrid.appendChild(postElement);
    });
}

// Initialize page
displayComments();
displayRelatedPosts();