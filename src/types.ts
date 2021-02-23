export type RedirectsExport = {
	plugin: {
		version: string
		date: string
	}
	groups: RedirectGroup[]
	redirects: Redirect[]
}

export type RedirectGroup = {
	id: number
	name: string
	redirects: number
	module_id: number
	moduleName: string
	enabled: boolean
}

export type Redirect = {
	id: number
	url: string
	match_url: string
	match_data: {
		source: {
			flag_query: string
			flag_case: boolean
			flag_trailing: boolean
			flag_regex: boolean
		}
	}
	action_code: string
	action_type: string
	action_data: {
		url: string
	}
	match_type: string
	title: string
	hits: number
	regex: boolean
	group_id: number
	position: number
	last_access: string
	enabled: boolean
}
