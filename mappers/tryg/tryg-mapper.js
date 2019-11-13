export default function mapper(input) {
    if (!('customer' in input)) {
        return input;
    }

    if ('category' in input.customer) {
        return input;
    }

    if ('customer_number' in input.customer) {
        input.customer.category = 'Private';
        return input;
    }

    if ('company_cvr_number' in input.customer) {
        input.customer.category = 'Business';
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
            input.customer.category = 'Private';
            break;
        case 'Private BusinessDirect':
            input.customer.category = 'Private';
            break;
        case 'Private Business':
            input.customer.category = 'Business';
            break;
        case 'PrivateBanking':
            input.customer.category = 'Private';
            break;
        case 'PrivateBanking BusinessDirect':
            input.customer.category = 'Private';
            break;
        case 'PrivateBanking Business':
            input.customer.category = 'Private';
            break;
        case 'BusinessDirect':
            input.customer.category = 'Business';
            break;
        case 'Business':
            input.customer.category = 'Business';
            break;
        default:
            break;
    }

    return input;
};
