import {Badge} from "react-bootstrap";
import styles from './TagList.module.css'

function TagList({tags}) {

    return (
        <div>
            {tags !== undefined && tags.map((tags, index) => (
                <Badge className={styles.tagStyle} variant="info" key={index}>{tags.tag}</Badge>
            ))}
        </div>
    );
}
export default TagList;
