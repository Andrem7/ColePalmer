// Authentication functionality
import { auth } from './firebase-config.js';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword 
} from 'firebase/auth';

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Auth state management
let currentUser = null;

// Sign in with Google
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    console.log('Signed in:', user.displayName);
    updateUI(user);
    return user;
  } catch (error) {
    console.error('Google sign-in error:', error);
    alert('Sign-in failed: ' + error.message);
  }
}

// Sign in with Email/Password
export async function signInWithEmail(email, password) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    console.log('Signed in:', result.user.email);
    updateUI(result.user);
    return result.user;
  } catch (error) {
    console.error('Email sign-in error:', error);
    alert('Sign-in failed: ' + error.message);
  }
}

// Sign up with Email/Password
export async function signUpWithEmail(email, password) {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    console.log('Signed up:', result.user.email);
    updateUI(result.user);
    return result.user;
  } catch (error) {
    console.error('Sign-up error:', error);
    alert('Sign-up failed: ' + error.message);
  }
}

// Sign out
export async function signOutUser() {
  try {
    await signOut(auth);
    console.log('Signed out');
    updateUI(null);
  } catch (error) {
    console.error('Sign-out error:', error);
  }
}

// Update UI based on auth state
function updateUI(user) {
  const authButton = document.getElementById('auth-button');
  const userInfo = document.getElementById('user-info');
  const commentsSection = document.getElementById('comments-section');
  const chatLink = document.getElementById('chat-link');
  
  if (user) {
    // User is signed in
    currentUser = user;
    authButton.textContent = 'Sign Out';
    authButton.onclick = signOutUser;
    
    if (userInfo) {
      userInfo.innerHTML = `
        <img src="${user.photoURL || '/default-avatar.png'}" alt="Profile" class="profile-pic">
        <span>Welcome, ${user.displayName || user.email}!</span>
      `;
      userInfo.style.display = 'block';
    }
    
    // Show comments section and chat link
    if (commentsSection) commentsSection.style.display = 'block';
    if (chatLink) chatLink.style.display = 'inline-block';
    
  } else {
    // User is signed out
    currentUser = null;
    authButton.textContent = 'Sign In';
    authButton.onclick = showSignInModal;
    
    if (userInfo) userInfo.style.display = 'none';
    if (commentsSection) commentsSection.style.display = 'none';
    if (chatLink) chatLink.style.display = 'none';
  }
}

// Show sign-in modal
function showSignInModal() {
  const modal = document.getElementById('auth-modal');
  if (modal) {
    modal.style.display = 'block';
  }
}

// Hide sign-in modal
export function hideSignInModal() {
  const modal = document.getElementById('auth-modal');
  if (modal) {
    modal.style.display = 'none';
  }
}

// Listen for auth state changes
onAuthStateChanged(auth, (user) => {
  updateUI(user);
});

// Get current user
export function getCurrentUser() {
  return currentUser;
}