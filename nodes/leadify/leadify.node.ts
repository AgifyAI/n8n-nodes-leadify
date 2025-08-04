import { INodeType, INodeTypeDescription, NodeConnectionType } from 'n8n-workflow';

export class Leadify implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Leadify',
		name: 'leadify',
		icon: 'file:leadify-logo.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Interact with Leadify API to manage leads',
		defaults: {
			name: 'Leadify',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'leadifyApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://api-leadify.agify.fr',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Add Leads',
						value: 'addLeads',
						description: 'Add new leads to a group',
						action: 'Add leads',
						routing: {
							request: {
								method: 'POST',
								url: '/add-lead',
							},
						},
					},
					{
						name: 'Delete Columns',
						value: 'deleteColumns',
						description: 'Delete multiple columns',
						action: 'Delete columns',
						routing: {
							request: {
								method: 'POST',
								url: '/delete-column',
							},
						},
					},
					{
						name: 'Delete Leads',
						value: 'deleteLeads',
						description: 'Delete multiple leads',
						action: 'Delete leads',
						routing: {
							request: {
								method: 'POST',
								url: '/delete-lead',
							},
						},
					},
					{
						name: 'Get Leads',
						value: 'getLeads',
						description: 'Get leads from a group',
						action: 'Get leads',
						routing: {
							request: {
								method: 'GET',
								url: '/get-leads',
							},
						},
					},
					{
						name: 'Update Lead',
						value: 'updateLead',
						description: 'Update an existing lead',
						action: 'Update a lead',
						routing: {
							request: {
								method: 'PUT',
								url: '/update-lead',
							},
						},
					},
				],
				default: 'getLeads',
			},

			// Fields for Add Leads operation
			{
				displayName: 'Lead Group ID',
				name: 'leadGroupId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['addLeads'],
					},
				},
				default: '',
				description: 'The ID of the lead group to add leads to',
				routing: {
					request: {
						body: {
							leadGroupId: '={{$value}}',
						},
					},
				},
			},
			{
				displayName: 'Lead Data',
				name: 'leadData',
				type: 'json',
				required: true,
				displayOptions: {
					show: {
						operation: ['addLeads'],
					},
				},
				default:
					'{\n  "isSelectFields": ["selectExample1", "selectExample2"],\n  "leads": [\n    {\n      "Email": "example@example.com",\n      "Name": "John Doe",\n      "selectExample1": "scraped",\n      "tel": "010203943593",\n      "selectExemple2": "yes"\n    },\n    {\n      "Email": "example2@example.com",\n      "Name": "Francois Larive",\n      "selectExample1": "api",\n      "tel": "0876486584",\n      "selectExemple2": "no"\n    }\n  ]\n}',
				description: 'Array of lead data objects to add',
				routing: {
					request: {
						body: {
							leadData: '={{JSON.parse($value)}}',
						},
					},
				},
			},

			// Fields for Get Leads operation
			{
				displayName: 'Group ID',
				name: 'groupId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['getLeads'],
					},
				},
				default: '',
				description: 'The ID of the group to get leads from',
				routing: {
					request: {
						qs: {
							groupId: '={{$value}}',
						},
					},
				},
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				typeOptions: {
					minValue: 1,
				},
				displayOptions: {
					show: {
						operation: ['getLeads'],
					},
				},
				default: 50,
				description: 'Max number of results to return',
				routing: {
					request: {
						qs: {
							limit: '={{$value}}',
						},
					},
				},
			},
			{
				displayName: 'Page',
				name: 'page',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['getLeads'],
					},
				},
				default: 1,
				description: 'Page number to retrieve',
				routing: {
					request: {
						qs: {
							page: '={{$value}}',
						},
					},
				},
			},
			{
				displayName: 'No Pagination',
				name: 'noPagination',
				type: 'boolean',
				displayOptions: {
					show: {
						operation: ['getLeads'],
					},
				},
				default: false,
				description: 'Whether to disable pagination and return all results',
				routing: {
					request: {
						qs: {
							noPagination: '={{$value}}',
						},
					},
				},
			},

			// Fields for Update Lead operation
			{
				displayName: 'Lead ID',
				name: 'leadId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['updateLead'],
					},
				},
				default: '',
				description: 'The ID of the lead to update',
				routing: {
					request: {
						body: {
							leadId: '={{$value}}',
						},
					},
				},
			},
			{
				displayName: 'Updates',
				name: 'updates',
				type: 'json',
				required: true,
				displayOptions: {
					show: {
						operation: ['updateLead'],
					},
				},
				default:
					'[\n  {\n    "propertyName": "Email",\n    "value": "newemail@example.com"\n  }\n]',
				description:
					'Array of update objects with propertyName, value, and optional isSelect fields',
				routing: {
					request: {
						body: {
							updates: '={{JSON.parse($value)}}',
						},
					},
				},
			},

			// Fields for Delete Leads operation
			{
				displayName: 'Lead IDs',
				name: 'leadIds',
				type: 'json',
				required: true,
				displayOptions: {
					show: {
						operation: ['deleteLeads'],
					},
				},
				default: '["lead_id_1", "lead_id_2"]',
				description: 'Array of lead IDs to delete',
				routing: {
					request: {
						body: {
							leadIds: '={{JSON.parse($value)}}',
						},
					},
				},
			},

			// Fields for Delete Columns operation
			{
				displayName: 'Column Names',
				name: 'columnNames',
				type: 'json',
				required: true,
				displayOptions: {
					show: {
						operation: ['deleteColumns'],
					},
				},
				default: '["column1", "column2"]',
				description: 'Array of column names to delete',
				routing: {
					request: {
						body: {
							columnNames: '={{JSON.parse($value)}}',
						},
					},
				},
			},

			// Additional Fields for all operations
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				options: [
					{
						displayName: 'Timeout',
						name: 'timeout',
						type: 'number',
						default: 30000,
						description: 'Request timeout in milliseconds',
					},
				],
			},
		],
	};
}
