import { useState } from 'react';
import { useComments, useCreateComment } from '@/hooks/usePost';
import { Comment as CommentType } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface CommentProps {
  comment: CommentType;
  postId: string;
  level?: number;
}

function Comment({ comment, postId, level = 0 }: CommentProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const createComment = useCreateComment();

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    try {
      await createComment.mutateAsync({
        postId,
        content: replyContent,
        parentId: comment.id,
      });
      setReplyContent('');
      setIsReplying(false);
    } catch (error) {
      console.error('Failed to reply:', error);
    }
  };

  return (
    <div className={`pl-${level * 4} mt-4`}>
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center mb-2">
          <span className="font-semibold">{comment.author.name || comment.author.email}</span>
          <span className="text-gray-500 text-sm ml-2">
            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
          </span>
        </div>
        <p className="text-gray-700">{comment.content}</p>
        <button
          onClick={() => setIsReplying(!isReplying)}
          className="text-blue-500 text-sm mt-2"
        >
          Reply
        </button>

        {isReplying && (
          <form onSubmit={handleReply} className="mt-2">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              placeholder="Write a reply..."
              rows={2}
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={() => setIsReplying(false)}
                className="px-3 py-1 text-sm text-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createComment.isPending}
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm disabled:opacity-50"
              >
                {createComment.isPending ? 'Sending...' : 'Reply'}
              </button>
            </div>
          </form>
        )}

        {comment.replies?.map((reply) => (
          <Comment key={reply.id} comment={reply} postId={postId} level={level + 1} />
        ))}
      </div>
    </div>
  );
}

export function Comments({ postId }: { postId: string }) {
  const { data: comments, isLoading, error } = useComments(postId);
  const [content, setContent] = useState('');
  const createComment = useCreateComment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      await createComment.mutateAsync({
        postId,
        content,
      });
      setContent('');
    } catch (error) {
      console.error('Failed to create comment:', error);
    }
  };

  if (isLoading) return <div>Loading comments...</div>;
  if (error) return <div>Error loading comments</div>;

  return (
    <div className="mt-6">
      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Write a comment..."
          rows={3}
        />
        <button
          type="submit"
          disabled={createComment.isPending}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
        >
          {createComment.isPending ? 'Posting...' : 'Post Comment'}
        </button>
      </form>

      <div className="space-y-4">
        {comments
          ?.filter((comment) => !comment.parentId)
          .map((comment) => (
            <Comment key={comment.id} comment={comment} postId={postId} />
          ))}
      </div>
    </div>
  );
}