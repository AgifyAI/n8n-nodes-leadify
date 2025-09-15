import {
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	IExecuteFunctions,
	INodeExecutionData,
	IHttpRequestOptions,
} from 'n8n-workflow';

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
						name: 'Add Lead Log',
						value: 'addLeadLog',
						description: 'Add a log entry related to a lead',
						action: 'Add lead log',
						routing: {
							request: {
								method: 'POST',
								url: '/add-lead-log',
							},
						},
					},
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
						name: 'Delete Lead Log',
						value: 'deleteLeadLog',
						description: 'Delete a lead log by ID',
						action: 'Delete lead log',
						routing: {
							request: {
								method: 'DELETE',
								url: '/delete-lead-log',
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
						name: 'Get Lead',
						value: 'getLead',
						description: 'Get a single lead by ID',
						action: 'Get a lead',
						routing: {
							request: {
								method: 'GET',
								url: '/get-lead',
							},
						},
					},
					{
						name: 'Get Lead Logs',
						value: 'getLeadLogs',
						description: 'Get lead logs with optional filters and pagination',
						action: 'Get lead logs',
						routing: {
							request: {
								method: 'GET',
								url: '/get-lead-logs',
							},
						},
					},
					{
						name: 'Get Leads',
						value: 'getLeads',
						description: 'Get leads from a group',
						action: 'Get leads',
					},
					{
						name: 'Update Hidden Columns',
						value: 'updateHiddenColumns',
						description: 'Add or remove hidden columns for a lead group',
						action: 'Update hidden columns',
						routing: {
							request: {
								method: 'POST',
								url: '/update-hidden-columns',
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
			},

			// Fields for Add Lead Log operation
			{
				displayName: 'Log Data',
				name: 'logData',
				type: 'json',
				required: true,
				displayOptions: {
					show: {
						operation: ['addLeadLog'],
					},
				},
				default:
					'{\n  "campaignSlug": "summer-2024-campaign",\n  "leadId": "your-lead-id-here",\n  "action": "email_sent",\n  "message": "Welcome email sent successfully",\n  "executionId": 12345,\n  "workflowId": 67890,\n  "workflow": "Lead Nurturing Workflow",\n  "workflowUrl": "https://n8n.example.com/workflow/67890",\n  "executionUrl": "https://n8n.example.com/execution/12345",\n  "level": "INFO",\n  "errorCode": null,\n  "retryCount": 0\n}',
				description: 'JSON payload describing the lead log to create',
				routing: {
					request: {
						body: '={{JSON.parse($value)}}',
					},
				},
			},

			// Fields for Delete Lead Log operation
			{
				displayName: 'Delete Log Data',
				name: 'deleteLogData',
				type: 'json',
				required: true,
				displayOptions: {
					show: {
						operation: ['deleteLeadLog'],
					},
				},
				default: '{\n  "id": "your-lead-log-id-here"\n}',
				description: 'JSON payload containing the ID of the lead log to delete',
				routing: {
					request: {
						body: '={{JSON.parse($value)}}',
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
			},

			// Dynamic Filters for Get Leads operation
			{
				displayName: 'Filters',
				name: 'filtersCollection',
				placeholder: 'Add Filter',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				displayOptions: {
					show: {
						operation: ['getLeads'],
					},
				},
				default: {},
				description: 'Add filters to refine your lead search',
				options: [
					{
						name: 'filterItems',
						displayName: 'Filter',
						values: [
							{
								displayName: 'Field Name',
								name: 'fieldName',
								type: 'string',
								default: '',
								placeholder: 'e.g. email, company, status',
								description: 'The name of the field to filter on',
								required: true,
							},
							{
								displayName: 'Operator',
								name: 'operator',
								type: 'options',
								options: [
									{
										name: 'Contains',
										value: 'contains', 
										description: 'Contains the text',
									},
									{
										name: 'Equals',
										value: 'equals',
										description: 'Exact match',
									},
									{
										name: 'Greater Than or Equal',
										value: 'gte',
										description: 'Greater than or equal to (for numbers/dates)',
									},
									{
										name: 'Is False',
										value: 'is_false',
										description: 'Boolean value is false',
									},
									{
										name: 'Is Not Null',
										value: 'is_not_null',
										description: 'Field has a value',
									},
									{
										name: 'Is Null',
										value: 'is_null',
										description: 'Field is empty or null',
									},
									{
										name: 'Is True',
										value: 'is_true',
										description: 'Boolean value is true',
									},
									{
										name: 'Less Than or Equal',
										value: 'lte',
										description: 'Less than or equal to (for numbers/dates)',
									},
									{
										name: 'Not Contains',
										value: 'not_contains',
										description: 'Does not contain the text',
									},
									{
										name: 'Not Equals',
										value: 'not_equals',
										description: 'Does not equal',
									},
								],
								default: 'equals',
								description: 'The comparison operator to use',
								required: true,
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
								placeholder: 'Filter value',
								description: 'The value to compare against (leave empty for is_null, is_not_null, is_true, is_false)',
								displayOptions: {
									hide: {
										operator: ['is_null', 'is_not_null', 'is_true', 'is_false'],
									},
								},
							},
						],
					},
				],
			},

			// Search parameter for Get Leads operation
			{
				displayName: 'Search',
				name: 'search',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['getLeads'],
					},
				},
				default: '',
				description: 'Global text search across all fields',
			},

			// View ID parameter for Get Leads operation
			{
				displayName: 'View ID',
				name: 'viewId',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['getLeads'],
					},
				},
				default: '',
				description: 'ID of an existing view to combine with URL filters',
			},

			// Fields for Get Lead operation
			{
				displayName: 'Lead ID',
				name: 'leadId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['getLead'],
					},
				},
				default: '',
				description: 'The ID of the lead to retrieve',
				routing: {
					request: {
						qs: {
							id: '={{$value}}',
						},
					},
				},
			},

			// Fields for Get Lead Logs operation
			{
				displayName: 'Campaign Slug',
				name: 'campaignSlug',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['getLeadLogs'],
					},
				},
				default: '',
				description: 'Filter logs by campaign slug',
				routing: {
					request: {
						qs: {
							campaign_slug: '={{$value}}',
						},
					},
				},
			},
			{
				displayName: 'Lead ID',
				name: 'leadId',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['getLeadLogs'],
					},
				},
				default: '',
				description: 'Filter logs by lead ID',
				routing: {
					request: {
						qs: {
							lead_id: '={{$value}}',
						},
					},
				},
			},
			{
				displayName: 'Lead Group ID',
				name: 'leadGroupId',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['getLeadLogs'],
					},
				},
				default: '',
				description: 'Filter logs by lead group ID',
				routing: {
					request: {
						qs: {
							leadgroup_id: '={{$value}}',
						},
					},
				},
			},
			{
				displayName: 'Level',
				name: 'level',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['getLeadLogs'],
					},
				},
				default: '',
				description: 'Filter by level, e.g. INFO, WARN, ERROR, DEBUG',
				routing: {
					request: {
						qs: {
							level: '={{$value}}',
						},
					},
				},
			},
			{
				displayName: 'Date From',
				name: 'dateFrom',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['getLeadLogs'],
					},
				},
				default: '',
				description: 'Filter logs created on or after this date (YYYY-MM-DD)',
				routing: {
					request: {
						qs: {
							date_from: '={{$value}}',
						},
					},
				},
			},
			{
				displayName: 'Date To',
				name: 'dateTo',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['getLeadLogs'],
					},
				},
				default: '',
				description: 'Filter logs created on or before this date (YYYY-MM-DD)',
				routing: {
					request: {
						qs: {
							date_to: '={{$value}}',
						},
					},
				},
			},
			{
				displayName: 'Page',
				name: 'logsPage',
				type: 'number',
				default: 1,
				description: 'Page number to retrieve',
				displayOptions: {
					show: {
						operation: ['getLeadLogs'],
					},
				},
				routing: {
					request: {
						qs: {
							page: '={{$value}}',
						},
					},
				},
			},
			{
				displayName: 'Limit',
				name: 'logsLimit',
				type: 'number',
				typeOptions: {
					minValue: 1,
				},
				default: 20,
				description: 'Max number of results to return',
				displayOptions: {
					show: {
						operation: ['getLeadLogs'],
					},
				},
				routing: {
					request: {
						qs: {
							limit: '={{$value}}',
						},
					},
				},
			},
			{
				displayName: 'Sort By',
				name: 'sortBy',
				type: 'string',
				default: 'createdAt',
				description: 'Field to sort by, e.g. createdAt',
				displayOptions: {
					show: {
						operation: ['getLeadLogs'],
					},
				},
				routing: {
					request: {
						qs: {
							sort_by: '={{$value}}',
						},
					},
				},
			},
			{
				displayName: 'Sort Order',
				name: 'sortOrder',
				type: 'options',
				options: [
					{ name: 'Ascending', value: 'asc' },
					{ name: 'Descending', value: 'desc' },
				],
				default: 'desc',
				description: 'Sort direction',
				displayOptions: {
					show: {
						operation: ['getLeadLogs'],
					},
				},
				routing: {
					request: {
						qs: {
							sort_order: '={{$value}}',
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
				displayName: 'Lead Group ID',
				name: 'leadGroupId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['deleteColumns'],
					},
				},
				default: '',
				description: 'The ID of the lead group to delete columns from',
				routing: {
					request: {
						body: {
							leadGroupId: '={{$value}}',
						},
					},
				},
			},
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

			// Fields for Update Hidden Columns operation
			{
				displayName: 'Lead Group ID',
				name: 'leadGroupId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['updateHiddenColumns'],
					},
				},
				default: '',
				description: 'The ID of the lead group to update hidden columns for',
				routing: {
					request: {
						body: {
							leadGroupId: '={{$value}}',
						},
					},
				},
			},
			{
				displayName: 'Add Hidden Columns',
				name: 'addHiddenColumns',
				type: 'json',
				displayOptions: {
					show: {
						operation: ['updateHiddenColumns'],
					},
				},
				default: '["status"]',
				description: 'Array of column names to add to the hidden list',
				routing: {
					request: {
						body: {
							addHiddenColumns: '={{JSON.parse($value)}}',
						},
					},
				},
			},
			{
				displayName: 'Remove Hidden Columns',
				name: 'removeHiddenColumns',
				type: 'json',
				displayOptions: {
					show: {
						operation: ['updateHiddenColumns'],
					},
				},
				default: '["phone"]',
				description: 'Array of column names to remove from the hidden list',
				routing: {
					request: {
						body: {
							removeHiddenColumns: '={{JSON.parse($value)}}',
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

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const operation = this.getNodeParameter('operation', 0) as string;
		
		// Only handle getLeads operation with custom filter logic
		if (operation === 'getLeads') {
			const credentials = await this.getCredentials('leadifyApi');
			const groupId = this.getNodeParameter('groupId', 0) as string;
			const limit = this.getNodeParameter('limit', 0) as number;
			const page = this.getNodeParameter('page', 0) as number;
			const noPagination = this.getNodeParameter('noPagination', 0) as boolean;
			const search = this.getNodeParameter('search', 0) as string;
			const viewId = this.getNodeParameter('viewId', 0) as string;
			const filtersCollection = this.getNodeParameter('filtersCollection', 0) as any;

			// Build query parameters
			const qs: any = {
				groupId,
				limit,
				page,
				noPagination,
			};

			// Add search if provided
			if (search) {
				qs.search = search;
			}

			// Add viewId if provided
			if (viewId) {
				qs.viewId = viewId;
			}

			// Process dynamic filters
			if (filtersCollection?.filterItems) {
				const filters = filtersCollection.filterItems;
				filters.forEach((filter: any) => {
					if (filter.fieldName && filter.operator) {
						const key = `filter[${filter.fieldName}][${filter.operator}]`;
						
						// For operators that don't need a value, set to "true"
						if (['is_null', 'is_not_null', 'is_true', 'is_false'].includes(filter.operator)) {
							qs[key] = 'true';
						} else if (filter.value !== undefined && filter.value !== '') {
							qs[key] = filter.value;
						}
					}
				});
			}

			// Make the HTTP request
			const options: IHttpRequestOptions = {
				method: 'GET',
				url: '/get-leads',
				qs,
				headers: {
					'Authorization': `Bearer ${credentials.apiKey}`,
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				json: true,
			};

			const response = await this.helpers.httpRequestWithAuthentication.call(this, 'leadifyApi', options);
			
			return [this.helpers.returnJsonArray(response)];
		}

		// For all other operations, use the default declarative routing
		// This will never be reached due to n8n's routing system, but kept for completeness
		return [items];
	}
}
