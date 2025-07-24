import { INodeType, INodeTypeDescription, NodeConnectionType } from 'n8n-workflow';

export class Leadify implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Leadify',
		name: 'leadify',
		icon: 'file:leadify-logo.png',
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
				default: '[\n  {\n    "Email": "example@example.com",\n    "Name": "John Doe"\n  }\n]',
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
				default: '[\n  {\n    "propertyName": "Email",\n    "value": "newemail@example.com"\n  }\n]',
				description: 'Array of update objects with propertyName, value, and optional isSelect fields',
				routing: {
					request: {
						body: {
							updates: '={{JSON.parse($value)}}',
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
