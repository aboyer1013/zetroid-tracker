import { types } from 'mobx-state-tree';
import LogicLightWorldAvailability from '~/logic/availability/LogicLightWorldAvailability';
import LogicDarkWorldAvailability from '~/logic/availability/LogicDarkWorldAvailability';
import LogicDungeonAvailability from '~/logic/availability/LogicDungeonAvailability';

/*
=== DUNGEONS ONLY ===
location.dungeon:
	Only checks if you can enter the dungeon.
	You may not be able to do collect anything inside, but you can at least enter.
	AKA "canGetChest"

location[BOSS_NAME]:
	If you are able to enter the dungeon and have the ability to kill the boss.
	You could still not have the ability to open any chests.
	AKA "isBeatable"
*/

const LogicAvailability = types.compose(
	LogicLightWorldAvailability,
	LogicDarkWorldAvailability,
	LogicDungeonAvailability,
	types.model(),
)
	.volatile((self) => {
		return {
			availability: {
				...self.lightWorldAvailability,
				...self.darkWorldAvailability,
				...self.dungeonAvailability,
			},
		};
	});

export default LogicAvailability;
