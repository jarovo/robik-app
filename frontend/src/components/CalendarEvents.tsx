import { Table } from "react-bootstrap"
import { GoogleEvent } from "./Calendar"
import { PropsWithChildren, Ref } from "react"
import { useDraggable, useDroppable } from "@dnd-kit/core"
import { Form } from "react-bootstrap"

interface EventProps {
    event: GoogleEvent
}


const getHours = (event: GoogleEvent) => {
    const endTime = new Date(event.end.dateTime).getTime()
    const startTime = new Date(event.start.dateTime).getTime()
    return endTime - startTime
}  

const EventMarkup: React.FC<EventProps> = ({event}) => {
    const {attributes, listeners, setNodeRef, transform} = useDraggable({
      id: event.id,
    });
    const style = transform ? {
      transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;
    
    return (
        <tr id={event.id} ref={setNodeRef} style={style} {...listeners} {...attributes}>
            <td>
            <input type="checkbox" defaultChecked={true} aria-label="Checkbox for following text input" />
            </td>
            <td>
            {new Date(event.start.dateTime).toLocaleString()}
            </td>
            <td>
            {new Date(event.end.dateTime).toLocaleString()}
            </td>
            <td>
            {Number(getHours(event) / 1000 / 60 / 60).toFixed(2)}
            </td>
            <td>
            <Form.Control aria-label="Apperance in invoice" defaultValue={event.summary} />
            </td>
        </tr>
    );
}

interface CalendarEventsProps {
    id: string,
    events: GoogleEvent[]
}
    
export const CalendarEvents = (props: PropsWithChildren<CalendarEventsProps>) => {

	const {isOver, setNodeRef} = useDroppable({id: props.id});	
	const style = {background: isOver ? 'green' : undefined };


    return (
        <Table ref={setNodeRef}>
        <thead>
        <tr>
            <th>Select</th>
            <th>Since</th>
            <th>Until</th>
            <th>Hours</th>
            <th>Summary</th>
        </tr>
        </thead>
        <tbody>
        {props.events.map((event) => (<EventMarkup key={event.id} event={event}></EventMarkup>))}
        </tbody>
        </Table>
    )
}