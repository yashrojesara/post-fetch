import { makeStyles } from "@mui/styles";
import { useLocation } from "react-router-dom";
import { IPost } from "./types";

const useStyles = makeStyles({   
    main: {
        display: 'flex',
        fontSize: '20px'
    }
})

const Post: React.FC = () => {
    const classes = useStyles();
    const { state } = useLocation();
    const data = state as IPost;

    const post = {
        title: data?.title,
        url: data?.url,
        created_at: data?.created_at,
        author: data?.author
    }

    return (
        <pre data-testid='post' className={classes.main}>
            { JSON.stringify(post, null, 2) }
        </pre>
    )
}

export default Post;