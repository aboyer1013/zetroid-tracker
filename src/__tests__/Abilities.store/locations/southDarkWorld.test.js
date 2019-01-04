// The tagged template literal throws eslint indents off bad. Best to just disable it.
/* eslint indent: 'off' */
import AbilitiesStore from '~/Abilities.store';
import { itemList, applyItemLoadout } from '~/utilities/testHelpers';

describe('Ability to enter south Dark World:', () => {
	const items = applyItemLoadout(itemList);
	const mockHasItem = jest.fn().mockImplementation(name => items[name]);
	const store = AbilitiesStore.create({
		id: '1',
		config: '2',
	});

	store.hasItem = mockHasItem;
	test.each`
		canLiftRocks | moonPearl | canLiftDarkRocks | hammer | canEnterNorthEastDarkWorld | canGrapple | canSwim | expected
		${true} | ${false} | ${true} | ${true} | ${true} | ${true} | ${true} | ${false}
		${true} | ${false} | ${true} | ${true} | ${true} | ${true} | ${false} | ${false}
		${true} | ${false} | ${true} | ${true} | ${true} | ${false} | ${true} | ${false}
		${true} | ${false} | ${true} | ${true} | ${true} | ${false} | ${false} | ${false}
		${true} | ${false} | ${true} | ${true} | ${false} | ${true} | ${true} | ${false}
		${true} | ${false} | ${true} | ${true} | ${false} | ${true} | ${false} | ${false}
		${true} | ${false} | ${true} | ${true} | ${false} | ${false} | ${true} | ${false}
		${true} | ${false} | ${true} | ${true} | ${false} | ${false} | ${false} | ${false}
		${true} | ${false} | ${true} | ${false} | ${true} | ${true} | ${true} | ${false}
		${true} | ${false} | ${true} | ${false} | ${true} | ${true} | ${false} | ${false}
		${true} | ${false} | ${true} | ${false} | ${true} | ${false} | ${true} | ${false}
		${true} | ${false} | ${true} | ${false} | ${true} | ${false} | ${false} | ${false}
		${true} | ${false} | ${true} | ${false} | ${false} | ${true} | ${true} | ${false}
		${true} | ${false} | ${true} | ${false} | ${false} | ${true} | ${false} | ${false}
		${true} | ${false} | ${true} | ${false} | ${false} | ${false} | ${true} | ${false}
		${true} | ${false} | ${true} | ${false} | ${false} | ${false} | ${false} | ${false}
		${true} | ${false} | ${false} | ${true} | ${true} | ${true} | ${true} | ${false}
		${true} | ${false} | ${false} | ${true} | ${true} | ${true} | ${false} | ${false}
		${true} | ${false} | ${false} | ${true} | ${true} | ${false} | ${true} | ${false}
		${true} | ${false} | ${false} | ${true} | ${true} | ${false} | ${false} | ${false}
		${true} | ${false} | ${false} | ${true} | ${false} | ${true} | ${true} | ${false}
		${true} | ${false} | ${false} | ${true} | ${false} | ${true} | ${false} | ${false}
		${true} | ${false} | ${false} | ${true} | ${false} | ${false} | ${true} | ${false}
		${true} | ${false} | ${false} | ${true} | ${false} | ${false} | ${false} | ${false}
		${true} | ${false} | ${false} | ${false} | ${true} | ${true} | ${true} | ${false}
		${true} | ${false} | ${false} | ${false} | ${true} | ${true} | ${false} | ${false}
		${true} | ${false} | ${false} | ${false} | ${true} | ${false} | ${true} | ${false}
		${true} | ${false} | ${false} | ${false} | ${true} | ${false} | ${false} | ${false}
		${true} | ${false} | ${false} | ${false} | ${false} | ${true} | ${true} | ${false}
		${true} | ${false} | ${false} | ${false} | ${false} | ${true} | ${false} | ${false}
		${true} | ${false} | ${false} | ${false} | ${false} | ${false} | ${true} | ${false}
		${true} | ${false} | ${false} | ${false} | ${false} | ${false} | ${false} | ${false}
		${false} | ${false} | ${true} | ${true} | ${true} | ${true} | ${true} | ${false}
		${false} | ${false} | ${true} | ${true} | ${true} | ${true} | ${false} | ${false}
		${false} | ${false} | ${true} | ${true} | ${true} | ${false} | ${true} | ${false}
		${false} | ${false} | ${true} | ${true} | ${true} | ${false} | ${false} | ${false}
		${false} | ${false} | ${true} | ${true} | ${false} | ${true} | ${true} | ${false}
		${false} | ${false} | ${true} | ${true} | ${false} | ${true} | ${false} | ${false}
		${false} | ${false} | ${true} | ${true} | ${false} | ${false} | ${true} | ${false}
		${false} | ${false} | ${true} | ${true} | ${false} | ${false} | ${false} | ${false}
		${false} | ${false} | ${true} | ${false} | ${true} | ${true} | ${true} | ${false}
		${false} | ${false} | ${true} | ${false} | ${true} | ${true} | ${false} | ${false}
		${false} | ${false} | ${true} | ${false} | ${true} | ${false} | ${true} | ${false}
		${false} | ${false} | ${true} | ${false} | ${true} | ${false} | ${false} | ${false}
		${false} | ${false} | ${true} | ${false} | ${false} | ${true} | ${true} | ${false}
		${false} | ${false} | ${true} | ${false} | ${false} | ${true} | ${false} | ${false}
		${false} | ${false} | ${true} | ${false} | ${false} | ${false} | ${true} | ${false}
		${false} | ${false} | ${true} | ${false} | ${false} | ${false} | ${false} | ${false}
		${false} | ${false} | ${false} | ${true} | ${true} | ${true} | ${true} | ${false}
		${false} | ${false} | ${false} | ${true} | ${true} | ${true} | ${false} | ${false}
		${false} | ${false} | ${false} | ${true} | ${true} | ${false} | ${true} | ${false}
		${false} | ${false} | ${false} | ${true} | ${true} | ${false} | ${false} | ${false}
		${false} | ${false} | ${false} | ${true} | ${false} | ${true} | ${true} | ${false}
		${false} | ${false} | ${false} | ${true} | ${false} | ${true} | ${false} | ${false}
		${false} | ${false} | ${false} | ${true} | ${false} | ${false} | ${true} | ${false}
		${false} | ${false} | ${false} | ${true} | ${false} | ${false} | ${false} | ${false}
		${false} | ${false} | ${false} | ${false} | ${true} | ${true} | ${true} | ${false}
		${false} | ${false} | ${false} | ${false} | ${true} | ${true} | ${false} | ${false}
		${false} | ${false} | ${false} | ${false} | ${true} | ${false} | ${true} | ${false}
		${false} | ${false} | ${false} | ${false} | ${true} | ${false} | ${false} | ${false}
		${false} | ${false} | ${false} | ${false} | ${false} | ${true} | ${true} | ${false}
		${false} | ${false} | ${false} | ${false} | ${false} | ${true} | ${false} | ${false}
		${false} | ${false} | ${false} | ${false} | ${false} | ${false} | ${true} | ${false}
		${false} | ${false} | ${false} | ${false} | ${false} | ${false} | ${false} | ${false}
		${false} | ${true} | ${false} | ${false} | ${false} | ${false} | ${true} | ${false}
		${false} | ${true} | ${false} | ${false} | ${false} | ${false} | ${false} | ${false}
		${false} | ${true} | ${false} | ${false} | ${false} | ${true} | ${true} | ${false}
		${false} | ${true} | ${false} | ${false} | ${false} | ${true} | ${false} | ${false}
		${true} | ${true} | ${false} | ${false} | ${false} | ${false} | ${true} | ${false}
		${true} | ${true} | ${false} | ${false} | ${false} | ${false} | ${false} | ${false}
		${true} | ${true} | ${false} | ${false} | ${false} | ${true} | ${true} | ${false}
		${true} | ${true} | ${false} | ${false} | ${false} | ${true} | ${false} | ${false}
		${false} | ${true} | ${false} | ${true} | ${false} | ${false} | ${true} | ${false}
		${false} | ${true} | ${false} | ${true} | ${false} | ${false} | ${false} | ${false}
		${false} | ${true} | ${false} | ${true} | ${false} | ${true} | ${true} | ${false}
		${false} | ${true} | ${false} | ${true} | ${false} | ${true} | ${false} | ${false}
		${true} | ${true} | ${false} | ${true} | ${false} | ${true} | ${true} | ${true}
		${true} | ${true} | ${false} | ${true} | ${false} | ${true} | ${false} | ${true}
		${true} | ${true} | ${false} | ${true} | ${false} | ${false} | ${true} | ${true}
		${true} | ${true} | ${false} | ${true} | ${false} | ${false} | ${false} | ${true}
		${false} | ${true} | ${false} | ${false} | ${true} | ${false} | ${true} | ${false}
		${false} | ${true} | ${false} | ${false} | ${true} | ${false} | ${false} | ${false}
		${true} | ${true} | ${false} | ${false} | ${true} | ${false} | ${true} | ${false}
		${true} | ${true} | ${false} | ${false} | ${true} | ${false} | ${false} | ${false}
		${false} | ${true} | ${false} | ${false} | ${true} | ${true} | ${true} | ${true}
		${false} | ${true} | ${false} | ${false} | ${true} | ${true} | ${false} | ${false}
		${true} | ${true} | ${false} | ${false} | ${true} | ${true} | ${true} | ${true}
		${true} | ${true} | ${false} | ${false} | ${true} | ${true} | ${false} | ${true}
		${false} | ${true} | ${false} | ${true} | ${true} | ${false} | ${true} | ${true}
		${false} | ${true} | ${false} | ${true} | ${true} | ${false} | ${false} | ${true}
		${false} | ${true} | ${false} | ${true} | ${true} | ${true} | ${true} | ${true}
		${false} | ${true} | ${false} | ${true} | ${true} | ${true} | ${false} | ${true}
		${true} | ${true} | ${false} | ${true} | ${true} | ${true} | ${true} | ${true}
		${true} | ${true} | ${false} | ${true} | ${true} | ${true} | ${false} | ${true}
		${true} | ${true} | ${false} | ${true} | ${true} | ${false} | ${true} | ${true}
		${true} | ${true} | ${false} | ${true} | ${true} | ${false} | ${false} | ${true}
		${true} | ${true} | ${true} | ${true} | ${true} | ${true} | ${true} | ${true}
		${true} | ${true} | ${true} | ${true} | ${true} | ${true} | ${false} | ${true}
		${true} | ${true} | ${true} | ${true} | ${true} | ${false} | ${true} | ${true}
		${true} | ${true} | ${true} | ${true} | ${true} | ${false} | ${false} | ${true}
		${true} | ${true} | ${true} | ${true} | ${false} | ${true} | ${true} | ${true}
		${true} | ${true} | ${true} | ${true} | ${false} | ${true} | ${false} | ${true}
		${true} | ${true} | ${true} | ${true} | ${false} | ${false} | ${true} | ${true}
		${true} | ${true} | ${true} | ${true} | ${false} | ${false} | ${false} | ${true}
		${true} | ${true} | ${true} | ${false} | ${true} | ${true} | ${true} | ${true}
		${true} | ${true} | ${true} | ${false} | ${true} | ${true} | ${false} | ${true}
		${true} | ${true} | ${true} | ${false} | ${true} | ${false} | ${true} | ${true}
		${true} | ${true} | ${true} | ${false} | ${true} | ${false} | ${false} | ${true}
		${true} | ${true} | ${true} | ${false} | ${false} | ${true} | ${true} | ${true}
		${true} | ${true} | ${true} | ${false} | ${false} | ${true} | ${false} | ${true}
		${true} | ${true} | ${true} | ${false} | ${false} | ${false} | ${true} | ${true}
		${true} | ${true} | ${true} | ${false} | ${false} | ${false} | ${false} | ${true}
		${false} | ${true} | ${true} | ${true} | ${true} | ${true} | ${true} | ${true}
		${false} | ${true} | ${true} | ${true} | ${true} | ${true} | ${false} | ${true}
		${false} | ${true} | ${true} | ${true} | ${true} | ${false} | ${true} | ${true}
		${false} | ${true} | ${true} | ${true} | ${true} | ${false} | ${false} | ${true}
		${false} | ${true} | ${true} | ${true} | ${false} | ${true} | ${true} | ${true}
		${false} | ${true} | ${true} | ${true} | ${false} | ${true} | ${false} | ${true}
		${false} | ${true} | ${true} | ${true} | ${false} | ${false} | ${true} | ${true}
		${false} | ${true} | ${true} | ${true} | ${false} | ${false} | ${false} | ${true}
		${false} | ${true} | ${true} | ${false} | ${true} | ${true} | ${true} | ${true}
		${false} | ${true} | ${true} | ${false} | ${true} | ${true} | ${false} | ${true}
		${false} | ${true} | ${true} | ${false} | ${true} | ${false} | ${true} | ${true}
		${false} | ${true} | ${true} | ${false} | ${true} | ${false} | ${false} | ${true}
		${false} | ${true} | ${true} | ${false} | ${false} | ${true} | ${true} | ${true}
		${false} | ${true} | ${true} | ${false} | ${false} | ${true} | ${false} | ${true}
		${false} | ${true} | ${true} | ${false} | ${false} | ${false} | ${true} | ${true}
		${false} | ${true} | ${true} | ${false} | ${false} | ${false} | ${false} | ${true}
	`('returns $expected when canLiftRocks is $canLiftRocks and moonPearl is $moonPearl and canLiftDarkRocks is $canLiftDarkRocks and hammer is $hammer and canEnterNorthEastDarkWorld is $canEnterNorthEastDarkWorld and canGrapple is $canGrapple and canSwim is $canSwim.', ({
		canLiftRocks,
		moonPearl,
		canLiftDarkRocks,
		hammer,
		canEnterNorthEastDarkWorld,
		canGrapple,
		canSwim,
		expected,
	}) => {
		items.moonPearl = moonPearl;
		items.hammer = hammer;
		jest.spyOn(store, 'canLiftDarkRocks', 'get').mockReturnValue(canLiftDarkRocks);
		jest.spyOn(store, 'canLiftRocks', 'get').mockReturnValue(canLiftRocks);
		jest.spyOn(store, 'canGrapple', 'get').mockReturnValue(canGrapple);
		jest.spyOn(store, 'canSwim', 'get').mockReturnValue(canSwim);
		store.canEnterNorthEastDarkWorld = jest.fn().mockReturnValue(canEnterNorthEastDarkWorld);

		expect(store.canEnterSouthDarkWorld()).toBe(expected);
	});
});
