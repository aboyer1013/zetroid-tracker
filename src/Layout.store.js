import { types, getRoot } from 'mobx-state-tree';
import { pick, isEmpty } from 'lodash';

const LayoutStore = types
	.model({
		id: types.identifier,
		enableEdgeDock: true,
		tabEnableClose: true,
		tabEnableDrag: true,
		tabEnableRename: false,
		tabClassName: types.maybeNull(types.string),
		tabIcon: types.maybeNull(types.string),
		tabEnableRenderOnDemand: true,
		tabDragSpeed: 0.3,
		tabSetEnableDeleteWhenEmpty: true,
		tabSetEnableDrop: true,
		tabSetEnableDrag: true,
		tabSetEnableDivide: true,
		tabSetEnableMaximize: true,
		tabSetClassNameTabStrip: types.maybeNull(types.string),
		tabSetClassNameHeader: types.maybeNull(types.string),
		tabSetEnableTabStrip: true,
		tabSetHeaderHeight: 30,
		tabSetTabStripHeight: 35,
		borderBarSize: 40,
		borderEnableDrop: true,
		borderClassName: types.maybeNull(types.string),
		showBorderTop: true,
		showBorderRight: true,
		showBorderBottom: true,
		showBorderLeft: true,
	})
	.volatile(() => ({
		layoutPresets: {
			zelda3: {
				current: {},
				DEV_TOOLS: {
					global: {
						splitterSize: 10,
						tabEnableRename: false,
						tabClassName: null,
						tabIcon: null,
						tabSetClassNameTabStrip: null,
						tabSetClassNameHeader: null,
						tabSetHeaderHeight: 30,
						tabSetTabStripHeight: 35,
						borderBarSize: 40,
						borderClassName: null,
					},
					layout: {
						type: 'row',
						id: '#4',
						children: [
							{
								type: 'row',
								id: '#32',
								weight: 9.082397003745319,
								children: [
									{
										type: 'tabset',
										id: '#15',
										weight: 41.1144578313253,
										children: [
											{
												type: 'tab',
												id: '#3',
												name: 'Items',
												component: 'ItemList',
												config: {},
												enableClose: false,
											},
										],
									},
									{
										type: 'tabset',
										id: '#31',
										weight: 58.8855421686747,
										children: [
											{
												type: 'tab',
												id: '#2',
												name: 'Dungeons',
												component: 'ItemList',
												config: {
													listType: 'dungeon',
												},
												enableClose: false,
											},
										],
										active: true,
									},
								],
							},
							{
								type: 'row',
								id: '#23',
								weight: 24.25093632958802,
								children: [
									{
										type: 'tabset',
										id: '#22',
										weight: 65.36164424263319,
										children: [
											{
												type: 'tab',
												id: '#24',
												name: 'Light World',
												component: 'Map',
												config: {
													mapName: 'zelda3-lw',
												},
												enableClose: false,
											},
											{
												type: 'tab',
												id: '#6',
												name: 'Dark World',
												component: 'Map',
												config: {
													mapName: 'zelda3-dw',
												},
												enableClose: false,
											},
										],
									},
									{
										type: 'tabset',
										id: '#27',
										weight: 21.874801540499348,
										children: [
											{
												type: 'tab',
												id: '#1',
												name: 'Details',
												component: 'LocationDetail',
												config: {
													id: '1',
												},
												enableClose: false,
											},
										],
									},
								],
							},
						],
					},
					borders: [
						{
							type: 'border',
							size: 257,
							show: false,
							location: 'left',
							children: [],
						},
						{
							type: 'border',
							show: false,
							location: 'right',
							children: [],
						},
						{
							type: 'border',
							show: false,
							location: 'bottom',
							children: [],
						},
						{
							type: 'border',
							show: false,
							location: 'top',
							children: [],
						},
					],
				},
				STANDARD: {
					global: {},
					layout: {
						type: 'row',
						id: '#4',
						children: [
							{
								type: 'row',
								id: '#11',
								weight: 25,
								children: [
									{
										type: 'row',
										id: '#23',
										weight: 25,
										children: [
											{
												type: 'tabset',
												id: '#22',
												weight: 50,
												children: [
													{
														type: 'tab',
														id: '#24',
														name: 'Light World',
														component: 'Map',
														config: {
															mapName: 'zelda3-lw',
														},
														enableClose: false,
													},
												],
												active: true,
											},
											{
												type: 'tabset',
												id: '#10',
												weight: 50,
												children: [
													{
														type: 'tab',
														id: '#6',
														name: 'Dark World',
														component: 'Map',
														mapName: 'zelda3-dw',
														config: {
															mapName: 'zelda3-dw',
														},
														enableClose: false,
													},
												],
											},
										],
									},
									{
										type: 'tabset',
										id: '#70',
										weight: 5,
										children: [
											{
												type: 'tab',
												id: '#1',
												name: 'Details',
												component: 'LocationDetail',
												config: {
													id: '1',
												},
												enableClose: false,
											},
										],
									},
								],
							},
						],
					},
					borders: [
						{
							type: 'border',
							size: 257,
							location: 'left',
							children: [
								{
									type: 'tab',
									id: '#3',
									name: 'Items',
									component: 'ItemList',
									config: {},
									enableClose: false,
								},
								{
									type: 'tab',
									id: '#2',
									name: 'Dungeons',
									component: 'ItemList',
									config: {
										listType: 'dungeon',
									},
									enableClose: false,
								},
							],
						},
						{
							type: 'border',
							location: 'right',
							show: true,
							children: [],
						},
						{
							type: 'border',
							location: 'bottom',
							children: [],
						},
						{
							type: 'border',
							location: 'top',
							show: false,
							children: [],
						},
					],
				},
			},
		},
	}))
	.views(self => ({
		get splitterSize() {
			return getRoot(self).configStore.splitterSize || 10;
		},
		get globalConfig() {
			const attrs = [
				'splitterSize',
				'enableEdgeDock',
				'tabEnableClose',
				'tabEnableDrag',
				'tabEnableRename',
				'tabClassName',
				'tabIcon',
				'tabEnableRenderOnDemand',
				'tabDragSpeed',
				'tabSetEnableDeleteWhenEmpty',
				'tabSetEnableDrop',
				'tabSetEnableDrag',
				'tabSetEnableDivide',
				'tabSetEnableMaximize',
				'tabSetClassNameTabStrip',
				'tabSetClassNameHeader',
				'tabSetEnableTabStrip',
				'tabSetHeaderHeight',
				'tabSetTabStripHeight',
				'borderBarSize',
				'borderEnableDrop',
				'borderClassName',
			];

			return pick(self, attrs);
		},
		get json() {
			let result;
			const root = getRoot(self);

			result = root.getGameStorage('layout');
			if (isEmpty(result)) {
				// result = self.layoutPresets[root.selectedGame.name].STANDARD;
				result = self.layoutPresets[root.selectedGame.name].DEV_TOOLS;
			}
			result = self.normalize(result);
			return result;
		},
	}))
	.actions((self) => {
		const saveToLocalStorage = (data) => {
			getRoot(self).updateGameLayoutStorage(data);
		};
		const normalize = (json) => {
			const globalConfig = Object.assign({}, json.global, self.globalConfig);

			json.global = globalConfig;
			return json;
		};
		const toggleBorder = (borderName) => {
			self[`showBorder${borderName}`] = !self[`showBorder${borderName}`];
		};

		return {
			saveToLocalStorage,
			normalize,
			toggleBorder,
		};
	});
export default LayoutStore;
