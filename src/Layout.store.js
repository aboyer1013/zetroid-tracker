import { types } from 'mobx-state-tree';

const LayoutStore = types
	.model({
		id: types.identifier,
	})
	.views(self => ({
		get json() {
			return {
				'global': {},
				'layout': {
					'type': 'row',
					'id': '#4',
					'children': [
						{
							'type': 'row',
							'id': '#11',
							'weight': 25,
							'children': [
								{
									'type': 'row',
									'id': '#23',
									'weight': 25,
									'children': [
										{
											'type': 'tabset',
											'id': '#22',
											'weight': 50,
											'children': [
												{
													'type': 'tab',
													'id': '#24',
													'name': 'Light World',
													'component': 'Map',
													'config': {
														mapName: 'zelda3-lw',
													},
													'enableClose': true
												}
											],
											'active': true
										},
										{
											'type': 'tabset',
											'id': '#10',
											'weight': 50,
											'children': [
												{
													'type': 'tab',
													'id': '#6',
													'name': 'Dark World',
													'component': 'Map',
													'mapName': 'zelda3-dw',
													'config': {
														'id': '1'
													}
												}
											]
										}
									]
								},
								{
									'type': 'tabset',
									'id': '#70',
									'weight': 5,
									'children': [
										{
											'type': 'tab',
											'id': '#1',
											'name': 'Location Details',
											'component': 'LocationDetail',
											'config': {
												'id': '1'
											},
											'enableClose': false
										}
									]
								}
							]
						}
					]
				},
				'borders': [
					{
						'type': 'border',
						'size': 257,
						'location': 'left',
						'children': [
							{
								'type': 'tab',
								'id': '#3',
								'name': 'Item List',
								'component': 'grid',
								'config': {
									'id': '1'
								},
								'enableClose': true
							},
							{
								'type': 'tab',
								'id': '#2',
								'name': 'Boss List',
								'component': 'grid',
								'config': {
									'id': '1'
								},
								'enableClose': true
							}
						]
					},
					{
						'type': 'border',
						'location': 'right',
						'children': []
					},
					{
						'type': 'border',
						'location': 'bottom',
						'children': []
					}
				]
			};
		}
	}))
;

export default LayoutStore;
