// The tagged template literal throws eslint indents off bad. Best to just disable it.
/* eslint indent: 'off' */
import AbilitiesStore from '~/Abilities.store';
import { itemList, applyItemLoadout } from '~/utilities/testHelpers';

describe('Ability helpers:', () => {
	let items;
	let store;

	beforeEach(() => {
		jest.clearAllMocks();
		store = AbilitiesStore.create({
			id: '1',
			config: '2',
		});
		store.hasItem = jest.fn().mockImplementation(name => items[name]);
		items = applyItemLoadout(itemList);
	});
	test('ability to dash.', () => {
		items.boots = false;
		expect(store.canDash).toBe(false);

		items.boots = true;
		expect(store.canDash).toBe(true);
	});
	describe('Equipped sword tiers.', () => {
		test.each`
			tier | acquired | expected
			${0} | ${true}  | ${0}
			${1} | ${true}  | ${1}
			${2} | ${true}  | ${2}
			${3} | ${true}  | ${3}
			${4} | ${true}  | ${4}
			${0} | ${false} | ${0}
			${1} | ${false} | ${0}
			${2} | ${false} | ${0}
			${3} | ${false} | ${0}
			${4} | ${false} | ${0}
		`('returns $expected when tier is $tier and acquired is $acquired.', ({ tier, acquired, expected }) => {
			store.getItemsByGroup = jest.fn().mockReturnValue([{ tier, acquired }]);
			expect(store.hasSwordTier).toEqual(expected);
		});
	});
	test('ability to read.', () => {
		items.book = false;
		expect(store.canRead).toBe(false);

		items.book = true;
		expect(store.canRead).toBe(true);
	});
	describe('Ability to activate tablets:', () => {
		test.each`
			canRead  | hasSwordTier | expected
			${true}  | ${0}         | ${false}
			${true}  | ${1}         | ${false}
			${true}  | ${2}         | ${true}
			${true}  | ${3}         | ${true}
			${true}  | ${4}         | ${true}
			${false} | ${0}         | ${false}
			${false} | ${1}         | ${false}
			${false} | ${2}         | ${false}
			${false} | ${3}         | ${false}
			${false} | ${4}         | ${false}
		`('returns $expected when canRead is $canRead and hasSwordTier is $hasSwordTier.', ({ canRead, hasSwordTier, expected }) => {
			jest.spyOn(store, 'canRead', 'get').mockReturnValue(canRead);
			jest.spyOn(store, 'hasSwordTier', 'get').mockReturnValue(hasSwordTier);

			expect(store.canActivateTablets).toBe(expected);
		});
	});
	test('ability to activate medallions.', () => {
		const hasSwordTier = jest.spyOn(store, 'hasSwordTier', 'get').mockReturnValue(0);

		expect(store.canActivateMedallions).toBe(false);

		hasSwordTier.mockReturnValue(1);
		expect(store.canActivateMedallions).toBe(true);
	});
	test('ability to grapple.', () => {
		items.hookshot = false;
		expect(store.canGrapple).toBe(false);

		items.hookshot = true;
		expect(store.canGrapple).toBe(true);
	});
	describe('Ability to be invulnerable:', () => {
		test.each`
			cape     | byrna    | expected
			${false} | ${false} | ${false}
			${false} | ${true}  | ${true}
			${true}  | ${false} | ${true}
			${true}  | ${true}  | ${true}
		`('returns $expected when cape is $cape and byrna is $byrna.', ({ cape, byrna, expected }) => {
			items.cape = cape;
			items.byrna = byrna;
			expect(store.canBeInvulnerable).toBe(expected);
		});
	});
	test('ability to swim.', () => {
		items.flippers = false;
		expect(store.canSwim).toBe(false);

		items.flippers = true;
		expect(store.canSwim).toBe(true);
	});
	describe('Ability to lift rocks:', () => {
		test.each`
			glove    | titanMitt    | expected
			${false} | ${false}     | ${false}
			${true}  | ${false}     | ${true}
			${false} | ${true}      | ${true}
			${true}  | ${true}      | ${true}
		`('returns $expected when glove is $glove and titanMitt is $titanMitt', ({ glove, titanMitt, expected }) => {
			items.glove = glove;
			items.titanMitt = titanMitt;
			expect(store.canLiftRocks).toBe(expected);
		});
	});
	test('ability to lift dark rocks.', () => {
		items.titanMitt = false;
		expect(store.canLiftDarkRocks).toBe(false);

		items.titanMitt = true;
		expect(store.canLiftDarkRocks).toBe(true);
	});
	describe('Ability to light torches:', () => {
		test.each`
			fireRod  | lantern  | expected
			${false} | ${false} | ${false}
			${true}  | ${false} | ${true}
			${false} | ${true}  | ${true}
			${true}  | ${true}  | ${true}
		`('returns $expected when fireRod is $fireRod and lantern is $lantern', ({ fireRod, lantern, expected }) => {
			items.fireRod = fireRod;
			items.lantern = lantern;
			expect(store.canLightTorches).toBe(expected);
		});
	});
	describe('Ability to melt things:', () => {
		test.each`
			canActivateMedallions | fireRod  | bombos   | expected
			${true}               | ${true}  | ${true}  | ${true}
			${true}               | ${true}  | ${false} | ${true}
			${true}               | ${false} | ${true}  | ${true}
			${true}               | ${false} | ${false} | ${true}
			${false}              | ${true}  | ${true}  | ${true}
			${false}              | ${true}  | ${false} | ${true}
			${false}              | ${false} | ${true}  | ${true}
			${false}              | ${false} | ${false} | ${false}
		`('returns $expected when canActivateMedallions is $canActivateMedallions and fireRod is $fireRod and bombos is $bombos', ({
            canActivateMedallions,
			fireRod,
			bombos,
			expected,
		}) => {
			jest.spyOn(store, 'canActivateMedallions', 'get').mockReturnValue(canActivateMedallions);
			items.fireRod = fireRod;
			items.bombos = bombos;
			expect(store.canMeltThings).toBe(expected);
		});
	});
	test('ability to fly.', () => {
		items.flute = false;
		expect(store.canFly).toBe(false);

		items.flute = true;
		expect(store.canFly).toBe(true);
	});
	describe('Ability to spin speed:', () => {
		test.each`
			canDash  | hasSwordTier | canGrapple | expected
			${true}  | ${0}         | ${true}    | ${true}
			${true}  | ${0}         | ${false}   | ${false}
			${true}  | ${1}         | ${true}    | ${true}
			${true}  | ${1}         | ${false}   | ${true}
			${true}  | ${2}         | ${true}    | ${true}
			${true}  | ${2}         | ${false}   | ${true}
			${true}  | ${3}         | ${true}    | ${true}
			${true}  | ${3}         | ${false}   | ${true}
			${true}  | ${4}         | ${true}    | ${true}
			${true}  | ${4}         | ${false}   | ${true}
			${false} | ${0}         | ${true}    | ${false}
			${false} | ${0}         | ${false}   | ${false}
			${false} | ${1}         | ${true}    | ${false}
			${false} | ${1}         | ${false}   | ${false}
			${false} | ${2}         | ${true}    | ${false}
			${false} | ${2}         | ${false}   | ${false}
			${false} | ${3}         | ${true}    | ${false}
			${false} | ${3}         | ${false}   | ${false}
			${false} | ${4}         | ${true}    | ${false}
			${false} | ${4}         | ${false}   | ${false}
		`('returns $expected when canDash is $canDash and hasSwordTier is $hasSwordTier and canGrapple is $canGrapple', ({
			canDash,
			hasSwordTier,
			canGrapple,
			expected,
		}) => {
			jest.spyOn(store, 'canDash', 'get').mockReturnValue(canDash);
			jest.spyOn(store, 'hasSwordTier', 'get').mockReturnValue(hasSwordTier);
			jest.spyOn(store, 'canGrapple', 'get').mockReturnValue(canGrapple);

			expect(store.canSpinSpeed).toBe(expected);
		});
	});
	test('ability to shoot arrows.', () => {
		items.bow = false;
		expect(store.canShootArrows).toBe(false);

		items.bow = true;
		expect(store.canShootArrows).toBe(true);
	});
	test('ability to block lazers.', () => {
		items.mirrorShield = false;
		expect(store.canBlockLasers).toBe(false);

		items.mirrorShield = true;
		expect(store.canBlockLasers).toBe(true);
	});
	describe('Ability to extend magic:', () => {
		test.each`
			mpUpgradeTier | mpUpgradeAcquired | bottle   | expected
			${1}          | ${false}          | ${false} | ${false}
			${2}          | ${false}          | ${false} | ${false}
			${3}          | ${false}          | ${false} | ${false}
			${1}          | ${true}           | ${false} | ${false}
			${2}          | ${true}           | ${false} | ${true}
			${3}          | ${true}           | ${false} | ${true}
			${1}          | ${true}           | ${true}  | ${true}
			${1}          | ${false}          | ${true}  | ${true}
			${2}          | ${true}           | ${true}  | ${true}
			${2}          | ${false}          | ${true}  | ${true}
			${3}          | ${true}           | ${true}  | ${true}
			${3}          | ${false}          | ${true}  | ${true}
		`('returns $expected when mpUpgradeTier is $mpUpgradeTier and mpUpgradeAcquired is $mpUpgradeAcquired and bottle is $bottle', ({
			mpUpgradeTier,
			mpUpgradeAcquired,
			bottle,
			expected,
		}) => {
			store.getItemsByGroup = jest.fn().mockReturnValue([{ tier: mpUpgradeTier, acquired: mpUpgradeAcquired }]);
			items.bottle = bottle;

			expect(store.canExtendMagic).toBe(expected);
		});
	});
	describe('Ability to get good bee:', () => {
		test.each`
			net      | bottle   | canDash  | hasSwordTier    | quake    | expected
			${true}  | ${true}  | ${true}  | ${0}            | ${true}  | ${true}
			${true}  | ${true}  | ${true}  | ${0}            | ${false} | ${true}
			${true}  | ${true}  | ${true}  | ${1}            | ${true}  | ${true}
			${true}  | ${true}  | ${true}  | ${1}            | ${false} | ${true}
			${true}  | ${true}  | ${true}  | ${2}            | ${true}  | ${true}
			${true}  | ${true}  | ${true}  | ${2}            | ${false} | ${true}
			${true}  | ${true}  | ${true}  | ${3}            | ${true}  | ${true}
			${true}  | ${true}  | ${true}  | ${3}            | ${false} | ${true}
			${true}  | ${true}  | ${true}  | ${4}            | ${true}  | ${true}
			${true}  | ${true}  | ${true}  | ${4}            | ${false} | ${true}
			${true}  | ${true}  | ${false} | ${0}            | ${true}  | ${false}
			${true}  | ${true}  | ${false} | ${1}            | ${true}  | ${true}
			${true}  | ${true}  | ${false} | ${2}            | ${true}  | ${true}
			${true}  | ${true}  | ${false} | ${3}            | ${true}  | ${true}
			${true}  | ${true}  | ${false} | ${4}            | ${true}  | ${true}
			${true}  | ${true}  | ${false} | ${0}            | ${false} | ${false}
			${true}  | ${true}  | ${false} | ${1}            | ${false} | ${false}
			${true}  | ${true}  | ${false} | ${2}            | ${false} | ${false}
			${true}  | ${true}  | ${false} | ${3}            | ${false} | ${false}
			${true}  | ${true}  | ${false} | ${4}            | ${false} | ${false}
			${true}  | ${false} | ${true}  | ${0}            | ${true}  | ${false}
			${true}  | ${false} | ${true}  | ${0}            | ${false} | ${false}
			${true}  | ${false} | ${true}  | ${1}            | ${true}  | ${false}
			${true}  | ${false} | ${true}  | ${1}            | ${false} | ${false}
			${true}  | ${false} | ${true}  | ${2}            | ${true}  | ${false}
			${true}  | ${false} | ${true}  | ${2}            | ${false} | ${false}
			${true}  | ${false} | ${true}  | ${3}            | ${true}  | ${false}
			${true}  | ${false} | ${true}  | ${3}            | ${false} | ${false}
			${true}  | ${false} | ${true}  | ${4}            | ${true}  | ${false}
			${true}  | ${false} | ${true}  | ${4}            | ${false} | ${false}
			${true}  | ${false} | ${false} | ${0}            | ${true}  | ${false}
			${true}  | ${false} | ${false} | ${0}            | ${false} | ${false}
			${true}  | ${false} | ${false} | ${1}            | ${true}  | ${false}
			${true}  | ${false} | ${false} | ${1}            | ${false} | ${false}
			${true}  | ${false} | ${false} | ${2}            | ${true}  | ${false}
			${true}  | ${false} | ${false} | ${2}            | ${false} | ${false}
			${true}  | ${false} | ${false} | ${3}            | ${true}  | ${false}
			${true}  | ${false} | ${false} | ${3}            | ${false} | ${false}
			${true}  | ${false} | ${false} | ${4}            | ${true}  | ${false}
			${true}  | ${false} | ${false} | ${4}            | ${false} | ${false}
			${false} | ${true}  | ${true}  | ${0}            | ${true}  | ${false}
			${false} | ${true}  | ${true}  | ${0}            | ${false} | ${false}
			${false} | ${true}  | ${true}  | ${1}            | ${true}  | ${false}
			${false} | ${true}  | ${true}  | ${1}            | ${false} | ${false}
			${false} | ${true}  | ${true}  | ${2}            | ${true}  | ${false}
			${false} | ${true}  | ${true}  | ${2}            | ${false} | ${false}
			${false} | ${true}  | ${true}  | ${3}            | ${true}  | ${false}
			${false} | ${true}  | ${true}  | ${3}            | ${false} | ${false}
			${false} | ${true}  | ${true}  | ${4}            | ${true}  | ${false}
			${false} | ${true}  | ${true}  | ${4}            | ${false} | ${false}
			${false} | ${true}  | ${false} | ${0}            | ${true}  | ${false}
			${false} | ${true}  | ${false} | ${0}            | ${false} | ${false}
			${false} | ${true}  | ${false} | ${1}            | ${true}  | ${false}
			${false} | ${true}  | ${false} | ${1}            | ${false} | ${false}
			${false} | ${true}  | ${false} | ${2}            | ${true}  | ${false}
			${false} | ${true}  | ${false} | ${2}            | ${false} | ${false}
			${false} | ${true}  | ${false} | ${3}            | ${true}  | ${false}
			${false} | ${true}  | ${false} | ${3}            | ${false} | ${false}
			${false} | ${true}  | ${false} | ${4}            | ${true}  | ${false}
			${false} | ${true}  | ${false} | ${4}            | ${false} | ${false}
			${false} | ${false} | ${true}  | ${0}            | ${true}  | ${false}
			${false} | ${false} | ${true}  | ${0}            | ${false} | ${false}
			${false} | ${false} | ${true}  | ${1}            | ${true}  | ${false}
			${false} | ${false} | ${true}  | ${1}            | ${false} | ${false}
			${false} | ${false} | ${true}  | ${2}            | ${true}  | ${false}
			${false} | ${false} | ${true}  | ${2}            | ${false} | ${false}
			${false} | ${false} | ${true}  | ${3}            | ${true}  | ${false}
			${false} | ${false} | ${true}  | ${3}            | ${false} | ${false}
			${false} | ${false} | ${true}  | ${4}            | ${true}  | ${false}
			${false} | ${false} | ${true}  | ${4}            | ${false} | ${false}
			${false} | ${false} | ${false} | ${0}            | ${true}  | ${false}
			${false} | ${false} | ${false} | ${0}            | ${false} | ${false}
			${false} | ${false} | ${false} | ${1}            | ${true}  | ${false}
			${false} | ${false} | ${false} | ${1}            | ${false} | ${false}
			${false} | ${false} | ${false} | ${2}            | ${true}  | ${false}
			${false} | ${false} | ${false} | ${2}            | ${false} | ${false}
			${false} | ${false} | ${false} | ${3}            | ${true}  | ${false}
			${false} | ${false} | ${false} | ${3}            | ${false} | ${false}
			${false} | ${false} | ${false} | ${4}            | ${true}  | ${false}
			${false} | ${false} | ${false} | ${4}            | ${false} | ${false}
		`('returns $expected when net is $net and bottle is $bottle and canDash is $canDash and hasSwordTier is $hasSwordTier and quake is $quake.', ({
			net,
			bottle,
			canDash,
			hasSwordTier,
			quake,
			expected,
		}) => {
			items.net = net;
			items.bottle = bottle;
			items.quake = quake;
			jest.spyOn(store, 'canDash', 'get').mockReturnValue(canDash);
			jest.spyOn(store, 'hasSwordTier', 'get').mockReturnValue(hasSwordTier);

			expect(store.canGetGoodBee).toBe(expected);
		});
	});
	describe('Possible to be glitched Link in Dark World:', () => {
		test.each`
			moonPearl | bottle | expected
			${true} | ${true} | ${true}
			${true} | ${false} | ${true}
			${false} | ${true} | ${true}
			${false} | ${false} | ${false}
		`('returns $expected when moonPearl is $moonPearl and bottle is $bottle.', ({ moonPearl, bottle, expected }) => {
			items.moonPearl = moonPearl;
			items.bottle = bottle;

			expect(store.glitchedLinkInDarkWorld).toBe(expected);
		});
	});
	describe('Ability to defeat Agahnim:', () => {
		test.each`
			agahnim  | cape     | hasSwordTier | lantern  | expected
			${true}  | ${true}  | ${0}         | ${true}  | ${false}
			${true}  | ${true}  | ${0}         | ${false} | ${false}
			${true}  | ${true}  | ${1}         | ${true}  | ${false}
			${true}  | ${true}  | ${1}         | ${false} | ${false}
			${true}  | ${true}  | ${2}         | ${true}  | ${false}
			${true}  | ${true}  | ${2}         | ${false} | ${false}
			${true}  | ${true}  | ${3}         | ${true}  | ${false}
			${true}  | ${true}  | ${3}         | ${false} | ${false}
			${true}  | ${true}  | ${4}         | ${true}  | ${false}
			${true}  | ${true}  | ${4}         | ${false} | ${false}
			${true}  | ${false} | ${0}         | ${true}  | ${false}
			${true}  | ${false} | ${0}         | ${false} | ${false}
			${true}  | ${false} | ${1}         | ${true}  | ${false}
			${true}  | ${false} | ${1}         | ${false} | ${false}
			${true}  | ${false} | ${2}         | ${true}  | ${false}
			${true}  | ${false} | ${2}         | ${false} | ${false}
			${true}  | ${false} | ${3}         | ${true}  | ${false}
			${true}  | ${false} | ${3}         | ${false} | ${false}
			${true}  | ${false} | ${4}         | ${true}  | ${false}
			${true}  | ${false} | ${4}         | ${false} | ${false}
			${false} | ${true}  | ${0}         | ${true}  | ${false}
			${false} | ${true}  | ${0}         | ${false} | ${false}
			${false} | ${true}  | ${1}         | ${true}  | ${true}
			${false} | ${true}  | ${1}         | ${false} | ${false}
			${false} | ${true}  | ${2}         | ${true}  | ${true}
			${false} | ${true}  | ${2}         | ${false} | ${false}
			${false} | ${true}  | ${3}         | ${true}  | ${true}
			${false} | ${true}  | ${3}         | ${false} | ${false}
			${false} | ${true}  | ${4}         | ${true}  | ${true}
			${false} | ${true}  | ${4}         | ${false} | ${false}
			${false} | ${false} | ${0}         | ${true}  | ${false}
			${false} | ${false} | ${0}         | ${false} | ${false}
			${false} | ${false} | ${1}         | ${true}  | ${false}
			${false} | ${false} | ${1}         | ${false} | ${false}
			${false} | ${false} | ${2}         | ${true}  | ${true}
			${false} | ${false} | ${2}         | ${false} | ${false}
			${false} | ${false} | ${3}         | ${true}  | ${true}
			${false} | ${false} | ${3}         | ${false} | ${false}
			${false} | ${false} | ${4}         | ${true}  | ${true}
			${false} | ${false} | ${4}         | ${false} | ${false}
		`('returns $expected when agahnim is $agahnim and cape is $cape and hasSwordTier is $hasSwordTier and lantern is $lantern.', ({
			agahnim,
			cape,
			hasSwordTier,
			lantern,
			expected,
           }) => {
			items.agahnim = agahnim;
			items.cape = cape;
			items.lantern = lantern;
			jest.spyOn(store, 'hasSwordTier', 'get').mockReturnValue(hasSwordTier);

			expect(store.canDefeatAgahnim()).toBe(expected);
		});
	});
});
