export default function mapper(input) {
    input.booking_system = 'Skedify';

    if (!('customer' in input)) {
        return input;
    }

    if ('propertyType' in input.customer) {
        input.propertyType = input.customer.propertyType;
        return input;
    }

    const propertyType = input.propertyType;

    switch (propertyType) {

        case 'APARTMENT':
            input.propertyType = 'False'; // We want this to automatically set the qualification question to "no"
            break;

        case 'BUSIRENTAL':
            input.propertyType = 'False'; // We want this to automatically set the qualification question to "no"
            break;

        case 'DETACHED':
            input.propertyType = 'True'; // We want this to automatically set the qualification question to "yes"
            break;

        case 'GARDEN':
            input.propertyType = 'False'; // We want this to automatically set the qualification question to "no"
            break;

        case 'HOBBYAGRI':
            input.propertyType = 'True'; // We want this to automatically set the qualification question to "yes"
            break;

        case 'HOLIDAY':
            input.propertyType = 'True'; // We want this to automatically set the qualification question to "yes"
            break;

        case 'RESIRENTAL':
            input.propertyType = 'False'; // We want this to automatically set the qualification question to "no"
            break;

        case 'ROOM':
            input.propertyType = 'False'; // We want this to automatically set the qualification question to "no"
            break;

        case 'TERRACE':
            input.propertyType = 'False'; // We want this to automatically set the qualification question to "no"
            break;

        case 'UNKNOWN':
            input.propertyType = 'False'; // We want this to automatically set the qualification question to "no"
            break;

        case 'PLOTDETA':
            input.propertyType = 'False'; // We want this to automatically set the qualification question to "no"
            break;

        case 'PLOTHOLIDA':
            input.propertyType = 'False'; // We want this to automatically set the qualification question to "no"
            break;

        default:
            break;
    }

    return input;
};
