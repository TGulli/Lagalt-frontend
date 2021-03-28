import "./SkillList.css"
import {Button} from "react-bootstrap"

function SkillList({skills, index, removeElement}) {

    return (
        <li className="li-sl" key={index}>
            <Button type="button" onClick={removeElement}>
                {skills}
            </Button>
        </li>

    );
}
export default SkillList;
