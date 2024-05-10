// Assume these imports
import { Post, User, Interaction } from './models'; // Import your models

interface FeedItem {
  post: Post;
  score: number;
}

function generateUserFeed(user: User): FeedItem[] {
  const interactions = getInteractionsForUser(user.id);
  const postScores = new Map<string, number>();

  interactions.forEach(interaction => {
    // Higher score for recent interactions
    let interactionScore = Math.max(0, 10 - (new Date().getTime() - new Date(interaction.timestamp).getTime()) / (1000 * 3600 * 24));
    
    if (interaction.type === 'like' || interaction.type === 'share') {
      interactionScore *= 2; // Boost for likes and shares
    }

    const posts = getPostsByEntity(interaction.entityId); // Function to get posts by entity
    posts.forEach(post => {
      const currentScore = postScores.get(post.id) || 0;
      postScores.set(post.id, currentScore + interactionScore);
    });
  });

  // Add recent posts to ensure feed freshness
  const recentPosts = getRecentPosts();
  recentPosts.forEach(post => {
    const currentScore = postScores.get(post.id) || 0;
    postScores.set(post.id, currentScore + 5); // Recent posts get a base score
  });

  const feedItems: FeedItem[] = Array.from(postScores, ([postId, score]) => ({
    post: getPostById(postId),
    score: score
  }));

  // Sort feed items by score in descending order
  return feedItems.sort((a, b) => b.score - a.score);
}

function getInteractionsForUser(userId: string): Interaction[] {
  // Implementation to fetch user interactions from the database
}

function getPostsByEntity(entityId: string): Post[] {
  // Implementation to fetch posts from the database based on entityId
}

function getRecentPosts(): Post[] {
  // Fetch recent posts, e.g., from the last 7 days
}

function getPostById(postId: string): Post {
  // Fetch a single post by ID
}
