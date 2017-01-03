export const METHODS = ['x13', 'ts']
export const PRESPECS = {
	x13: ['RSA0', 'RSA1', 'RSA2c', 'RSA3', 'RSA4c', 'RSA5c'],
	ts: ['RSA0', 'RSA1', 'RSA2', 'RSA3', 'RSA4', 'RSA5']
}

//tabs for specification details
export const TRANSFORMATION = 'TRANSFORMATION'
export const MODEL = 'MODEL'
export const OUTLIERS = 'OUTLIERS'
export const CALENDAR = 'CALENDAR'
export const OUTPUTS = 'OUTPUTS'

//status for time series
export const FILE_LOADED = 'FILE_LOADED'
export const FILE_LOADING = 'FILE_LOADING'
export const FILE_NO = 'FILE_NO'
export const ADJUST_NO = 'ADJUST_NO'
export const ADJUST_PENDING = 'ADJUST_PENDING'
export const ADJUST_DONE = 'ADJUST_DONE'

//types for results
export const ADJUSTED = 'ADJUSTED'
export const EFFECTS = 'EFFECTS'
export const STATISTICS = 'STATISTICS'

export const SHOW_GRAPH = 'SHOW_GRAPH'
export const SHOW_STATISTICS = 'SHOW_STATISTICS'

export const OUTPUT_MAPPING = {
	y :  { label: 'Original series', menu: ADJUSTED, type: 'y' },
	sa:  { label: 'Seasonally adjusted series', menu: ADJUSTED, type: 'y' },
	t:   { label: 'Trend component', menu: ADJUSTED, type: 'y' },
	det: { label: 'Deterministic component', menu: ADJUSTED, type: 'c' },
	s:   { label: 'Seasonal component', menu: ADJUSTED, type: 'c' },
	i:   { label: 'Irregular component', menu: ADJUSTED, type: 'c' },
	ee:  { label: 'Easter effect', menu: EFFECTS, type: 'r' },
	tde: { label: 'Trading days effect', menu: EFFECTS, type: 'r' },
	mhe: { label: 'Moving holidays effect', menu: EFFECTS, type: 'r' },
	cal: { label: 'Calendar effect', menu: EFFECTS, type: 'r'},
	reg: { label: 'Regression effect', menu: EFFECTS, type: 'r' },
	out: { label: 'Outliers effect', menu: EFFECTS, type: 'r' },
	likelihood: { label: 'Likelihood statistics', menu: STATISTICS, type: 's' }
}

// constants value in the css file (as selectors)
export const SERIES_COLORS = {
	y: 'color-1',
	sa: 'color-2',
	t: 'color-3',
	det: 'color-4',
	s: 'color-5',
	i: 'color-6'
}