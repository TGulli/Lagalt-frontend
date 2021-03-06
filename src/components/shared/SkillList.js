import "./SkillList.css"
import {Button} from "react-bootstrap"

function SkillList({skills, index, removeFunction}) {

    return (
        <li className="li-sl" key={index}>
            <Button type="button" onClick={removeFunction}>
                {skills}
            </Button>
        </li>

    );
}
export default SkillList;
