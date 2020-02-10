export default function mapper(input, headers) {
    input.booking_system = 'Skedify';

    try {
        if (headers['x-globaltransactionid'] != null) {
            input.global_transaction_id = headers['x-globaltransactionid'];
        }
    } catch (e) {
        // Swallow error
    }

    try {
        if (input.customer.postal_address.country == null) {
            input.customer.postal_address.country = 'Danmark'
        }
    } catch (e) {
        // Swallow error
    }

    try {
        if (input.appointment.office.location.country == null) {
            input.appointment.office.location.country = 'Danmark'
        }
    } catch (e) {
        // Swallow error
    }

    try {
        if (input.appointment.office.location.street_1 != null) {
            const street = input.appointment.office.location.street_1;
            delete input.appointment.office.location.street_1;
            input.appointment.office.location.street = street;
        }
    } catch (e) {
        // Swallow error
    }

    input.filters = [];

    try {
        if (input.appointment.office.location != null) {
            const branchAddress = input.appointment.office.location;
            const formattedBranchAddress = `${branchAddress.street} ${branchAddress.house_number}${branchAddress.postal_code}${branchAddress.city}`;
            const offices = await sdk.offices().include(sdk.include.contacts);
            const office = offices?.data.find(o => {
                const formattedSkedifyAddress = `${o.location.street_1}${branchAddress.postal_code}${branchAddress.city}`;
                return formattedSkedifyAddress === formattedBranchAddress;
            });

            if (office !== undefined) {
                input.filters.push({
                    contacts: office.contacts.map(c => c.id),
                    meetingType: 'PHONE',
                }, {
                    contacts: office.contacts.map(c => c.id),
                    meetingType: 'VIDEO',
                });
            }
        }
    } catch (e) {
        // Swallow error
    }

    if ('category' in input) {
        return input;
    }

    if (!('customer' in input)) {
        return input;
    }

    if ('housing_type' in input.customer) {
        input.housing_type = input.customer.housing_type;
    }

    const housingType = input.housing_type;

    switch (housingType) {
        case 'APARTMENT':
        case 'BUSIRENTAL':
        case 'GARDEN':
        case 'HOLIDAY':
        case 'RESIRENTAL':
        case 'ROOM':
        case 'PLOTDETA':
        case 'PLOTHOLIDA':
            input.customer.is_houseowner = 'false';
            break;

        case 'DETACHED':
        case 'HOBBYAGRI':
            input.customer.is_houseowner = 'true';
            break;

        case 'TERRACE':
        case 'UNKNOWN':
        default:
            break;
    }

    if ('category' in input.customer) {
        input.category = input.customer.category;
        return input;
    }

    if (('partner_segment' in input.customer)) {

        let partnerSegment = input.customer.partner_segment;
        if (Array.isArray(partnerSegment)) {
            partnerSegment = partnerSegment.map(p => p.toLowerCase());
        } else {
            partnerSegment = partnerSegment.toLowerCase();
        }

        if (partnerSegment.includes('employee')) {
            input.employee = 'DB';
        } else {
            input.employee = '';
        }

        if (partnerSegment.includes('business')) {
            input.category = 'Business';
            input.customer.business_segment = 'Business';
            input.customer.partner_segment = 'Business';

            if ('customer_number' in input.customer) {
                input.category = 'Private';
                input.customer.business_segment = 'Private';
            }

            if ('company_cvr_number' in input.customer) {
                input.category = 'Business';
                input.customer.business_segment = 'Business';
            }
            return input;
        }

        if (partnerSegment.includes('business direct')) {
            input.category = 'Business';
            input.customer.business_segment = 'Business';
            input.customer.partner_segment = 'Business Direct';

            if ('customer_number' in input.customer) {
                input.category = 'Private';
                input.customer.business_segment = 'Private';
            }

            if ('company_cvr_number' in input.customer) {
                input.category = 'Business';
                input.customer.business_segment = 'Business';
            }

            return input;
        }

        if (partnerSegment.includes('private banking')) {
            input.category = 'Private';
            input.customer.business_segment = 'Private';
            input.customer.partner_segment = 'Private Banking';

            if ('customer_number' in input.customer) {
                input.category = 'Private';
                input.customer.business_segment = 'Private';
            }

            if ('company_cvr_number' in input.customer) {
                input.category = 'Business';
                input.customer.business_segment = 'Business';
            }

            return input;
        }

        if (partnerSegment.includes('private')) {
            input.category = 'Private';
            input.customer.business_segment = 'Private';
            input.customer.partner_segment = 'Private';

            if ('customer_number' in input.customer) {
                input.category = 'Private';
                input.customer.business_segment = 'Private';
            }

            if ('company_cvr_number' in input.customer) {
                input.category = 'Business';
                input.customer.business_segment = 'Business';
            }

            return input;
        }
    }

    if ('customer_number' in input.customer) {
        input.category = 'Private';
        input.customer.business_segment = 'Private';

        return input;
    }

    if ('company_cvr_number' in input.customer) {
        input.category = 'Business';
        input.customer.business_segment = 'Business';

        return input;
    }

    return input;
};
