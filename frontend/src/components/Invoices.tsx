import React, { useEffect, useState } from "react";
import axios from "axios";

interface Invoice {
  id: Number
  number: String
}

type SubjecTypes = "customer" | "supplier" | "both"
type AresUpdateSettings = "on" | "off"
type WebinvoiceHistory = null | "disabled" | "recent" | "cliet_portal"

interface  Subject {
  id: Number        // 	Unique identifier in Fakturoid
	custom_id: string //	 	Identifier in your application
	user_id:	Number  // 	User ID who created the subject
	type: SubjecTypes
	name: string 	    // Name of the subject
	full_name: string // 	Contact person name
	email: string     // 	Main email address receive invoice emails
	email_copy: string  // 	Email copy address to receive invoice emails
	phone: string     //	Phone number
	web: string       //	Web page
	street: string    // 	Street
	city: string      //	City
	zip: string 	  // ZIP or postal code
	country: string   // Country (ISO code)
	has_delivery_address: Boolean   // 	Enable delivery address
  // To be able to set delivery address in the attributes below this must be set to true. Upon setting this to false, the delivery address below is cleared.
	delivery_name: string     // Delivery address name
	delivery_street: string   // Delivery address street
	delivery_city: string 	  // Delivery address city
	delivery_zip: string 	    // Delivery address ZIP or postal code
	delivery_country: string  // Delivery address country (ISO code)
	due: Number               // 	Number of days until an invoice is due for this subject
	currency: string          // Currency (ISO code)
	language:	string 	        // Invoice language
	private_note: string      //	Private note
	registration_no: string 	// Registration number (IČO)
	vat_no: 	string 	        // VAT-payer VAT number (DIČ, IČ DPH in Slovakia, typically starts with the country code)
	local_vat_no: string 	    // SK DIČ (only in Slovakia, does not start with country code)
	unreliable: 	boolean 	  // Unreliable VAT-payer
	unreliable_checked_at: 	Date 	// Date of last check for unreliable VAT-payer
	legal_form: string        // 	A three-digit number (as a string). Describes whether subject is a physical/natural person or a company of some sort. For list of codes see a CSV file on the official Legal form page (corresponds to chodnota field).
	vat_mode: string          // 	VAT mode
	bank_account: string      //	Bank account number
	iban: string              // 	IBAN
	swift_bic: 	string        // 	SWIFT/BIC
	variable_symbol: string   // 	Fixed variable symbol (used for all invoices for this client instead of invoice number)
	setting_update_from_ares: AresUpdateSettings // 	Whether to update subject data from ARES. Used to override account settings 
                                               //Default: inherit Updating this will also update the deprecated ares_update attribute. If both this and the deprecated attribute are present, the new one takes precedence.
	ares_update: boolean      //	Whether to update subject data from ARES. Used to override account settings
                            // Default: true
                            // Deprecated in favor of setting_update_from_ares
                            // Updating this will also update the new attribute
  setting_invoice_pdf_attachments: AresUpdateSettings // 	Whether to attach invoice PDF in email. Used to override account settings
	setting_estimate_pdf_attachments: AresUpdateSettings // 	Whether to attach estimate PDF in email. Used to override account settings
	setting_invoice_send_reminders: AresUpdateSettings //	Whether to send overdue invoice email reminders. Used to override account settings

	suggestion_enabled: boolean // Suggest for documents
                              // Default: true
	custom_email_text:	string 	// New invoice custom email text
	overdue_email_text:	string 	// Overdue reminder custom email text
	invoice_from_proforma_email_text: string 	// Proforma paid custom email text
	thank_you_email_text: string 	// Thanks for payment custom email text
	custom_estimate_email_text: string 	// Estimate custom email text
	webinvoice_history: WebinvoiceHistory 	// Webinvoice history
                                          //  Default: null (inherit from account settings)
	html_url: string            // 	Subject HTML web address
	url: string                 // 	Subject API address
	created_at:	Date        //	Date and time of subject creation
	updated_at:	Date 	      //  Date and time of last subject update
}

interface InvoicesProps {
  token: string | null
}

const Invoices: React.FC<InvoicesProps> = ({token}) => {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])

  useEffect(() => {
    const reqConfig = {headers: { Authorization: `Bearer ${token}`, 'Content-Type': "application/json", Accept: 'application/json'}}

    if (!token) return

    const getResources = async () => {
      const subjsResp = axios.get(`http://localhost:5000/api/subjects.json`, reqConfig)
      const invoicesResp = axios.get(`http://localhost:5000/api/invoices.json`, reqConfig)
      const subjects_data = (await subjsResp).data
      console.log("This is what I got", subjects_data)
      setSubjects(subjects_data)
      setInvoices((await invoicesResp).data)
    }

    getResources()
  }, [token]);

  return (
    <div>
      <h2>Invoices</h2>

      <select className="form-select" aria-label="Subject">
        {subjects.map((subj) => (
          <option key={subj.id.toString()} value={subj.id.toString()}>{subj.name}</option>
        ))}
      </select>

      {invoices.map((invoice) => (
        <p key={invoice.id.toString()}>{invoice.number}</p>
      ))}
    </div>
  );
};

export default Invoices;
