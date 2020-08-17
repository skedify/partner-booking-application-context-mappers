export default async function mapper(input, headers) {
    input.booking_system = 'Skedify';
    try {
        if (headers['x-globaltransactionid'] != null) {
            input.global_transaction_id = headers['x-globaltransactionid']
        }
    } catch (e) {
    }
    try {
        if (input.appointment.booker != null) {
            input.booker = {
                bookerSource: 'context',
                email: input.appointment.booker.email,
                externalId: input.appointment.booker.employee_number,
                employeeRegistrationNumber: input.appointment.booker.employee_registration_number
            }
        }
    } catch (e) {}

    try {
        if (input.customer.postal_address.country == null) {
            input.customer.postal_address.country = 'Danmark'
        }
    } catch (e) {
    }
    try {
        if (input.appointment.office.location.country == null) {
            input.appointment.office.location.country = 'Danmark'
        }
    } catch (e) {
    }
    try {
        if (input.appointment.office.location.street_1 != null) {
            const street = input.appointment.office.location.street_1;
            delete input.appointment.office.location.street_1;
            input.appointment.office.location.street = street
        }
    } catch (e) {
    }
    input.filters = [];
    try {
        if (input.appointment.office.location != null) {
            const branchAddress = input.appointment.office.location;
            const formattedBranchAddress = `${branchAddress.street}${branchAddress.postal_code}${branchAddress.city}`.replace(/ /g, '').toLowerCase();
            input.appointment.formattedBranchAddress = formattedBranchAddress;
            const offices = await sdk.offices().include(sdk.include.contacts);
            const matchedOffices = offices.data.filter(o => {
                const formattedSkedifyAddress = `${o.location.street_1}${o.location.postal_code}${o.location.city}`.replace(/ /g, '').toLowerCase();
                return formattedSkedifyAddress === formattedBranchAddress && o.is_active
            });
            if (matchedOffices != null && matchedOffices.length > 0) {
                let contacts = [];
                matchedOffices.forEach(m => contacts.push(...m.contacts.map(c => c.id)));
                offices.data.forEach(o => {
                    if (o.external_id === 'SalesAgents' && o.is_active) {
                        input.filters.push({
                            contacts,
                            meetingType: 'PHONE',
                            office: o.id
                        }, {contacts, meetingType: 'VIDEO', office: o.id})
                    }
                })
            }
        }
    } catch (e) {
        input.filter_error = e
    }
    if ('category' in input) {
        return input
    }
    if (!('customer' in input)) {
        return input
    }
    if ('housing_type' in input.customer) {
        input.housing_type = input.customer.housing_type
    }
    if ('category' in input.customer) {
        input.category = input.customer.category;
        return input
    }
    if (('partner_segment' in input.customer)) {
        let partnerSegment = input.customer.partner_segment;
        if (Array.isArray(partnerSegment)) {
            partnerSegment = partnerSegment.map(p => p.toLowerCase())
        } else {
            partnerSegment = partnerSegment.toLowerCase()
        }
        if (partnerSegment.includes('employee')) {
            input.employee = 'DB'
        } else {
            input.employee = ''
        }
        if (partnerSegment.includes('business')) {
            input.category = 'Business';
            input.customer.business_segment = 'Business';
            input.customer.partner_segment = 'Business';
            if ('customer_number' in input.customer) {
                input.category = 'Private';
                input.customer.business_segment = 'Private'
            }
            if ('company_cvr_number' in input.customer) {
                input.category = 'Business';
                input.customer.business_segment = 'Business'
            }
            return input
        }
        if (partnerSegment.includes('business direct')) {
            input.category = 'Business';
            input.customer.business_segment = 'Business';
            input.customer.partner_segment = 'Business Direct';
            if ('customer_number' in input.customer) {
                input.category = 'Private';
                input.customer.business_segment = 'Private'
            }
            if ('company_cvr_number' in input.customer) {
                input.category = 'Business';
                input.customer.business_segment = 'Business'
            }
            return input
        }
        if (partnerSegment.includes('private banking')) {
            input.category = 'Private';
            input.customer.business_segment = 'Private';
            input.customer.partner_segment = 'Private Banking';
            if ('customer_number' in input.customer) {
                input.category = 'Private';
                input.customer.business_segment = 'Private'
            }
            if ('company_cvr_number' in input.customer) {
                input.category = 'Business';
                input.customer.business_segment = 'Business'
            }
            return input
        }
        if (partnerSegment.includes('private')) {
            input.category = 'Private';
            input.customer.business_segment = 'Private';
            input.customer.partner_segment = 'Private';
            if ('customer_number' in input.customer) {
                input.category = 'Private';
                input.customer.business_segment = 'Private'
            }
            if ('company_cvr_number' in input.customer) {
                input.category = 'Business';
                input.customer.business_segment = 'Business'
            }
            return input
        }
    }
    if ('customer_number' in input.customer) {
        input.category = 'Private';
        input.customer.business_segment = 'Private';
        return input
    }
    if ('company_cvr_number' in input.customer) {
        input.category = 'Business';
        input.customer.business_segment = 'Business';
        return input
    }
    return input;
};
