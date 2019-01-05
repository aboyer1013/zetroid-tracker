import { types } from 'mobx-state-tree';

const LogicBeatability = types.model().volatile((self) => {
	return {
		// AKA canHurtBoss
		beatability: {
			lanmolas: () => {
				const abl = self.abilities;

				return (
					abl.hasSwordTier >= 1
					|| abl.hasItem('hammer')
					|| abl.hasItem('bow')
					|| abl.hasItem('fireRod')
					|| abl.hasItem('iceRod')
					|| abl.hasItem('byrna')
					|| abl.hasItem('somaria')
				);
			},
			blindTheThief: () => {
				const abl = self.abilities;

				return (
					abl.hasSwordTier >= 1
					|| abl.hasItem('hammer')
					|| abl.hasItem('somaria')
					|| abl.hasItem('byrna')
				);
			},
		},
	};
});

export default LogicBeatability;
