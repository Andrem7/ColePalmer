// Comments functionality
import { db } from './firebase-config.js';
import { getCurrentUser } from './auth.js';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  updateDoc, 
  doc, 
  arrayUnion, 
  arrayRemove,
  serverTimestamp 
} from 'firebase/firestore';

const commentsCollection = collection(db, 'comments');

// Add a new comment
export async function addComment(text) {
  const user = getCurrentUser();
  if (!user) {
    alert('Please sign in to comment');
    return;
  }

  try {
    await addDoc(commentsCollection, {
      text: text,
      author: {
        uid: user.uid,
        name: user.displayName || user.email,
        photoURL: user.photoURL || null
      },
      timestamp: serverTimestamp(),
      likes: [],
      likeCount: 0
    });
    
    // Clear the comment input
    const commentInput = document.getElementById('comment-input');
    if (commentInput) commentInput.value = '';
    
  } catch (error) {
    console.error('Error adding comment:', error);
    alert('Failed to add comment');
  }
}

// Like/unlike a comment
export async function toggleLike(commentId) {
  const user = getCurrentUser();
  if (!user) {
    alert('Please sign in to like comments');
    return;
  }

  try {
    const commentRef = doc(db, 'comments', commentId);
    const userLiked = await checkIfUserLiked(commentId, user.uid);
    
    if (userLiked) {
      // Unlike the comment
      await updateDoc(commentRef, {
        likes: arrayRemove(user.uid),
        likeCount: increment(-1)
      });
    } else {
      // Like the comment
      await updateDoc(commentRef, {
        likes: arrayUnion(user.uid),
        likeCount: increment(1)
      });
    }
  } catch (error) {
    console.error('Error toggling like:', error);
  }
}

// Check if user has liked a comment
async function checkIfUserLiked(commentId, userId) {
  // This would need to be implemented based on the comment data structure
  // For now, we'll track it in the likes array
  return false; // Simplified for now
}

// Load and display comments
export function loadComments() {
  const commentsContainer = document.getElementById('comments-container');
  if (!commentsContainer) return;

  const q = query(commentsCollection, orderBy('timestamp', 'desc'));
  
  onSnapshot(q, (snapshot) => {
    commentsContainer.innerHTML = '';
    
    snapshot.forEach((doc) => {
      const comment = doc.data();
      const commentElement = createCommentElement(doc.id, comment);
      commentsContainer.appendChild(commentElement);
    });
  });
}

// Create comment HTML element
function createCommentElement(commentId, comment) {
  const commentDiv = document.createElement('div');
  commentDiv.className = 'comment';
  commentDiv.innerHTML = `
    <div class="comment-header">
      <img src="${comment.author.photoURL || '/default-avatar.png'}" alt="Profile" class="comment-avatar">
      <span class="comment-author">${comment.author.name}</span>
      <span class="comment-time">${formatTime(comment.timestamp)}</span>
    </div>
    <div class="comment-text">${comment.text}</div>
    <div class="comment-actions">
      <button class="like-button" onclick="toggleLike('${commentId}')">
        <span class="like-icon">❤️</span>
        <span class="like-count">${comment.likeCount || 0}</span>
      </button>
    </div>
  `;
  return commentDiv;
}

// Format timestamp
function formatTime(timestamp) {
  if (!timestamp) return 'Just now';
  
  const date = timestamp.toDate();
  const now = new Date();
  const diff = now - date;
  
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return date.toLocaleDateString();
}

// Initialize comments when page loads
document.addEventListener('DOMContentLoaded', () => {
  loadComments();
  
  // Set up comment form
  const commentForm = document.getElementById('comment-form');
  if (commentForm) {
    commentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('comment-input');
      if (input && input.value.trim()) {
        addComment(input.value.trim());
      }
    });
  }
});