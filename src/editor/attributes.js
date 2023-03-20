// All supported properties of the blockVisibility attribute.
export const blockVisibilityProps = {
	hideBlock: {
		type: 'boolean',
	},
	controlSets: {
		type: 'array',
		items: {
			type: 'object',
			properties: {
				id: {
					type: 'number',
				},
				title: {
					type: 'string',
				},
				enable: {
					type: 'boolean',
				},
				controls: {
					type: 'object',
					properties: {
						browserDevice: {
							type: 'object',
							properties: {
								enable: {
									type: 'boolean',
								},
								hideOnRuleSets: {
									type: 'boolean',
								},
								ruleSets: {
									type: 'array',
									items: {
										type: 'object',
										properties: {
											id: {
												type: 'number',
											},
											title: {
												type: 'string',
											},
											enable: {
												type: 'boolean',
											},
											rules: {
												type: 'array',
												items: {
													type: 'object',
													properties: {
														field: {
															type: 'string',
														},
														operator: {
															type: 'string',
														},
														value: {
															type: 'string',
														},
													},
												},
											},
										},
									},
								},
							},
						},
						cookie: {
							type: 'object',
							properties: {
								enable: {
									type: 'boolean',
								},
								hideOnRuleSets: {
									type: 'boolean',
								},
								ruleSets: {
									type: 'array',
									items: {
										type: 'object',
										properties: {
											id: {
												type: 'number',
											},
											title: {
												type: 'string',
											},
											enable: {
												type: 'boolean',
											},
											rules: {
												type: 'array',
												items: {
													type: 'object',
													properties: {
														field: {
															type: 'string',
														},
														subField: {
															type: [
																'string',
																'integer',
																'array',
															],
														},
														operator: {
															type: 'string',
														},
														value: {
															type: [
																'string',
																'integer',
																'array',
															],
														},
													},
												},
											},
										},
									},
								},
							},
						},
						dateTime: {
							type: 'object',
							properties: {
								schedules: {
									type: 'array',
									items: {
										type: 'object',
										properties: {
											id: {
												type: 'number',
											},
											title: {
												type: 'string',
											},
											enable: {
												type: 'boolean',
											},
											start: {
												type: 'string',
											},
											end: {
												type: 'string',
											},
											dayOfWeek: {
												type: 'object',
												properties: {
													enable: {
														type: 'boolean',
													},
													days: {
														type: 'array',
														items: {
															type: 'string',
														},
													},
												},
											},
											timeOfDay: {
												type: 'object',
												properties: {
													enable: {
														type: 'boolean',
													},
													intervals: {
														type: 'array',
														items: {
															type: 'object',
															properties: {
																start: {
																	type: 'string',
																},
																end: {
																	type: 'string',
																},
															},
														},
													},
												},
											},
										},
									},
								},
								hideOnSchedules: {
									type: 'boolean',
								},
							},
						},
						location: {
							type: 'object',
							properties: {
								enable: {
									type: 'boolean',
								},
								hideOnRuleSets: {
									type: 'boolean',
								},
								ruleSets: {
									type: 'array',
									items: {
										type: 'object',
										properties: {
											id: {
												type: 'number',
											},
											title: {
												type: 'string',
											},
											enable: {
												type: 'boolean',
											},
											rules: {
												type: 'array',
												items: {
													type: 'object',
													properties: {
														field: {
															type: 'string',
														},
														subField: {
															type: [
																'string',
																'integer',
																'array',
															],
														},
														subFields: {
															type: 'object',
														},
														operator: {
															type: 'string',
														},
														value: {
															type: [
																'string',
																'integer',
																'array',
															],
														},
													},
												},
											},
										},
									},
								},
							},
						},
						metadata: {
							type: 'object',
							properties: {
								enable: {
									type: 'boolean',
								},
								hideOnRuleSets: {
									type: 'boolean',
								},
								ruleSets: {
									type: 'array',
									items: {
										type: 'object',
										properties: {
											id: {
												type: 'number',
											},
											title: {
												type: 'string',
											},
											enable: {
												type: 'boolean',
											},
											rules: {
												type: 'array',
												items: {
													type: 'object',
													properties: {
														field: {
															type: 'string',
														},
														subField: {
															type: [
																'string',
																'integer',
																'array',
															],
														},
														operator: {
															type: 'string',
														},
														value: {
															type: [
																'string',
																'integer',
																'array',
															],
														},
													},
												},
											},
										},
									},
								},
							},
						},
						queryString: {
							type: 'object',
							properties: {
								enable: {
									type: 'boolean',
								},
								queryStringAny: {
									type: 'string',
								},
								queryStringAll: {
									type: 'string',
								},
								queryStringNot: {
									type: 'string',
								},
							},
						},
						referralSource: {
							type: 'object',
							properties: {
								enable: {
									type: 'boolean',
								},
								contains: {
									type: 'string',
								},
								doesNotContain: {
									type: 'string',
								},
								showIfNoReferral: {
									type: 'boolean',
								},
							},
						},
						screenSize: {
							type: 'object',
							properties: {
								enable: {
									type: 'boolean',
								},
								hideOnScreenSize: {
									type: 'object',
									properties: {
										extraLarge: {
											type: 'boolean',
										},
										large: {
											type: 'boolean',
										},
										medium: {
											type: 'boolean',
										},
										small: {
											type: 'boolean',
										},
										extraSmall: {
											type: 'boolean',
										},
									},
								},
							},
						},
						urlPath: {
							type: 'object',
							properties: {
								enable: {
									type: 'boolean',
								},
								contains: {
									type: 'string',
								},
								doesNotContain: {
									type: 'string',
								},
							},
						},
						userRole: {
							type: 'object',
							properties: {
								enable: {
									type: 'boolean',
								},
								visibilityByRole: {
									type: 'string',
								},
								hideOnRestrictedRoles: {
									type: 'boolean',
								},
								restrictedRoles: {
									type: 'array',
									items: {
										type: 'string',
									},
								},
								hideOnRestrictedUsers: {
									type: 'boolean',
								},
								restrictedUsers: {
									type: 'array',
									items: {
										type: 'string',
									},
								},
								hideOnRuleSets: {
									type: 'boolean',
								},
								ruleSets: {
									type: 'array',
									items: {
										type: 'object',
										properties: {
											id: {
												type: 'number',
											},
											title: {
												type: 'string',
											},
											enable: {
												type: 'boolean',
											},
											rules: {
												type: 'array',
												items: {
													type: 'object',
													properties: {
														field: {
															type: 'string',
														},
														subField: {
															type: [
																'string',
																'integer',
																'array',
															],
														},
														subFields: {
															type: 'object',
														},
														operator: {
															type: 'string',
														},
														value: {
															type: [
																'string',
																'integer',
																'array',
															],
														},
													},
												},
											},
										},
									},
								},
							},
						},
						visibilityPresets: {
							type: 'object',
							properties: {
								enable: {
									type: 'boolean',
								},
								hideOnPresets: {
									type: 'boolean',
								},
								presets: {
									type: 'array',
									items: {
										type: 'string',
									},
								},
								operator: {
									type: 'string',
								},
							},
						},
						// Integrations
						acf: {
							type: 'object',
							properties: {
								enable: {
									type: 'boolean',
								},
								hideOnRuleSets: {
									type: 'boolean',
								},
								ruleSets: {
									type: 'array',
									items: {
										type: [ 'array', 'object' ],
										items: {
											type: 'object',
											properties: {
												field: {
													type: 'string',
												},
												operator: {
													type: 'string',
												},
												value: {
													type: 'string',
												},
											},
										},
										properties: {
											id: {
												type: 'number',
											},
											title: {
												type: 'string',
											},
											enable: {
												type: 'boolean',
											},
											rules: {
												type: 'array',
												items: {
													type: 'object',
													properties: {
														field: {
															type: 'string',
														},
														subField: {
															type: [
																'string',
																'integer',
																'array',
															],
														},
														operator: {
															type: 'string',
														},
														value: {
															type: [
																'string',
																'integer',
																'array',
															],
														},
													},
												},
											},
										},
									},
								},
							},
						},
						wpFusion: {
							type: 'object',
							properties: {
								enable: {
									type: 'boolean',
								},
								tagsAny: {
									type: 'array',
									items: {
										type: [ 'number', 'string' ],
									},
								},
								tagsAll: {
									type: 'array',
									items: {
										type: [ 'number', 'string' ],
									},
								},
								tagsNot: {
									type: 'array',
									items: {
										type: [ 'number', 'string' ],
									},
								},
							},
						},
					},
				},
			},
		},
	},
};
