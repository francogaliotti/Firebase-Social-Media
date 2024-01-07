import { useEffect, useState } from 'react'
import { IPost } from './Main';
import { db, auth } from '../../config/Firebase';
import { addDoc, collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';


interface Props {
    post: IPost;
}

interface Like {
    userId: string;
    id?: string;
}

export const Post = ({ post }: Props) => {
    const [likes, setLikes] = useState<Like[] | null>(null)
    const [user] = useAuthState(auth)
    const likesRef = collection(db, "likes")
    const likesDoc = query(likesRef, where("postId", "==", post.id));

    const getLikes = async () => {
        const data = await getDocs(likesDoc);
        setLikes(data.docs.map((doc) => ({ userId: doc.data().userId, id: doc.id })));
    }

    useEffect(() => {
        getLikes();
    }, []);

    const addLike = async () => {
        try {
            await addDoc(likesRef, {
                userId: user?.uid,
                postId: post.id
            });
            if (user) {
                setLikes((prev) => prev ? [...prev, { userId: user?.uid }] : [{ userId: user?.uid }]);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const removeLike = async () => {
        try {
            const likeToDeleteQuery = query(
                likesRef,
                where("userId", "==", user?.uid),
                where("postId", "==", post.id)
            );
            const data = await getDocs(likeToDeleteQuery);
            const likeToDelete = doc(db, "likes", data.docs[0].id);
            await deleteDoc(likeToDelete);
            if (user) {
                setLikes((prev) => prev && prev?.filter((like) => like.userId !== user?.uid));
            }
        } catch (error) {
            console.log(error)
        }
    }

    const hasUserLiked = likes?.find((like) => like.userId === user?.uid);

    return (
        <div className='post'>
            <div className='title'>
                <h1>{post.title}</h1>
            </div>
            <div className="body">
                <p>{post.description}</p>
            </div>
            <div className="footer">
                <p>@{post.username}</p>
                <button onClick={hasUserLiked ? removeLike : addLike}>
                    {hasUserLiked ? <>&#128078;</> : <>&#128077;</>}{" "}
                </button>
                {likes && <p> Likes: {likes?.length}</p>}
            </div>
        </div>
    )
}
