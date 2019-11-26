export default function mapper(input) {
    input.booking_system = 'Skedify';

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
            input.customer.is_houseowner = 'false'; // We want this to automatically set the qualification question to "no"
            break;

        case 'BUSIRENTAL':
            input.customer.is_houseowner = 'false'; // We want this to automatically set the qualification question to "no"
            break;

        case 'DETACHED':
            input.customer.is_houseowner = 'true'; // We want this to automatically set the qualification question to "yes"
            break;

        case 'GARDEN':
            input.customer.is_houseowner = 'false'; // We want this to automatically set the qualification question to "no"
            break;

        case 'HOBBYAGRI':
            input.customer.is_houseowner = 'true'; // We want this to automatically set the qualification question to "yes"
            break;

        case 'HOLIDAY':
            input.customer.is_houseowner = 'true'; // We want this to automatically set the qualification question to "yes"
            break;

        case 'RESIRENTAL':
            input.customer.is_houseowner = 'false'; // We want this to automatically set the qualification question to "no"
            break;

        case 'ROOM':
            input.customer.is_houseowner = 'false'; // We want this to automatically set the qualification question to "no"
            break;

        case 'TERRACE':
            input.customer.is_houseowner = 'false'; // We want this to automatically set the qualification question to "no"
            break;

        case 'UNKNOWN':
            input.customer.is_houseowner = 'false'; // We want this to automatically set the qualification question to "no"
            break;

        case 'PLOTDETA':
            input.customer.is_houseowner = 'false'; // We want this to automatically set the qualification question to "no"
            break;

        case 'PLOTHOLIDA':
            input.customer.is_houseowner = 'false'; // We want this to automatically set the qualification question to "no"
            break;

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
            input.business_segment = 'Business';
            input.partner_segment = 'Business';

            if ('customer_number' in input.customer) {
                input.category = 'Private';
                input.business_segment = 'Private';
            }

            if ('company_cvr_number' in input.customer) {
                input.category = 'Business';
                input.business_segment = 'Business';
            }
            return input;
        }

        if (partnerSegment.includes("BusinessDirect")) {
            input.category = 'Business';
            input.business_segment = 'Business';
            input.partner_segment = 'BusinessDirect';

            if ('customer_number' in input.customer) {
                input.category = 'Private';
                input.business_segment = 'Private';
            }

            if ('company_cvr_number' in input.customer) {
                input.category = 'Business';
                input.business_segment = 'Business';
            }

            return input;
        }

        if (partnerSegment.includes("PrivateBanking")) {
            input.category = 'Private';
            input.business_segment = 'Private';
            input.partner_segment = 'PrivateBanking';

            if ('customer_number' in input.customer) {
                input.category = 'Private';
                input.business_segment = 'Private';
            }

            if ('company_cvr_number' in input.customer) {
                input.category = 'Business';
                input.business_segment = 'Business';
            }

            return input;
        }

        if (partnerSegment.includes("Private")) {
            input.category = 'Private';
            input.business_segment = 'Private';
            input.partner_segment = 'Private';

            if ('customer_number' in input.customer) {
                input.category = 'Private';
                input.business_segment = 'Private';
            }

            if ('company_cvr_number' in input.customer) {
                input.category = 'Business';
                input.business_segment = 'Business';
            }

            return input;
        }
    }

    if ('customer_number' in input.customer) {
        input.category = 'Private';
        input.business_segment = 'Private';

        return input;
    }

    if ('company_cvr_number' in input.customer) {
        input.category = 'Business';
        input.business_segment = 'Business';

        return input;
    }

    return input;
};
