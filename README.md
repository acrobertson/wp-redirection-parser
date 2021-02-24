# wp-redirection-parser

A node CLI tool for the very particular use case of needing to transform redirect rules exported in a JSON file from the [Redirection Wordpress plugin](https://wordpress.org/plugins/redirection/) into a txt file with RegEx formatting that [WP Engine's support team will accept](https://wpengine.com/support/redirect/#Submitting_Redirects_in_Bulk).

## Usage

Install and build the package:

```zsh
npm install
npm run build
```

Run the script from the `build` directory. The script requires two arguments:

- `redirectsFile`: filepath to the JSON file exported from the Redirection plugin
- `baseUrl`: the base URL of your site to be used in the rewrite rules

### Example

```zsh
node build --redirectsFile="/Users/yourname/Desktop/redirects.json" --baseUrl="https://example.com"
```

`redirects.json`:

```json
{
	"plugin": {
		"version": "5.0.1",
		"date": "Tue, 23 Feb 2021 15:52:48 +0000"
	},
	"groups": [
		{
			"id": 1,
			"name": "wp",
			"redirects": 432,
			"module_id": 1,
			"moduleName": "WordPress",
			"enabled": true
		}
	],
	"redirects": [
		{
			"id": 1,
			"url": "/section/page",
			"match_url": "/section/page",
			"match_data": {
				"source": {
					"flag_query": "exact",
					"flag_case": false,
					"flag_trailing": false,
					"flag_regex": false
				}
			},
			"action_code": 301,
			"action_type": "url",
			"action_data": {
				"url": "/page"
			},
			"match_type": "url",
			"title": "",
			"hits": 478,
			"regex": false,
			"group_id": 1,
			"position": 0,
			"last_access": "February 23, 2021",
			"enabled": true
		},
		{
			"id": 2,
			"url": "/posts/[\\d]{4}/[\\d]{2}/[\\d]{2}/(.*)$",
			"match_url": "regex",
			"match_data": {
				"source": {
					"flag_query": "exact",
					"flag_case": false,
					"flag_trailing": false,
					"flag_regex": true
				}
			},
			"action_code": 301,
			"action_type": "url",
			"action_data": {
				"url": "/post/$1"
			},
			"match_type": "url",
			"title": "",
			"hits": 84032,
			"regex": true,
			"group_id": 1,
			"position": 7,
			"last_access": "February 23, 2021",
			"enabled": true
		}
	]
}
```

Resulting `out/redirects.txt`:

```txt
Redirect 301 ^/section/page/?$ https://example.com/page
Redirect 301 ^/posts/[\d]{4}/[\d]{2}/[\d]{2}/(.*)$ https://example.com/post/$1
```
