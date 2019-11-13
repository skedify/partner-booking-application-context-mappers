import {basePrivateContext, baseCommercialContext} from "./helpers/base-context";
import mapper from './tryg-mapper';

describe('TrygMapper', () => {
    const scenarios = {
        1: {
            in: ['Private'],
            out: 'Private',
        },
        2: {
            in: ['Private', 'BusinessDirect'],
            out: 'Private',
        },
        4: {
            in: ['Private', 'Business'],
            out: 'Business',
        },
        7: {
            in: ['PrivateBanking'],
            out: 'Private',
        },
        8: {
            in: ['PrivateBanking', 'BusinessDirect'],
            out: 'Private',
        },
        10: {
            in: ['PrivateBanking', 'Business'],
            out: 'Private',
        },
        12: {
            in: ['BusinessDirect'],
            out: 'Business',
        },
        14: {
            in: ['Business'],
            out: 'Business',
        },
        16: {
            in: ['CVR Number'],
            out: 'Private',
        },
        17: {
            in: ['CPR Number'],
            out: 'Business',
        },
    };

    it('should return the input if category is defined', () => {
        const result = mapper({ category: '123' });
        expect(result.category).toEqual('123');
    });

    it('should return the input if no customer is defined', () => {
       const result = mapper({ booker: '123' });
       expect(result.booker).toEqual('123');
    });

    it('should always return the defined category', () => {
       const context = JSON.parse(JSON.stringify(baseCommercialContext));
       context.category = 'Private';

       const result = mapper(context);
       expect(result.category).toEqual('Private');
    });

    it('should always return private with CVR present, test case #16', () => {
        const context = JSON.parse(JSON.stringify(basePrivateContext));
        context.customer.customer_number = '123';

        const result = mapper(context);
        expect(result.category).toEqual(scenarios["16"].out);
    });

    it('should always return business with CPR present, test case #17',  () => {
        const context = JSON.parse(JSON.stringify(baseCommercialContext));
        context.customer.company_cvr_number = '123';

        const result = mapper(context);
        expect(result.category).toEqual(scenarios["17"].out);
    });

    it('should return test case #1', () => {
        const context = JSON.parse(JSON.stringify(basePrivateContext));
        context.customer.partner_segment = scenarios["1"].in;

        const result = mapper(context);
        expect(result.category).toEqual(scenarios["1"].out);
    });

    it('should return test case #2', () => {
        const context = JSON.parse(JSON.stringify(basePrivateContext));
        context.customer.partner_segment = scenarios["2"].in;

        const result = mapper(context);
        expect(result.category).toEqual(scenarios["2"].out);
    });

    it('should return test case #4', () => {
        const context = JSON.parse(JSON.stringify(basePrivateContext));
        context.customer.partner_segment = scenarios["4"].in;

        const result = mapper(context);
        expect(result.category).toEqual(scenarios["4"].out);
    });

    it('should return test case #7', () => {
        const context = JSON.parse(JSON.stringify(basePrivateContext));
        context.customer.partner_segment = scenarios["7"].in;

        const result = mapper(context);
        expect(result.category).toEqual(scenarios["7"].out);
    });

    it('should return test case #8', () => {
        const context = JSON.parse(JSON.stringify(basePrivateContext));
        context.customer.partner_segment = scenarios["8"].in;

        const result = mapper(context);
        expect(result.category).toEqual(scenarios["8"].out);
    });

    it('should return test case #10', () => {
        const context = JSON.parse(JSON.stringify(basePrivateContext));
        context.customer.partner_segment = scenarios["10"].in;

        const result = mapper(context);
        expect(result.category).toEqual(scenarios["10"].out);
    });

    it('should return test case #12', () => {
        const context = JSON.parse(JSON.stringify(basePrivateContext));
        context.customer.partner_segment = scenarios["12"].in;

        const result = mapper(context);
        expect(result.category).toEqual(scenarios["12"].out);
    });

    it('should return test case #14', () => {
        const context = JSON.parse(JSON.stringify(basePrivateContext));
        context.customer.partner_segment = scenarios["14"].in;

        const result = mapper(context);
        expect(result.category).toEqual(scenarios["14"].out);
    });

    it('should mirror the result with no partner_segment and no CVR or CPR props', () => {
        const context = JSON.parse(JSON.stringify(basePrivateContext));

        const result = mapper(context);
        expect(result).toEqual(context);
    });

    it('should mirror the result with empty partner_segment and no CVR or CPR props', () => {
        const context= JSON.parse(JSON.stringify(basePrivateContext));
        context.customer.partner_segment = [];

        const result = mapper(context);
        expect(result).toEqual(context);
    });
});
