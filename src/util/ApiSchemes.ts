export default {
  "Roblox.Groups.Api.GroupDetailResponse":{ 
  "description":"A detailed group response model",
  "type":"object",
  "properties":{ 
     "id":{ 
        "format":"int64",
        "description":"The group id",
        "type":"integer"
     },
     "name":{ 
        "description":"The group name",
        "type":"string"
     },
     "description":{ 
        "description":"The group description",
        "type":"string"
     },
     "owner":{ 
        "$ref":"#/definitions/Roblox.Groups.Api.Models.Response.UserModel",
        "description":"The owner of the group"
     },
     "shout":{ 
        "$ref":"#/definitions/Roblox.Groups.Api.ShoutResponse",
        "description":"The group shout/status"
     },
     "memberCount":{ 
        "format":"int32",
        "description":"The number of members in the group",
        "type":"integer"
     },
     "isBuildersClubOnly":{ 
        "description":"Whether the group is Builders Club only",
        "type":"boolean"
     },
     "hasClan":{ 
        "description":"Whether the group has a clan",
        "type":"boolean"
     },
     "publicEntryAllowed":{ 
        "description":"Whether the group is public (no approval required)",
        "type":"boolean"
     },
     "isLocked":{ 
        "description":"Whether the group is locked",
        "type":"boolean"
     }
  }
},
"Roblox.Groups.Api.Models.Response.UserModel":{ 
  "description":"A model representing data about an {Roblox.Platform.Membership.IUser}",
  "type":"object",
  "properties":{ 
     "userId":{ 
        "format":"int64",
        "description":"The user id",
        "type":"integer"
     },
     "username":{ 
        "description":"The username",
        "type":"string"
     },
     "buildersClubMembershipType":{ 
        "description":"The user's builders club membership type",
        "enum":[ 
           "None",
           "BC",
           "TBC",
           "OBC",
           "RobloxPremium"
        ],
        "type":"string"
     }
  }
},
"Roblox.Groups.Api.ShoutResponse":{ 
  "type":"object",
  "properties":{ 
     "body":{ 
        "description":"The shout's message",
        "type":"string"
     },
     "poster":{ 
        "$ref":"#/definitions/Roblox.Groups.Api.Models.Response.UserModel",
        "description":"The shout's poster"
     },
     "created":{ 
        "format":"date-time",
        "description":"The shout's created time",
        "type":"string"
     },
     "updated":{ 
        "format":"date-time",
        "description":"The shout's last updated time",
        "type":"string"
     }
  }
},
"Roblox.Groups.Api.CreateGroupRequest":{ 
  "description":"A request model for creating a new group.",
  "type":"object",
  "properties":{ 
     "name":{ 
        "description":"The name of the group.",
        "type":"string"
     },
     "description":{ 
        "description":"The group description.",
        "type":"string"
     },
     "publicGroup":{ 
        "description":"Whether or not the group is open for anyone to join.",
        "type":"boolean"
     },
     "buildersClubMembersOnly":{ 
        "description":"Whether or not the group is only open to join for builders club members.",
        "type":"boolean"
     }
  }
},
"Roblox.Web.Responses.Groups.GroupResponseV2":{ 
  "type":"object",
  "properties":{ 
     "id":{ 
        "format":"int64",
        "type":"integer"
     },
     "name":{ 
        "type":"string"
     },
     "description":{ 
        "type":"string"
     },
     "owner":{ 
        "$ref":"#/definitions/Roblox.Web.Responses.RelatedEntityTypeResponse[Roblox.Web.Responses.Groups.GroupOwnerType]"
     },
     "memberCount":{ 
        "format":"int64",
        "type":"integer"
     },
     "shout":{ 
        "$ref":"#/definitions/Roblox.Web.Responses.Groups.GroupShoutResponse"
     },
     "created":{ 
        "format":"date-time",
        "type":"string"
     }
  }
},
"Roblox.Web.Responses.RelatedEntityTypeResponse[Roblox.Web.Responses.Groups.GroupOwnerType]":{ 
  "type":"object",
  "properties":{ 
     "id":{ 
        "format":"int64",
        "type":"integer",
        "readOnly":true
     },
     "type":{ 
        "enum":[ 
           "User"
        ],
        "type":"string",
        "readOnly":true
     },
     "name":{ 
        "type":"string",
        "readOnly":true
     }
  }
},
"Roblox.Web.Responses.Groups.GroupShoutResponse":{ 
  "type":"object",
  "properties":{ 
     "body":{ 
        "type":"string"
     },
     "poster":{ 
        "$ref":"#/definitions/Roblox.Web.Responses.RelatedEntityTypeResponse[Roblox.Web.Responses.Groups.GroupShoutPosterType]"
     },
     "created":{ 
        "format":"date-time",
        "type":"string"
     }
  }
},
"Roblox.Web.Responses.RelatedEntityTypeResponse[Roblox.Web.Responses.Groups.GroupShoutPosterType]":{ 
  "type":"object",
  "properties":{ 
     "id":{ 
        "format":"int64",
        "type":"integer",
        "readOnly":true
     },
     "type":{ 
        "enum":[ 
           "User"
        ],
        "type":"string",
        "readOnly":true
     },
     "name":{ 
        "type":"string",
        "readOnly":true
     }
  }
},
"Roblox.Groups.Api.ChangeIconRequest":{ 
  "description":"A request model for creating a new group.",
  "type":"object",
  "properties":{ 

  }
},
"Roblox.Web.WebAPI.ApiEmptyResponseModel":{ 
  "type":"object",
  "properties":{ 

  }
},
"Roblox.Groups.Api.PostGroupStatusRequest":{ 
  "description":"A request model for setting the authenticated user's primary group.",
  "type":"object",
  "properties":{ 
     "message":{ 
        "description":"The message to set the group status to.",
        "type":"string"
     }
  }
},
"Roblox.Groups.Api.UpdateGroupDescriptionRequest":{ 
  "description":"A request model for setting a description for the group",
  "type":"object",
  "properties":{ 
     "description":{ 
        "description":"The group description being set.",
        "type":"string"
     }
  }
},
"Roblox.Groups.Api.GroupDescriptionResponse":{ 
  "type":"object",
  "properties":{ 
     "newDescription":{ 
        "description":"The new description returned",
        "type":"string"
     }
  }
},
"Roblox.Groups.Api.GroupSettingsResponse":{ 
  "description":"Response model for Group Settings",
  "type":"object",
  "properties":{ 
     "isApprovalRequired":{ 
        "description":"Whether public entry is allowed.",
        "type":"boolean"
     },
     "isBuildersClubRequired":{ 
        "description":"Whether Builder's Club is required.",
        "type":"boolean"
     },
     "areEnemiesAllowed":{ 
        "description":"Whether enemy club declarations are allowed.",
        "type":"boolean"
     },
     "areGroupFundsVisible":{ 
        "description":"Whether funds are publicly visible.",
        "type":"boolean"
     },
     "areGroupGamesVisible":{ 
        "description":"Whether games are publicly visible.",
        "type":"boolean"
     }
  }
},
"Roblox.Groups.Api.UpdateGroupSettingsRequest":{ 
  "description":"A request model for updating a group's settings.",
  "type":"object",
  "properties":{ 
     "isApprovalRequired":{ 
        "description":"Whether public entry is allowed.",
        "type":"boolean"
     },
     "isBuildersClubRequired":{ 
        "description":"Whether Builder's Club is required.",
        "type":"boolean"
     },
     "areEnemiesAllowed":{ 
        "description":"Whether enemy club declarations are allowed.",
        "type":"boolean"
     },
     "areGroupFundsVisible":{ 
        "description":"Whether funds are publicly visible.",
        "type":"boolean"
     },
     "areGroupGamesVisible":{ 
        "description":"Whether games are publicly visible.",
        "type":"boolean"
     }
  }
},
"Roblox.Web.WebAPI.ExclusiveStartRequest[System.Int32]":{ 
  "type":"object",
  "properties":{ 
     "ExclusiveStartKeyInfo":{ 
        "$ref":"#/definitions/Roblox.Platform.Core.ExclusiveStartPaging.IExclusiveStartKeyInfo[System.Int32]",
        "readOnly":true
     },
     "CursorRecipe":{ 
        "type":"string",
        "readOnly":true
     }
  }
},
"Roblox.Platform.Core.ExclusiveStartPaging.IExclusiveStartKeyInfo[System.Int32]":{ 
  "type":"object",
  "properties":{ 
     "SortOrder":{ 
        "enum":[ 
           "Asc",
           "Desc"
        ],
        "type":"string",
        "readOnly":true
     },
     "PagingDirection":{ 
        "enum":[ 
           "Forward",
           "Backward"
        ],
        "type":"string",
        "readOnly":true
     },
     "Count":{ 
        "format":"int32",
        "type":"integer",
        "readOnly":true
     }
  }
},
"Roblox.Groups.Api.GroupAuditLogPageResponse[Roblox.Groups.Api.Models.Response.GroupAuditLogResponseItem]":{ 
  "description":"ApiPageResponse for group audit log",
  "type":"object",
  "properties":{ 
     "previousPageCursor":{ 
        "type":"string"
     },
     "nextPageCursor":{ 
        "type":"string"
     },
     "data":{ 
        "type":"array",
        "items":{ 
           "$ref":"#/definitions/Roblox.Groups.Api.Models.Response.GroupAuditLogResponseItem"
        }
     }
  }
},
"Roblox.Groups.Api.Models.Response.GroupAuditLogResponseItem":{ 
  "description":"A group audit log response model",
  "type":"object",
  "properties":{ 
     "actor":{ 
        "$ref":"#/definitions/Roblox.Groups.Api.UserGroupRoleResponse",
        "description":"The auditors username"
     },
     "actionType":{ 
        "description":"The action type",
        "type":"string"
     },
     "description":{ 
        "description":"Information on the action performed",
        "type":"object"
     },
     "created":{ 
        "format":"date-time",
        "description":"Date the group action was performed",
        "type":"string"
     }
  }
},
"Roblox.Groups.Api.UserGroupRoleResponse":{ 
  "description":"A user group role response model",
  "type":"object",
  "properties":{ 
     "user":{ 
        "$ref":"#/definitions/Roblox.Groups.Api.Models.Response.UserModel",
        "description":"The user"
     },
     "role":{ 
        "$ref":"#/definitions/Roblox.Groups.Api.GroupRoleResponse",
        "description":"The user's group role"
     }
  }
},
"Roblox.Groups.Api.GroupRoleResponse":{ 
  "description":"A group role response model",
  "type":"object",
  "properties":{ 
     "id":{ 
        "format":"int64",
        "description":"The role id",
        "type":"integer"
     },
     "name":{ 
        "description":"The role name",
        "type":"string"
     },
     "description":{ 
        "description":"The role description",
        "type":"string"
     },
     "rank":{ 
        "format":"int32",
        "description":"The role rank",
        "type":"integer"
     },
     "memberCount":{ 
        "format":"int64",
        "description":"The number of members in the role.",
        "type":"integer"
     }
  }
},
"Roblox.Groups.Api.GroupsDisplayOptionsResponse":{ 
  "description":"A group roles response model",
  "type":"object",
  "properties":{ 
     "groupLimit":{ 
        "format":"int32",
        "description":"The user's builders club membership group limit",
        "type":"integer"
     },
     "currentGroupCount":{ 
        "format":"int32",
        "description":"The user's current group membership count",
        "type":"integer"
     },
     "groupStatusMaxLength":{ 
        "format":"int32",
        "description":"The maximum length of a group status",
        "type":"integer"
     },
     "groupPostMaxLength":{ 
        "format":"int32",
        "description":"The maximum length of a group wall post",
        "type":"integer"
     },
     "isFunCaptchaEnabled":{ 
        "description":"Whether or not captchas for groups use FunCaptcha.",
        "type":"boolean"
     },
     "isConfigureGroupPageEnabled":{ 
        "description":"Whether or not the configure group page is enabled.",
        "type":"boolean"
     },
     "isGroupAdminRedirectEnabled":{ 
        "description":"Whether or not the group admin page should redirect to the configure group page.",
        "type":"boolean"
     },
     "isGroupAuditLogRedirectEnabled":{ 
        "description":"Whether or not the group audit log page should redirect to the configure group page.",
        "type":"boolean"
     },
     "isGroupJoinEndpointCaptchaVerificationEnabled":{ 
        "description":"If this is true the captcha token for group join will be passed directly\r\nto the group join endpoint, and the API will use the Captcha Service (BEDEV2)\r\nfor token verification.\r\n            \r\nIf this is false, the javascript will use the Captcha API (BEDEV1) to set a memcached key\r\nthat the group join endpoint checks for in order to determine if a user has passed captcha.",
        "type":"boolean"
     },
     "areProfileGroupsHidden":{ 
        "description":"If set to true, groups showcase will not show on users profiles.\r\n            \r\nIf set to false, group showcase will display on users profiles.",
        "type":"boolean"
     },
     "isConfigureGroupOnMobileEnabled":{ 
        "description":"If set to true, configure group will be accessible on mobile\r\n            \r\nIf set to false, configure group will not be accessible on mobile",
        "type":"boolean"
     }
  }
},
"Roblox.Groups.Api.GroupConfigurationDisplayOptionsResponse":{ 
  "description":"A response model for group configuration",
  "type":"object",
  "properties":{ 
     "groupConfiguration":{ 
        "$ref":"#/definitions/Roblox.Groups.Api.GroupConfigurationResponse",
        "description":"The group configuration response"
     },
     "recurringPayoutsConfiguration":{ 
        "$ref":"#/definitions/Roblox.Groups.Api.RecurringPayoutsConfigurationResponse",
        "description":"The recurring payouts configuration response"
     },
     "roleConfiguration":{ 
        "$ref":"#/definitions/Roblox.Groups.Api.RoleConfigurationResponse",
        "description":"The role configuration response"
     }
  }
},
"Roblox.Groups.Api.GroupConfigurationResponse":{ 
  "description":"A response model for group configuration",
  "type":"object",
  "properties":{ 
     "nameMaxLength":{ 
        "format":"int32",
        "description":"The maximum length of a group name",
        "type":"integer"
     },
     "descriptionMaxLength":{ 
        "format":"int32",
        "description":"The maximum length of a group description",
        "type":"integer"
     },
     "cost":{ 
        "format":"int64",
        "description":"The cost of purchasing a group",
        "type":"integer"
     }
  }
},
"Roblox.Groups.Api.RecurringPayoutsConfigurationResponse":{ 
  "description":"A response model for recurring payout configuration",
  "type":"object",
  "properties":{ 
     "maxPayoutPartners":{ 
        "format":"int32",
        "description":"The maximum number of recurring payout partners",
        "type":"integer"
     }
  }
},
"Roblox.Groups.Api.RoleConfigurationResponse":{ 
  "description":"A response model for role configuration",
  "type":"object",
  "properties":{ 
     "nameMaxLength":{ 
        "format":"int32",
        "description":"The maximum length of a role name",
        "type":"integer"
     },
     "descriptionMaxLength":{ 
        "format":"int32",
        "description":"The maximum length of a role description",
        "type":"integer"
     },
     "limit":{ 
        "format":"int32",
        "description":"The maximum number of roles in a group",
        "type":"integer"
     },
     "cost":{ 
        "format":"int64",
        "description":"The cost of purchasing a role",
        "type":"integer"
     },
     "minRank":{ 
        "format":"int32",
        "description":"The minimum rank a role can have",
        "type":"integer"
     },
     "maxRank":{ 
        "format":"int32",
        "description":"The maximum rank a role can have",
        "type":"integer"
     }
  }
},
"Roblox.Paging.StartIndexCursor":{ 
  "type":"object",
  "properties":{ 
     "startIndex":{ 
        "format":"int64",
        "type":"integer"
     },
     "discriminator":{ 
        "type":"string"
     },
     "count":{ 
        "format":"int32",
        "type":"integer"
     }
  }
},
"Roblox.Groups.Api.GroupSearchPageResponse":{ 
  "description":"ApiPageResponse for catalog search",
  "type":"object",
  "properties":{ 
     "keyword":{ 
        "description":"Keyword used for search query",
        "type":"string"
     },
     "previousPageCursor":{ 
        "type":"string"
     },
     "nextPageCursor":{ 
        "type":"string"
     },
     "data":{ 
        "type":"array",
        "items":{ 
           "$ref":"#/definitions/Roblox.Groups.Api.GroupSearchResponseItem"
        }
     }
  }
},
"Roblox.Groups.Api.GroupSearchResponseItem":{ 
  "type":"object",
  "properties":{ 
     "id":{ 
        "format":"int64",
        "type":"integer"
     },
     "name":{ 
        "type":"string"
     },
     "description":{ 
        "type":"string"
     },
     "memberCount":{ 
        "format":"int32",
        "type":"integer"
     },
     "publicEntryAllowed":{ 
        "type":"boolean"
     },
     "created":{ 
        "format":"date-time",
        "type":"string"
     },
     "updated":{ 
        "format":"date-time",
        "type":"string"
     }
  }
},
"Roblox.Web.WebAPI.Models.ApiArrayResponse[Roblox.Web.Responses.Groups.GroupBasicResponse]":{ 
  "type":"object",
  "properties":{ 
     "data":{ 
        "type":"array",
        "items":{ 
           "$ref":"#/definitions/Roblox.Web.Responses.Groups.GroupBasicResponse"
        }
     }
  }
},
"Roblox.Web.Responses.Groups.GroupBasicResponse":{ 
  "type":"object",
  "properties":{ 
     "id":{ 
        "format":"int64",
        "type":"integer"
     },
     "name":{ 
        "type":"string"
     },
     "memberCount":{ 
        "format":"int32",
        "type":"integer"
     }
  }
},
"Roblox.Groups.Api.GroupSearchMetadataResponse":{ 
  "description":"Response Model For Group Search Metadata Endpoint",
  "type":"object",
  "properties":{ 
     "SuggestedGroupKeywords":{ 
        "description":"Suggested Group Category translation keys",
        "type":"array",
        "items":{ 
           "type":"string"
        }
     }
  }
},
"Roblox.Web.WebAPI.ExclusiveStartRequest[System.Int64]":{ 
  "type":"object",
  "properties":{ 
     "ExclusiveStartKeyInfo":{ 
        "$ref":"#/definitions/Roblox.Platform.Core.ExclusiveStartPaging.IExclusiveStartKeyInfo[System.Int64]",
        "readOnly":true
     },
     "CursorRecipe":{ 
        "type":"string",
        "readOnly":true
     }
  }
},
"Roblox.Platform.Core.ExclusiveStartPaging.IExclusiveStartKeyInfo[System.Int64]":{ 
  "type":"object",
  "properties":{ 
     "SortOrder":{ 
        "enum":[ 
           "Asc",
           "Desc"
        ],
        "type":"string",
        "readOnly":true
     },
     "PagingDirection":{ 
        "enum":[ 
           "Forward",
           "Backward"
        ],
        "type":"string",
        "readOnly":true
     },
     "Count":{ 
        "format":"int32",
        "type":"integer",
        "readOnly":true
     }
  }
},
"Roblox.Web.WebAPI.Models.ApiPageResponse[Roblox.Groups.Api.Models.Response.UserModel]":{ 
  "type":"object",
  "properties":{ 
     "previousPageCursor":{ 
        "type":"string"
     },
     "nextPageCursor":{ 
        "type":"string"
     },
     "data":{ 
        "type":"array",
        "items":{ 
           "$ref":"#/definitions/Roblox.Groups.Api.Models.Response.UserModel"
        }
     }
  }
},
"Roblox.Groups.Api.MembersRequest":{ 
  "type":"object",
  "properties":{ 
     "UserIds":{ 
        "description":"The user ids being either accepted or declined",
        "type":"array",
        "items":{ 
           "format":"int64",
           "type":"integer"
        }
     }
  }
},
"Roblox.Web.WebAPI.Models.ApiPageResponse[Roblox.Groups.Api.GroupJoinRequestResponse]":{ 
  "type":"object",
  "properties":{ 
     "previousPageCursor":{ 
        "type":"string"
     },
     "nextPageCursor":{ 
        "type":"string"
     },
     "data":{ 
        "type":"array",
        "items":{ 
           "$ref":"#/definitions/Roblox.Groups.Api.GroupJoinRequestResponse"
        }
     }
  }
},
"Roblox.Groups.Api.GroupJoinRequestResponse":{ 
  "description":"Response model for {Roblox.GroupJoinRequest}s",
  "type":"object",
  "properties":{ 
     "requester":{ 
        "$ref":"#/definitions/Roblox.Groups.Api.UserResponse",
        "description":"The requester"
     },
     "created":{ 
        "format":"date-time",
        "description":"The DateTime the request was created",
        "type":"string"
     }
  }
},
"Roblox.Groups.Api.UserResponse":{ 
  "description":"A model representing data about an {Roblox.Platform.Membership.IUser}",
  "type":"object",
  "properties":{ 
     "userId":{ 
        "format":"int64",
        "description":"The user id",
        "type":"integer"
     },
     "username":{ 
        "description":"The username",
        "type":"string"
     }
  }
},
"Roblox.Groups.Api.UpdateUserRoleRequest":{ 
  "description":"A request model for setting a users role in a group.",
  "type":"object",
  "properties":{ 
     "roleId":{ 
        "format":"int64",
        "description":"The role in the group the user should be put into.",
        "type":"integer"
     }
  }
},
"Roblox.Web.WebAPI.Models.ApiArrayResponse[Roblox.Groups.Api.GroupMembershipDetailResponse]":{ 
  "type":"object",
  "properties":{ 
     "data":{ 
        "type":"array",
        "items":{ 
           "$ref":"#/definitions/Roblox.Groups.Api.GroupMembershipDetailResponse"
        }
     }
  }
},
"Roblox.Groups.Api.GroupMembershipDetailResponse":{ 
  "description":"A group membership response model",
  "type":"object",
  "properties":{ 
     "group":{ 
        "$ref":"#/definitions/Roblox.Groups.Api.GroupDetailResponse",
        "description":"The group"
     },
     "role":{ 
        "$ref":"#/definitions/Roblox.Groups.Api.GroupRoleResponse",
        "description":"The role"
     }
  }
},
"Roblox.Groups.Api.JoinGroupRequest":{ 
  "description":"A request model for joining group.",
  "type":"object",
  "properties":{ 
     "captchaToken":{ 
        "type":"string"
     },
     "captchaProvider":{ 
        "type":"string"
     }
  }
},
"Roblox.Web.WebAPI.Models.ApiPageResponse[Roblox.Groups.Api.UserGroupRoleResponse]":{ 
  "type":"object",
  "properties":{ 
     "previousPageCursor":{ 
        "type":"string"
     },
     "nextPageCursor":{ 
        "type":"string"
     },
     "data":{ 
        "type":"array",
        "items":{ 
           "$ref":"#/definitions/Roblox.Groups.Api.UserGroupRoleResponse"
        }
     }
  }
},
"Roblox.Web.WebAPI.Models.ApiArrayResponse[Roblox.Groups.Api.GroupDetailResponse]":{ 
  "type":"object",
  "properties":{ 
     "data":{ 
        "type":"array",
        "items":{ 
           "$ref":"#/definitions/Roblox.Groups.Api.GroupDetailResponse"
        }
     }
  }
},
"Roblox.Groups.Api.UserMembershipResponse":{ 
  "description":"A user membership response model",
  "type":"object",
  "properties":{ 
     "user":{ 
        "$ref":"#/definitions/Roblox.Groups.Api.Models.Response.UserModel",
        "description":"The user"
     },
     "maxGroups":{ 
        "format":"int32",
        "description":"The user's builders club membership group limit",
        "type":"integer"
     },
     "membershipType":{ 
        "description":"The user's Premium membership type.",
        "enum":[ 
           "None",
           "BC",
           "TBC",
           "OBC",
           "RobloxPremium"
        ],
        "type":"string"
     }
  }
},
"Roblox.Groups.Api.GroupAllRolesResponse":{ 
  "description":"A group roles response model",
  "type":"object",
  "properties":{ 
     "groupId":{ 
        "format":"int64",
        "description":"The group id",
        "type":"integer"
     },
     "roles":{ 
        "description":"The roles in the group",
        "type":"array",
        "items":{ 
           "$ref":"#/definitions/Roblox.Groups.Api.GroupRoleResponse"
        }
     }
  }
},
"Roblox.Groups.Api.GroupMembershipMetadataResponse":{ 
  "description":"A user's group membership metadata response model",
  "type":"object",
  "properties":{ 
     "groupId":{ 
        "format":"int64",
        "description":"The group id",
        "type":"integer"
     },
     "isPrimary":{ 
        "description":"Whether the group is primary",
        "type":"boolean"
     },
     "isPendingJoin":{ 
        "description":"Whether there has been a request to join this group",
        "type":"boolean"
     },
     "userRole":{ 
        "$ref":"#/definitions/Roblox.Groups.Api.UserGroupRoleResponse",
        "description":"User group role information"
     },
     "maxGroups":{ 
        "format":"int32",
        "description":"The user's builders club membership group limit",
        "type":"integer"
     },
     "permissions":{ 
        "$ref":"#/definitions/Roblox.Groups.Api.GroupPermissionsModel",
        "description":"The group role's permissions"
     },
     "areGroupGamesVisible":{ 
        "description":"Whether group games are visible",
        "type":"boolean"
     },
     "areGroupFundsVisible":{ 
        "description":"Whether group funds are visible",
        "type":"boolean"
     },
     "areEnemiesAllowed":{ 
        "description":"Whether enemies are allowed",
        "type":"boolean"
     },
     "canConfigure":{ 
        "description":"If the user can configure the group",
        "type":"boolean"
     }
  }
},
"Roblox.Groups.Api.GroupPermissionsModel":{ 
  "description":"A model for group permissions/&gt;",
  "type":"object",
  "properties":{ 
     "groupPostsPermissions":{ 
        "$ref":"#/definitions/Roblox.Groups.Api.GroupPostsPermissionsModel",
        "description":"Group posts permissions"
     },
     "groupMembershipPermissions":{ 
        "$ref":"#/definitions/Roblox.Groups.Api.GroupMembershipPermissionsModel",
        "description":"Group membership permissions"
     },
     "groupManagementPermissions":{ 
        "$ref":"#/definitions/Roblox.Groups.Api.GroupManagementPermissionsModel",
        "description":"Group management permissions"
     },
     "groupEconomyPermissions":{ 
        "$ref":"#/definitions/Roblox.Groups.Api.GroupEconomyPermissionsModel",
        "description":"Group economy permissions"
     }
  }
},
"Roblox.Groups.Api.GroupPostsPermissionsModel":{ 
  "description":"A model representing group posts permissions",
  "type":"object",
  "properties":{ 
     "viewWall":{ 
        "description":"View wall permission",
        "type":"boolean"
     },
     "postToWall":{ 
        "description":"Post to wall permission",
        "type":"boolean"
     },
     "deleteFromWall":{ 
        "description":"Delete from wall permission",
        "type":"boolean"
     },
     "viewStatus":{ 
        "description":"View status permission",
        "type":"boolean"
     },
     "postToStatus":{ 
        "description":"Post to status permission",
        "type":"boolean"
     }
  }
},
"Roblox.Groups.Api.GroupMembershipPermissionsModel":{ 
  "description":"A model representing data about an {Roblox.Platform.Membership.IUser}",
  "type":"object",
  "properties":{ 
     "changeRank":{ 
        "description":"View wall permission",
        "type":"boolean"
     },
     "inviteMembers":{ 
        "description":"Post to wall permission",
        "type":"boolean"
     },
     "removeMembers":{ 
        "description":"Delete from wall permission",
        "type":"boolean"
     }
  }
},
"Roblox.Groups.Api.GroupManagementPermissionsModel":{ 
  "description":"A model representing data about an {Roblox.Platform.Membership.IUser}",
  "type":"object",
  "properties":{ 
     "manageRelationships":{ 
        "description":"Manage group relationships permission",
        "type":"boolean"
     },
     "manageClan":{ 
        "description":"Manage clan permission",
        "type":"boolean"
     },
     "viewAuditLogs":{ 
        "description":"View audit logs permission",
        "type":"boolean"
     }
  }
},
"Roblox.Groups.Api.GroupEconomyPermissionsModel":{ 
  "description":"A model representing data about an {Roblox.Platform.Membership.IUser}",
  "type":"object",
  "properties":{ 
     "spendGroupFunds":{ 
        "description":"Spend group funds permission",
        "type":"boolean"
     },
     "advertiseGroup":{ 
        "description":"Advertise group permission",
        "type":"boolean"
     },
     "createItems":{ 
        "description":"Create items permission",
        "type":"boolean"
     },
     "manageItems":{ 
        "description":"Manage items permission",
        "type":"boolean"
     },
     "addGroupPlaces":{ 
        "description":"Add group places permission",
        "type":"boolean"
     },
     "manageGroupGames":{ 
        "description":"Manage group games permission",
        "type":"boolean"
     },
     "viewGroupPayouts":{ 
        "description":"Manage group games permission",
        "type":"boolean"
     }
  }
},
"Roblox.Groups.Api.ChangeOwnerRequest":{ 
  "description":"A request model for changing the group owner.",
  "type":"object",
  "properties":{ 
     "userId":{ 
        "format":"int64",
        "description":"The user id.",
        "type":"integer"
     }
  }
},
"Roblox.Groups.Api.GroupPermissionsResponse":{ 
  "description":"A group role's permissions response model",
  "type":"object",
  "properties":{ 
     "groupId":{ 
        "format":"int64",
        "description":"The group id",
        "type":"integer"
     },
     "role":{ 
        "$ref":"#/definitions/Roblox.Groups.Api.GroupRoleResponse",
        "description":"The group role"
     },
     "permissions":{ 
        "$ref":"#/definitions/Roblox.Groups.Api.GroupPermissionsModel",
        "description":"The group role's permissions"
     }
  }
},
"Roblox.Groups.Api.UpdatePermissionsRequest":{ 
  "description":"A request model for updating a group's roleset's permissions.",
  "type":"object",
  "properties":{ 
     "permissions":{ 
        "description":"The permission-value pairs to be updated.",
        "type":"object",
        "properties":{ 
           "DeleteFromWall":{ 
              "type":"boolean"
           },
           "PostToWall":{ 
              "type":"boolean"
           },
           "InviteMembers":{ 
              "type":"boolean"
           },
           "PostToStatus":{ 
              "type":"boolean"
           },
           "RemoveMembers":{ 
              "type":"boolean"
           },
           "ViewStatus":{ 
              "type":"boolean"
           },
           "ViewWall":{ 
              "type":"boolean"
           },
           "ChangeRank":{ 
              "type":"boolean"
           },
           "AdvertiseGroup":{ 
              "type":"boolean"
           },
           "ManageRelationships":{ 
              "type":"boolean"
           },
           "AddGroupPlaces":{ 
              "type":"boolean"
           },
           "ViewAuditLogs":{ 
              "type":"boolean"
           },
           "CreateItems":{ 
              "type":"boolean"
           },
           "ManageItems":{ 
              "type":"boolean"
           },
           "SpendGroupFunds":{ 
              "type":"boolean"
           },
           "ManageClan":{ 
              "type":"boolean"
           },
           "ManageGroupGames":{ 
              "type":"boolean"
           }
        }
     }
  }
},
"Roblox.Web.WebAPI.Models.ApiArrayResponse[Roblox.Groups.Api.GroupPermissionsResponse]":{ 
  "type":"object",
  "properties":{ 
     "data":{ 
        "type":"array",
        "items":{ 
           "$ref":"#/definitions/Roblox.Groups.Api.GroupPermissionsResponse"
        }
     }
  }
},
"Roblox.Groups.Api.PrimaryGroupRequest":{ 
  "description":"A request model for setting the authenticated user's primary group.",
  "type":"object",
  "properties":{ 
     "groupId":{ 
        "format":"int64",
        "description":"The group id.",
        "type":"integer"
     }
  }
},
"Roblox.Groups.Api.RelationshipsRequest":{ 
  "type":"object",
  "properties":{ 
     "GroupIds":{ 
        "description":"The group ids being either accepted or declined",
        "type":"array",
        "items":{ 
           "format":"int64",
           "type":"integer"
        }
     }
  }
},
"Roblox.Groups.Api.PagedRequest":{ 
  "description":"A request model for a page of elements",
  "type":"object",
  "properties":{ 
     "startRowIndex":{ 
        "format":"int32",
        "description":"The start index of the page request",
        "type":"integer"
     },
     "maxRows":{ 
        "format":"int32",
        "description":"The maximum number of rows for the page request, should be at least 1.",
        "type":"integer"
     }
  }
},
"Roblox.Groups.Api.GroupRelationshipsResponse":{ 
  "description":"A group relationships response model",
  "type":"object",
  "properties":{ 
     "groupId":{ 
        "format":"int64",
        "description":"The group id",
        "type":"integer"
     },
     "relationshipType":{ 
        "description":"The group relationship type",
        "enum":[ 
           "Allies",
           "Enemies"
        ],
        "type":"string"
     },
     "totalGroupCount":{ 
        "format":"int64",
        "description":"The total number of groups for this relationship type",
        "type":"integer"
     },
     "relatedGroups":{ 
        "description":"The related or requested groups",
        "type":"array",
        "items":{ 
           "$ref":"#/definitions/Roblox.Groups.Api.GroupDetailResponse"
        }
     },
     "nextRowIndex":{ 
        "format":"int64",
        "description":"The index for the next page of related groups",
        "type":"integer"
     }
  }
},
"Roblox.Web.WebAPI.Models.ApiArrayResponse[Roblox.Groups.Api.GroupPayoutResponse]":{ 
  "type":"object",
  "properties":{ 
     "data":{ 
        "type":"array",
        "items":{ 
           "$ref":"#/definitions/Roblox.Groups.Api.GroupPayoutResponse"
        }
     }
  }
},
"Roblox.Groups.Api.GroupPayoutResponse":{ 
  "description":"A group payout response",
  "type":"object",
  "properties":{ 
     "user":{ 
        "$ref":"#/definitions/Roblox.Groups.Api.Models.Response.UserModel",
        "description":"The group payout user"
     },
     "percentage":{ 
        "format":"int32",
        "description":"The group payout percentage for the user",
        "type":"integer"
     }
  }
},
"Roblox.Groups.Api.PayoutRequest":{ 
  "description":"Multi-payout request information.",
  "type":"object",
  "properties":{ 
     "PayoutType":{ 
        "description":"The {Roblox.Groups.Api.PayoutType}.",
        "enum":[ 
           "FixedAmount",
           "Percentage"
        ],
        "type":"string"
     },
     "Recipients":{ 
        "description":"The recipients of the payouts.",
        "type":"array",
        "items":{ 
           "$ref":"#/definitions/Roblox.Groups.Api.PayoutRecipientRequest"
        }
     }
  }
},
"Roblox.Groups.Api.PayoutRecipientRequest":{ 
  "description":"A request model for paying out Robux.",
  "type":"object",
  "properties":{ 
     "recipientId":{ 
        "format":"int64",
        "description":"The recipient id.",
        "type":"integer"
     },
     "recipientType":{ 
        "description":"The recipient type.",
        "enum":[ 
           "User",
           "Group"
        ],
        "type":"string"
     },
     "amount":{ 
        "format":"int64",
        "description":"The amount to payout.",
        "type":"integer"
     }
  }
},
"Roblox.Web.WebAPI.Models.ApiArrayResponse[Roblox.Groups.Api.GroupRoleDetailResponse]":{ 
  "type":"object",
  "properties":{ 
     "data":{ 
        "type":"array",
        "items":{ 
           "$ref":"#/definitions/Roblox.Groups.Api.GroupRoleDetailResponse"
        }
     }
  }
},
"Roblox.Groups.Api.GroupRoleDetailResponse":{ 
  "type":"object",
  "properties":{ 
     "groupId":{ 
        "format":"int64",
        "description":"The id of the group the role belongs to",
        "type":"integer"
     },
     "id":{ 
        "format":"int64",
        "description":"The role id",
        "type":"integer"
     },
     "name":{ 
        "description":"The role name",
        "type":"string"
     },
     "description":{ 
        "description":"The role description",
        "type":"string"
     },
     "rank":{ 
        "format":"int32",
        "description":"The role rank",
        "type":"integer"
     },
     "memberCount":{ 
        "format":"int64",
        "description":"The number of members in the role.",
        "type":"integer"
     }
  }
},
"Roblox.Groups.Api.Models.Request.CreateRoleSetRequest":{ 
  "type":"object",
  "properties":{ 
     "name":{ 
        "description":"The name of the roleset.",
        "type":"string"
     },
     "description":{ 
        "description":"The description of the roleset.",
        "type":"string"
     },
     "rank":{ 
        "format":"int32",
        "description":"The rank/positioning of the roleset.",
        "type":"integer"
     },
     "usingGroupFunds":{ 
        "description":"Setting to use group funds or not.",
        "type":"boolean"
     }
  }
},
"Roblox.Groups.Api.Models.Request.UpdateRoleSetRequest":{ 
  "type":"object",
  "properties":{ 
     "name":{ 
        "description":"The name of the roleset.",
        "type":"string"
     },
     "description":{ 
        "description":"The description of the roleset.",
        "type":"string"
     },
     "rank":{ 
        "format":"int32",
        "description":"The rank/positioning of the roleset.",
        "type":"integer"
     }
  }
},
"Roblox.Web.WebAPI.Models.ApiArrayResponse[Roblox.Groups.Api.SocialLinkResponse]":{ 
  "type":"object",
  "properties":{ 
     "data":{ 
        "type":"array",
        "items":{ 
           "$ref":"#/definitions/Roblox.Groups.Api.SocialLinkResponse"
        }
     }
  }
},
"Roblox.Groups.Api.SocialLinkResponse":{ 
  "description":"A social link response from a create request",
  "type":"object",
  "properties":{ 
     "id":{ 
        "format":"int64",
        "description":"The id of the social link",
        "type":"integer"
     },
     "type":{ 
        "description":"What type of social media (including Roblox Group) this points to",
        "enum":[ 
           "Facebook",
           "Twitter",
           "YouTube",
           "Twitch",
           "GooglePlus",
           "Discord",
           "RobloxGroup"
        ],
        "type":"string"
     },
     "url":{ 
        "description":"The url of the link",
        "type":"string"
     },
     "title":{ 
        "description":"The title of the link",
        "type":"string"
     }
  }
},
"Roblox.Groups.Api.SocialLinkRequest":{ 
  "description":"An update request for a social link",
  "type":"object",
  "properties":{ 
     "type":{ 
        "description":"What type of social media this points to",
        "enum":[ 
           "Facebook",
           "Twitter",
           "YouTube",
           "Twitch",
           "GooglePlus",
           "Discord",
           "RobloxGroup"
        ],
        "type":"string"
     },
     "url":{ 
        "description":"The url of the link",
        "type":"string"
     },
     "title":{ 
        "description":"The title of the link",
        "type":"string"
     }
  }
},
"Roblox.Web.WebAPI.Models.ApiPageResponse[Roblox.Groups.Api.Models.Response.GroupWallPostModel]":{ 
  "type":"object",
  "properties":{ 
     "previousPageCursor":{ 
        "type":"string"
     },
     "nextPageCursor":{ 
        "type":"string"
     },
     "data":{ 
        "type":"array",
        "items":{ 
           "$ref":"#/definitions/Roblox.Groups.Api.Models.Response.GroupWallPostModel"
        }
     }
  }
},
"Roblox.Groups.Api.Models.Response.GroupWallPostModel":{ 
  "description":"A response model for group wall post information",
  "type":"object",
  "properties":{ 
     "id":{ 
        "format":"int64",
        "description":"The group wall post Id.",
        "type":"integer"
     },
     "poster":{ 
        "$ref":"#/definitions/Roblox.Groups.Api.Models.Response.UserModel",
        "description":"The user that posted the group wall post."
     },
     "body":{ 
        "description":"The group wall post body.",
        "type":"string"
     },
     "created":{ 
        "format":"date-time",
        "description":"When the group wall post was posted.",
        "type":"string"
     },
     "updated":{ 
        "format":"date-time",
        "description":"When the group wall post was last updated.",
        "type":"string"
     }
  }
},
"Roblox.Groups.Api.CreateWallPostRequest":{ 
  "description":"A request model for creating a group wall post",
  "type":"object",
  "properties":{ 
     "body":{ 
        "description":"The wall post body",
        "type":"string"
     }
  }
}
};