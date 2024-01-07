import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../../config/Firebase';
import { Post } from './Post';

export interface IPost {
  title: string;
  description: string;
  username: string;
  userId: string;
  id: string;
}

const Main = () => {
  const [postsList, setPostsList] = useState<IPost[] | null>(null) // Update the type of postsList to be an array of IPost objects
  const postsRef = collection(db, "posts")

  const getPosts = async () => {
    const data = await getDocs(postsRef);
    setPostsList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as IPost[]);
  }

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div className='main-page'>
      {
        postsList?.map((post) => (
          <Post post={post}/>
        ))
      }
    </div>
  )
}

export default Main