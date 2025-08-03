import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class LeadifyApi implements ICredentialType {
	name = 'leadifyApi';
	displayName = 'Leadify API';
	documentationUrl = 'https://docs.n8n.io/integrations/creating-nodes/build/declarative-style-node/';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'Your Leadify API key',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api-leadify.agify.fr',
			url: '/test-api-key',
			method: 'GET',
		},
	};
}
