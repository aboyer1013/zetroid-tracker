// The tagged template literal throws eslint indents off bad. Best to just disable it.
/* eslint indent: 'off' */
import AbilitiesStore from '~/Abilities.store';
import { itemList, applyItemLoadout } from '~/utilities/testHelpers';

describe('Ability to enter west Death Mountain:', () => {
	const items = applyItemLoadout(itemList);
	const mockHasItem = jest.fn().mockImplementation(name => items[name]);
	const store = AbilitiesStore.create({
		id: '1',
		config: '2',
	});

	store.hasItem = mockHasItem;
	test.each`
		canFly | canLiftRocks | lantern | canAccessDeathMountainPortal | expected
		${false} | ${false} | ${false} | ${true} | ${true}
		${false} | ${false} | ${false} | ${false} | ${false}
		${true} | ${false} | ${false} | ${true} | ${true}
		${true} | ${false} | ${false} | ${false} | ${true}
		${false} | ${false} | ${true} | ${true} | ${true}
		${false} | ${false} | ${true} | ${false} | ${false}
		${true} | ${false} | ${true} | ${true} | ${true}
		${true} | ${false} | ${true} | ${false} | ${true}
		${false} | ${true} | ${false} | ${true} | ${true}
		${false} | ${true} | ${false} | ${false} | ${false}
		${true} | ${true} | ${false} | ${true} | ${true}
		${true} | ${true} | ${false} | ${false} | ${true}
		${false} | ${true} | ${true} | ${true} | ${true}
		${false} | ${true} | ${true} | ${false} | ${true}
		${true} | ${true} | ${true} | ${true} | ${true}
		${true} | ${true} | ${true} | ${false} | ${true}
	`('returns $expected when canFly is $canFly and canLiftRocks is $canLiftRocks and lantern is $lantern and canAccessDeathMountainPortal is $canAccessDeathMountainPortal', ({
		canFly,
		canLiftRocks,
		lantern,
		canAccessDeathMountainPortal,
		expected,
	}) => {
		items.lantern = lantern;
		jest.spyOn(store, 'canFly', 'get').mockReturnValue(canFly);
		jest.spyOn(store, 'canLiftRocks', 'get').mockReturnValue(canLiftRocks);
		store.canAccessDeathMountainPortal = jest.fn().mockReturnValue(canAccessDeathMountainPortal);

		expect(store.canEnterWestDeathMountain()).toBe(expected);
	});
});
