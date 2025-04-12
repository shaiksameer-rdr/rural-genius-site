// Sample blog data
const blogPosts = [
    {
        id: 1,
        title: 'Getting Started with AI: A Beginner's Guide',
        excerpt: 'Learn the fundamentals of AI and how to begin your journey in machine learning...',
        author: 'Priya Sharma',
        date: 'June 10, 2023',
        readTime: '7 min read',
        category: 'ai-learning',
        image: 'path/to/blog-image-1.jpg',
        tags: ['#AIbasics', '#beginnerguide', '#machinelearning']
    },
    {
        id: 2,
        title: 'From Rural India to Tech Leadership',
        excerpt: 'My journey from a small village to leading a tech team at a major company...',
        author: 'Amit Kumar',
        date: 'June 8, 2023',
        readTime: '5 min read',
        category: 'student-stories',
        image: 'path/to/blog-image-2.jpg',
        tags: ['#success', '#ruraltalent', '#inspiration']
    },
    {
        id: 3,
        title: 'Top Skills Required for AI Jobs in 2023',
        excerpt: 'Essential skills and qualifications needed to succeed in the AI industry...',
        author: 'Rahul Verma',
        date: 'June 5, 2023',
        readTime: '6 min read',
        category: 'career-guidance',
        image: 'path/to/blog-image-3.jpg',
        tags: ['#skills', '#career', '#AIjobs']
    }
];

// DOM Elements
const blogGrid = document.getElementById('blogGrid');
const searchInput = document.getElementById('blogSearch');
const filterButtons = document.querySelectorAll('.filter-btn');
const writeBlogBtn = document.getElementById('writeBlogBtn');

// Check login state for write blog button visibility
function updateWriteBlogButton() {
    const token = localStorage.getItem('userToken');
    writeBlogBtn.style.display = token ? 'inline-block' : 'none';
}

// Create blog card element
function createBlogCard(post) {
    const card = document.createElement('div');
    card.classList.add('blog-card');
    card.innerHTML = `
        <img src="${post.image}" alt="${post.title}">
        <div class="blog-card-content">
            <h3>${post.title}</h3>
            <p>${post.excerpt}</p>
            <div class="blog-meta">
                <span class="author">By ${post.author}</span>
                <span class="date">${post.date}</span>
                <span class="read-time">${post.readTime}</span>
            </div>
            <div class="tags-container">
                ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <a href="blog-post.html?id=${post.id}" class="btn read-more">Read More</a>
        </div>
    `;
    return card;
}

// Filter blog posts
function filterPosts(category = 'all') {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredPosts = blogPosts.filter(post => {
        const matchesCategory = category === 'all' || post.category === category;
        const matchesSearch = post.title.toLowerCase().includes(searchTerm) ||
                            post.excerpt.toLowerCase().includes(searchTerm) ||
                            post.author.toLowerCase().includes(searchTerm) ||
                            post.tags.some(tag => tag.toLowerCase().includes(searchTerm));
        return matchesCategory && matchesSearch;
    });

    displayPosts(filteredPosts);
}

// Display posts in the grid
function displayPosts(posts) {
    blogGrid.innerHTML = '';
    posts.forEach(post => {
        blogGrid.appendChild(createBlogCard(post));
    });
}

// Event Listeners
searchInput.addEventListener('input', () => filterPosts(getActiveCategory()));

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        filterPosts(button.dataset.category);
    });
});

writeBlogBtn.addEventListener('click', () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
        alert('Please log in to write a blog post');
        return;
    }
    // Redirect to blog editor page (to be implemented)
    // window.location.href = 'blog-editor.html';
});

// Helper function to get active category
function getActiveCategory() {
    const activeButton = document.querySelector('.filter-btn.active');
    return activeButton ? activeButton.dataset.category : 'all';
}

// Initialize
updateWriteBlogButton();
displayPosts(blogPosts);