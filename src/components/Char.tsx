import {type CSSProperties, type ReactNode} from "react";
import {CharStatus} from "../types.ts";

export default function Char(props: { status: CharStatus, isSelected: boolean, children: ReactNode }) {

    const getStyle = (): CSSProperties => {
        if (props.isSelected) {
            return {backgroundColor: "yellow"}
        }

        switch (props.status) {
            case CharStatus.CORRECT:
                return {backgroundColor: "green"}
            case CharStatus.INCORRECT:
                return {backgroundColor: "red"}
            case CharStatus.PENDING:
            default:
                return {}
        }
    }

    return <span className={"char"} style={getStyle()}>{props.children}</span>
}
