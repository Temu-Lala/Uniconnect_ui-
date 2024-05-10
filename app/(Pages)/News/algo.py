from django.utils import timezone
from datetime import timedelta
from django.http import JsonResponse
from .models import Interaction, Post

def get_user_feed(request, user_id):
    one_week_ago = timezone.now() - timedelta(days=7)
    interactions = Interaction.objects.filter(user_id=user_id)
    post_scores = {}

    for interaction in interactions:
        time_diff = (timezone.now() - interaction.timestamp).days
        interaction_score = max(0, 10 - time_diff)

        if interaction.type in ['like', 'share']:
            interaction_score *= 2

        related_posts = Post.objects.filter(entity_id=interaction.entity_id)
        for post in related_posts:
            post_scores[post.id] = post_scores.get(post.id, 0) + interaction_score

    # Fetch recent posts to ensure feed freshness
    recent_posts = Post.objects.filter(created_at__gte=one_week_ago)
    for post in recent_posts:
        post_scores[post.id] = post_scores.get(post.id, 5)

    # Convert to list and sort
    feed_items = [{'post': Post.objects.get(id=post_id), 'score': score}
                  for post_id, score in post_scores.items()]
    feed_items.sort(key=lambda x: x['score'], reverse=True)

    # Convert to JSON
    feed_data = [{'title': item['post'].title, 'content': item['post'].content, 'score': item['score']}
                 for item in feed_items]

    return JsonResponse(feed_data, safe=False)
