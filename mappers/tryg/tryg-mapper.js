export default function mapper(input) {
    input.booking_system = 'Skedify';

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

    if ('category' in input) {
        return input;
    }

    if (!('customer' in input)) {
        return input;
    }

    if ('propertyType' in input.customer) {
        input.propertyType = input.customer.propertyType;
    }

    const propertyType = input.propertyType;

    switch (propertyType) {
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

        const partnerSegment = input.customer.partner_segment;

        if (partnerSegment.includes("Employee")) {
            input.employee = 'DB';
        } else {
            input.employee = '';
        }

        if (partnerSegment.includes("Business")) {
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

        if (partnerSegment.includes("Business Direct")) {
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

        if (partnerSegment.includes("Private Banking")) {
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

        if (partnerSegment.includes("Private")) {
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
