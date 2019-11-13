export default function mapper(input) {
    if ('category' in input) {
        return input;
    }

    if (!('customer' in input)) {
        return input;
    }

    if ('category' in input.customer) {
        input.category = input.customer.category;
        return input;
    }

    if ('customer_number' in input.customer) {
        input.category = 'Private';
        return input;
    }

    if ('company_cvr_number' in input.customer) {
        input.category = 'Business';
        return input;
    }

    if (!('partner_segment' in input.customer)) {
        return input;
    }

    const partnerSegment = Array.isArray(input.customer.partner_segment)
        ? input.customer.partner_segment.join(' ')
        : input.customer.partner_segment;

    switch (partnerSegment) {
        case 'Private':
            input.category = 'Private';
            break;
        case 'Private BusinessDirect':
            input.category = 'Private';
            break;
        case 'Private Business':
            input.category = 'Business';
            break;
        case 'PrivateBanking':
            input.category = 'Private';
            break;
        case 'PrivateBanking BusinessDirect':
            input.category = 'Private';
            break;
        case 'PrivateBanking Business':
            input.category = 'Private';
            break;
        case 'BusinessDirect':
            input.category = 'Business';
            break;
        case 'Business':
            input.category = 'Business';
            break;
        default:
            break;
    }

    return input;
};
