import React, { PropsWithChildren, useState, ChangeEventHandler, use, useEffect, MouseEventHandler, ReactElement, FormEventHandler, FormEvent, ReactEventHandler, ChangeEvent } from "react";
import { Api, Namespace, Invoice } from "fakturoid-js"

import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

import { GoogleEvent } from "./Calendar";
import { InputGroup } from "react-bootstrap";
import { Subject } from "fakturoid-js/lib/Api/ApiEntity";

interface InvoicesProps {
  accessToken: string
  CalendarEvents: ReactElement
}


const Invoices: React.FC<PropsWithChildren<InvoicesProps>> =({accessToken, CalendarEvents}) => {

	const [fakturoid, setFakturoid] = useState<Api|null>(null)
	const [subjectName, setSubjectName] = useState("")
	const [subjectsOptions, setSubjectsOptions] = useState<Subject[]>([])
	const [invoices, setInvoices] = useState<Invoice[]>([])
	const [selectedSubject, setSelectedSubject] = useState<Number|null>(null)
	const [events, setEvents] = useState<GoogleEvent[]>([])

	const onFakturoidSlugChange: ChangeEventHandler<HTMLInputElement> = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFakturoid(new Api({
			namespace: Namespace.development,
			credentials: { access_token: accessToken },
			slug: e.currentTarget.value
		}))
			
		fakturoid?.subjects.search({query: subjectName, page: 1}).then(data => setSubjectsOptions(data)).catch(e => console.debug(`Unable to find subjects starting with ${subjectName}`, e))
	}

	const onSubjectSearch: ChangeEventHandler<HTMLInputElement> = (e)  => {
		fakturoid?.subjects.search({query: e.target.value, page: 1}).then(data => setSubjectsOptions(data))
	}

	const onSubjectSelect: ChangeEventHandler<HTMLInputElement> = (e) => {
		if (subjectsOptions.length === 0) return

		const selectedId = Number(subjectsOptions[0]!.id)
		setSelectedSubject(selectedId)
		fakturoid?.invoices.list({subject_id: selectedId, page: 1}).then(data => setInvoices(data))
	}

	const onInvoiceSelect: ChangeEventHandler<HTMLSelectElement> = (e: ChangeEvent) => {
		if (subjectsOptions.length === 0) return
		
		const selectedId = Number(subjectsOptions[0].id)
		if(!selectedId) return

		setSelectedSubject(selectedId)

		fakturoid?.invoices.list({subject_id: selectedId, page: 1}).then(data => setInvoices(data))
	}

	const fakturoidUpdate = (formData: FormData) => {
		console.log("Form data", formData)
	}

	return (
		<div>
			<h2>Invoice</h2>
			<Form action={fakturoidUpdate}>
				<InputGroup className="mb-3">
					<InputGroup.Text>Fakturoid slug</InputGroup.Text>
					<Form.Control onChange={onFakturoidSlugChange} aria-label="Fakturoid slug" />

					<InputGroup.Text>Subject name</InputGroup.Text>
					<Form.Control name="subjectName" type="text" list="subjects" onChange={onSubjectSearch} onSelect={onSubjectSelect}/>
					<datalist id="subjects">
						{subjectsOptions.map((subj) => (
						<option key={subj.id.toString()} value={subj.name}>{subj.name}</option>
						))}
					</datalist>

					<InputGroup.Text>Invoice number</InputGroup.Text>
					<select name="invoiceNumber" className="form-select" aria-label="Invoices" onChange={onInvoiceSelect}>
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

				<Button variant="primary" type="submit">Submit</Button>

				{CalendarEvents}
			</Form>
		</div>
	)
}

export default Invoices;