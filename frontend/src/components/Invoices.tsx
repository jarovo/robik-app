import React, { PropsWithChildren, useState, ChangeEventHandler, use, useEffect, MouseEventHandler, ReactElement } from "react";
import { Api, Namespace, Invoice } from "fakturoid-js"

import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

import { CalendarEvents } from "./CalendarEvents";
import { GoogleEvent } from "./Calendar";
import { FloatingLabel, FormLabel, InputGroup } from "react-bootstrap";
import InputGroupText from "react-bootstrap/esm/InputGroupText";
import { Subject } from "fakturoid-js/lib/Api/ApiEntity";

interface InvoicesProps {
  accessToken: string
  CalendarEvents: ReactElement
}

const Invoices: React.FC<PropsWithChildren<InvoicesProps>> =({accessToken, CalendarEvents}) => {

	const fakturoid = new Api({
		namespace: Namespace.development,
		credentials: { access_token: accessToken },
		slug: "jaroslavhenner"
	})
	const [subjectName, setSubjectName] = useState("")
	const [subjects, setSubjects] = useState<Subject[]>([])
	const [invoices, setInvoices] = useState<Invoice[]>([])
	const [selectedSubject, setSelectedSubject] = useState<Number|null>(null)
	const [events, setEvents] = useState<GoogleEvent[]>([])

	useEffect(() => {
		fakturoid.subjects.search({query: subjectName, page:0}).then(data => setSubjects(data))
	}, [])

	const onSubjectSearch: ChangeEventHandler<HTMLInputElement> = (e)  => {
		console.log("Searching for", e.target.value)
		fakturoid.subjects.search({query: e.target.value, page: 1}).then(data => setSubjects(data))
	}

	const onSubjectSelect: ChangeEventHandler<HTMLInputElement> = (e) => {
		console.log(e)
		const selectedId= Number(subjects[0].id)
		if(!selectedId) return
		setSelectedSubject(selectedId)
		fakturoid.invoices.list({subject_id: selectedId, page: 1}).then(data => setInvoices(data))
	}

	return (
		<div>
			<h2>Invoice</h2>
			<Form>
				<InputGroup className="mb-3">
					<InputGroup.Text>Subject name</InputGroup.Text>
					<input type="text" list="subjects" onChange={onSubjectSearch} onSelect={onSubjectSelect}/>
					<datalist id="subjects">
						{subjects.map((subj) => (
						<option key={subj.id.toString()} value={subj.name}>{subj.name}</option>
						))}
					</datalist>

					<InputGroup.Text>Invoice number</InputGroup.Text>
					<select className="form-select" aria-label="Invoices">
						{invoices.map((invoice) => (
						<option key={invoice.id.toString()} value={invoice.number.toString()}>{invoice.number}</option>
						))}
					</select>
				</InputGroup>
				
				<InputGroup className="mb-3">
					<InputGroup.Text>Default price per hour</InputGroup.Text>
					<Form.Control aria-label="Price per hour" />
					<InputGroup.Text>/hour</InputGroup.Text>
				</InputGroup>

				<Button variant="primary">Update Fakturoid</Button>

				{CalendarEvents}
			</Form>
		</div>
	)
}

export default Invoices;