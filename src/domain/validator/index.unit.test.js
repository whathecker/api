const Joi = require('@hapi/joi');

const errorMessages = Object.freeze({
    string: 'must be a string',
    number: 'must be a number',
    boolean: 'must be a boolean',
    date: 'must be a date',
});

const schema = Joi.object({
    string: Joi.string().error(new Error(errorMessages.string)),
    number: Joi.number().error(new Error(errorMessages.number)),
    boolean: Joi.boolean().error(new Error(errorMessages.boolean)),
    date: Joi.date().error(new Error(errorMessages.date))
});

const validator = require('./index')(schema);

const payload = Object.freeze({
    valid: {
        string: 'string',
        number: 0,
        boolean: true,
        date: new Date('December 17, 1995 03:24:00')
    },
    invalid_string: {
        string: true,
        number: 0,
        boolean: true,
        date: new Date('December 17, 1995 03:24:00')
    },
    invalid_number: {
        string: 'string',
        number: null,
        boolean: true,
        date: new Date('December 17, 1995 03:24:00')
    },
    invalid_boolean: {
        string: 'string',
        number: 0,
        boolean: 1,
        date: new Date('December 17, 1995 03:24:00')
    },
    invalid_date: {
        string: 'string',
        number: 0,
        boolean: true,
        date: 'December'
    }
});


describe('schema validator', () => {

    test('valid schema', () => {
        const result = validator(payload.valid);
        expect(result).toBe(true);
    });

    test('invalid string', () => {
        const result = validator(payload.invalid_string);
        expect(result instanceof Error).toBe(true);
        expect(result.message).toBe(errorMessages.string);
    });

    test('invalid number', () => {
        const result = validator(payload.invalid_number);
        expect(result instanceof Error).toBe(true);
        expect(result.message).toBe(errorMessages.number);
    });

    test('invalid boolean', () => {
        const result = validator(payload.invalid_boolean);
        expect(result instanceof Error).toBe(true);
        expect(result.message).toBe(errorMessages.boolean);
    });

    test('invalid date', () => {
        const result = validator(payload.invalid_date);
        expect(result instanceof Error).toBe(true);
        expect(result.message).toBe(errorMessages.date);
    });

});