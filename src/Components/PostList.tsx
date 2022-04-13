import { makeStyles } from "@mui/styles";
import { useEffect, useRef, useState } from "react";
import { getPosts } from "./service";
import { IPost } from "./types";
import { CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material';
import Paper from '@mui/material/Paper';
import { useNavigate } from 'react-router-dom';
import useIntersectionObserver from './useIntersection';

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
    const navigate = useNavigate();

    const ref = useRef<HTMLDivElement | null>(null)
    const entry = useIntersectionObserver(ref, {})
    const isVisible = !!entry?.isIntersecting

    useEffect(() => {
        let interval: any;
        if (!isLastPage) {
            fetchPost();
            interval = setInterval(() => {
                fetchPost();
            }, 10000)            
        }
        
        return(() => {
            clearInterval(interval);
        })
    }, [isLastPage])

    const fetchPost = async() => {
        setLoader(true);
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

    const onRowClick = (post: IPost) => {
        navigate('/PostDetail', { state: post })
    }

    useEffect(() => {
        if (isVisible && posts.length > 0) {
            console.log('here')
            fetchPost();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isVisible])

    return (
        <TableContainer component={Paper}>
            {loader && (
                <CircularProgress style={{ position: "fixed", top: "30%", left: "50%" }} />
            )}
            <Table data-testid='table' className={classes.table} sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead className={classes.head}>
                    <TableRow>
                        <TableCell data-testid='title' align="center">Title</TableCell>
                        <TableCell data-testid='url' align="center">URL</TableCell>
                        <TableCell data-testid='created' align="center">Created At</TableCell>
                        <TableCell data-testid='author' align="center">Author</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {posts.map((post, index) => {                        
                        return (
                            <TableRow data-testid={'row'} className={`${classes.row} ${index % 2 === 0 && classes.rowColor}`} onClick={() => onRowClick(post)} key={index}>
                                <TableCell align="center">{post.title}</TableCell>
                                <TableCell align="center">{post.url}</TableCell>
                                <TableCell align="center">{post.created_at}</TableCell>
                                <TableCell align="center">{post.author}</TableCell>
                            </TableRow>                                                     
                        )})
                    }
                </TableBody>
            </Table>   
             <div ref={ref} style={{ visibility: 'hidden' }}>
                Last Post
            </div>        
        </TableContainer>
    )
}

export default PostList;