// import React, { useEffect, useState } from 'react';
// import { FeedItem, fetchUserFeed } from './api'; // Assume you have this API function

// interface Props {
//   userId: string;
// }

// const Feed: React.FC<Props> = ({ userId }) => {
//   const [feedItems, setFeedItems] = useState<FeedItem[]>([]);

//   useEffect(() => {
//     fetchUserFeed(userId).then(items => {
//       setFeedItems(items);
//     });
//   }, [userId]);

//   return (
//     <div>
//       {feedItems.map(item => (
//         <div key={item.post.id}>
//           <h3>{item.post.title}</h3>
//           <p>{item.post.content}</p>
//           {/* Display other elements like images, videos as needed */}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Feed;
