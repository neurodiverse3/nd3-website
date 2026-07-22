import React from 'react';
import CommentSection from '../../components/CommentSection';

export default function TestCommentsPage() {
  return (
    <div className="p-8 bg-bg-primary min-h-screen">
      <CommentSection 
        postSlug="test-post" 
        postTitle="Test Post" 
        initialComments={[
          { id: '1', name: 'Alice', content: 'First comment', createdAt: new Date().toISOString() }
        ]} 
      />
    </div>
  );
}
