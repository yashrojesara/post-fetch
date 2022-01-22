import { makeStyles } from "@mui/styles";
import { useCallback, useEffect, useRef, useState } from "react";
import { getPosts } from "./service";
import { IPost } from "./types";
import { CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material';
import Paper from '@mui/material/Paper';
import { useNavigate } from 'react-router-dom';
import { useInView } from "react-intersection-observer";

const useStyles = makeStyles({   
    table: {
        overflowWrap: 'anywhere'
    }, 
    head: {
        background: 'aquamarine',
    },
    row: {
        cursor: 'pointer',
    },
    rowColor: {
        background: 'ivory'
    }
})

const PostList: React.FC = () => {
    const classes = useStyles();
    const currentPage = useRef<number>(0);
    const [posts, setPosts] = useState<IPost[]>([]);
    const [loader, setLoader] = useState(false);
    const [isLastPage, setIsLastPage] = useState(false)
    const [lastPost, isLastPostVisible] = useInView();
    const navigate = useNavigate();

    useEffect(() => {
        let interval: any;
        if (!isLastPage) {
            fetchPost();
            interval = setInterval(() => {
                fetchPost();
            }, 100000)            
        }
        
        return(() => {
            clearInterval(interval);
        })
    }, [isLastPage])

    const fetchPost = async() => {
        setLoader(true);
        console.log(currentPage.current)
        await getPosts(currentPage.current)
            .then(res => {                
                currentPage.current += 1;
                const data = res.data.hits as IPost[];
                setPosts((prevPosts) => [...prevPosts, ...data])
                if (res.data.nbPages <= currentPage.current) {
                    setIsLastPage(true);
                    alert('All Data Fetched')
                }                
            })
            .catch((err) => {
                console.log('GetPostError', err)
            })
            .finally(() => {
                setLoader(false);
            })
    }

    useEffect(() => {
        if (isLastPostVisible && posts?.length > 0 && !isLastPage) {
          setLoader(true);
          fetchPost();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLastPostVisible]);

    const postEndingRef = useCallback((node) => {
        lastPost(node);
    },[lastPost]);

    const onRowClick = (post: IPost) => {
        navigate('/PostDetail', { state: post })
    }

    return (
        <TableContainer component={Paper}>
            {loader && (
                <CircularProgress style={{ position: "fixed", top: "30%", left: "50%" }} />
            )}
            <Table className={classes.table} sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead className={classes.head}>
                    <TableRow>
                        <TableCell align="center">Title</TableCell>
                        <TableCell align="center">URL</TableCell>
                        <TableCell align="center">Created At</TableCell>
                        <TableCell align="center">Author</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {posts.map((post, index) => {
                        return (
                           <TableRow className={`${classes.row} ${index % 2 === 0 && classes.rowColor}`} onClick={() => onRowClick(post)} key={index}>
                                <TableCell align="center">{post.title}</TableCell>
                                <TableCell align="center">{post.url}</TableCell>
                                <TableCell align="center">{post.created_at}</TableCell>
                                <TableCell align="center">{post.author}</TableCell>
                            </TableRow>
                        )})
                    }
                </TableBody>
            </Table>
            <div ref={postEndingRef} style={{ visibility: 'hidden' }}>
                Last Post
            </div>
        </TableContainer>
    )
}

export default PostList;