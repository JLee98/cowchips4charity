import Chance from 'chance';
import moment from 'moment';

import security from '../../../src/security/security';

const chance = new Chance();

const ALPHA = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUM = '0123456789';
const ALPHA_NUMERIC = ALPHA + NUM;

// maximum permission value is 2^(number of permissions) - 1
const MAX_PERM = (2 ** Object.getOwnPropertyNames(security.permission).length) - 1;
const MIN_PERM = 1;

export default class Generator
{
  static invalidString()
  {
    // TODO: would these actually be valid and casted?

    return chance.pickone([
      chance.integer(),
      chance.bool(),
      chance.floating(),
    ]);
  }

  static invalidName()
  {
    return this.invalidString();
  }

  static invalidEmail()
  {
    // email should be a string of the form <user>@<domain>
    return chance.pickone([
      this.invalidString(),
      chance.word(),
    ]);
  }

  static invalidPassword()
  {
    // password should be a string
    return this.invalidString();
  }

  static invalidPhone()
  {
    // phone should consist of 10 digits
    return chance.pickone([
      chance.string({ pool: ALPHA }),
      chance.string({ length: chance.integer({ min: 0, max: 9 }) }),
    ]);
  }

  static invalidPermissions()
  {
    // permissions should be a number
    return chance.pickone([
      chance.bool(),
      chance.word(),
      chance.email(),
      chance.floating(),
      chance.string({ pool: ALPHA }),
      // TODO add with integer larger than highest perm, and lower than lowest perm
    ]);
  }

  static invalidPhoto()
  {
    // photo should be a string ending in .jpg
    return chance.pickone([
      this.invalidString(),
      chance.email(),
      chance.string({ pool: ALPHA }),
    ]);
  }

  static invalidAbbreviation()
  {
    // TODO: would these actually be valid and casted?

    // abbreviation should be text with no spaces
    return this.invalidString();
  }

  static invalidDate()
  {
    // date should be a date object from javascript
    return chance.pickone([
      this.invalidString(),
      chance.string({ pool: ALPHA }),
    ]);
  }

  static invalidStringArray()
  {
    // yeah, these are not string arrays.
    return chance.pickone([
      this.invalidString(),
      chance.string(),
    ]);
  }

  static invalidDOB()
  {
    const now = moment.utc();
    now.subtract(chance.integer({ min: 0, max: 17 }), 'y');
    now.subtract(chance.integer({ min: 0, max: 11 }), 'm');
    now.subtract(chance.integer({ min: 0, max: 364 }), 'd');
    return now;
  }

  static invalidCity()
  {
    return this.invalidString();
  }

  static invalidState()
  {
    return this.invalidString();
  }

  static invalidZip()
  {
    return chance.pickone([
      chance.string({ pool: ALPHA }),
      chance.string({ pool: NUM }),
    ]);
  }

  static invalidAddress()
  {
    return this.invalidString();
  }

  static invalidLocation()
  {
    return {
      state: this.invalidState(),
      address: this.invalidAddress(),
      city: this.invalidCity(),
      zip: this.invalidZip(),
    };
  }

  static invalidBoard()
  {
    return chance.pickone([
      chance.integer(),
      chance.string(),
      undefined,
    ]);
  }

  static invalidPrice()
  {
    return chance.pickone([
      chance.string({ pool: ALPHA }),
    ]);
  }

  static invalidStreamUrl()
  {
    return chance.pickone([
      undefined,
    ]);
  }

  static permission(required)
  {
    if (required !== undefined && (required.val === undefined || Number.isNaN(required.val)))
      throw new Error('required permission needs to have a val property');

    const perm = chance.integer({ min: MIN_PERM, max: MAX_PERM });
    return (required !== undefined) ? perm | (1 << (required - 1)) : perm;
  }

  static email()
  {
    return chance.email();
  }

  static name()
  {
    return chance.name();
  }

  static photo()
  {
    return chance.string({ pool: ALPHA_NUMERIC }) + '.jpg';
  }

  static password()
  {
    return chance.string();
  }

  static abbreviation()
  {
    return chance.string({ pool: ALPHA, length: 3 });
  }

  static phone()
  {
    return chance.string({ pool: NUM, length: 10 });
  }

  static date(between = {})
  {

    if (between.before !== undefined)
      between.before = moment.utc(between.before);
    if (between.after !== undefined)
      between.after = moment.utc(between.after);

    // generate a date between the 2 specified dates
    if (between.after !== undefined && between.before !== undefined)
    {
      const rand = between.after.clone();
      rand.add(chance.integer({ min: 0, max: between.before.diff(between.after) }), 'ms');
      return rand.toDate();
    }
    // generate a date after a given date
    else if (between.after !== undefined)
    {
      const rand = between.after.clone();
      rand.add(chance.integer({ min: 3, max: 20 }), 'd');
      return rand.toDate();
    }
    // generate a date before a specified date
    else if (between.before !== undefined)
    {
      const rand = between.before.clone();
      rand.subtract(chance.integer({ min: 3, max: 20 }), 'd');
      return rand.toDate();
    }

    return moment.utc(chance.date({ year: new Date().getFullYear() })).toDate();
  }

  // returns an age > 18
  static dob()
  {
    const now = moment.utc();
    now.subtract(chance.integer({ min: 18, max: 100 }), 'y');
    now.subtract(chance.integer({ min: 0, max: 11 }), 'm');
    now.subtract(chance.integer({ min: 0, max: 364 }), 'd');
    return now.toDate();
  }

  static state()
  {
    return chance.state({ country: 'us' });
  }

  static address()
  {
    return chance.address();
  }

  static city()
  {
    return chance.city();
  }

  static zip()
  {
    return chance.zip({ plusfour: chance.bool() });
  }

  static location()
  {
    return {
      state: this.state(),
      address: this.address(),
      city: this.city(),
      zip: this.zip(),
    };
  }

  static board()
  {
    const l = 5;

    const spacing = 15;
    const min = 1;
    const max = l * spacing;

    const possible = [];

    let n = min;
    for (let i = 0; i < l; i++)
    {
      possible.push([]);
      for (let j = 0; j < spacing; j++)
        possible[i].push(n++);
    }

    let b = [];
    for (let i = 0; i < l; i++)
      b = b.concat(chance.pickset(possible[i], l));
    return b;
  }

  static streamUrl()
  {
    // https://www.youtube.com/watch?v=3bhP7zulFfY
    return 'https://www.youtube.com/watch?v=' + chance.string({ pool: ALPHA_NUMERIC });
  }

  static price()
  {
    return chance.integer({ min: 50, max: 100 });
  }

  static tiles(valid)
  {
    return chance.pickset(valid, chance.integer({ min: 1, max: 4 }));
  }

  static stripeID()
  {
    return chance.string();
  }
}
